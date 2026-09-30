# Frontend Integration Guide: AI-Powered Career Readiness Platform

Welcome to the **Frontend Integration Guide**. This document outlines all backend REST API endpoints, expected request payloads, response contracts, authentication requirements, and actionable frontend integration hints for UI/UX engineering.

---

## 1. General Architecture & Conventions

### Base URLs
- **Backend API Gateway**: `http://localhost:5000` (Docker / Local Development)
- **Direct AI Service (Internal)**: `http://localhost:8000` (Direct access usually proxied via Backend `/api/ai`)
- **Supabase Authentication**: Integrated via `@supabase/supabase-js` or standard OAuth/JWT.

### Authentication Header
All authenticated routes require a valid Supabase JWT bearer token:
```http
Authorization: Bearer <supabase_access_token>
```

### Standard Response Envelope
All backend endpoints return responses wrapped in a consistent structure:

#### Success Response (`200 OK`, `201 Created`)
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2026-09-29T12:00:00.000Z"
}
```

#### Error Response (`400`, `401`, `403`, `404`, `409`, `500`)
```json
{
  "success": false,
  "error": {
    "message": "Invalid status transition from 'APPLIED' to 'OFFER'.",
    "code": "BAD_REQUEST",
    "details": null
  },
  "timestamp": "2026-09-29T12:00:00.000Z"
}
```

### User Roles
- `STUDENT`: Default student account. Can manage own profile, skills, resumes, interview sessions, and job applications.
- `RECRUITER`: Recruiter portal access. Can post jobs/internships with weighted skill tags and manage ATS candidate stages.
- `ADMIN`: Platform superuser. Full access including adding and deleting platform courses.

---

## 2. Authentication & Identity (`/api/auth`)

### `POST /api/auth/register`
Registers a new user with email/password and initializes role-based profile (`STUDENT`, `RECRUITER`, or `ADMIN`).
- **Auth**: Public
- **Request Body**:
```json
{
  "email": "student@university.edu",
  "password": "StrongPassword123!",
  "role": "STUDENT",
  "first_name": "Alex",
  "last_name": "Dev",
  "phone": "+91 9876543210",
  "institution_name": "National Institute of Technology",
  "degree": "B.Tech",
  "field_of_study": "Computer Science"
}
```
- **Response (`201 Created`)**:
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "student@university.edu", "role": "STUDENT" },
    "student": { "id": "profile-uuid", "role": "STUDENT", "first_name": "Alex" },
    "session": { "access_token": "...", "refresh_token": "...", "expires_in": 3600 }
  }
}
```

### `POST /api/auth/login`
Authenticates credentials and returns JWT bearer session token augmented with RBAC role context.
- **Auth**: Public
- **Request Body**:
```json
{
  "email": "student@university.edu",
  "password": "StrongPassword123!"
}
```

### `POST /api/auth/logout`
Terminates active session.

### `GET /api/auth/me`
Retrieves current authenticated user's metadata, assigned role, and linked profile ID.

- **Auth**: Required (`STUDENT`, `RECRUITER`, or `ADMIN`)
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "11111111-1111-1111-1111-111111111111",
      "email": "student@university.edu",
      "role": "STUDENT"
    },
    "student": {
      "id": "22222222-2222-2222-2222-222222222222",
      "first_name": "Alex",
      "last_name": "Dev",
      "role": "STUDENT"
    }
  }
}
```
> 💡 **Frontend Hint**: Call this immediately after Supabase `onAuthStateChange(SIGNED_IN)` to populate user context, determine route access (e.g. `/student/dashboard` vs `/recruiter/portal`), and store `student.id`.

---

## 3. Student Profile & Portfolio (`/api/students`)

### `GET /api/students/me`
Fetches complete student profile with nested education, academics, skills, projects, and certifications.
- **Auth**: Required (`STUDENT`)
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "22222222-2222-2222-2222-222222222222",
    "first_name": "Alex",
    "last_name": "Dev",
    "phone": "+91 9876543210",
    "city": "Bengaluru",
    "state": "Karnataka",
    "country": "India",
    "bio": "CS Sophomore passionate about distributed systems.",
    "linkedin_url": "https://linkedin.com/in/alexdev",
    "github_url": "https://github.com/alexdev",
    "portfolio_url": "https://alexdev.me",
    "student_education": [...],
    "academic_records": [...],
    "student_skills": [...],
    "projects": [...],
    "certifications": [...]
  }
}
```

