<div align="center">

# MP Online | AI-Powered Career Readiness & Employability Platform
### *Bridging the Gap from Campus → Career → Corporate*

[![Node.js Version](https://img.shields.io/badge/Node.js-v20%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python Version](https://img.shields.io/badge/Python-3.11%20|%203.12%20|%203.13-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%2015-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-3.5_Flash_Lite-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![LangChain / LangGraph](https://img.shields.io/badge/Orchestration-LangGraph-FF6F00?logo=langchain&logoColor=white)](https://www.langchain.com/)

<p align="center">
  <b>A national-scale, multi-tenant digital employability ecosystem aligned with NEP 2020, Skill India, and Digital India.</b><br>
  Combining authoritative PostgreSQL analytics, deterministic applicant tracking, and stateful Google Gemini AI workflows.
</p>

---

</div>

## 📑 Table of Contents

1. [Executive Overview & Vision](#1-executive-overview--vision)
2. [National Policy & Government Initiatives Alignment](#2-national-policy--government-initiatives-alignment)
3. [Full-Stack System Architecture](#3-full-stack-system-architecture)
4. [Core Modules & Operational Capabilities](#4-core-modules--operational-capabilities)
5. [AI Intelligence & Agent Architecture](#5-ai-intelligence--agent-architecture)
6. [Database Schema & Migration Index](#6-database-schema--migration-index)
7. [API Gateway & Endpoint Matrix](#7-api-gateway--endpoint-matrix)
8. [Automated Testing & Quality Assurance](#8-automated-testing--quality-assurance)
9. [Repository & Directory Structure](#9-repository--directory-structure)
10. [Local Development & Deployment Guide](#10-local-development--deployment-guide)
11. [Security, Governance & Data Isolation](#11-security-governance--data-isolation)

---

## 1. Executive Overview & Vision

**MP Online (Campus2Corporate)** is an enterprise career enablement and talent assessment platform developed to address graduate employability challenges. It replaces static job boards and isolated resume builders with an integrated, intelligent ecosystem connecting:

- **Students & Candidates**: Self-service portfolio building, AI skill-gap diagnostics against target market roles, interactive mock interviews, and automated multi-month learning roadmaps.
- **Recruiters & Enterprises**: Talent pipeline sourcing, objective hybrid match ranking, and an auditable, stage-gated Applicant Tracking System (ATS).
- **Public Sector & National Bodies**: Direct integration with government vacancies (NIC, C-DAC, DRDO, ISRO, CRIS) and national youth development schemes (NAPS, PMKVY 4.0, Digital India internships).
- **Academic & Platform Administrators**: Governance over course catalogs, skill hierarchies, and employment telemetry.

---

## 2. National Policy & Government Initiatives Alignment

The platform is designed to support core Indian educational and employment frameworks:

```
                      NATIONAL POLICY DIRECTIVES
 ┌──────────────────────────────────────────────────────────────────┐
 │                                                                  │
 │   🇮🇳 NEP 2020                 🇮🇳 SKILL INDIA      🇮🇳 DIGITAL INDIA│
 │   - Multidisciplinary Paths   - PMKVY 4.0 AI/Cloud - MeitY Schemes│
 │   - Experiential Learning     - NAPS Apprenticeships- Cloud Systems│
 │   - Outcome-Based Tracking    - Industry Readiness - Public GovTech│
 └──────────────────────────────────────────────────────────────────┘
```

- **NEP 2020 (National Education Policy)**:
  - Supports continuous, multi-disciplinary competency mapping across academic subjects, personal projects, and industry certifications.
  - Implements outcome-based milestone roadmaps that convert academic credentials into industry-recognized competencies.
- **Skill India Mission (MSDE & NSDC)**:
  - Deep-links students into the **National Apprenticeship Promotion Scheme (NAPS)** with direct stipend metadata.
  - Recommends certifications in emerging technologies under **PMKVY 4.0** (Artificial Intelligence, Cloud Computing, Cyber Security).
- **Digital India (MeitY)**:
  - Dedicated public-sector portal featuring technology openings at **National Informatics Centre (NIC)**, **Centre for Development of Advanced Computing (C-DAC)**, **Defence Research & Development Organisation (DRDO)**, and **Centre for Railway Information Systems (CRIS)**.

---

## 3. Full-Stack System Architecture

The platform uses a decoupled, microservice-inspired architecture designed for high throughput, strict security boundaries, and deterministic data handling:

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│                                  PRESENTATION TIER                                    │
│                    Vite + React 18 + TypeScript + Tailwind CSS                        │
│   - Public Portal & Explorers          - Student Career & Interview Studio            │
│   - Recruiter ATS Kanban Board         - Dynamic UI Adjuster & Skeuomorphic Gauges    │
│   - Admin Governance Console           - Real-time Copilot Drawer & Voice Assistant   │
└───────────────────────────────────────────┬───────────────────────────────────────────┘
                                            │ HTTPS / WSS (Bearer Supabase JWT)
                                            ▼
┌───────────────────────────────────────────────────────────────────────────────────────┐
│                                APPLICATION GATEWAY TIER                               │
│                         Node.js (v20+) + Express.js + TypeScript                      │
│                                                                                       │
│  - Helmet Security & Strict CORS Policy      - Role-Based Access Control (RBAC Guard) │
│  - Zod Request Schema Validation             - Mutex ATS State Machine Engine         │
│  - Vector PDF Engine (PDFKit)                - Cloud Storage Multiplexer              │
│  - Centralized Async Error Trap              - RESTful Gateway to Python AI Service   │
└───────────────────────┬───────────────────────────────────────────────┬───────────────┘
                        │                                               │
          Internal REST │ (FastAPI Client)                Supabase SDK  │ (Service Role)
                        ▼                                               ▼
┌───────────────────────────────────────────────┐ ┌─────────────────────────────────────┐
│             AI INTELLIGENCE TIER              │ │            PERSISTENCE TIER         │
│             FastAPI + Python 3.13             │ │          Supabase / PostgreSQL 15   │
│                                               │ │                                     │
│ - Google Gemini 3.5 Flash Lite Engine         │ │ - Relational Tables & Foreign Keys  │
│ - LangChain & LangGraph Workflows             │ │ - Row Level Security (RLS) Policies │
│ - Dynamic ContextBuilder (Zero Direct SQL)    │ │ - pgvector High-Dimensional Storage │
│ - Strict Guardrails & Persona Scoping         │ │ - Private Storage Buckets:          │
│ - Tavily Live Web Intelligence Search         │ │     • `resumes`  (PDF / DOCX)       │
│ - Groq Whisper Turbo Voice Transcription      │ │     • `reports`  (Assessment PDFs) │
└───────────────────────────────────────────────┘ └─────────────────────────────────────┘
```

---

## 4. Core Modules & Operational Capabilities

### 4.1 Authentication & Role-Based Access Control (RBAC)
- **Roles**: `STUDENT`, `RECRUITER`, `ADMIN`.
- **Identity Provider**: Supabase Auth (GoTrue) handling token issuance, refreshes, and revocation.
- **Fail-Safe Mechanism**: Database stored procedure `public.create_auth_user_fallback` creates secure bcrypt-hashed identity records if external SMTP or rate-limit thresholds are reached.

### 4.2 Student Portfolio & Academic Records
- Complete normalization of student profiles: education institutions, degree programs, graduation years, GPA, and semester records.
- Portfolio integration for GitHub repositories, live demo URLs, LinkedIn profiles, and personal bios.

### 4.3 Skills Catalog & Dynamic Gap Diagnostics
- Standardized taxonomy of 30+ core technical skills with multi-level parent-child categorization.
- Tracks verified vs. self-reported proficiencies (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`, `EXPERT`).
- Real-time skill-gap calculation against 10 foundational industry career roles.

### 4.4 Dual-Source Course Recommender Engine
- **Platform Academy First**: Identifies missing skills and first prioritizes internal verified courses.
- **Tavily Web Search Discovery**: Automatically discovers external, high-quality free and paid courses (Coursera, Udemy, edX, YouTube) for remaining skill gaps.

### 4.5 Government Employment & National Schemes Portal
- Filterable listings across Central Government, Defence, Railways, PSUs, and Research Bodies.
- Degree-matching algorithm that maps B.Tech, MCA, M.Tech, and B.Sc qualifications to relevant public-sector vacancies.
- Curated integration with national development initiatives (NAPS, PMKVY 4.0, MeitY).

### 4.6 Recruiter Portal & Deterministic ATS Pipeline
- Recruiter job and internship management with weighted skill tagging.
- **Deterministic ATS State Machine**:
  $$\text{APPLIED} \longrightarrow \text{REVIEWING} \longrightarrow \text{INTERVIEW\_SCHEDULED} \longrightarrow \text{OFFER} \longrightarrow \text{SELECTED}$$
  - Illegal status transitions (e.g. `APPLIED` $\to$ `OFFER`) are rejected with `400 Bad Request`.
  - Immutable terminal states (`SELECTED`, `REJECTED`) prevent unauthorized edits.
  - Complete historical audit logging in `application_status_history`.

### 4.7 Resume Ingestion & ATS AI Scanner
- Multipart upload (`.pdf`, `.docx`) supporting up to 10MB.
- In-memory parsing using `pdf-parse` and `mammoth` (no raw file paths saved on disk).
- Storage in encrypted private Supabase Storage buckets.
- AI ATS evaluation: keyword matching, formatting compliance, readability scoring, and bullet-point rewrite suggestions.
- Temporary time-limited signed URLs (e.g., 60-minute expiry) for authenticated document access.

### 4.8 Adaptive AI Mock Interview Studio
- Multi-turn, real-time conversational interview simulation supporting `TECHNICAL`, `BEHAVIORAL`, `SYSTEM_DESIGN`, or `MIXED` formats.
- Real-time speech-to-text processing (Web Speech API / Groq Whisper Turbo).
- Per-turn guardrails to detect and steer off-topic candidate queries back to the interview context.

### 4.9 Executive PDF Assessment Report Generator
- Built with `pdfkit` to compile multi-page vector assessment reports.
- Includes candidate metadata, hiring readiness badge, 4-pillar competency progress bars, strengths, growth areas, skill recommendations, and turn-by-turn transcripts.
- Endpoints support direct download (`Content-Disposition: attachment`) and in-browser preview (`?view=inline`), with automatic persistence to Supabase Storage.

### 4.10 Guardrailed AI Career Copilot
- Dynamic `ContextBuilder` that selectively pulls relevant profile, skill, and goal data without exposing database access to the model.
- Strictly enforced domain guardrails to keep interactions focused on career progression and employability.
- Dynamic 3-to-6-month milestone roadmaps with sequential phases.

---

## 5. AI Intelligence & Agent Architecture

### 5.1 Model Standardization: Google Gemini 3.5 Flash Lite
Integrated via `langchain-google-genai` for predictable inference speeds and structured outputs.

```python
# ai-service/app/llm/provider.py
from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.config import get_settings

def get_llm(temperature: float = 0.2, structured_output_schema=None):
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

### 5.2 Deterministic Hybrid Matching Engine
Matching calculations combine deterministic checks with semantic similarity:

$$\text{Match Score} = (0.45 \times \text{Skill Overlap}) + (0.35 \times \text{Semantic Cosine Similarity}) + (0.20 \times \text{Academic Alignment})$$

```
   Student Skills        Job Required Skills
        │                        │
        └───────────┬────────────┘
                    │
                    ▼
     [45% Verified Skill Overlap]
                    │
                    ├──────► [Final Match Score (0 - 100%)]
                    │                    │
     [35% pgvector Embeddings]           ▼
                    │        [LLM Generates Rationale & Gaps]
     [20% Academic Alignment]
```

---

## 6. Database Schema & Migration Index

The relational architecture contains 20+ tables secured with PostgreSQL Row Level Security (RLS):

| Migration File | Description |
|---|---|
| [`001_initial_schema.sql`](file:///c:/Users/dell/OneDrive/Desktop/mp%20online/database/migrations/001_initial_schema.sql) | Core schema: users, students, recruiters, skills, careers, jobs, applications, interviews, courses, pgvector extensions. |
| [`002_remove_mentor_role.sql`](file:///c:/Users/dell/OneDrive/Desktop/mp%20online/database/migrations/002_remove_mentor_role.sql) | Aligns user roles to `STUDENT`, `RECRUITER`, and `ADMIN`. |
| [`003_storage_resumes_bucket.sql`](file:///c:/Users/dell/OneDrive/Desktop/mp%20online/database/migrations/003_storage_resumes_bucket.sql) | Configures private `resumes` storage bucket with 10MB limits. |
| [`004_recruiter_and_ats_workflows.sql`](file:///c:/Users/dell/OneDrive/Desktop/mp%20online/database/migrations/004_recruiter_and_ats_workflows.sql) | Adds ATS status enum and `application_status_history` audit table. |
| [`005_backend_rls_alignment.sql`](file:///c:/Users/dell/OneDrive/Desktop/mp%20online/database/migrations/005_backend_rls_alignment.sql) | Refines service-role gateway execution policies. |
| [`006_add_verified_to_student_skills.sql`](file:///c:/Users/dell/OneDrive/Desktop/mp%20online/database/migrations/006_add_verified_to_student_skills.sql) | Adds verified skill tracking flags. |
| [`007_storage_resumes_policies.sql`](file:///c:/Users/dell/OneDrive/Desktop/mp%20online/database/migrations/007_storage_resumes_policies.sql) | Enforces tenant-isolated storage access policies. |
| [`008_government_schemes_and_jobs.sql`](file:///c:/Users/dell/OneDrive/Desktop/mp%20online/database/migrations/008_government_schemes_and_jobs.sql) | Adds `government_schemes` table, extends `jobs` table, and adds auth fallback procedure. |
| [`009_interview_reports_and_pdf.sql`](file:///c:/Users/dell/OneDrive/Desktop/mp%20online/database/migrations/009_interview_reports_and_pdf.sql) | Adds `report_data`, `pdf_url`, `completed_at`, and private `reports` storage bucket. |

---

## 7. API Gateway & Endpoint Matrix

All endpoints (except public catalogs and login) require an `Authorization: Bearer <JWT>` header.

### 7.1 Authentication & Profile
| Method | Route | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register with role (`STUDENT`, `RECRUITER`, `ADMIN`). |
| `POST` | `/api/auth/login` | Public | Authenticates credentials and returns JWT session. |
| `POST` | `/api/auth/logout` | Optional | Terminates session. |
| `GET` | `/api/auth/me` | Authenticated | Returns current profile and identity. |
| `GET` | `/api/students/me` | `STUDENT` | Retrieves full portfolio, education, skills, and projects. |
| `PUT` | `/api/students/me` | `STUDENT` | Updates candidate portfolio and biographical data. |

### 7.2 Careers, Skills & Courses
| Method | Route | Access | Description |
|---|---|---|---|
| `GET` | `/api/skills` | Public | Retrieves standardized skill catalog. |
| `POST` | `/api/skills/me` | `STUDENT` | Adds or updates student proficiency rating. |
| `GET` | `/api/careers` | Public | Lists foundational career paths and required skills. |
| `POST` | `/api/careers/me/goals` | `STUDENT` | Sets active career target for diagnostics. |
| `GET` | `/api/courses` | Public | Browses internal platform courses. |
| `POST` | `/api/courses/recommendations/skill-gap` | Public | Dual-source recommendation (Platform + Tavily Live Web). |
| `POST` | `/api/admin/courses` | `ADMIN` | Adds course to platform catalog. |
| `DELETE`| `/api/admin/courses/:id` | `ADMIN` | Removes course from platform catalog. |

### 7.3 Jobs, Internships & Government Schemes
| Method | Route | Access | Description |
|---|---|---|---|
| `GET` | `/api/jobs` | Public | Browses job openings with filtering. |
| `GET` | `/api/jobs/government` | Public | Lists public-sector openings (NIC, C-DAC, DRDO, CRIS). |
| `GET` | `/api/government-schemes`| Public | National schemes (NAPS, PMKVY 4.0, MeitY). |
| `POST` | `/api/government-schemes/recommend` | Optional | Recommends schemes based on degree and skills. |
| `POST` | `/api/jobs` | `RECRUITER`, `ADMIN` | Posts job with weighted skill requirements. |
| `GET` | `/api/jobs/:id/candidates` | `RECRUITER`, `ADMIN` | Views applicants ranked by match score. |

### 7.4 ATS Applications Pipeline
| Method | Route | Access | Description |
|---|---|---|---|
| `POST` | `/api/applications` | `STUDENT` | Submits application and computes match score. |
| `GET` | `/api/applications/me` | `STUDENT` | Tracks student submitted applications. |
| `PATCH`| `/api/applications/:id/status` | `RECRUITER`, `ADMIN` | Transitions ATS stage with state validation. |
| `GET` | `/api/applications/:id` | `RECRUITER`, `ADMIN` | Inspects application audit history. |

### 7.5 Resume Ingestion & ATS Intelligence
| Method | Route | Access | Description |
|---|---|---|---|
| `POST` | `/api/resumes/upload` | `STUDENT` | Multipart upload (`.pdf`, `.docx`) $\to$ ATS scoring. |
| `GET` | `/api/resumes/me` | `STUDENT` | Retrieves uploaded resumes and analysis. |
| `GET` | `/api/resumes/:id/download-url` | `STUDENT` | Generates secure, time-limited download URL. |

### 7.6 Mock Interviews & Assessment Reports
| Method | Route | Access | Description |
|---|---|---|---|
| `POST` | `/api/interviews/generate` | `STUDENT` | Initializes adaptive mock interview session. |
| `POST` | `/api/interviews/:id/turn` | `STUDENT` | Evaluates turn answer and generates follow-up question. |
| `POST` | `/api/interviews/:id/report` | `STUDENT` | Compiles comprehensive scorecard and generates PDF. |
| `GET` | `/api/interviews/:id/report` | `STUDENT` | Retrieves cached scorecard and download URLs. |
| `GET` | `/api/interviews/:id/report/pdf` | `STUDENT` | Streams binary PDF (download or `?view=inline`). |

### 7.7 AI Career Copilot & Roadmaps
| Method | Route | Access | Description |
|---|---|---|---|
| `POST` | `/api/ai/chat` | `STUDENT` | Guardrailed conversational career advisor. |
| `POST` | `/api/ai/career/skill-gap` | `STUDENT` | Multi-dimensional skill-gap analysis. |
| `POST` | `/api/ai/roadmap` | `STUDENT` | Generates 3-to-6-month milestone roadmap. |

---

## 8. Automated Testing & Quality Assurance

The platform includes end-to-end test suites covering auth, business logic, and security:

```
                          AUTOMATED TEST COVERAGE
 ┌───────────────────────────────────────────────────────────────────────┐
 │                                                                       │
 │  npm run test:all ────────────────────────────────────────────────┐   │
 │                                                                   │   │
 │  ├── npm run test          (Smoke sanity checks)                  │   │
 │  ├── npm run test:gov      (RBAC auth & government schemes)       │   │
 │  ├── npm run test:pdf      (Interview PDF generation & streaming) │   │
 │  └── npm run test:e2e      (Full 11-module platform regression)   │   │
 │                                                                   │   │
 └───────────────────────────────────────────────────────────────────┘
```

### Running Test Suites
```bash
cd backend

# 1. Run dedicated Mock Interview PDF Generation & Streaming test
npm run test:pdf

# 2. Run RBAC Registration, Login & Government Schemes test
npm run test:gov

# 3. Run full 11-module E2E platform test
npm run test:e2e

# 4. Run the entire automated test suite sequentially
npm run test:all
```

---

## 9. Repository & Directory Structure

```
mp-online/
├── backend/                             # Express.js Application Gateway (Node.js + TypeScript)
│   ├── src/
│   │   ├── app.ts                       # Express setup, middleware, and route mounting
│   │   ├── server.ts                    # HTTP server bootstrap
│   │   ├── config/                      # Validated environment configuration & Supabase singletons
│   │   ├── middleware/                  # JWT auth, RBAC guard, Zod validation, error handler
│   │   ├── modules/                     # Feature domain modules
│   │   │   ├── auth/                    # RBAC registration, login, session handlers
│   │   │   ├── student/                 # Profiles, education, projects
│   │   │   ├── skills/                  # Skills catalog & student ratings
│   │   │   ├── careers/                 # Career definitions & student targets
│   │   │   ├── courses/                 # Platform academy course management
│   │   │   ├── jobs/                    # Jobs, internships, public-sector openings
│   │   │   ├── applications/            # ATS state machine & status history
│   │   │   ├── resume/                  # Uploads, ATS scoring, signed URLs
│   │   │   ├── interviews/              # Mock interviews, turns, scorecards, PDF streams
│   │   │   ├── recommendations/         # Hybrid gap course recommendations
│   │   │   ├── copilot/                 # AI Copilot endpoints
│   │   │   └── government-schemes/      # National schemes & public recommendations
│   │   └── services/                    # Shared services
│   │       ├── ai.service.ts            # HTTP client for Python FastAPI service
│   │       ├── interview-pdf.service.ts # PDFKit assessment report compiler
│   │       ├── storage.service.ts       # Supabase Storage client
│   │       └── resume-parser.service.ts # In-memory PDF/DOCX text extractor
│   └── tests/                           # Integration & QA test suites
│       ├── smoke.test.ts
│       ├── government_and_auth.test.ts
│       ├── interview_pdf_download.test.ts
│       └── e2e_full_platform.test.ts
│
├── ai-service/                          # AI Intelligence Service (Python + FastAPI)
│   ├── app/
│   │   ├── main.py                      # FastAPI app entry point & CORS configuration
│   │   ├── core/                        # Configuration & JSON logging
│   │   ├── llm/                         # Gemini 3.5 Flash Lite provider factory
│   │   ├── schemas/                     # Pydantic schemas (copilot, interview, resume)
│   │   ├── agent/                       # LangGraph workflows, ContextBuilder, Tools
│   │   ├── services/                    # Interview evaluation, ATS scoring, matching
│   │   └── api/routes/                  # Internal REST endpoints
│   └── requirements.txt
│
├── frontend/                            # Presentation Layer (Vite + React 18 + Tailwind)
│   ├── src/
│   │   ├── App.tsx                      # Routing & navigation
│   │   ├── components/                  # Layout, navigation, gauges, Copilot drawer
│   │   ├── pages/
│   │   │   ├── public/                  # Landing, career explorer, jobs explorer
│   │   │   ├── auth/                    # Login & registration forms
│   │   │   ├── student/                 # Dashboard, interview studio, roadmap, courses
│   │   │   ├── recruiter/               # Dashboard, ATS Kanban, job wizard
│   │   │   └── admin/                   # Governance & academy course manager
│   │   └── services/                    # API client bindings & UI contexts
│   ├── package.json
│   └── vite.config.ts
│
├── database/
│   ├── migrations/                      # 001 to 009 SQL migrations
│   └── seed/                            # 001_seed_data.sql (Careers, skills, public jobs)
│
├── integration.md                       # Comprehensive API contract & integration specs
├── SITEMAP.md                           # Detailed frontend site map & page inventory
└── docker-compose.yml                   # Container orchestration
```

---

## 10. Local Development & Deployment Guide

### Prerequisites
- **Node.js**: v20.x or higher
- **Python**: v3.11, v3.12, or v3.13
- **Supabase Account**: A Supabase project with database access
- **Google Gemini API Key**: From [Google AI Studio](https://aistudio.google.com/)

---

### Step 1: Environment Configuration

Create a root `.env` file (or configure individual `.env` files in each service):

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Supabase Credentials
SUPABASE_URL=https://<your-project-id>.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# AI Intelligence Service
AI_SERVICE_URL=http://127.0.0.1:8000
GOOGLE_API_KEY=AIzaSy...

# Optional External Integrations
TAVILY_API_KEY=tvly-...
GROQ_API_KEY=gsk_...
```

---

### Step 2: Database Initialization

1. Open your **Supabase Dashboard $\to$ SQL Editor**.
2. Run migrations [`001_initial_schema.sql`](file:///c:/Users/dell/OneDrive/Desktop/mp%20online/database/migrations/001_initial_schema.sql) through [`009_interview_reports_and_pdf.sql`](file:///c:/Users/dell/OneDrive/Desktop/mp%20online/database/migrations/009_interview_reports_and_pdf.sql) in sequence.
3. Run the seed data script: [`database/seed/001_seed_data.sql`](file:///c:/Users/dell/OneDrive/Desktop/mp%20online/database/seed/001_seed_data.sql).

---

### Step 3: Start the Backend Service

```bash
cd backend
npm install
npm run dev
```
The gateway will start on **`http://localhost:5000`**.
Verify health: `http://localhost:5000/health`

---

### Step 4: Start the AI Intelligence Service

```bash
cd ai-service

# Create and activate virtual environment
python -m venv .venv

# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The AI service will start on **`http://127.0.0.1:8000`**.
Verify health: `http://127.0.0.1:8000/health`

---

### Step 5: Start the Frontend Application

```bash
cd frontend
npm install
npm run dev
```
The client portal will start on **`http://localhost:5173`**.

---

## 11. Security, Governance & Data Isolation

- **Zero Direct SQL for LLMs**: The AI microservice has no direct SQL connection or credentials. Data access is controlled entirely through typed tool functions.
- **Tenant Isolation**: Row Level Security (RLS) policies ensure candidates can only access their own documents, resumes, interview transcripts, and evaluations.
- **Time-Limited Cloud URLs**: Resumes and generated PDFs are stored in private Supabase Storage buckets, accessed via signed URLs with short expiration windows.
- **Defensive Error Handling**: Express route exceptions pass through a central error handler to prevent stack trace leaks, returning structured JSON error payloads.
- **Strict Input Validation**: Incoming request bodies, query parameters, and route parameters are validated using Zod schemas before reaching domain controllers.

---

<div align="center">

**MP Online Career Readiness & Employability Platform**  
*Empowering India's next generation of software professionals.*

</div>
