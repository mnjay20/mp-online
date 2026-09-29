from pydantic import BaseModel, Field
from typing import List, Optional

class ChatRequest(BaseModel):
    conversation_id: Optional[str] = None
    student_id: str
    message: str

class RecommendationItem(BaseModel):
    type: str = Field(description="CAREER | SKILL | COURSE | PROJECT | JOB | INTERNSHIP")
    title: str
    reason: str
    priority: str = Field(default="MEDIUM", description="HIGH | MEDIUM | LOW")

class CopilotResponse(BaseModel):
    message: str = Field(description="Conversational response tailored to the student")
    confidence: float = Field(default=0.85, ge=0.0, le=1.0)
    recommendations: List[RecommendationItem] = []
    next_actions: List[str] = Field(default_factory=list, description="Immediate action items for the student")