### `PUT /api/students/me`
Creates or updates the student's personal details and portfolio links.
- **Auth**: Required (`STUDENT`)
- **Request Body**:
```json
{
  "first_name": "Alex",
  "last_name": "Dev",
  "phone": "+91 9876543210",
  "city": "Bengaluru",
  "state": "Karnataka",
  "country": "India",
  "bio": "Full-stack enthusiast specializing in TypeScript and Python.",
  "linkedin_url": "https://linkedin.com/in/alexdev",
  "github_url": "https://github.com/alexdev",
  "portfolio_url": "https://alexdev.me"
}
```

### Education Endpoints
- `GET /api/students/me/education`: List degrees.
- `POST /api/students/me/education`:
  ```json
  {
    "institution_name": "Indian Institute of Technology",
    "degree": "B.Tech",
    "field_of_study": "Computer Science & Engineering",
    "start_year": 2023,
    "end_year": 2027,
    "grade_point_avg": 8.9,
    "is_current": true
  }
  ```
- `DELETE /api/students/me/education/:id`: Removes education entry.

### Projects & Certifications
- `GET /api/students/me/projects` | `POST /api/students/me/projects`:
  ```json
  {
    "title": "Cloud Resume Challenge",
    "description": "Serverless portfolio hosted on AWS with CI/CD.",
    "github_url": "https://github.com/alexdev/cloud-resume",
    "live_url": "https://resume.alexdev.me",
    "is_featured": true,
    "skill_ids": ["uuid-of-aws", "uuid-of-terraform"]
  }
  ```
- `DELETE /api/students/me/projects/:id`
- `GET /api/students/me/certifications` | `POST /api/students/me/certifications` | `DELETE /:id`

> 💡 **Frontend Hint**: Calculate a **Profile Completeness Score** on the UI based on non-null fields (e.g., bio +15%, education +25%, skills +30%, projects +20%, LinkedIn +10%) to encourage profile completion before job applications.

---

## 4. Skills Catalog & Management (`/api/skills`)

### `GET /api/skills`
Returns master list of platform skills for auto-complete dropdowns.
- **Auth**: Public or Authenticated
- **Response**:
```json
{
  "success": true,
  "data": [
    { "id": "skill-uuid-1", "name": "Python", "category": "Programming Languages" },
    { "id": "skill-uuid-2", "name": "Docker", "category": "DevOps & Cloud" }
  ]
}
```

### `GET /api/skills/me`
List skills reported or verified by the logged-in student.

### `POST /api/skills/me`
Add a skill to the student profile.
- **Request Body**:
```json
{
  "skill_id": "skill-uuid-1",
  "proficiency": "INTERMEDIATE",
  "source": "SELF_REPORTED",
  "years_experience": 2
}
```
*Proficiency levels*: `'BEGINNER' | 'ELEMENTARY' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'`

### `PUT /api/skills/me/:id` & `DELETE /api/skills/me/:id`
Update or remove a reported skill.

> 💡 **Frontend Hint**: Implement a searchable combobox (e.g. Radix UI / Shadcn Combobox) hitting `GET /api/skills`. Display verified badges `verified: true` for skills verified by assessments or resume parsing.

---

## 5. Career Explorer & Target Goals (`/api/careers`)

### `GET /api/careers`
List available career tracks (e.g., Backend Developer, ML Engineer, Cloud Architect).

### `GET /api/careers/:id`
Returns career details, average salary ranges, and **required skills with importance levels**:
```json
{
  "success": true,
  "data": {
    "id": "career-uuid-1",
    "title": "Backend Engineer",
    "description": "Architects high-availability server systems...",
    "average_salary_min": 800000,
    "average_salary_max": 2400000,
    "demand_level": "High",
    "career_skills": [
      {
        "skill": { "name": "Python", "category": "Languages" },
        "importance": "CRITICAL",
        "required_proficiency": "ADVANCED",
        "weight": 3.0
      }
    ]
  }
}
```

