from pydantic import BaseModel, Field
from typing import List

class RoadmapMilestone(BaseModel):
    month: int
    focus_area: str
    target_skills: List[str] = []
    recommended_tasks: List[str] = []
    checkpoint_project: str

class RoadmapResponse(BaseModel):
    career_title: str
    duration_months: int
    overview: str
    milestones: List[RoadmapMilestone] = []
