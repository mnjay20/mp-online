# AI Agents & Intelligence Architecture

## 1. Overview & Core Directives

This document defines the architecture, design patterns, and operational boundaries for the **FastAPI AI Intelligence Service**.

### Core Tenets
1. **Model Standard**: Utilizes **Google Gemini 3.5 Flash Lite** via LangChain's Google GenAI integration (`langchain-google-genai`).
2. **Stateful Graph Orchestration**: Utilizes **LangGraph** where multi-step workflows require state persistence, checkpointing, and conditional branching (e.g., Resume Ingestion → Skill Extraction → Gap Analysis → Personalized Roadmap).
3. **No Database Super-User for LLMs**: The AI service and LLM **never receive direct arbitrary SQL execution access**. All data retrieval and actions must pass through strictly typed, controlled tool functions.
4. **Authoritative Context vs. Hallucinated Memory**: Conversational memory is not the single source of truth. The authoritative student state is dynamically compiled by the **Central ContextBuilder** from PostgreSQL records.
5. **Explainability First**: Unexplained recommendations are forbidden. Every AI output provides rationale, identified gaps, matching confidence, and concrete next actions.
6. **DRY & Clean Code**: Reusable prompt templates, shared Pydantic response models, modular tool registries, and clear, concise comments without boilerplate clutter.

---

## 2. AI Service Architecture & Directory Layout

The AI service is decoupled from the Express web server and runs as an independent, lightweight FastAPI service.

```
ai-service/
├── app/
│   ├── main.py                        # FastAPI app creation, middleware, and health endpoints
│   │
│   ├── core/
│   │   ├── config.py                  # Pydantic BaseSettings for env (GEMINI_API_KEY, SUPABASE_URL, etc.)
│   │   └── logging.py                 # Structured JSON logger
│   │
│   ├── llm/
│   │   ├── provider.py                # LangChain ChatGoogleGenerativeAI factory (Gemini 3.5 Flash Lite)
│   │   └── embeddings.py              # Google GenAI Embeddings factory
│   │
│   ├── schemas/                       # Pydantic Schemas & DTOs
│   │   ├── context.py                 # StudentContext, ProfileContext, SkillContext
│   │   ├── copilot.py                 # ChatRequest, ChatResponse, StructuredAction
│   │   ├── career.py                  # CareerRecommendation, SkillGapItem, GapAnalysisResponse
│   │   ├── roadmap.py                 # LearningRoadmap, RoadmapMilestone
│   │   ├── resume.py                  # ResumeAnalysisResult, AtsScoreBreakdown, ImprovementItem
│   │   ├── interview.py               # InterviewQuestion, AnswerEvaluation, PerformanceReport
│   │   └── matching.py                # JobMatchResult, InternshipMatchResult
│   │
│   ├── agent/
│   │   ├── state.py                   # LangGraph TypedDict / Pydantic State definitions
│   │   ├── career_agent.py            # Main Career Copilot agent loop
│   │   ├── context_builder.py         # Dynamic, selective context compilation
│   │   ├── prompts/
│   │   │   ├── copilot_prompts.py     # Prompt templates for general copilot dialogue
│   │   │   ├── career_prompts.py      # Skill-gap and career recommendation system prompts
│   │   │   ├── resume_prompts.py      # ATS review and bullet-point enhancement prompts
│   │   │   └── interview_prompts.py   # Mock interview generation and scoring rubrics
│   │   │
│   │   └── tools/                     # Controlled Agent Tools
│   │       ├── student_tools.py       # get_student_profile, get_skills, get_projects
│   │       ├── career_tools.py        # get_career_requirements, calculate_skill_gap
│   │       ├── opportunity_tools.py   # search_jobs, search_courses, search_internships
│   │       └── resume_tools.py        # parse_resume_text, extract_resume_skills
│   │
│   ├── graphs/                        # LangGraph StateGraph Workflows
│   │   ├── resume_processing_graph.py # Resume Text → Skills → Career Gap → Course Suggestion
│   │   └── mock_interview_graph.py    # Role Setup → Question Generator → Evaluation Loop
│   │
│   ├── rag/
│   │   ├── vector_store.py            # Supabase pgvector integration via LangChain PGVector
│   │   ├── retriever.py               # Semantic retriever for career & industry knowledge
│   │   └── ingestion.py               # Document chunking & embedding pipeline
│   │
│   ├── services/                      # Domain Service Layer (Pure Business Functions)
│   │   ├── career_service.py          # Career guidance and gap scoring logic
│   │   ├── resume_service.py          # Resume parsing, ATS scoring & bullet polishing
│   │   ├── interview_service.py       # Mock interview generation & evaluation
│   │   └── matching_service.py        # Hybrid semantic + skill matching engine
│   │
│   └── api/
│       └── routes/                    # Internal REST endpoints called by Express
│           ├── chat.py                # POST /ai/chat
│           ├── career.py              # POST /ai/career/recommend, POST /ai/career/skill-gap
│           ├── roadmap.py             # POST /ai/roadmap/generate
│           ├── resume.py              # POST /ai/resume/analyze, POST /ai/resume/improve
│           ├── interview.py           # POST /ai/interview/generate, POST /ai/interview/evaluate
│           └── matching.py            # POST /ai/match/jobs, POST /ai/match/internships
│
├── tests/
├── requirements.txt
├── pyproject.toml
└── .env.example
```

---

## 3. LLM Integration: Gemini 3.5 Flash Lite

The service standardizes on **Gemini 3.5 Flash Lite** for superior inference speed, cost-efficiency, and strong reasoning capabilities.