### `GET /api/careers/me/goals` | `POST /api/careers/me/goals`
Set active target career goal for personalized gap analysis and roadmaps:
```json
{
  "career_id": "career-uuid-1",
  "priority": 1,
  "target_date": "2027-06-01"
}
```

---

## 6. Course Catalog & Skill Gap Recommendations (`/api/courses`)

### `GET /api/courses` & `GET /api/courses/:id`
Public catalog of learning modules.

### `POST /api/courses/recommendations/skill-gap` *(Dual GET/POST)*
AI-driven course recommendation engine for skill gaps.
- **Workflow**: Searches the platform course catalog first. If not covered, performs a live **Tavily Web Search & Scrape** and categorizes courses into **Free / Paid**.
- **Request Body**:
```json
{
  "skill_names": ["Kubernetes", "Redis", "Kafka"]
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "app_catalog_courses": [
      {
        "id": "course-uuid-1",
        "title": "Production Redis Microservices",
        "provider": "Platform Internal",
        "url": "https://academy.platform.internal/redis",
        "difficulty": "INTERMEDIATE",
        "is_free": true,
        "price": 0,
        "rating": 4.8
      }
    ],
    "web_courses": {
      "unpaid": [
        {
          "title": "Kubernetes Official Free Bootcamp",
          "provider": "Linux Foundation",
          "url": "https://...",
          "is_free": true,
          "price": "Free"
        }
      ],
      "paid": [
        {
          "title": "Kafka Event Streaming Certification",
          "provider": "Coursera",
          "url": "https://...",
          "is_free": false,
          "price": "Paid"
        }
      ]
    }
  }
}
```

### Admin Course Management
- `POST /api/courses` (or `/api/admin/courses`):
  - **Auth**: Required (`ADMIN` only)
  - **Request Body**:
    ```json
    {
      "title": "Distributed Systems in Go",
      "provider": "Internal Academy",
      "description": "Master concurrency and Raft consensus.",
      "url": "https://platform.com/courses/go-distributed",
      "difficulty": "ADVANCED",
      "duration_hours": 30,
      "is_free": true,
      "skill_ids": ["skill-uuid-go", "skill-uuid-dist-sys"]
    }
    ```
- `DELETE /api/courses/:id`: Admin deletes a course.

### Student Learning Progress
- `GET /api/courses/me/progress`: Current enrolled courses and completion %.
- `PUT /api/courses/me/progress/:id`:
  ```json
  {
    "progress_percent": 75,
    "status": "IN_PROGRESS"
  }
  ```

---

## 7. Jobs & Recruiter Portal (`/api/jobs` & `/api/internships`)

### `GET /api/jobs` | `GET /api/internships`
Public job board with query filters:
- **Query Params**: `?work_mode=REMOTE&location=Bengaluru`

### `GET /api/jobs/government`
Filters public-sector and government technical positions (NIC, C-DAC, DRDO, CRIS / Railways) by candidate degree eligibility:
- **Query Params**: `?degree=B.Tech&gov_category=PSU`
- **Response**: List of verified government openings with eligibility degrees and required skills.

### Government Schemes & National Initiatives (`/api/government-schemes`)
- `GET /api/government-schemes`: Browse schemes supporting Skill India, NEP 2020, and Digital India (`?initiative=Skill India`).
- `GET /api/government-schemes/:id`: Detailed scheme criteria, benefits, and stipends.
- `POST /api/government-schemes/recommend` (or `POST /api/ai/government-schemes/recommend`): Recommends public-sector schemes (NAPS, PMKVY 4.0, MeitY internships) aligned with the student's degree, verified skills, and academic profile.

