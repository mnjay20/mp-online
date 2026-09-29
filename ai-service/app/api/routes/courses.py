"""
API routes for course intelligence, skill gap recommendations, and web search discovery.
"""

from fastapi import APIRouter
from app.schemas.course_recommendation import (
    GapCourseRecommendRequest,
    GapCourseRecommendationResponse,
)
from app.services.course_search_service import CourseSearchService

router = APIRouter(prefix="/ai/courses", tags=["Course Intelligence"])

@router.post("/recommend-gap-courses", response_model=GapCourseRecommendationResponse)
async def recommend_gap_courses(payload: GapCourseRecommendRequest):
    """
    Recommends courses for skill gaps:
    - Prioritizes app catalog courses FIRST
    - Searches and scrapes external web courses via Tavily
    - Categorizes into Paid and Unpaid (Free)
    """
    return await CourseSearchService.recommend_courses_for_gaps(
        skills=payload.skills,
        student_id=payload.student_id,
        career_title=payload.career_title,
        max_web_results_per_skill=payload.max_web_results_per_skill
    )