### Factory Pattern (`app/llm/provider.py`)
```python
from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.config import get_settings

def get_llm(temperature: float = 0.2, structured_output_schema=None) -> ChatGoogleGenerativeAI:
    """
    Instantiates Google Gemini 3.5 Flash Lite client with strict deterministic defaults.
    """
    settings = get_settings()
    llm = ChatGoogleGenerativeAI(
        model="gemini-3.5-flash-lite",
        google_api_key=settings.GOOGLE_API_KEY,
        temperature=temperature,
        max_output_tokens=2048,
    )
    if structured_output_schema:
        return llm.with_structured_output(structured_output_schema)
    return llm
```

---

## 4. Central AI ContextBuilder

To prevent cognitive overload and context poisoning, the `ContextBuilder` dynamically pulls only domain-relevant fragments into the LLM prompt.

```
Incoming Request ("What skills do I need for Backend Developer?")
  │
  ▼
ContextBuilder.build_context(student_id, intent="CAREER_SKILL_GAP")
  ├── Profile: Year, Major (e.g. CS Sophomore)
  ├── Current Skills: Python (Intermediate), Git (Beginner)
  ├── Target Career Goal: Backend Developer (Priority 1)
  ├── Excluded: Irrelevant personal contacts, non-related academic marks
  └── Available Course Catalog: Backend modules
  │
  ▼
Structured StudentContext Object → LLM Prompt / Tool execution
```

### Context Schema (`app/schemas/context.py`)
```python
from pydantic import BaseModel
from typing import List, Optional

class SkillRecord(BaseModel):
    name: str
    proficiency: str  # BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
    verified: bool

class CareerTarget(BaseModel):
    title: str
    priority: int

class StudentContext(BaseModel):
    student_id: str
    degree: Optional[str] = None
    target_career: Optional[CareerTarget] = None
    skills: List[SkillRecord] = []
    projects: List[str] = []
    current_gap_skills: List[str] = []
```

---

## 5. Controlled Agent Tools

Tools operate as pure functions or typed API callers. They do **not** execute arbitrary SQL.

| Tool Name | Input Parameters | Output | Description |
|---|---|---|---|
| `get_student_profile` | `student_id: str` | `StudentProfile` | Retrieves student bio, education level, and active goals. |
| `get_student_skills` | `student_id: str` | `List[SkillRecord]` | Retrieves verified and self-reported skills. |
| `get_career_requirements` | `career_id: str` | `CareerRequirements` | Returns skills and required proficiency levels for a career. |
| `calculate_skill_gap` | `student_id: str, career_id: str` | `SkillGapReport` | Compares student current skills with career requirements. |
| `search_courses` | `skill_names: List[str]` | `List[Course]` | Searches course catalog for courses addressing specific gaps. |
| `search_jobs` | `skills: List[str], limit: int` | `List[Job]` | Dispatches semantic + skill overlap search for opportunities. |
| `analyze_resume_text` | `resume_text: str, target_role: str` | `AtsAnalysis` | Scores keywords, structure, readability, and ATS metrics. |

---

## 6. LangGraph Workflows for Complex Pipelines

When processing stateful multi-step pipelines, LangGraph manages the state machine and conditional transitions.

### Flow: Career Readiness & Learning Roadmap Generation
```
  [Start]
     │
     ▼
[Extract Student State] ─────────────┐
     │                               │
     ▼                               ▼
[Fetch Target Career Skills]    [Compute Gap Scores]
     │                               │
     └───────────────┬───────────────┘
                     │
                     ▼
           [Curate Course Sequence]
                     │
                     ▼
      [Draft 3-Month Action Roadmap]
                     │
                     ▼
            [Pydantic Validation]
                     │
                     ▼
                  [Finish]
```

### LangGraph State Schema (`app/agent/state.py`)
```python
from typing import TypedDict, List, Optional
from app.schemas.career import SkillGapItem
from app.schemas.roadmap import RoadmapMilestone

class CareerAgentState(TypedDict):
    student_id: str
    target_career_id: str
    target_career_title: str
    student_skills: List[dict]
    identified_gaps: List[SkillGapItem]
    recommended_courses: List[dict]
    milestones: List[RoadmapMilestone]
    summary_explanation: str
```

---

## 7. Explainability & Structured AI Responses

Every AI response adheres to a strict Pydantic model guaranteeing explainability.

### Structured Response Model (`app/schemas/copilot.py`)
```python
from pydantic import BaseModel, Field
from typing import List, Optional

class RecommendationItem(BaseModel):
    type: str = Field(description="SKILL | COURSE | PROJECT | JOB | INTERNSHIP")
    title: str = Field(description="Name or title of recommended item")
    reason: str = Field(description="Detailed explanation based on student context")
    priority: str = Field(description="HIGH | MEDIUM | LOW")

class CopilotResponse(BaseModel):
    message: str = Field(description="Conversational response tailored to the student")
    confidence: float = Field(ge=0.0, le=1.0, description="Confidence score")
    recommendations: List[RecommendationItem] = []
    next_actions: List[str] = Field(description="Concrete action items for the student this week")
```

---

## 8. Hybrid Match Engine (Jobs & Internships)

Rather than delegating matching exclusively to an LLM hallucination, the matching engine uses a deterministic hybrid score:

$$\text{Final Match Score} = (0.45 \times \text{Skill Overlap}) + (0.35 \times \text{Semantic Embedding Similarity}) + (0.20 \times \text{Academic/Experience Alignment})$$

1. **Skill Overlap (45%)**: Ratio of student's verified skills against required job skill tags.
2. **Semantic Similarity (35%)**: Cosine similarity between student profile summary embedding and job description embedding via `pgvector`.
3. **Alignment (20%)**: Experience level match, graduation year, or location preference.
4. **LLM Synthesis**: Gemini 3.5 Flash Lite generates the user-facing explanation (`Why you are a match`, `Top missing skill to learn`).
