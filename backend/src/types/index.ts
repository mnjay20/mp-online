export type UserRole = 'STUDENT' | 'ADMIN' | 'RECRUITER';

export interface AuthenticatedUser {
  id: string; // Supabase Auth user_id
  email?: string;
  role: UserRole;
  token: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      studentId?: string;
    }
  }
}
