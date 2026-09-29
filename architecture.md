# System Architecture Documentation

## 1. Executive Summary & Core Mandate

This document outlines the architectural blueprint for the **AI-Powered Career Readiness & Employability Platform** backend ecosystem.

### Scope & Constraints
- **Scope Focus**: Dedicated focus on building a **production-oriented, modular, and decluttered Backend & AI Service** infrastructure.
- **Core Principles**:
  - **DRY (Don't Repeat Yourself)**: Shared utilities, unified validation mechanisms, consolidated schema declarations, and single sources of truth.
  - **Separation of Concerns**: Strict architectural boundaries between HTTP transport/routing, business logic, persistence layers, and AI orchestration.
  - **Professional Coding Ethics**: Explicit error handling without silent swallowing, zero sensitive data leaks in log streams, strict input validation with Zod/Pydantic, predictable REST status codes, and comprehensive TypeScript typings.
  - **No Monolithic Junk Drawers**: Feature-driven module layout. No global `controllers/`, `services/`, or `models/` holding dozens of unrelated files.

---

## 2. High-Level System Architecture

```
                    ┌───────────────────────────────────────────────┐
                    │               Client Consumers                │
                    │         (Web App, Mobile, API Consumers)      │
                    └───────────────────────┬───────────────────────┘
                                            │ HTTPS / REST (Bearer JWT)
                                            ▼
                    ┌───────────────────────────────────────────────┐
                    │          Express.js Application Backend       │
                    │               (Node.js + TypeScript)          │
                    │                                               │
                    │  ┌─────────────────────────────────────────┐  │
                    │  │       Global Middlewares & Security     │  │
                    │  │  - Helmet / CORS / Rate Limiter         │  │
                    │  │  - Supabase JWT Verification Auth Guard │  │
                    │  │  - RBAC (STUDENT, ADMIN)                │  │
                    │  │  - Zod Request Validator                │  │
                    │  │  - Centralized Error Handler            │  │
                    │  └────────────────────┬────────────────────┘  │
                    │                       │                       │
                    │  ┌────────────────────▼────────────────────┐  │
                    │  │             Feature Modules             │  │
                    │  │  - auth/            - student/          │  │
                    │  │  - academics/       - skills/           │  │
                    │  │  - projects/        - careers/          │  │
                    │  │  - courses/         - jobs/             │  │
                    │  │  - internships/     - applications/     │  │
                    │  │  - resume/          - interviews/       │  │
                    │  │  - recommendations/ - copilot/          │  │
                    │  └─────────────┬─────────────────┬─────────┘  │
                    └────────────────┼─────────────────┼────────────┘
                                     │                 │
              Internal REST Service  │                 │ Database & Storage
                    Requests         │                 │ Client SDK
                                     ▼                 ▼
          ┌───────────────────────────────────┐   ┌───────────────────────────────────┐
          │     FastAPI AI Orchestrator       │   │        Supabase Platform          │
          │             (Python)              │   │                                   │
          │                                   │   │  - Auth (Identity & JWT issuer)   │
          │  - LangChain Google GenAI         │   │  - PostgreSQL 15+ (Relational DB) │
          │    (Gemini 3.5 Flash Lite)        │   │  - pgvector (Vector Embeddings)   │
          │  - LangGraph Workflows            │   │  - Row Level Security (RLS)       │
          │  - Dynamic ContextBuilder         │   │  - Supabase Storage (Resumes/Docs)│
          │  - Controlled Tool Registry       │   └───────────────────────────────────┘
          │  - RAG Vector Search & Retrieval  │
          └───────────────────────────────────┘
```

---

## 3. Technology Stack & Responsibilities

| Component | Technology | Primary Responsibilities |
|---|---|---|
| **Core Backend** | Node.js, Express.js, TypeScript | REST APIs, route dispatch, authentication middleware, business logic, data persistence via Supabase SDK, validation via Zod, orchestration of AI tasks. |
| **Database & Identity** | Supabase (PostgreSQL 15+, pgvector, Auth, Storage) | Relational source-of-truth data, student identity & sessions, Row Level Security (RLS), semantic vector similarity search, secure file bucket storage. |
| **AI Orchestrator** | Python 3.11+, FastAPI, Pydantic | AI intelligence endpoints, LangChain Google GenAI integration (Gemini 3.5 Flash Lite), LangGraph state graphs, RAG pipeline, tool executions. |
| **LLM Engine** | Google Gemini 3.5 Flash Lite | Reasoning, career guidance, resume critique, mock interview generation/evaluations, skill-gap analysis, semantic synthesis. |

---

## 4. Architectural Boundaries & Security Constraints

1. **Identity & Auth**:
   - Supabase Auth is the **exclusive identity authority**.
   - No custom user password hashing or custom password tables exist.
   - The Express backend extracts `userId` and role claims directly from the verified Supabase JWT (`Bearer <token>`).
   - Normal student operations query records matching their authenticated `user_id`. Frontend-provided student IDs are never trusted for authorization.
2. **AI Tool Isolation**:
   - The AI service and LLM **never receive direct arbitrary SQL execution access**.
   - The AI service interacts exclusively through typed, parameter-validated internal tool functions.
   - LLMs never hold the Supabase Service Role Key.
3. **Storage Security**:
   - Student resumes and sensitive document files are stored in private Supabase Storage buckets.
   - Only validated storage paths and metadata are written to PostgreSQL. Binary data is never stored in table rows.

---

## 5. Express Backend Design Patterns & Project Structure

The Express backend strictly enforces a **feature-based modular structure**. Rather than grouping files by technical layer across the entire app, each domain feature encapsulates its own routes, controller, service, validation schemas, and types.

```
backend/
├── src/
│   ├── app.ts                         # Express application factory & middleware setup
│   ├── server.ts                      # Server bootstrap, port binding, graceful shutdown
│   │
│   ├── config/
│   │   ├── env.ts                     # Strict Zod-validated environment variables
│   │   └── supabase.ts                # Supabase client singletons (Anon & Admin clients)
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts         # Supabase JWT extraction & user hydration
│   │   ├── rbac.middleware.ts         # Role-based route guard (STUDENT, ADMIN)
│   │   ├── error.middleware.ts        # Central error handler with standardized JSON payload
│   │   └── validation.middleware.ts   # Generic Zod request schema validator (body/query/params)
│   │
│   ├── modules/                       # Domain Feature Modules
│   │   ├── auth/                      # Session verification & current user identity routes
│   │   ├── student/                   # Student profile management
│   │   ├── academics/                 # Subjects and semester academic records
│   │   ├── skills/                    # Master skills & student skill proficiencies
│   │   ├── projects/                  # Student portfolio projects
│   │   ├── certifications/            # Student professional certifications
│   │   ├── careers/                   # Career paths & career skill requirements
│   │   ├── goals/                     # Student career goals & targets
│   │   ├── courses/                   # Course catalog & student learning progress
│   │   ├── jobs/                      # Job postings & semantic matching
│   │   ├── internships/               # Internship postings & matching
│   │   ├── applications/              # Application tracker (Job OR Internship constraint)
│   │   ├── resume/                    # Resume upload, storage orchestration & analysis
│   │   ├── interviews/                # AI mock interview generation & evaluation records
│   │   ├── recommendations/           # Explainable recommendations repository
│   │   └── copilot/                   # AI Career Copilot conversation dispatch
│   │
│   │   # Standard Module Anatomy:
│   │   # [module-name]/
│   │   #   ├── [module].routes.ts     # Express Router registering endpoints & middleware
│   │   #   ├── [module].controller.ts # HTTP request/response handlers
│   │   #   ├── [module].service.ts    # Business logic & Supabase database queries
│   │   #   ├── [module].schema.ts     # Zod schemas for input validation
│   │   #   └── [module].types.ts      # TypeScript interfaces & DTO definitions
│   │
│   ├── services/
│   │   ├── ai.service.ts              # HTTP client communicating with FastAPI AI Service
│   │   └── storage.service.ts         # Supabase Storage helper (upload, signed URLs, delete)
│   │
│   ├── lib/
│   │   ├── logger.ts                  # Structured logging (Pino / Winston)
│   │   └── api-response.ts            # Standardized API response builder utility
│   │
│   └── utils/
│       ├── errors.ts                  # Custom ApplicationError class hierarchy
│       └── async-handler.ts           # Wrapper for eliminating try/catch boilerplate in controllers
│
├── package.json
├── tsconfig.json
└── .env.example
```

### Express Coding Ethics & Conventions
1. **Controller Cleanliness**: Controllers handle request parsing, invoke the corresponding service method, and format the response using `ApiResponse.success(res, data)`. Zero business logic lives in controllers.
2. **Async Handler Pattern**: Every route handler is wrapped with `asyncHandler()` to guarantee uncaught promises bubble up to the centralized error middleware.
3. **Strict Typing**: No usage of `any`. All database inputs and outputs are strictly typed against Supabase-generated database types.
4. **Declarative Validation**: No manual `if (!req.body.title)` checks. Every mutable endpoint is guarded by `validateRequest({ body: schema })`.

---

## 6. Central Database Schema & Key Entity Relationships

The PostgreSQL database enforces relational normalization, referential integrity via foreign keys, and UUID primary keys.

```
                           ┌───────────────────┐
                           │    auth.users     │ (Supabase Identity)
                           └─────────┬─────────┘
                                     │ 1:1
                                     ▼
                           ┌───────────────────┐
                           │     students      │
                           └─────────┬─────────┘
        ┌────────────────┬───────────┼───────────┬────────────────┬────────────────┐
        │ 1:N            │ 1:N       │ 1:N       │ 1:N            │ 1:N            │ 1:N
        ▼                ▼           ▼           ▼                ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌─────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│student_educ. │ │academic_recs │ │skils│ │   projects   │ │certifications│ │ career_goals │
└──────────────┘ └──────────────┘ └──┬──┘ └──────────────┘ └──────────────┘ └──────┬───────┘
                                     │                                             │
                       ┌─────────────┴─────────────┐                               ▼
                       ▼                           ▼                     ┌──────────────────┐
             ┌──────────────────┐        ┌──────────────────┐            │     careers      │
             │   career_skills  │        │   course_skills  │            └─────────┬────────┘
             └──────────────────┘        └──────────────────┘                      │
                                                                         ┌─────────┴────────┐
                                                                         ▼                  ▼
┌──────────────────┐                                           ┌──────────────────┐ ┌───────────────┐
│     courses      │                                           │  skill_gap_items │ │recommendations│
└────────┬─────────┘                                           └──────────────────┘ └───────────────┘
         │ 1:N
         ▼
┌──────────────────┐      ┌─────────────────────────┐
│learning_progress │      │      applications       │
└──────────────────┘      │(job_id OR internship_id)│
                          └────────────┬────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    ▼                                     ▼
          ┌───────────────────┐                 ┌───────────────────┐
          │       jobs        │                 │    internships    │
          │ (pgvector embed)  │                 │                   │
          └───────────────────┘                 └───────────────────┘
```

### Table Specifications
- **Students**: 1:1 with `auth.users(id)`. Profile details, location, social links, timestamps.
- **Academics**: `subjects`, `academic_records` (semester, grade, credits, marks).
- **Skills**: Hierarchical skills catalogue (`parent_skill_id`) and `student_skills` with proficiencies (`BEGINNER` to `EXPERT`) and verification source.
- **Careers & Goals**: Master career library, skill matrix requirements (`importance`, `required_proficiency`), and student goals (`primary`, `secondary`).
- **Opportunities**: `companies`, `jobs` (with `pgvector` embedding field for semantic matching), and `internships`.
- **Applications**: Central tracker enforcing mutually exclusive `job_id` OR `internship_id` via PostgreSQL check constraint:
  `CHECK ((job_id IS NOT NULL AND internship_id IS NULL) OR (job_id IS NULL AND internship_id IS NOT NULL))`.
- **Interviews**: `interviews`, `interview_questions`, and `interview_answers` storing granular scores (technical, communication, problem solving) and feedback.
- **Copilot**: `agent_conversations` and `agent_messages` maintaining chat logs linked to authenticated students.

---

## 7. Standardized Error & Response Contracts

### Success Response Contract
```json
{
  "success": true,
  "data": {},
  "meta": {
    "timestamp": "2026-09-29T10:45:00.000Z",
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45
    }
  }
}
```

### Error Response Contract
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input provided.",
    "details": [
      {
        "field": "target_date",
        "issue": "Expected valid ISO timestamp string"
      }
    ]
  }
}
```

Standardized Error Codes:
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `VALIDATION_ERROR` (400)
- `CONFLICT` (409)
- `AI_SERVICE_UNAVAILABLE` (503)
- `INTERNAL_SERVER_ERROR` (500)
