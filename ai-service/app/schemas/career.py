from pydantic import BaseModel, Field
from typing import List, Optional

class SkillGapItem(BaseModel):
    skill_name: str
    current_proficiency: Optional[str] = None
    required_proficiency: str
    gap_score: int
    priority: str = "HIGH"
    recommendation: Optional[str] = None

class SkillGapResponse(BaseModel):
    career_id: str
    career_title: str
    readiness_score: int = Field(ge=0, le=100)
    matching_skills: List[str] = []
    missing_skills: List[SkillGapItem] = []
    summary_analysis: str

class CareerRecommendationItem(BaseModel):
    career_id: str
    title: str
    match_score: int = Field(ge=0, le=100)
    reason: str
    key_strengths: List[str] = []
    critical_gaps: List[str] = []

class CareerRecommendationResponse(BaseModel):
    student_id: str
    recommendations: List[CareerRecommendationItem] = []
