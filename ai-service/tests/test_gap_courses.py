"""
Test suite for Skill Gap Course Recommendations.
Verifies:
1. Internal platform courses are prioritized FIRST
2. Searched web courses follow
3. Categorization into Paid and Unpaid (Free)
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_recommend_gap_courses():
    payload = {
        "skills": ["Docker", "PostgreSQL"],
        "career_title": "Backend Developer",
        "max_web_results_per_skill": 2
    }

    response = client.post("/ai/courses/recommend-gap-courses", json=payload)
    assert response.status_code == 200, f"Expected 200 OK, got {response.status_code}: {response.text}"

    data = response.json()
    assert "skill_groups" in data
    assert len(data["skill_groups"]) == 2
    assert data["total_courses"] > 0
    assert data["total_unpaid_courses"] > 0
    assert data["total_paid_courses"] > 0

    # 1. Verify Docker skill group
    docker_group = next(g for g in data["skill_groups"] if g["skill_name"] == "Docker")
    assert len(docker_group["paid_courses"]) > 0
    assert len(docker_group["unpaid_courses"]) > 0
    
    # Priority rule: Platform course must be the FIRST item in the paid list
    first_docker_paid = docker_group["paid_courses"][0]
    assert first_docker_paid["source"] == "APP_CATALOG", (
        f"Expected first paid course to be from APP_CATALOG, got {first_docker_paid['source']}"
    )
    assert "Docker" in first_docker_paid["title"]

    # 2. Verify PostgreSQL skill group
    pg_group = next(g for g in data["skill_groups"] if g["skill_name"] == "PostgreSQL")
    assert len(pg_group["unpaid_courses"]) > 0

    # Priority rule: Platform course must be the FIRST item in the unpaid list
    first_pg_unpaid = pg_group["unpaid_courses"][0]
    assert first_pg_unpaid["source"] == "APP_CATALOG", (
        f"Expected first unpaid course to be from APP_CATALOG, got {first_pg_unpaid['source']}"
    )
    assert "PostgreSQL" in first_pg_unpaid["title"]

    # 3. Verify web search courses are present in the list after app courses
    has_web_search = any(
        c["source"] == "WEB_SEARCH"
        for group in data["skill_groups"]
        for c in (group["unpaid_courses"] + group["paid_courses"])
    )
    assert has_web_search, "Expected web search courses to be present"

    print("[PASSED] All Skill Gap Course Recommendation tests PASSED!")

if __name__ == "__main__":
    test_recommend_gap_courses()