### `POST /api/jobs` (Recruiter Job Posting)
Allows recruiters to post open positions with weighted skill requirements:
- **Auth**: Required (`RECRUITER` or `ADMIN`)
- **Request Body**:
```json
{
  "company_id": "company-uuid-1",
  "title": "Lead Full Stack Developer",
  "description": "Building scalable React & Node cloud platforms.",
  "location": "Bengaluru",
  "work_mode": "HYBRID",
  "employment_type": "FULL_TIME",
  "experience_min": 2,
  "experience_max": 5,
  "salary_min": 1800000,
  "salary_max": 2800000,
  "skills": [
    {
      "skill_id": "skill-uuid-ts",
      "weight": 3.0,
      "is_required": true,
      "required_proficiency": "ADVANCED"
    },
    {
      "skill_id": "skill-uuid-docker",
      "weight": 2.0,
      "is_required": true,
      "required_proficiency": "INTERMEDIATE"
    },
    {
      "skill_id": "skill-uuid-aws",
      "weight": 1.0,
      "is_required": false,
      "required_proficiency": "BEGINNER"
    }
  ]
}
```

### `GET /api/jobs/:id/candidates` (Recruiter Candidate View)
Returns all candidate applications **ranked by weighted match score**:
- **Auth**: Required (`RECRUITER` or `ADMIN`)
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "app-uuid-1",
      "status": "REVIEWING",
      "match_score": 87.5,
      "match_breakdown": {
        "score": 87.5,
        "matched_count": 2,
        "total_skills": 3,
        "matched_skills": [
          {
            "skill_name": "TypeScript",
            "weight": 3.0,
            "required_proficiency": "ADVANCED",
            "student_proficiency": "EXPERT",
            "is_verified": true,
            "match_ratio": 1.0
          }
        ],
        "missing_skills": [
          { "skill_name": "AWS", "weight": 1.0, "is_required": false }
        ]
      },
      "student": {
        "first_name": "Alex",
        "last_name": "Dev",
        "phone": "+91 9876543210",
        "resumes": [...]
      },
      "status_history": [...]
    }
  ]
}
```

> 💡 **Frontend Hint (Recruiter Portal)**:
> - Display candidates in an ATS Kanban or Table sorted by `match_score DESC`.
> - Show a progress bar indicator: `80%+` (Green / Strong Fit), `60–79%` (Yellow / Moderate), `<60%` (Red / Gap).
> - Allow recruiters to expand `match_breakdown` to see verified skills with checkmarks.

---

## 8. Application Tracking System (ATS) (`/api/applications`)

### Lifecycle State Machine
Status transitions strictly follow this state machine:
```
SAVED ──► APPLIED ──► REVIEWING ──► INTERVIEW_SCHEDULED ──► OFFER ──► SELECTED (Hired)
  │          │             │                 │                │
  ▼          ▼             ▼                 ▼                ▼
