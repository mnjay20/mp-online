from fastapi import APIRouter
from pydantic import BaseModel
from app.schemas.career import SkillGapResponse, CareerRecommendationResponse
from app.services.career_service import CareerService

router = APIRouter(prefix="/ai/career", tags=["Career Intelligence"])

class RecommendRequest(BaseModel):
    student_id: str

class SkillGapRequest(BaseModel):
    student_id: str
    career_id: str

@router.post("/recommend", response_model=CareerRecommendationResponse)
async def recommend_careers(payload: RecommendRequest):
    return await CareerService.recommend_careers(payload.student_id)

@router.post("/skill-gap", response_model=SkillGapResponse)
async def analyze_skill_gap(payload: SkillGapRequest):
    return await CareerService.analyze_skill_gap(payload.student_id, payload.career_id)
