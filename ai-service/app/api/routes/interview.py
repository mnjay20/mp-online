from fastapi import APIRouter
from app.schemas.interview import (
    InterviewGenerateRequest,
    InterviewGenerateResponse,
    InterviewEvaluateRequest,
    InterviewEvaluateResponse
)
from app.services.interview_service import InterviewService

router = APIRouter(prefix="/ai/interview", tags=["Mock Interview"])

@router.post("/generate", response_model=InterviewGenerateResponse)
async def generate_mock_interview(payload: InterviewGenerateRequest):
    return await InterviewService.generate_questions(
        career_id=payload.career_id,
        interview_type=payload.interview_type,
        count=payload.count
    )

@router.post("/evaluate", response_model=InterviewEvaluateResponse)
async def evaluate_interview_answer(payload: InterviewEvaluateRequest):
    return await InterviewService.evaluate_answer(
        question_text=payload.question_text,
        student_answer=payload.student_answer
    )
