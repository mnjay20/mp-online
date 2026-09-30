import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../services/authContext';
import { useDynamicUi } from '../../services/dynamicUiContext';
import { 
  Sparkles, 
  Briefcase, 
  GraduationCap, 
  ShieldCheck, 
  Search, 
  SlidersHorizontal,
  Sun,
  Moon,
  Menu,
  X,
  LogIn,
  UserPlus
} from 'lucide-react';

export const DeskHeader: React.FC = () => {
  const { role, setRole, student, setCopilotOpen } = useAuth();
  const { theme, setTheme, toggleAdjuster } = useDynamicUi();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchTerm)}`);
      setMobileMenuOpen(false);
    }
  };

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('midnight');
    else setTheme('light');
  };

  return (
    <>
      <header
        style={{
          backgroundColor: 'var(--bg-glass-header)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          borderBottom: '1px solid var(--glass-border-subtle)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 4px 20px 0 rgba(31, 38, 135, 0.05)',
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            padding: '0 20px',
            height: '68px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          {/* Brand Logo & Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, maxWidth: '620px' }}>
            <Link
              to="/"
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, var(--brand-blue) 0%, var(--brand-purple) 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '17px',
                  boxShadow: '0 4px 12px rgba(10, 102, 194, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                }}
              >
                C2C
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: '19px',
                    color: 'var(--text-main)',
                    letterSpacing: '-0.02em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Campus</span>
                  <span style={{ color: 'var(--brand-blue)' }}>2</span>
                  <span style={{ color: 'var(--brand-purple)' }}>Corporate</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1 }}>
                  Employability Intelligence
                </div>
              </div>
            </Link>

            {/* Desktop Search Bar */}
            <form
              onSubmit={handleSearch}
              className="hide-on-tablet"
              style={{
                flex: 1,
                position: 'relative',
                maxWidth: '360px',
              }}
            >
              <Search
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search careers, skills, jobs, courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="modern-input"
                style={{
                  paddingLeft: '36px',
                  paddingRight: '12px',
                  height: '38px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--bg-glass-subtle)',
                  backdropFilter: 'blur(8px)',
                  fontSize: '13px',
                  border: '1px solid var(--border-subtle)',
                }}
              />
            </form>
          </div>

          {/* Center / Right: Navigation & Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Desktop Quick Links */}
            <div className="hide-on-tablet" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Link
                to="/careers"
                style={{
                  textDecoration: 'none',
                  color: location.pathname === '/careers' ? 'var(--brand-blue)' : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '13px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                Careers
              </Link>
              <Link
                to="/jobs"
                style={{
                  textDecoration: 'none',
                  color: location.pathname === '/jobs' ? 'var(--brand-blue)' : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '13px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                Jobs
              </Link>
            </div>

            {/* Role Switcher Pills (Desktop) */}
            <div
              className="hide-on-tablet"
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--bg-glass-subtle)',
                backdropFilter: 'blur(10px)',
                borderRadius: 'var(--radius-pill)',
                padding: '3px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <button
                onClick={() => setRole('STUDENT')}
                style={{
                  border: 'none',
                  background: role === 'STUDENT' ? 'var(--bg-glass-card)' : 'transparent',
                  color: role === 'STUDENT' ? 'var(--brand-blue)' : 'var(--text-muted)',
                  fontWeight: role === 'STUDENT' ? 700 : 500,
                  fontSize: '12px',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-pill)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: role === 'STUDENT' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <GraduationCap size={14} /> Student
              </button>
              <button
                onClick={() => setRole('RECRUITER')}
                style={{
                  border: 'none',
                  background: role === 'RECRUITER' ? 'var(--bg-glass-card)' : 'transparent',
                  color: role === 'RECRUITER' ? 'var(--brand-purple)' : 'var(--text-muted)',
                  fontWeight: role === 'RECRUITER' ? 700 : 500,
                  fontSize: '12px',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-pill)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: role === 'RECRUITER' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <Briefcase size={14} /> Recruiter
              </button>
              <button
                onClick={() => setRole('ADMIN')}
                style={{
                  border: 'none',
                  background: role === 'ADMIN' ? 'var(--bg-glass-card)' : 'transparent',
                  color: role === 'ADMIN' ? 'var(--text-main)' : 'var(--text-muted)',
                  fontWeight: role === 'ADMIN' ? 700 : 500,
                  fontSize: '12px',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-pill)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: role === 'ADMIN' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <ShieldCheck size={14} /> Admin
              </button>
            </div>

            {/* Quick Dynamic Theme Switcher Icon */}
            <button
              onClick={toggleTheme}
              title={`Switch Theme (Current: ${theme})`}
              style={{
                background: 'var(--bg-glass-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-main)',
                transition: 'all 0.15s ease',
              }}
            >
              {theme === 'light' ? <Sun size={17} color="#d97706" /> : <Moon size={17} color="#38bdf8" />}
            </button>

            {/* Dynamic UI Adjuster Trigger Button */}
            <button
              onClick={toggleAdjuster}
              className="hide-on-mobile"
              title="Open Dynamic Customization Panel"
              style={{
                background: 'var(--bg-glass-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-pill)',
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                color: 'var(--text-main)',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <SlidersHorizontal size={14} color="var(--brand-blue)" />
              <span>Adjust UI</span>
            </button>

            {/* AI Career Copilot Button */}
            <button
              onClick={() => setCopilotOpen(true)}
              className="btn-purple"
              style={{ fontSize: '13px', padding: '6px 14px', height: '36px' }}
            >
              <Sparkles size={14} />
              <span className="hide-on-mobile">Copilot</span>
            </button>

            {/* Profile & Auth Links (Desktop) */}
            <div className="hide-on-tablet" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link
                to="/login"
                style={{
                  textDecoration: 'none',
                  color: 'var(--text-body)',
                  fontSize: '13px',
                  fontWeight: 600,
                  padding: '6px 12px',
                }}
              >
                Sign In
              </Link>

              <Link to="/register" className="btn-primary" style={{ fontSize: '13px', padding: '6px 14px', height: '36px' }}>
                Join Free
              </Link>
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="show-on-mobile"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-main)',
                cursor: 'pointer',
                padding: '6px',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Toggle Mobile Navigation"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '68px',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'var(--bg-glass-card)',
            backdropFilter: 'blur(20px)',
            zIndex: 99,
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            overflowY: 'auto',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          {/* Mobile Search */}
          <form onSubmit={handleSearch} style={{ position: 'relative' }}>
            <Search
              size={16}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search careers, skills, jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="modern-input"
              style={{ paddingLeft: '36px', height: '40px' }}
            />
          </form>

          {/* Role Switcher */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
              Active Persona Portal
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
              <button
                onClick={() => {
                  setRole('STUDENT');
                  navigate('/student/dashboard');
                  setMobileMenuOpen(false);
                }}
                className={role === 'STUDENT' ? 'btn-primary' : 'btn-secondary'}
                style={{ fontSize: '12px', padding: '8px 4px' }}
              >
                🎓 Student
              </button>
              <button
                onClick={() => {
                  setRole('RECRUITER');
                  navigate('/recruiter/dashboard');
                  setMobileMenuOpen(false);
                }}
                className={role === 'RECRUITER' ? 'btn-purple' : 'btn-secondary'}
                style={{ fontSize: '12px', padding: '8px 4px' }}
              >
                🏢 Recruiter
              </button>
              <button
                onClick={() => {
                  setRole('ADMIN');
                  navigate('/admin/dashboard');
                  setMobileMenuOpen(false);
                }}
                className={role === 'ADMIN' ? 'btn-primary' : 'btn-secondary'}
                style={{ fontSize: '12px', padding: '8px 4px' }}
              >
                🛡️ Admin
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 600, padding: '8px 0', fontSize: '15px' }}
            >
              🏠 Home & Portals Gateway
            </Link>
            <Link
              to="/careers"
              onClick={() => setMobileMenuOpen(false)}
              style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 600, padding: '8px 0', fontSize: '15px' }}
            >
              🧭 Career Explorer & Benchmarks
            </Link>
            <Link
              to="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 600, padding: '8px 0', fontSize: '15px' }}
            >
              💼 Verified Job Requisitions
            </Link>
          </div>

          {/* Dynamic Adjuster Quick Trigger */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                toggleAdjuster();
              }}
              className="btn-secondary"
              style={{ flex: 1, fontSize: '13px', padding: '10px' }}
            >
              <SlidersHorizontal size={15} color="var(--brand-blue)" />
              <span>Dynamic Adjuster</span>
            </button>
            <button
              onClick={toggleTheme}
              className="btn-secondary"
              style={{ fontSize: '13px', padding: '10px 14px' }}
            >
              {theme === 'light' ? <Sun size={16} color="#d97706" /> : <Moon size={16} color="#38bdf8" />}
            </button>
          </div>

          {/* Mobile Auth Actions */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-secondary"
              style={{ textAlign: 'center', padding: '11px', fontSize: '14px' }}
            >
              Sign In to Station
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary"
              style={{ textAlign: 'center', padding: '11px', fontSize: '14px' }}
            >
              Create Free Account
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
