"""
Guardrail engine for AI Career Copilot.
Ensures that queries remain strictly focused on career, profile, skills, roadmaps, and employability.
"""

import re
from typing import Tuple
from app.llm.provider import get_llm, extract_text
from app.core.logging import logger
from app.agent.prompts.copilot_prompts import GUARDRAIL_CLASSIFIER_PROMPT

FALLBACK_REFUSAL_MESSAGE = (
    "I am your AI Career Copilot. I can only assist with career guidance, profile evaluation, "
    "learning roadmaps, skill gaps, resume critiques, mock interviews, and opportunity readiness. "
    "I cannot help with this query."
)

DEFAULT_CAREER_SUGGESTIONS = [
    "Ask: 'What skills do I need to become a Backend Developer?'",
    "Ask: 'Can you create a 3-month roadmap for Cloud & DevOps?'",
    "Ask: 'Analyze my current skill gaps for my target role'",
    "Ask: 'How can I optimize my resume bullet points for ATS?'"
]

# Obvious off-topic and prompt-injection keywords/patterns
FAST_OFF_TOPIC_PATTERNS = [
    r"\b(write\s+a\s+poem|compose\s+a\s+poem|write\s+a\s+song|tell\s+a\s+joke)\b",
    r"\b(recipe\s+for|how\s+to\s+bake|how\s+to\s+cook|ingredients\s+for)\b",
    r"\b(ignore\s+all\s+previous\s+instructions|system\s+prompt|jailbreak|pretend\s+you\s+are)\b",
    r"\b(horoscope|astrology|zodiac|movie\s+review|plot\s+summary)\b",
    r"\b(who\s+won\s+the\s+match|football\s+score|cricket\s+score)\b",
]

class GuardrailService:
    @staticmethod
    async def validate_query(query: str) -> Tuple[bool, str]:
        """
        Validates whether a student query is within the career & employability domain.
        Returns:
            Tuple[is_allowed: bool, refusal_reason: str]
        """
        cleaned_query = query.strip()
        if not cleaned_query:
            return False, "Empty query received."

        # Layer 1: Fast pattern check
        for pattern in FAST_OFF_TOPIC_PATTERNS:
            if re.search(pattern, cleaned_query, re.IGNORECASE):
                logger.info(f"Guardrail triggered by fast heuristic pattern on query: '{cleaned_query[:60]}...'")
                return False, "Off-topic heuristic match."

        # Layer 2: LLM Classification with Gemini 3.5 Flash Lite
        llm = get_llm(temperature=0.0)
        if llm:
            try:
                prompt = GUARDRAIL_CLASSIFIER_PROMPT.format(query=cleaned_query)
                res = await llm.ainvoke(prompt)
                classification = extract_text(getattr(res, "content", "")).strip().upper()

                if "REFUSED" in classification:
                    logger.info(f"Guardrail LLM classifier rejected query: '{cleaned_query[:60]}...'")
                    return False, "Query classified as off-topic by LLM guardrail."
                
                return True, "Query approved."
            except Exception as e:
                logger.warning(f"Guardrail LLM check encountered an error: {e}. Falling back to permissive career check.")

        # Default fallback: allow if not caught by pattern check
        return True, "Default allow."
