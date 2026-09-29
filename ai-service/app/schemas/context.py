from pydantic import BaseModel, Field
from typing import List, Optional

class StudentSkillItem(BaseModel):
    skill_name: str
    proficiency: str = "BEGINNER"
    source: str = "SELF_REPORTED"
    years_experience: float = 0.0

class StudentEducationItem(BaseModel):
    institution: str
    degree: str
    field_of_study: str
    graduation_year: Optional[int] = None
    gpa: Optional[float] = None

class StudentProjectItem(BaseModel):
    title: str
    description: str
    skills_used: List[str] = []

class StudentContext(BaseModel):
    student_id: str
    full_name: str = ""
    bio: Optional[str] = None
    education: List[StudentEducationItem] = []
    skills: List[StudentSkillItem] = []
    projects: List[StudentProjectItem] = []
    target_career_titles: List[str] = []
    current_courses: List[str] = []