WITHDRAWN  REJECTED      REJECTED          REJECTED         REJECTED
```

### `POST /api/applications` (Student Apply)
- **Auth**: Required (`STUDENT`)
- Automatically computes weighted `match_score`, populates `match_breakdown`, and records the first entry in `status_history`.
- **Request Body**:
```json
{
  "job_id": "job-uuid-1",
  "status": "APPLIED",
  "notes": "Eager to apply for the Backend Engineer role!"
}
```

### `PATCH /api/applications/:id/status` (Recruiter / Admin Stage Transition)
- **Auth**: Required (`RECRUITER` or `ADMIN`)
- **Request Body**:
```json
{
  "status": "INTERVIEW_SCHEDULED",
  "notes": "Candidate passed screening round. Scheduling technical interview."
}
```
- **Error on invalid transition (`400 Bad Request`)**:
```json
{
  "success": false,
  "error": {
    "message": "Invalid ATS status transition from 'APPLIED' to 'OFFER'. Allowed stages from 'APPLIED' are: [REVIEWING, REJECTED, WITHDRAWN]",
    "code": "BAD_REQUEST"
  }
}
```

### `GET /api/applications/:id`
Inspect full application details including complete `status_history` audit trail:
```json
{
  "success": true,
  "data": {
    "id": "app-uuid-1",
    "status": "INTERVIEW_SCHEDULED",
    "status_history": [
      {
        "from_status": null,
        "to_status": "APPLIED",
        "changed_by": "student-uuid",
        "role": "STUDENT",
        "notes": "Application submitted",
        "timestamp": "2026-09-29T10:00:00Z"
      },
      {
        "from_status": "APPLIED",
        "to_status": "REVIEWING",
        "changed_by": "recruiter-uuid",
        "role": "RECRUITER",
        "notes": "Profile shortlisted",
        "timestamp": "2026-09-29T12:00:00Z"
      }
    ]
  }
}
```

> 💡 **Frontend Hint (ATS Actions)**:
> In the recruiter interface, inspect `application.status` to render only valid next stage buttons:
> - If `status === 'APPLIED'`: Render `[Move to Reviewing]` and `[Reject]`.
> - If `status === 'REVIEWING'`: Render `[Schedule Interview]` and `[Reject]`.
> - If `status === 'INTERVIEW_SCHEDULED'`: Render `[Extend Offer]` and `[Reject]`.
> - If `status === 'OFFER'`: Render `[Mark as Selected]` and `[Rescind/Reject]`.
> - If `status === 'REJECTED'` or `'SELECTED'`: Disable transition buttons (terminal state).

---

## 9. Resume File Upload & ATS Scanner (`/api/resumes`)

### `POST /api/resumes/upload`
Uploads a document, extracts text in memory (PDF/DOCX), uploads to private Supabase storage bucket `resumes`, and triggers instant AI ATS scoring.

- **Auth**: Required (`STUDENT`)
- **Content-Type**: `multipart/form-data`
- **Form Data**:
  - `resume`: Binary file (`.pdf` or `.docx`, max 5 MB).
  - `target_career_id`: *(Optional UUID)* Target career for tailored ATS scoring.
- **Response**:
```json
{
  "success": true,
  "data": {
    "resume": {
      "id": "resume-uuid-1",
      "file_name": "Alex_Dev_Resume.pdf",
      "storage_path": "student-id/Alex_Dev_Resume_1727610000.pdf",
      "is_current": true
    },
    "analysis": {
      "overall_score": 85,
      "ats_score": 88,
      "extracted_skills": ["Python", "Docker", "Node.js", "PostgreSQL"],
      "missing_skills": ["Kubernetes", "Redis"],
      "strengths": [
        "Strong quantified achievement metrics in project descriptions",
        "Clear section headings and ATS-friendly font structure"
      ],
      "improvements": [
        "Include links to live GitHub repositories for the cloud projects",
        "Add familiarity with automated CI/CD deployment pipelines"
      ]
    }
  }
}
```

### `GET /api/resumes/:id/download-url`
Generates a secure, 60-second time-limited signed URL to view/download the original uploaded file from Supabase private storage.

### `POST /api/resumes/:id/analyze`
On-demand re-analysis of an existing resume against a new career or job title:
```json
{
  "target_role": "DevOps Engineer",
  "target_career_id": "career-uuid-devops"
}
```

> 💡 **Frontend Hint (File Upload UX)**:
> 1. Restrict file picker input to `accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"`.
> 2. Show an interactive radial progress circle for `ats_score` (0–100).
> 3. Display `strengths` as green badges and `improvements` as actionable checklist cards.

---

## 10. AI Real-Time Mock Interview System (`/api/interviews`)

The platform features an adaptive, multi-turn AI interview simulation.

### `POST /api/interviews/generate`
Starts a new mock interview session and returns initial question.
- **Request Body**:
```json
{
  "career_id": "career-uuid-1",
  "interview_type": "MIXED",
  "question_count": 5,
  "title": "Backend Engineering Mock Interview"
}
```

### `POST /api/interviews/:id/turn` (Real-Time Interactive Turn)
Evaluates the student's answer (via speech transcript or text input) and dynamically generates the next adaptive question or follow-up:
- **Request Body**:
```json
{
  "turn_number": 1,
  "total_turns": 5,
  "target_role": "Backend Engineer",
  "interview_type": "TECHNICAL",
  "current_question": "How do you handle race conditions in a distributed payment system?",
  "student_answer": "I use Redis distributed locks with a short TTL, or PostgreSQL SELECT FOR UPDATE row-level locking."
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "evaluation": {
      "turn_score": 90,
      "feedback": "Excellent response highlighting distributed locking and database-level isolation.",
      "clarity_score": 95,
      "depth_score": 85
    },
    "next_question": "What happens if the Redis lock holder crashes before releasing the lock?",
    "is_completed": false
  }
}
```

