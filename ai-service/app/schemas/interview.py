from pydantic import BaseModel, Field
from typing import List, Optional

class InterviewGenerateRequest(BaseModel):
    student_id: str
    career_id: Optional[str] = None
    interview_type: str = "MIXED"
    count: int = 5

class InterviewQuestionItem(BaseModel):
    question: str
    expected_topics: List[str] = []
    category: str = "Technical"

class InterviewGenerateResponse(BaseModel):
    interview_type: str
    questions: List[InterviewQuestionItem] = []

class InterviewEvaluateRequest(BaseModel):
    question_text: str
    student_answer: str
    target_career: Optional[str] = None

class InterviewEvaluateResponse(BaseModel):
    score: int = Field(ge=0, le=100)
    strengths: str
    weaknesses: str
    ideal_answer_hint: str
