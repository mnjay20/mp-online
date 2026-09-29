import pytest
import sys
from pathlib import Path

# Add app directory to sys.path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.schemas.context import StudentContext
from app.schemas.copilot import ChatRequest, CopilotResponse
from app.schemas.career import SkillGapResponse
from app.schemas.roadmap import RoadmapResponse
from app.schemas.resume import ResumeAnalysisResponse
from app.schemas.interview import InterviewGenerateResponse, InterviewEvaluateResponse

def test_schemas_instantiation():
    context = StudentContext(student_id="test-student-id")
    assert context.student_id == "test-student-id"

    chat_req = ChatRequest(student_id="test-student-id", message="Hello Copilot")
    assert chat_req.message == "Hello Copilot"

    copilot_resp = CopilotResponse(message="Guidance provided", confidence=0.9)
    assert copilot_resp.confidence == 0.9

    skill_gap = SkillGapResponse(
        career_id="career-1",
        career_title="Backend Developer",
        readiness_score=80,
        summary_analysis="Ready"
    )
    assert skill_gap.readiness_score == 80

    roadmap = RoadmapResponse(
        career_title="Backend Developer",
        duration_months=3,
        overview="3 month roadmap"
    )
    assert roadmap.duration_months == 3

    print("[OK] All AI service schemas validated successfully")

if __name__ == "__main__":
    test_schemas_instantiation()
