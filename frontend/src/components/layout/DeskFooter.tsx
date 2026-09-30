import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../services/authContext';
import { 
  GraduationCap, 
  Briefcase, 
  Server, 
  ExternalLink, 
  ShieldCheck, 
  ChevronRight, 
  Globe, 
  Heart,
  Sparkles
} from 'lucide-react';

export const DeskFooter: React.FC = () => {
  const { setRole } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-glass-card)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        borderTop: '1px solid var(--border-subtle)',
        marginTop: 'auto',
        padding: '48px 0 24px 0',
      }}
    >
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '36px',
        }}
      >
        {/* 4-Column Directory Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '32px',
          }}
        >
          {/* Column 1: Brand & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, var(--brand-blue) 0%, var(--brand-purple) 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '14px',
                }}
              >
                C2C
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '17px',
                  color: 'var(--text-main)',
                }}
              >
                Campus2Corporate
              </span>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
              The authoritative career readiness, employability telemetry, and corporate recruitment ecosystem. Empowering students across the transition to corporate tech leadership.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-pill badge-success" style={{ fontSize: '11px' }}>
                ✓ ISO 27001 Certified
              </span>
              <span className="badge-pill badge-blue" style={{ fontSize: '11px' }}>
                pgvector v0.7
              </span>
            </div>
          </div>

          {/* Column 2: Candidate Readiness Tools (Udemy + LinkedIn style) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Student Candidates
            </h4>
            <Link to="/student/dashboard" onClick={() => setRole('STUDENT')} style={{ fontSize: '13px', color: 'var(--text-body)', textDecoration: 'none' }}>
              Readiness Command Center
            </Link>
            <Link to="/student/resume-scanner" onClick={() => setRole('STUDENT')} style={{ fontSize: '13px', color: 'var(--text-body)', textDecoration: 'none' }}>
              AI Resume ATS Scanner
            </Link>
            <Link to="/student/interviews" onClick={() => setRole('STUDENT')} style={{ fontSize: '13px', color: 'var(--text-body)', textDecoration: 'none' }}>
              Adaptive Voice Mock Studio
            </Link>
            <Link to="/student/career-planner" onClick={() => setRole('STUDENT')} style={{ fontSize: '13px', color: 'var(--text-body)', textDecoration: 'none' }}>
              Skill Gap Matrix & Planner
            </Link>
            <Link to="/student/courses" onClick={() => setRole('STUDENT')} style={{ fontSize: '13px', color: 'var(--text-body)', textDecoration: 'none' }}>
              Course Hub & Live Web Courses
            </Link>
            <Link to="/student/applications" onClick={() => setRole('STUDENT')} style={{ fontSize: '13px', color: 'var(--text-body)', textDecoration: 'none' }}>
              Applications ATS Pipeline
            </Link>
          </div>

          {/* Column 3: Corporate Recruiters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Corporate Recruiters
            </h4>
            <Link to="/recruiter/dashboard" onClick={() => setRole('RECRUITER')} style={{ fontSize: '13px', color: 'var(--text-body)', textDecoration: 'none' }}>
              Recruiter Talent Desk
            </Link>
            <Link to="/recruiter/jobs/new" onClick={() => setRole('RECRUITER')} style={{ fontSize: '13px', color: 'var(--text-body)', textDecoration: 'none' }}>
              Post Position with Skill Weights
            </Link>
            <Link to="/recruiter/jobs/job-101/candidates" onClick={() => setRole('RECRUITER')} style={{ fontSize: '13px', color: 'var(--text-body)', textDecoration: 'none' }}>
              ATS Candidate Match Kanban
            </Link>
            <Link to="/recruiter/company-profile" onClick={() => setRole('RECRUITER')} style={{ fontSize: '13px', color: 'var(--text-body)', textDecoration: 'none' }}>
              Enterprise Folio & Branding
            </Link>
            <Link to="/jobs" style={{ fontSize: '13px', color: 'var(--text-body)', textDecoration: 'none' }}>
              Public Job Board
            </Link>
          </div>

          {/* Column 4: Architecture & Security */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Platform Architecture
            </h4>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <div>• <strong>Backend:</strong> Express.js + TS (:5000)</div>
              <div>• <strong>AI Engine:</strong> Gemini 3.5 Flash Lite (:8000)</div>
              <div>• <strong>Database:</strong> PostgreSQL 15+ pgvector</div>
              <div>• <strong>Security:</strong> Supabase Auth & Storage RLS</div>
            </div>
            <div style={{ marginTop: '6px', display: 'flex', gap: '8px' }}>
              <Link to="/admin/dashboard" onClick={() => setRole('ADMIN')} className="btn-secondary" style={{ fontSize: '12px', padding: '5px 12px' }}>
                Admin Console
              </Link>
              <Link to="/login" className="btn-primary" style={{ fontSize: '12px', padding: '5px 14px' }}>
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal Strip */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            fontSize: '13px',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            © {currentYear} <strong>Campus2Corporate Inc.</strong> All rights reserved. Powered by Supabase & Google Gemini.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ cursor: 'pointer' }}>Terms of Service</span>
            <span style={{ cursor: 'pointer' }}>Security Whitepaper</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Globe size={14} /> English (US)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
