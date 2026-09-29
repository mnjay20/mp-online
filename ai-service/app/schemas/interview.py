"""
Pydantic schemas for the Professional Real-time Mock Interview System.
Supports audio transcription (Groq Whisper Large Turbo), multi-dimensional evaluation,
strict guardrails against derailment/unrelated questions, and comprehensive performance reporting.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Literal

class InterviewGenerateRequest(BaseModel):
    student_id: str
    career_id: Optional[str] = None
    target_role: Optional[str] = "Software Engineer"
    interview_type: Literal["TECHNICAL", "BEHAVIORAL", "SYSTEM_DESIGN", "MIXED"] = "MIXED"
    count: int = Field(default=5, ge=1, le=10)

class InterviewQuestionItem(BaseModel):
    question: str
    expected_topics: List[str] = []
    category: str = "Technical"
    difficulty: str = "INTERMEDIATE"

class InterviewGenerateResponse(BaseModel):
    interview_type: str
    target_role: str
    questions: List[InterviewQuestionItem] = []

class AudioTranscriptionResponse(BaseModel):
    text: str
    model: str = "whisper-large-v3-turbo"
    duration_seconds: Optional[float] = None
    language: str = "en"

class DimensionalScore(BaseModel):
    technical_accuracy: int = Field(default=75, ge=0, le=100)
    communication_clarity: int = Field(default=80, ge=0, le=100)
    depth_and_structure: int = Field(default=70, ge=0, le=100)

class InterviewEvaluateRequest(BaseModel):
    question_text: str
    student_answer: str
    target_career: Optional[str] = "Software Engineer"
    interview_type: Literal["TECHNICAL", "BEHAVIORAL", "SYSTEM_DESIGN", "MIXED"] = "TECHNICAL"

class InterviewEvaluateResponse(BaseModel):
    score: int = Field(ge=0, le=100)
    breakdown: DimensionalScore = Field(default_factory=DimensionalScore)
    is_guarded: bool = False
    guardrail_flag: Optional[str] = None
    strengths: str
    weaknesses: str
    ideal_answer_hint: str
    interviewer_commentary: str

class InterviewTurnRequest(BaseModel):
    interview_id: Optional[str] = None
    student_id: Optional[str] = None
    turn_number: int = Field(default=1, ge=1)
    total_turns: int = Field(default=5, ge=1)
    target_role: str = "Software Engineer"
    interview_type: str = "TECHNICAL"
    current_question: str
    student_answer: str

class InterviewTurnResponse(BaseModel):
    turn_number: int
    is_guarded: bool = False
    guardrail_reason: Optional[str] = None
    evaluation: InterviewEvaluateResponse
    interviewer_reply: str
    next_action: Literal["PROBE_FOLLOW_UP", "NEXT_QUESTION", "FINISH_INTERVIEW"]
    next_question: Optional[str] = None

class InterviewTurnRecord(BaseModel):
    turn_number: int
    question: str
    answer: str
    score: int
    strengths: str
    weaknesses: str

class InterviewReportRequest(BaseModel):
    student_id: Optional[str] = None
    interview_id: str
    career_title: str = "Software Engineer"
    turns: List[InterviewTurnRecord] = []

class InterviewReportResponse(BaseModel):
    interview_id: str
    career_title: str
    overall_score: int = Field(ge=0, le=100)
    readiness_level: Literal["NEEDS_WORK", "PROGRESSING", "INTERVIEW_READY", "EXCEPTIONAL"]
    summary_evaluation: str
    radar_metrics: Dict[str, int]
    top_strengths: List[str]
    critical_weaknesses: List[str]
    identified_gap_skills: List[str]
