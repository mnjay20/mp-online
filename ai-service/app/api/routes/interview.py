"""
API routes for the Real-time AI Mock Interview System.
Supports:
- Audio transcription via Groq Whisper Large Turbo
- Authentic question generation with target role alignment
- Multi-dimensional turn evaluation with ironclad guardrails
- Interactive turn handling (adaptive probing, redirecting, advancing)
- Comprehensive performance report generation
"""

from fastapi import APIRouter, UploadFile, File
from app.schemas.interview import (
    InterviewGenerateRequest,
    InterviewGenerateResponse,
    InterviewEvaluateRequest,
    InterviewEvaluateResponse,
    AudioTranscriptionResponse,
    InterviewTurnRequest,
    InterviewTurnResponse,
    InterviewReportRequest,
    InterviewReportResponse
)
from app.services.interview_service import InterviewService
from app.services.stt_service import STTService

router = APIRouter(prefix="/ai/interview", tags=["Mock Interview"])

@router.post("/transcribe", response_model=AudioTranscriptionResponse)
async def transcribe_audio_chunk(
    file: UploadFile = File(...)
):
    """
    Transcribes student microphone audio in real time using Groq whisper-large-v3-turbo.
    """
    audio_bytes = await file.read()
    return await STTService.transcribe_audio(
        audio_bytes=audio_bytes,
        filename=file.filename or "audio.wav"
    )

@router.post("/generate", response_model=InterviewGenerateResponse)
async def generate_mock_interview(payload: InterviewGenerateRequest):
    """
    Generates authentic, corporate-standard mock interview questions.
    """
    return await InterviewService.generate_questions(
        career_id=payload.career_id,
        interview_type=payload.interview_type,
        count=payload.count,
        target_role=payload.target_role or "Software Engineer"
    )

@router.post("/evaluate", response_model=InterviewEvaluateResponse)
async def evaluate_interview_answer(payload: InterviewEvaluateRequest):
    """
    Evaluates candidate response with multi-dimensional scoring and guardrails.
    """
    return await InterviewService.evaluate_answer(
        question_text=payload.question_text,
        student_answer=payload.student_answer,
        target_career=payload.target_career or "Software Engineer",
        interview_type=payload.interview_type
    )

@router.post("/turn", response_model=InterviewTurnResponse)
async def process_interview_turn(payload: InterviewTurnRequest):
    """
    Processes an interactive interview turn:
    - Evaluates answer with guardrails
    - Generates professional interviewer spoken reply
    - Returns adaptive follow-up probe or next question
    """
    return await InterviewService.process_turn(payload)

@router.post("/report", response_model=InterviewReportResponse)
async def generate_final_report(payload: InterviewReportRequest):
    """
    Synthesizes interview turns into a complete scorecard with radar metrics and identified gap skills.
    """
    return await InterviewService.generate_final_report(payload)
