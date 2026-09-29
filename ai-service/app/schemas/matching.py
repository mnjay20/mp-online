from pydantic import BaseModel, Field
from typing import List, Optional

class MatchRequest(BaseModel):
    student_id: str
    job_ids: Optional[List[str]] = None
    internship_ids: Optional[List[str]] = None

class OpportunityMatchItem(BaseModel):
    id: str
    title: str
    company_name: str
    match_score: int = Field(ge=0, le=100)
    matching_skills: List[str] = []
    missing_skills: List[str] = []
    why_matched: str

class MatchResponse(BaseModel):
    student_id: str
    matches: List[OpportunityMatchItem] = []
