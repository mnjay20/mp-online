import { create } from 'zustand';

export type UserRole = 'STUDENT' | 'RECRUITER' | 'ADMIN';

export interface StudentProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  bio?: string;
  target_career_title?: string;
  readiness_score?: number;
  profile_completeness?: number;
}

interface AuthState {
  token: string | null;
  role: UserRole;
  user: { id: string; email: string } | null;
  student: StudentProfile | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: { id: string; email: string }, role: UserRole, student?: StudentProfile) => void;
  switchRole: (newRole: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: 'mock-jwt-session-token',
  role: 'STUDENT',
  user: {
    id: 'user-00000000-0000-0000-0000-000000000001',
    email: 'alex.dev@university.edu',
  },
  student: {
    id: 'student-11111111-1111-1111-1111-111111111111',
    user_id: 'user-00000000-0000-0000-0000-000000000001',
    first_name: 'Alex',
    last_name: 'Dev',
    email: 'alex.dev@university.edu',
    phone: '+91 9876543210',
    city: 'Bengaluru',
    state: 'Karnataka',
    bio: 'CS Junior focused on cloud native distributed systems, container orchestration, and high throughput APIs.',
    target_career_title: 'Backend Engineer',
    readiness_score: 78,
    profile_completeness: 85,
  },
  isAuthenticated: true,

  setAuth: (token, user, role, student) =>
    set({
      token,
      user,
      role,
      student: student || null,
      isAuthenticated: true,
    }),

  switchRole: (newRole) => set({ role: newRole }),

  logout: () =>
    set({
      token: null,
      user: null,
      student: null,
      role: 'STUDENT',
      isAuthenticated: false,
    }),
}));
