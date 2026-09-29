import { Request, Response, NextFunction } from 'express';
import { supabase, supabaseAdmin } from '../config/supabase.js';
import { UnauthorizedError } from '../utils/errors.js';
import { UserRole } from '../types/index.js';

/**
 * Middleware to authenticate requests via Supabase JWT
 */
export const requireAuth = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authorization token is missing or malformed');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('Authorization token is missing');
    }

    // Verify token with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authData.user) {
      throw new UnauthorizedError('Invalid or expired authentication session');
    }

    const userId = authData.user.id;

    // Retrieve corresponding student record from database
    const { data: student, error: studentError } = await supabaseAdmin
      .from('students')
      .select('id, role')
      .eq('user_id', userId)
      .single();

    const role: UserRole = (student?.role as UserRole) || 'STUDENT';

    req.user = {
      id: userId,
      email: authData.user.email,
      role,
      token,
    };

    if (student) {
      req.studentId = student.id;
    }

    next();
  } catch (error) {
    next(error);
  }
};
