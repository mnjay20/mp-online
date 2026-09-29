from fastapi import APIRouter
from app.schemas.matching import MatchRequest, MatchResponse
from app.services.matching_service import MatchingService

router = APIRouter(prefix="/ai/match", tags=["Opportunity Matching"])

@router.post("/jobs", response_model=MatchResponse)
async def match_jobs(payload: MatchRequest):
    return await MatchingService.match_jobs(
        student_id=payload.student_id,
        job_ids=payload.job_ids
    )

@router.post("/internships", response_model=MatchResponse)
async def match_internships(payload: MatchRequest):
    return await MatchingService.match_internships(
        student_id=payload.student_id,
        internship_ids=payload.internship_ids
    )
