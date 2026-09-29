"""
Pydantic schemas for the Resume Parsing and ATS Intelligence Pipeline.
"""

from pydantic import BaseModel, Field
from typing import List, Optional

class ResumeAnalyzeRequest(BaseModel):
    resume_text: str
    target_career_id: Optional[str] = None
    target_role: Optional[str] = "Software Engineer"

class ResumeBulletImproveRequest(BaseModel):
    bullet_point: str
    target_role: str = "Software Engineer"

class AtsScoreBreakdown(BaseModel):
    formatting: int = Field(default=80, ge=0, le=100)
    keywords: int = Field(default=75, ge=0, le=100)
    impact_metrics: int = Field(default=70, ge=0, le=100)

class CandidateProfileExtracted(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None

class ResumeAnalysisResponse(BaseModel):
    overall_score: int = Field(ge=0, le=100)
    ats_score: int = Field(ge=0, le=100)
    breakdown: AtsScoreBreakdown = Field(default_factory=AtsScoreBreakdown)
    candidate_profile: CandidateProfileExtracted = Field(default_factory=CandidateProfileExtracted)
    extracted_skills: List[str] = []
    missing_skills: List[str] = []
    strengths: List[str] = []
    improvements: List[str] = []
    critique_markdown: str
    is_guarded: bool = False
    guardrail_flag: Optional[str] = None

class ResumeBulletImproveResponse(BaseModel):
    original_bullet: str
    improved_bullets: List[str] = []
    impact_rationale: str
