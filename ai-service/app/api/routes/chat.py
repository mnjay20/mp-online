from fastapi import APIRouter
from app.schemas.copilot import ChatRequest, CopilotResponse
from app.agent.career_agent import CareerAgent

router = APIRouter(prefix="/ai", tags=["AI Copilot"])

@router.post("/chat", response_model=CopilotResponse)
async def chat_with_copilot(payload: ChatRequest):
    return await CareerAgent.chat(
        student_id=payload.student_id,
        message=payload.message,
        conversation_id=payload.conversation_id
    )
