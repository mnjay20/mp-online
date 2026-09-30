import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, StudentProfile, StudentSkill, Application, Job } from '../types';
import { 
  INITIAL_STUDENT_PROFILE, 
  INITIAL_STUDENT_SKILLS, 
  MOCK_APPLICATIONS, 
  MOCK_JOBS 
} from './mockData';

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  student: StudentProfile;
  updateProfile: (updated: Partial<StudentProfile>) => void;
  skills: StudentSkill[];
  addSkill: (skill: Omit<StudentSkill, 'id'>) => void;
  removeSkill: (id: string) => void;
  jobs: Job[];
  addJob: (newJob: Omit<Job, 'id' | 'posted_at'>) => void;
  applications: Application[];
  applyToJob: (jobId: string, notes?: string) => void;
  updateApplicationStatus: (appId: string, status: any) => void;
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [student, setStudent] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);
  const [skills, setSkills] = useState<StudentSkill[]>(INITIAL_STUDENT_SKILLS);
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);
  const [copilotOpen, setCopilotOpen] = useState(false);

  const updateProfile = (updated: Partial<StudentProfile>) => {
    setStudent((prev) => ({ ...prev, ...updated }));
  };

  const addSkill = (newSkill: Omit<StudentSkill, 'id'>) => {
    const id = `ssk-${Date.now()}`;
    setSkills((prev) => [...prev, { ...newSkill, id }]);
  };

  const removeSkill = (id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  const addJob = (newJobData: Omit<Job, 'id' | 'posted_at'>) => {
    const newJob: Job = {
      ...newJobData,
      id: `job-${Date.now()}`,
      posted_at: 'Just now',
    };
    setJobs((prev) => [newJob, ...prev]);
  };

  const applyToJob = (jobId: string, notes?: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    // Check if already applied
    if (applications.some((a) => a.job_id === jobId)) return;

    const newApp: Application = {
      id: `app-${Date.now()}`,
      job_id: job.id,
      job_title: job.title,
      company_name: job.company_name,
      status: 'APPLIED',
      applied_at: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      match_score: Math.floor(75 + Math.random() * 20),
      notes: notes || 'Submitted application dossier.',
      status_history: [
        {
          from_status: null,
          to_status: 'APPLIED',
          changed_by: `${student.first_name} ${student.last_name}`,
          role: 'STUDENT',
          notes: 'Candidate applied.',
          timestamp: new Date().toISOString(),
        },
      ],
    };

    setApplications((prev) => [newApp, ...prev]);
  };

  const updateApplicationStatus = (appId: string, status: any) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const history = app.status_history || [];
        return {
          ...app,
          status,
          status_history: [
            ...history,
            {
              from_status: app.status,
              to_status: status,
              changed_by: 'Hiring Committee',
              role,
              notes: `Status transitioned to ${status}`,
              timestamp: new Date().toISOString(),
            },
          ],
        };
      })
    );
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        student,
        updateProfile,
        skills,
        addSkill,
        removeSkill,
        jobs,
        addJob,
        applications,
        applyToJob,
        updateApplicationStatus,
        copilotOpen,
        setCopilotOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
