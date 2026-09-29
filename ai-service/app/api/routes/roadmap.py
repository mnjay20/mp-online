from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.schemas.roadmap import RoadmapResponse
from app.services.career_service import CareerService

router = APIRouter(prefix="/ai/roadmap", tags=["Learning Roadmap"])

class RoadmapRequest(BaseModel):
    student_id: str
    career_id: str
    target_months: Optional[int] = 3

@router.post("/generate", response_model=RoadmapResponse)
async def generate_roadmap(payload: RoadmapRequest):
    return await CareerService.generate_roadmap(
        student_id=payload.student_id,
        career_id=payload.career_id,
        target_months=payload.target_months or 3
    )
