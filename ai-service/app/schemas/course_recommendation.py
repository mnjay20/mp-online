"""
Pydantic schemas for course recommendations bridging skill gaps.
Supports internal app catalog courses prioritized over web-searched courses,
divided into distinct Paid and Unpaid (Free) categories.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Literal

class RecommendedCourseItem(BaseModel):
    id: Optional[str] = None
    title: str
    provider: str
    url: str
    description: str
    difficulty: str = "BEGINNER"
    duration_hours: Optional[int] = None
    is_free: bool = True
    price: Optional[float] = 0.0
    rating: Optional[float] = 4.5
    source: Literal["APP_CATALOG", "WEB_SEARCH"] = "APP_CATALOG"
    category: Literal["UNPAID", "PAID"] = "UNPAID"
    why_recommended: str
    relevance_score: Optional[float] = Field(default=0.9, ge=0.0, le=1.0)

class SkillCourseRecommendationGroup(BaseModel):
    skill_name: str
    unpaid_courses: List[RecommendedCourseItem] = Field(
        default_factory=list,
        description="Free/unpaid courses with app catalog courses listed FIRST, followed by web-searched courses"
    )
    paid_courses: List[RecommendedCourseItem] = Field(
        default_factory=list,
        description="Paid courses with app catalog courses listed FIRST, followed by web-searched courses"
    )
    app_course_count: int = 0
    web_course_count: int = 0

class GapCourseRecommendRequest(BaseModel):
    student_id: Optional[str] = None
    skills: List[str]
    career_title: Optional[str] = None
    max_web_results_per_skill: int = 4

class GapCourseRecommendationResponse(BaseModel):
    student_id: Optional[str] = None
    target_career: Optional[str] = None
    skill_groups: List[SkillCourseRecommendationGroup] = []
    total_unpaid_courses: int = 0
    total_paid_courses: int = 0
    total_courses: int = 0
    summary: str