### `POST /api/interviews/:id/report`
Final session evaluation report with breakdown across Communication, Technical Depth, Problem Solving, and Next Steps:
- **Request Body**:
```json
{
  "career_title": "Backend Engineer"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "interview_id": "interview-uuid",
    "career_title": "Backend Engineer",
    "overall_score": 88,
    "readiness_level": "INTERVIEW_READY",
    "summary_evaluation": "Candidate demonstrated a clear understanding of distributed systems, concurrency control, and API contracts.",
    "radar_metrics": {
      "Technical Depth": 90,
      "Communication & Clarity": 85,
      "Problem Solving & Structure": 88
    },
    "top_strengths": ["Deep understanding of ACID transactions", "Logical decomposition of architecture"],
    "critical_weaknesses": ["Elaborate more on distributed tracing and circuit breaking"],
    "identified_gap_skills": ["Kafka", "Distributed Tracing"],
    "pdf_download_url": "/api/interviews/interview-uuid/report/pdf",
    "storage_pdf_url": "https://<supabase-storage-url>/interviews/student-uuid/interview-uuid.pdf?token=...",
    "completed_at": "2026-09-30T17:40:00.000Z"
  }
}
```

### `GET /api/interviews/:id/report`
Retrieves the saved performance report, radar metrics, and PDF download links without re-invoking the AI model.
- **Auth**: Required (`STUDENT`)
- **Response**: Same as `POST /api/interviews/:id/report` response data.

### `GET /api/interviews/:id/report/pdf`
Streams or downloads the official executive vector PDF report generated by `pdfkit`.
- **Auth**: Required (`STUDENT`, owner of the session)
- **Query Parameters**:
  - `?view=inline`: Renders PDF inline in the browser's PDF reader (`Content-Disposition: inline`).
  - Default (no query): Triggers automatic file download (`Content-Disposition: attachment; filename="<title>-<id>.pdf"`).
- **Response Headers**:
  - `Content-Type`: `application/pdf`
  - `Content-Disposition`: `attachment; filename="backend-engineer-assessment-3816578a.pdf"`
  - `Content-Length`: `9076`
  - `Cache-Control`: `private, max-age=3600`
- **Frontend Download Integration Example**:
```typescript
// Option A: Direct download via browser anchor or window
const downloadPdf = (interviewId: string) => {
  window.open(`${API_BASE_URL}/api/interviews/${interviewId}/report/pdf`, '_blank');
};

// Option B: Authenticated fetch with automatic Blob save
const exportPdfReport = async (interviewId: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/interviews/${interviewId}/report/pdf`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const blob = await response.blob();
  const blobUrl = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = blobUrl;
  anchor.download = `mock-interview-report-${interviewId.slice(0, 8)}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(blobUrl);
};
```

> 💡 **Frontend Hint (Voice & Real-Time Flow)**:
> 1. Use the Web Speech API (`webkitSpeechRecognition`) or Groq Whisper STT to capture live student audio.
> 2. Send transcript to `POST /api/interviews/:id/turn`.
> 3. Use Web Speech Synthesis (`window.speechSynthesis`) to read `next_question` aloud for an authentic conversational experience.
> 4. Once interview turns conclude, trigger `POST /api/interviews/:id/report` and render the `[Download Performance PDF]` button bound to `/api/interviews/:id/report/pdf`.

---

## 11. AI Career Copilot & Guardrails (`/api/ai`)

The Copilot is constrained by **domain guardrails**: it only answers questions related to career growth, skill gaps, learning roadmaps, and profile optimization. Off-topic queries automatically trigger fallback responses.

