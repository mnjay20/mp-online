# AI-Powered Career Readiness & Employability Platform

A production-grade, modular platform engineered to empower students navigating the transition from **Campus → Career → Corporate**. Powered by an authoritative PostgreSQL/Supabase backbone and an AI Career Copilot orchestrator driven by **Google Gemini 3.5 Flash Lite** and **LangChain / LangGraph**.

---

## 1. System Architecture

```
                    ┌───────────────────────────────────────────────┐
                    │          Express.js Application Backend       │
                    │               (Node.js + TypeScript)          │
                    │                                               │
                    │  - Global Middleware (Helmet, CORS, RateLimit)│
                    │  - Supabase JWT Verification Auth Guard       │
                    │  - Feature-Based Domain Modules               │
                    │  - Zod Input Validation & Central Error Trap  │
                    └───────────────┬───────────────────────────────┘
                                    │
          ┌─────────────────────────┴────────────────────────┐
          │                                                  │
          ▼                                                  ▼
┌───────────────────────────────────┐             ┌───────────────────────────────────┐
│     FastAPI AI Orchestrator       │             │        Supabase Platform          │
│             (Python)              │             │                                   │
│  - LangChain Google GenAI         │             │  - Auth (Identity & JWT issuer)   │
│    (Gemini 3.5 Flash Lite)        │             │  - PostgreSQL 15+ (Relational DB) │
│  - LangGraph Stateful Workflows   │             │  - pgvector (Vector Embeddings)   │
│  - Dynamic ContextBuilder         │             │  - Row Level Security (RLS)       │
│  - Controlled Typed Tool Registry │             │  - Supabase Storage (Resumes/Docs)│
└───────────────────────────────────┘             └───────────────────────────────────┘
```

---

## 2. Key Modules & Capabilities

- **Identity & Authentication**: Supabase Auth handles registration, JWT verification, and session lifecycle. Express validates Supabase JWTs without storing custom password tables.
- **Student Profile & Academics**: Complete normalized profiles encompassing education, semester-wise subjects, credits, and GPA.
- **Skills Catalog & Hierarchy**: 30+ core technical skills with multi-tier parent-child relationships and proficiency rankings (`BEGINNER` to `EXPERT`).
- **Career Intelligence & Skill Gap**: Real-time evaluation against 10 foundational careers with granular importance weights.
- **Opportunities & Applications**: Job and internship listings with hybrid semantic matching and mutually exclusive application target constraints.
- **Resume Intelligence**: Private Supabase Storage bucket file tracking and AI-driven ATS evaluation and bullet-point enhancements.
- **Mock Interviews**: Adaptive technical, behavioral, and role-specific interview simulators with multi-dimensional scoring.
- **AI Career Copilot**: Context-aware career guide that dynamically constructs student context without leaking raw database access.

---

## 3. Directory Layout

```
career-readiness-platform/
├── backend/                  # Node.js + Express.js + TypeScript application service
│   ├── src/
│   │   ├── config/           # Validated environment & Supabase client singletons
│   │   ├── middleware/       # Auth guards, RBAC, Zod validation, error trap
│   │   ├── modules/          # Feature-based domain modules
│   │   ├── services/         # Storage and AI HTTP clients
│   │   └── lib/              # Standardized API response formatters & loggers
├── ai-service/               # Python + FastAPI + LangChain + LangGraph AI service
│   ├── app/
│   │   ├── agent/            # LangChain/LangGraph agent, ContextBuilder, and Tools
│   │   ├── api/routes/       # Internal endpoints for chat, resume, interview, matching
│   │   ├── llm/              # Gemini 3.5 Flash Lite provider factory
│   │   └── schemas/          # Pydantic validation contracts
├── database/
│   ├── migrations/           # 001_initial_schema.sql (PostgreSQL + RLS + pgvector)
│   └── seed/                 # 001_seed_data.sql (Careers, skills, requirements, jobs)
├── docker-compose.yml        # Multi-service local environment orchestration
├── architecture.md           # Backend architectural blueprint & coding ethics
├── agents.md                 # Agent specs, Gemini 3.5 Flash Lite & LangGraph workflows
└── .env.example              # Centralized environment variable documentation
```

---

## 4. Setup & Running Locally

### Step 1: Clone & Configure Environment
```bash
cp .env.example .env
# Edit .env with your SUPABASE_URL, SUPABASE_ANON_KEY, and GOOGLE_API_KEY
```

### Step 2: Apply Database Schema & Seed Data
Execute the migration scripts in your Supabase SQL Editor:
1. `database/migrations/001_initial_schema.sql`
2. `database/seed/001_seed_data.sql`

### Step 3: Start Services

#### Backend Service (Express)
```bash
cd backend
npm install
npm run dev
```
Health Check: `http://localhost:5000/health`

#### AI Service (FastAPI)
```bash
cd ai-service
python -m venv .venv
# Activate virtual environment
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Health Check: `http://localhost:8000/health`
