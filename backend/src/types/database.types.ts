export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      academic_records: {
        Row: {
          academic_year: string
          created_at: string
          credits: number
          grade: string | null
          id: string
          marks: number | null
          semester: number
          student_id: string
          subject_id: string | null
          subject_name: string
          updated_at: string
        }
        Insert: {
          academic_year: string
          created_at?: string
          credits?: number
          grade?: string | null
          id?: string
          marks?: number | null
          semester: number
          student_id: string
          subject_id?: string | null
          subject_name: string
          updated_at?: string
        }
        Update: {
          academic_year?: string
          created_at?: string
          credits?: number
          grade?: string | null
          id?: string
          marks?: number | null
          semester?: number
          student_id?: string
          subject_id?: string | null
          subject_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "academic_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "academic_records_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_conversations: {
        Row: {
          created_at: string
          id: string
          student_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          student_id: string
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          student_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_conversations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: Database["public"]["Enums"]["message_role"]
          structured_data: Json | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["message_role"]
          structured_data?: Json | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["message_role"]
          structured_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "agent_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          applied_at: string | null
          created_at: string
          id: string
          internship_id: string | null
          job_id: string | null
          notes: string | null
          status: Database["public"]["Enums"]["application_status"]
          student_id: string
          updated_at: string
        }
        Insert: {
          applied_at?: string | null
          created_at?: string
          id?: string
          internship_id?: string | null
          job_id?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          student_id: string
          updated_at?: string
        }
        Update: {
          applied_at?: string | null
          created_at?: string
          id?: string
          internship_id?: string | null
          job_id?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_internship_id_fkey"
            columns: ["internship_id"]
            isOneToOne: false
            referencedRelation: "internships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      career_goals: {
        Row: {
          career_id: string
          created_at: string
          goal_title: string | null
          id: string
          is_active: boolean
          priority: number
          student_id: string
          target_date: string | null
          updated_at: string
        }
        Insert: {
          career_id: string
          created_at?: string
          goal_title?: string | null
          id?: string
          is_active?: boolean
          priority?: number
          student_id: string
          target_date?: string | null
          updated_at?: string
        }
        Update: {
          career_id?: string
          created_at?: string
          goal_title?: string | null
          id?: string
          is_active?: boolean
          priority?: number
          student_id?: string
          target_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "career_goals_career_id_fkey"
            columns: ["career_id"]
            isOneToOne: false
            referencedRelation: "careers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "career_goals_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      career_skills: {
        Row: {
          career_id: string
          id: string
          importance: Database["public"]["Enums"]["importance_level"]
          required_proficiency: Database["public"]["Enums"]["proficiency_level"]
          skill_id: string
          weight: number | null
        }
        Insert: {
          career_id: string
          id?: string
          importance?: Database["public"]["Enums"]["importance_level"]
          required_proficiency?: Database["public"]["Enums"]["proficiency_level"]
          skill_id: string
          weight?: number | null
        }
        Update: {
          career_id?: string
          id?: string
          importance?: Database["public"]["Enums"]["importance_level"]
          required_proficiency?: Database["public"]["Enums"]["proficiency_level"]
          skill_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "career_skills_career_id_fkey"
            columns: ["career_id"]
            isOneToOne: false
            referencedRelation: "careers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "career_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      careers: {
        Row: {
          average_salary_max: number | null
          average_salary_min: number | null
          created_at: string
          demand_level: string | null
          description: string
          id: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          average_salary_max?: number | null
          average_salary_min?: number | null
          created_at?: string
          demand_level?: string | null
          description: string
          id?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          average_salary_max?: number | null
          average_salary_min?: number | null
          created_at?: string
          demand_level?: string | null
          description?: string
          id?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      certification_skills: {
        Row: {
          certification_id: string
          id: string
          skill_id: string
        }
        Insert: {
          certification_id: string
          id?: string
          skill_id: string
        }
        Update: {
          certification_id?: string
          id?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certification_skills_certification_id_fkey"
            columns: ["certification_id"]
            isOneToOne: false
            referencedRelation: "certifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certification_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          created_at: string
          credential_id: string | null
          credential_url: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          issuing_organization: string
          name: string
          student_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_organization: string
          name: string
          student_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_organization?: string
          name?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "certifications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          description: string | null
          id: string
          location: string | null
          logo_url: string | null
          name: string
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          logo_url?: string | null
          name: string
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          logo_url?: string | null
          name?: string
          website?: string | null
        }
        Relationships: []
      }
      course_skills: {
        Row: {
          course_id: string
          id: string
          skill_id: string
        }
        Insert: {
          course_id: string
          id?: string
          skill_id: string
        }
        Update: {
          course_id?: string
          id?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_skills_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string
          description: string
          difficulty: Database["public"]["Enums"]["proficiency_level"] | null
          duration_hours: number | null
          id: string
          is_free: boolean | null
          price: number | null
          provider: string
          rating: number | null
          title: string
          url: string
        }
        Insert: {
          created_at?: string
          description: string
          difficulty?: Database["public"]["Enums"]["proficiency_level"] | null
          duration_hours?: number | null
          id?: string
          is_free?: boolean | null
          price?: number | null
          provider: string
          rating?: number | null
          title: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string
          difficulty?: Database["public"]["Enums"]["proficiency_level"] | null
          duration_hours?: number | null
          id?: string
          is_free?: boolean | null
          price?: number | null
          provider?: string
          rating?: number | null
          title?: string
          url?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          code: string | null
          created_at: string
          id: string
          institution_id: string | null
          name: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          id?: string
          institution_id?: string | null
          name: string
        }
        Update: {
          code?: string | null
          created_at?: string
          id?: string
          institution_id?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      institutions: {
        Row: {
          city: string | null
          code: string | null
          country: string | null
          created_at: string
          id: string
          name: string
          state: string | null
        }
        Insert: {
          city?: string | null
          code?: string | null
          country?: string | null
          created_at?: string
          id?: string
          name: string
          state?: string | null
        }
        Update: {
          city?: string | null
          code?: string | null
          country?: string | null
          created_at?: string
          id?: string
          name?: string
          state?: string | null
        }
        Relationships: []
      }
      internships: {
        Row: {
          company_id: string
          created_at: string
          description: string
          duration: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          location: string
          posted_at: string
          source_url: string | null
          stipend: string | null
          title: string
          work_mode: Database["public"]["Enums"]["work_mode"]
        }
        Insert: {
          company_id: string
          created_at?: string
          description: string
          duration?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          location: string
          posted_at?: string
          source_url?: string | null
          stipend?: string | null
          title: string
          work_mode?: Database["public"]["Enums"]["work_mode"]
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string
          duration?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          location?: string
          posted_at?: string
          source_url?: string | null
          stipend?: string | null
          title?: string
          work_mode?: Database["public"]["Enums"]["work_mode"]
        }
        Relationships: [
          {
            foreignKeyName: "internships_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_answers: {
        Row: {
          created_at: string
          id: string
          ideal_answer_hint: string | null
          question_id: string
          score: number | null
          strengths: string | null
          student_answer: string
          weaknesses: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ideal_answer_hint?: string | null
          question_id: string
          score?: number | null
          strengths?: string | null
          student_answer: string
          weaknesses?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ideal_answer_hint?: string | null
          question_id?: string
          score?: number | null
          strengths?: string | null
          student_answer?: string
          weaknesses?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interview_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "interview_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_questions: {
        Row: {
          created_at: string
          expected_topics: Json | null
          id: string
          interview_id: string
          question_order: number
          question_text: string
        }
        Insert: {
          created_at?: string
          expected_topics?: Json | null
          id?: string
          interview_id: string
          question_order: number
          question_text: string
        }
        Update: {
          created_at?: string
          expected_topics?: Json | null
          id?: string
          interview_id?: string
          question_order?: number
          question_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_questions_interview_id_fkey"
            columns: ["interview_id"]
            isOneToOne: false
            referencedRelation: "interviews"
            referencedColumns: ["id"]
          },
        ]
      }
      interviews: {
        Row: {
          career_id: string | null
          communication_score: number | null
          created_at: string
          feedback: string | null
          id: string
          interview_type: Database["public"]["Enums"]["interview_type"]
          overall_score: number | null
          problem_solving_score: number | null
          status: string
          student_id: string
          technical_score: number | null
          title: string
        }
        Insert: {
          career_id?: string | null
          communication_score?: number | null
          created_at?: string
          feedback?: string | null
          id?: string
          interview_type?: Database["public"]["Enums"]["interview_type"]
          overall_score?: number | null
          problem_solving_score?: number | null
          status?: string
          student_id: string
          technical_score?: number | null
          title: string
        }
        Update: {
          career_id?: string | null
          communication_score?: number | null
          created_at?: string
          feedback?: string | null
          id?: string
          interview_type?: Database["public"]["Enums"]["interview_type"]
          overall_score?: number | null
          problem_solving_score?: number | null
          status?: string
          student_id?: string
          technical_score?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "interviews_career_id_fkey"
            columns: ["career_id"]
            isOneToOne: false
            referencedRelation: "careers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interviews_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      job_skills: {
        Row: {
          id: string
          is_required: boolean | null
          job_id: string
          skill_id: string
        }
        Insert: {
          id?: string
          is_required?: boolean | null
          job_id: string
          skill_id: string
        }
        Update: {
          id?: string
          is_required?: boolean | null
          job_id?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_skills_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          company_id: string
          created_at: string
          description: string
          embedding: string | null
          employment_type: Database["public"]["Enums"]["employment_type"]
          experience_max: number | null
          experience_min: number | null
          expires_at: string | null
          id: string
          is_active: boolean
          location: string
          posted_at: string
          salary_max: number | null
          salary_min: number | null
          source_url: string | null
          title: string
          work_mode: Database["public"]["Enums"]["work_mode"]
        }
        Insert: {
          company_id: string
          created_at?: string
          description: string
          embedding?: string | null
          employment_type?: Database["public"]["Enums"]["employment_type"]
          experience_max?: number | null
          experience_min?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          location: string
          posted_at?: string
          salary_max?: number | null
          salary_min?: number | null
          source_url?: string | null
          title: string
          work_mode?: Database["public"]["Enums"]["work_mode"]
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string
          embedding?: string | null
          employment_type?: Database["public"]["Enums"]["employment_type"]
          experience_max?: number | null
          experience_min?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          location?: string
          posted_at?: string
          salary_max?: number | null
          salary_min?: number | null
          source_url?: string | null
          title?: string
          work_mode?: Database["public"]["Enums"]["work_mode"]
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_progress: {
        Row: {
          completed_at: string | null
          course_id: string
          id: string
          progress_percent: number
          started_at: string
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          id?: string
          progress_percent?: number
          started_at?: string
          status?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          id?: string
          progress_percent?: number
          started_at?: string
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      project_skills: {
        Row: {
          id: string
          project_id: string
          skill_id: string
        }
        Insert: {
          id?: string
          project_id: string
          skill_id: string
        }
        Update: {
          id?: string
          project_id?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_skills_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          description: string
          end_date: string | null
          github_url: string | null
          id: string
          is_featured: boolean | null
          live_url: string | null
          start_date: string | null
          student_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          end_date?: string | null
          github_url?: string | null
          id?: string
          is_featured?: boolean | null
          live_url?: string | null
          start_date?: string | null
          student_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          end_date?: string | null
          github_url?: string | null
          id?: string
          is_featured?: boolean | null
          live_url?: string | null
          start_date?: string | null
          student_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      recommendations: {
        Row: {
          confidence: number
          created_at: string
          expires_at: string | null
          explanation: string
          id: string
          is_dismissed: boolean
          metadata: Json
          priority: string
          student_id: string
          title: string
          type: Database["public"]["Enums"]["recommendation_type"]
        }
        Insert: {
          confidence?: number
          created_at?: string
          expires_at?: string | null
          explanation: string
          id?: string
          is_dismissed?: boolean
          metadata?: Json
          priority?: string
          student_id: string
          title: string
          type: Database["public"]["Enums"]["recommendation_type"]
        }
        Update: {
          confidence?: number
          created_at?: string
          expires_at?: string | null
          explanation?: string
          id?: string
          is_dismissed?: boolean
          metadata?: Json
          priority?: string
          student_id?: string
          title?: string
          type?: Database["public"]["Enums"]["recommendation_type"]
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_analyses: {
        Row: {
          ats_score: number
          created_at: string
          critique_markdown: string | null
          extracted_skills: Json
          id: string
          improvements: Json
          missing_skills: Json
          overall_score: number
          resume_id: string
          strengths: Json
          student_id: string
          target_career_id: string | null
        }
        Insert: {
          ats_score: number
          created_at?: string
          critique_markdown?: string | null
          extracted_skills?: Json
          id?: string
          improvements?: Json
          missing_skills?: Json
          overall_score: number
          resume_id: string
          strengths?: Json
          student_id: string
          target_career_id?: string | null
        }
        Update: {
          ats_score?: number
          created_at?: string
          critique_markdown?: string | null
          extracted_skills?: Json
          id?: string
          improvements?: Json
          missing_skills?: Json
          overall_score?: number
          resume_id?: string
          strengths?: Json
          student_id?: string
          target_career_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resume_analyses_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resume_analyses_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resume_analyses_target_career_id_fkey"
            columns: ["target_career_id"]
            isOneToOne: false
            referencedRelation: "careers"
            referencedColumns: ["id"]
          },
        ]
      }
      resumes: {
        Row: {
          created_at: string
          file_name: string
          file_size_bytes: number | null
          id: string
          is_current: boolean
          mime_type: string | null
          parsed_text: string | null
          storage_path: string
          student_id: string
          version: number
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size_bytes?: number | null
          id?: string
          is_current?: boolean
          mime_type?: string | null
          parsed_text?: string | null
          storage_path: string
          student_id: string
          version?: number
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size_bytes?: number | null
          id?: string
          is_current?: boolean
          mime_type?: string | null
          parsed_text?: string | null
          storage_path?: string
          student_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "resumes_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_gap_analysis: {
        Row: {
          career_id: string
          created_at: string
          id: string
          overall_readiness_score: number
          student_id: string
        }
        Insert: {
          career_id: string
          created_at?: string
          id?: string
          overall_readiness_score: number
          student_id: string
        }
        Update: {
          career_id?: string
          created_at?: string
          id?: string
          overall_readiness_score?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_gap_analysis_career_id_fkey"
            columns: ["career_id"]
            isOneToOne: false
            referencedRelation: "careers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_gap_analysis_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_gap_items: {
        Row: {
          analysis_id: string
          created_at: string
          current_proficiency:
            | Database["public"]["Enums"]["proficiency_level"]
            | null
          gap_score: number
          id: string
          priority: string | null
          required_proficiency: Database["public"]["Enums"]["proficiency_level"]
          skill_id: string
        }
        Insert: {
          analysis_id: string
          created_at?: string
          current_proficiency?:
            | Database["public"]["Enums"]["proficiency_level"]
            | null
          gap_score: number
          id?: string
          priority?: string | null
          required_proficiency: Database["public"]["Enums"]["proficiency_level"]
          skill_id: string
        }
        Update: {
          analysis_id?: string
          created_at?: string
          current_proficiency?:
            | Database["public"]["Enums"]["proficiency_level"]
            | null
          gap_score?: number
          id?: string
          priority?: string | null
          required_proficiency?: Database["public"]["Enums"]["proficiency_level"]
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_gap_items_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "skill_gap_analysis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_gap_items_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          name: string
          parent_skill_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          parent_skill_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          parent_skill_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skills_parent_skill_id_fkey"
            columns: ["parent_skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      student_education: {
        Row: {
          created_at: string
          degree: string
          end_year: number | null
          field_of_study: string
          grade_point_avg: number | null
          id: string
          institution_name: string
          is_current: boolean | null
          start_year: number
          student_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          degree: string
          end_year?: number | null
          field_of_study: string
          grade_point_avg?: number | null
          id?: string
          institution_name: string
          is_current?: boolean | null
          start_year: number
          student_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          degree?: string
          end_year?: number | null
          field_of_study?: string
          grade_point_avg?: number | null
          id?: string
          institution_name?: string
          is_current?: boolean | null
          start_year?: number
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_education_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_skills: {
        Row: {
          created_at: string
          id: string
          proficiency: Database["public"]["Enums"]["proficiency_level"]
          skill_id: string
          source: Database["public"]["Enums"]["skill_source"]
          student_id: string
          updated_at: string
          years_experience: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          proficiency?: Database["public"]["Enums"]["proficiency_level"]
          skill_id: string
          source?: Database["public"]["Enums"]["skill_source"]
          student_id: string
          updated_at?: string
          years_experience?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          proficiency?: Database["public"]["Enums"]["proficiency_level"]
          skill_id?: string
          source?: Database["public"]["Enums"]["skill_source"]
          student_id?: string
          updated_at?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "student_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_skills_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          bio: string | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          first_name: string
          gender: string | null
          github_url: string | null
          id: string
          last_name: string
          linkedin_url: string | null
          phone: string | null
          portfolio_url: string | null
          role: Database["public"]["Enums"]["user_role"]
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name: string
          gender?: string | null
          github_url?: string | null
          id?: string
          last_name: string
          linkedin_url?: string | null
          phone?: string | null
          portfolio_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string
          gender?: string | null
          github_url?: string | null
          id?: string
          last_name?: string
          linkedin_url?: string | null
          phone?: string | null
          portfolio_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subjects: {
        Row: {
          code: string | null
          created_at: string
          credits: number | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          credits?: number | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string | null
          created_at?: string
          credits?: number | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      application_status:
        | "SAVED"
        | "APPLIED"
        | "SCREENING"
        | "SHORTLISTED"
        | "INTERVIEW"
        | "SELECTED"
        | "REJECTED"
        | "WITHDRAWN"
      employment_type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP"
      importance_level: "CRITICAL" | "IMPORTANT" | "NICE_TO_HAVE"
      interview_type:
        | "TECHNICAL"
        | "HR"
        | "BEHAVIORAL"
        | "ROLE_SPECIFIC"
        | "MIXED"
      message_role: "SYSTEM" | "USER" | "ASSISTANT" | "TOOL"
      proficiency_level:
        | "BEGINNER"
        | "ELEMENTARY"
        | "INTERMEDIATE"
        | "ADVANCED"
        | "EXPERT"
      recommendation_type:
        | "CAREER"
        | "COURSE"
        | "JOB"
        | "INTERNSHIP"
        | "PROJECT"
        | "SKILL"
        | "CERTIFICATION"
      skill_source:
        | "SELF_REPORTED"
        | "ASSESSMENT"
        | "PROJECT"
        | "CERTIFICATION"
        | "AI_INFERRED"
      user_role: "STUDENT" | "ADMIN" | "RECRUITER" | "MENTOR"
      work_mode: "REMOTE" | "HYBRID" | "ONSITE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: [
        "SAVED",
        "APPLIED",
        "SCREENING",
        "SHORTLISTED",
        "INTERVIEW",
        "SELECTED",
        "REJECTED",
        "WITHDRAWN",
      ],
      employment_type: ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"],
      importance_level: ["CRITICAL", "IMPORTANT", "NICE_TO_HAVE"],
      interview_type: [
        "TECHNICAL",
        "HR",
        "BEHAVIORAL",
        "ROLE_SPECIFIC",
        "MIXED",
      ],
      message_role: ["SYSTEM", "USER", "ASSISTANT", "TOOL"],
      proficiency_level: [
        "BEGINNER",
        "ELEMENTARY",
        "INTERMEDIATE",
        "ADVANCED",
        "EXPERT",
      ],
      recommendation_type: [
        "CAREER",
        "COURSE",
        "JOB",
        "INTERNSHIP",
        "PROJECT",
        "SKILL",
        "CERTIFICATION",
      ],
      skill_source: [
        "SELF_REPORTED",
        "ASSESSMENT",
        "PROJECT",
        "CERTIFICATION",
        "AI_INFERRED",
      ],
      user_role: ["STUDENT", "ADMIN", "RECRUITER", "MENTOR"],
      work_mode: ["REMOTE", "HYBRID", "ONSITE"],
    },
  },
} as const