### `POST /api/ai/chat`
- **Request Body**:
```json
{
  "conversation_id": "optional-existing-conversation-uuid",
  "message": "What skills am I missing to become a Backend Engineer?"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "conversation_id": "conv-uuid-1",
    "message": "Based on your profile, you have solid foundations in Python and Git. To reach your goal as a Backend Engineer, you are missing Docker and Redis.",
    "confidence": 0.95,
    "recommendations": [
      {
        "type": "SKILL",
        "title": "Docker & Containerization",
        "reason": "Crucial requirement for 85% of backend listings",
        "priority": "HIGH"
      }
    ],
    "next_actions": [
      "Enroll in the Container Fundamentals course",
      "Containerize your existing Cloud Resume project"
    ]
  }
}
```

### AI Domain Workflows
- `POST /api/ai/skill-gap`: `{ "career_id": "career-uuid" }` -> Detailed gap breakdown.
- `POST /api/ai/roadmap`: `{ "career_id": "career-uuid", "target_months": 6 }` -> Month-by-month learning milestones.
- `POST /api/ai/career/recommend`: Profile-driven career path matching.
- `POST /api/ai/match/jobs` | `POST /api/ai/match/internships`: Semantic PGVector + skill overlap hybrid ranking.

---

## 12. Quick Reference Table for Frontend Developers

| Module | Method | Path | Auth / Role | Key Purpose |
|---|---|---|---|---|
| **Auth** | `GET` | `/api/auth/me` | User | Get current session, role, and student ID |
| **Student** | `GET` | `/api/students/me` | `STUDENT` | Complete student portfolio & records |
| **Student** | `PUT` | `/api/students/me` | `STUDENT` | Upsert profile info & social links |
| **Skills** | `GET` | `/api/skills` | Public | Master skill catalog dropdown |
| **Skills** | `POST` | `/api/skills/me` | `STUDENT` | Add skill to student profile |
| **Careers** | `GET` | `/api/careers` | Public | Browse career tracks & required skills |
| **Careers** | `POST` | `/api/careers/me/goals`| `STUDENT` | Set target career goal |
| **Courses** | `POST` | `/api/courses/recommendations/skill-gap` | Public | Gap courses: App first, then Tavily Web (Paid/Free) |
| **Courses** | `POST` | `/api/courses` | `ADMIN` | Admin add course to platform |
| **Courses** | `DELETE`| `/api/courses/:id` | `ADMIN` | Admin delete course from platform |
| **Jobs** | `GET` | `/api/jobs` | Public | Browse jobs with `?work_mode` / `?location` |
| **Jobs** | `POST` | `/api/jobs` | `RECRUITER`, `ADMIN` | Post job with weighted skill tags |
| **Jobs** | `GET` | `/api/jobs/:id/candidates` | `RECRUITER`, `ADMIN` | View candidates sorted by match score |
| **ATS** | `POST` | `/api/applications` | `STUDENT` | Apply for job (computes match score & breakdown) |
| **ATS** | `PATCH`| `/api/applications/:id/status` | `RECRUITER`, `ADMIN` | Transition stage (`APPLIED -> REVIEWING -> ...`) |
| **Resumes** | `POST` | `/api/resumes/upload` | `STUDENT` | Multipart upload (PDF/DOCX) -> ATS Parser |
| **Resumes** | `GET` | `/api/resumes/:id/download-url`| `STUDENT` | Temporary signed view/download URL |
| **Interview**| `POST` | `/api/interviews/generate` | `STUDENT` | Start mock interview session |
| **Interview**| `POST` | `/api/interviews/:id/turn` | `STUDENT` | Real-time interactive turn Q&A & scoring |
| **Interview**| `POST` | `/api/interviews/:id/report` | `STUDENT` | Generate final session performance scorecard |
| **Interview**| `GET`  | `/api/interviews/:id/report` | `STUDENT` | Fetch saved scorecard & download links |
| **Interview**| `GET`  | `/api/interviews/:id/report/pdf` | `STUDENT` | Download official executive vector PDF report |
| **Copilot** | `POST` | `/api/ai/chat` | `STUDENT` | Chat with Guardrailed Career Copilot |
| **Copilot** | `POST` | `/api/ai/roadmap` | `STUDENT` | Generate 3/6-month action roadmap |

