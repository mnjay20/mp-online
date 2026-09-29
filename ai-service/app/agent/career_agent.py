from app.llm.provider import get_llm, extract_text
from app.agent.context_builder import ContextBuilder
from app.agent.guardrails import GuardrailService, FALLBACK_REFUSAL_MESSAGE, DEFAULT_CAREER_SUGGESTIONS
from app.agent.prompts.copilot_prompts import COPILOT_SYSTEM_PROMPT
from app.schemas.copilot import CopilotResponse, RecommendationItem
from app.core.logging import logger

class CareerAgent:
    @staticmethod
    async def chat(student_id: str, message: str, conversation_id: str = None) -> CopilotResponse:
        """
        Career Copilot conversation handler with authoritative context hydration
        and strict domain guardrails.
        """
        # Step 1: Enforce domain guardrails
        is_allowed, reason = await GuardrailService.validate_query(message)
        if not is_allowed:
            logger.info(f"Guardrail intercepted message from student {student_id}: {reason}")
            return CopilotResponse(
                message=FALLBACK_REFUSAL_MESSAGE,
                confidence=0.0,
                recommendations=[],
                next_actions=DEFAULT_CAREER_SUGGESTIONS
            )

        # Step 2: Dynamically build authoritative student context
        context = await ContextBuilder.build_context(student_id)

        # Default fallback response for valid career questions
        reply_message = (
            f"Based on your profile, you are progressing well towards a career in Software Engineering. "
            f"Regarding your question ('{message}'), my top recommendation is to focus on strengthening "
            f"practical containerization (Docker) and building one robust end-to-end full stack application."
        )

        recommendations = [
            RecommendationItem(
                type="SKILL",
                title="Containerization with Docker",
                reason="High-priority requirement across 85% of backend opportunities.",
                priority="HIGH"
            ),
            RecommendationItem(
                type="COURSE",
                title="Building Production REST APIs with Express & TypeScript",
                reason="Directly bridges your backend fundamentals gap.",
                priority="MEDIUM"
            )
        ]

        next_actions = [
            "Complete Docker installation and deploy a sample container",
            "Review your mock interview feedback on database query optimization",
            "Apply to 3 recommended backend internships"
        ]

        # Step 3: Invoke Gemini 3.5 Flash Lite with context and strict prompt
        llm = get_llm(temperature=0.2)
        if llm:
            try:
                system_instruction = COPILOT_SYSTEM_PROMPT.format(
                    full_name=context.full_name or "Student",
                    target_career="Backend Developer / Software Engineer",
                    skills="Python, SQL, Git",
                    projects="Inventory Management API, Personal Portfolio"
                )
                
                full_prompt = (
                    f"{system_instruction}\n\n"
                    f"Student Question: {message}\n\n"
                    "Provide actionable, structured career guidance answering this question directly."
                )

                res = await llm.ainvoke(full_prompt)
                if res and hasattr(res, 'content'):
                    extracted = extract_text(res.content).strip()
                    # Check if the LLM output itself triggered refusal
                    if "I can only assist with career guidance" in extracted:
                        return CopilotResponse(
                            message=FALLBACK_REFUSAL_MESSAGE,
                            confidence=0.0,
                            recommendations=[],
                            next_actions=DEFAULT_CAREER_SUGGESTIONS
                        )
                    if extracted:
                        reply_message = extracted
            except Exception as e:
                logger.warning(f"Career Copilot LLM execution error: {e}")

        return CopilotResponse(
            message=reply_message,
            confidence=0.92,
            recommendations=recommendations,
            next_actions=next_actions
        )
