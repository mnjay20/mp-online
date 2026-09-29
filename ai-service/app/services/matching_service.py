from typing import List, Optional
from app.schemas.matching import MatchResponse, OpportunityMatchItem

class MatchingService:
    @staticmethod
    async def match_jobs(student_id: str, job_ids: Optional[List[str]] = None) -> MatchResponse:
        matches = [
            OpportunityMatchItem(
                id="e0000000-0000-0000-0000-000000000001",
                title="Junior Backend Developer",
                company_name="CloudScale Technologies",
                match_score=84,
                matching_skills=["Node.js", "Express", "PostgreSQL", "REST APIs"],
                missing_skills=["Docker"],
                why_matched="Your backend project stack directly mirrors their core technology requirements."
            ),
            OpportunityMatchItem(
                id="e0000000-0000-0000-0000-000000000002",
                title="Associate Machine Learning Engineer",
                company_name="NexGen AI Labs",
                match_score=68,
                matching_skills=["Python", "SQL"],
                missing_skills=["PyTorch", "MLOps"],
                why_matched="Good Python proficiency, with opportunity to upskill in deep learning frameworks."
            )
        ]
        return MatchResponse(student_id=student_id, matches=matches)

    @staticmethod
    async def match_internships(student_id: str, internship_ids: Optional[List[str]] = None) -> MatchResponse:
        matches = [
            OpportunityMatchItem(
                id="f0000000-0000-0000-0000-000000000001",
                title="Backend Engineering Intern",
                company_name="CloudScale Technologies",
                match_score=92,
                matching_skills=["Node.js", "SQL", "Git"],
                missing_skills=[],
                why_matched="Exceptional alignment with your current academic coursework and project experience."
            )
        ]
        return MatchResponse(student_id=student_id, matches=matches)
