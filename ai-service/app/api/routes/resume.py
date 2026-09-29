from fastapi import APIRouter
from app.schemas.resume import (
    ResumeAnalyzeRequest,
    ResumeBulletImproveRequest,
    ResumeAnalysisResponse,
    ResumeBulletImproveResponse
)
from app.services.resume_service import ResumeService

router = APIRouter(prefix="/ai/resume", tags=["Resume Intelligence"])

@router.post("/analyze", response_model=ResumeAnalysisResponse)
async def analyze_resume(payload: ResumeAnalyzeRequest):
    return await ResumeService.analyze_resume(
        resume_text=payload.resume_text,
        target_role=payload.target_role or "Software Engineer"
    )

@router.post("/improve", response_model=ResumeBulletImproveResponse)
async def improve_bullet(payload: ResumeBulletImproveRequest):
    return await ResumeService.improve_bullet(
        bullet_point=payload.bullet_point,
        target_role=payload.target_role
    )
