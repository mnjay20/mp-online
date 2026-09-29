from pydantic import BaseModel, Field
from typing import List, Optional

class ResumeAnalyzeRequest(BaseModel):
    resume_text: str
    target_career_id: Optional[str] = None
    target_role: Optional[str] = None

class ResumeBulletImproveRequest(BaseModel):
    bullet_point: str
    target_role: str

class ResumeAnalysisResponse(BaseModel):
    overall_score: int = Field(ge=0, le=100)
    ats_score: int = Field(ge=0, le=100)
    extracted_skills: List[str] = []
    missing_skills: List[str] = []
    strengths: List[str] = []
    improvements: List[str] = []
    critique_markdown: str

class ResumeBulletImproveResponse(BaseModel):
    original_bullet: str
    improved_bullets: List[str] = []
    impact_rationale: str
