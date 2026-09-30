import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { UserRole } from '../../types';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  User, 
  Building, 
  GraduationCap, 
  ShieldCheck, 
  KeyRound, 
  CheckCircle2,
  Sparkles,
  Briefcase,
  Eye,
  EyeOff,
  Zap
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { setRole, updateProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isRegisterRoute = location.pathname === '/register';
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>(isRegisterRoute ? 'REGISTER' : 'LOGIN');
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [email, setEmail] = useState('alexandria.vance@university.edu');
  const [password, setPassword] = useState('password123');

  // Registration form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regOrg, setRegOrg] = useState('');
  const [regTargetCareer, setRegTargetCareer] = useState('Distributed Backend Engineer');
  const [regPassword, setRegPassword] = useState('');
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRole(selectedRole);
    if (selectedRole === 'STUDENT') navigate('/student/dashboard');
    else if (selectedRole === 'RECRUITER') navigate('/recruiter/dashboard');
    else navigate('/admin/dashboard');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail) {
      alert('Please fill out all required fields.');
      return;
    }

    setRole(selectedRole);
    if (selectedRole === 'STUDENT') {
      const parts = regName.trim().split(' ');
      updateProfile({
        first_name: parts[0] || 'Candidate',
        last_name: parts.slice(1).join(' ') || 'Student',
      });
    }

    setRegisteredSuccess(true);
    setTimeout(() => {
      if (selectedRole === 'STUDENT') navigate('/student/dashboard');
      else if (selectedRole === 'RECRUITER') navigate('/recruiter/dashboard');
      else navigate('/admin/dashboard');
    }, 1000);
  };

  // Quick 1-Click Persona Login
  const handleQuickDemoLogin = (role: UserRole) => {
    setRole(role);
    if (role === 'STUDENT') {
      setEmail('alexandria.vance@university.edu');
      navigate('/student/dashboard');
    } else if (role === 'RECRUITER') {
      setEmail('recruiter@vanguardledger.internal');
      navigate('/recruiter/dashboard');
    } else {
      setEmail('admin@campus2corporate.internal');
      navigate('/admin/dashboard');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '75vh',
        padding: '36px 16px',
      }}
    >
      <div
        className="glass-panel"
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '36px 32px',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          backgroundColor: 'var(--bg-glass-card)',
          backdropFilter: 'var(--glass-blur)',
          border: '1px solid var(--glass-border)',
        }}
      >
        {/* Brand Logo Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--brand-blue) 0%, var(--brand-purple) 100%)',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '22px',
              boxShadow: '0 8px 20px rgba(10, 102, 194, 0.25)',
              marginBottom: '12px',
            }}
          >
            C2C
          </div>
          <h2
            style={{
              fontSize: '24px',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              color: 'var(--text-main)',
              letterSpacing: '-0.02em',
              margin: '0 0 6px 0',
            }}
          >
            {mode === 'LOGIN' ? 'Welcome Back to C2C' : 'Create Your Free Account'}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
            {mode === 'LOGIN'
              ? 'Access your employability benchmarks and AI career studio'
              : 'Join thousands of students and top recruiters on the network'}
          </p>
        </div>

        {/* Auth Mode Toggle Tabs (Sign In vs Register) */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--bg-glass-subtle)',
            padding: '4px',
            borderRadius: 'var(--radius-pill)',
            marginBottom: '24px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <button
            type="button"
            onClick={() => setMode('LOGIN')}
            style={{
              flex: 1,
              border: 'none',
              padding: '8px 16px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: mode === 'LOGIN' ? 'var(--bg-glass-card)' : 'transparent',
              color: mode === 'LOGIN' ? 'var(--brand-blue)' : 'var(--text-muted)',
              fontWeight: mode === 'LOGIN' ? 700 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: mode === 'LOGIN' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <Lock size={14} /> Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('REGISTER')}
            style={{
              flex: 1,
              border: 'none',
              padding: '8px 16px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: mode === 'REGISTER' ? 'var(--bg-glass-card)' : 'transparent',
              color: mode === 'REGISTER' ? 'var(--brand-purple)' : 'var(--text-muted)',
              fontWeight: mode === 'REGISTER' ? 700 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: mode === 'REGISTER' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <User size={14} /> Create Account
          </button>
        </div>

        {/* Role Persona Switcher */}
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-muted)',
              display: 'block',
              marginBottom: '8px',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Select Target Portal
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: mode === 'LOGIN' ? '1fr 1fr 1fr' : '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => {
                setSelectedRole('STUDENT');
                setEmail('alexandria.vance@university.edu');
              }}
              style={{
                border: selectedRole === 'STUDENT' ? '2px solid var(--brand-blue)' : '1px solid var(--border-subtle)',
                backgroundColor: selectedRole === 'STUDENT' ? 'var(--brand-blue-light)' : 'var(--bg-glass-subtle)',
                color: selectedRole === 'STUDENT' ? 'var(--brand-blue)' : 'var(--text-main)',
                padding: '10px 8px',
                borderRadius: 'var(--radius-lg)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.15s ease',
              }}
            >
              <GraduationCap size={18} color={selectedRole === 'STUDENT' ? 'var(--brand-blue)' : 'var(--text-muted)'} />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('RECRUITER');
                setEmail('recruiter@vanguardledger.internal');
              }}
              style={{
                border: selectedRole === 'RECRUITER' ? '2px solid var(--brand-purple)' : '1px solid var(--border-subtle)',
                backgroundColor: selectedRole === 'RECRUITER' ? 'var(--brand-purple-light)' : 'var(--bg-glass-subtle)',
                color: selectedRole === 'RECRUITER' ? 'var(--brand-purple)' : 'var(--text-main)',
                padding: '10px 8px',
                borderRadius: 'var(--radius-lg)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.15s ease',
              }}
            >
              <Briefcase size={18} color={selectedRole === 'RECRUITER' ? 'var(--brand-purple)' : 'var(--text-muted)'} />
              <span>Recruiter</span>
            </button>

            {mode === 'LOGIN' && (
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('ADMIN');
                  setEmail('admin@campus2corporate.internal');
                }}
                style={{
                  border: selectedRole === 'ADMIN' ? '2px solid var(--brand-blue)' : '1px solid var(--border-subtle)',
                  backgroundColor: selectedRole === 'ADMIN' ? 'var(--brand-blue-light)' : 'var(--bg-glass-subtle)',
                  color: selectedRole === 'ADMIN' ? 'var(--brand-blue)' : 'var(--text-main)',
                  padding: '10px 8px',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.15s ease',
                }}
              >
                <ShieldCheck size={18} color={selectedRole === 'ADMIN' ? '#0f172a' : 'var(--text-muted)'} />
                <span>Admin</span>
              </button>
            )}
          </div>
        </div>

        {/* =========================================================================
            SIGN IN FORM
            ========================================================================= */}
        {mode === 'LOGIN' && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                {selectedRole === 'STUDENT' ? 'University / Student Email' : selectedRole === 'RECRUITER' ? 'Corporate Recruiter Email' : 'Admin Email'}
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  className="modern-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '38px', height: '42px', fontSize: '14px' }}
                  required
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                  Password
                </label>
                <span
                  onClick={() => alert('Password reset link sent to registered email.')}
                  style={{ fontSize: '12px', color: 'var(--brand-blue)', cursor: 'pointer', fontWeight: 500 }}
                >
                  Forgot password?
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="modern-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '38px', paddingRight: '38px', height: '42px', fontSize: '14px' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <input type="checkbox" id="remember" defaultChecked style={{ accentColor: 'var(--brand-blue)' }} />
              <label htmlFor="remember" style={{ cursor: 'pointer' }}>Keep me signed in on this workstation</label>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                height: '44px',
                fontSize: '15px',
                marginTop: '6px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <KeyRound size={16} />
              <span>Sign In to {selectedRole === 'STUDENT' ? 'Student' : selectedRole === 'RECRUITER' ? 'Recruiter' : 'Admin'} Portal</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* =========================================================================
            REGISTRATION FORM
            ========================================================================= */}
        {mode === 'REGISTER' && (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                {selectedRole === 'STUDENT' ? 'Full Candidate Name' : 'Authorized Representative Name'}
              </label>
              <input
                type="text"
                className="modern-input"
                placeholder={selectedRole === 'STUDENT' ? 'e.g. Marcus Chen' : 'e.g. Eleanor Vance'}
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                style={{ height: '40px', fontSize: '13px' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                {selectedRole === 'STUDENT' ? 'University / Student Email (.edu preferred)' : 'Corporate Domain Email'}
              </label>
              <input
                type="email"
                className="modern-input"
                placeholder={selectedRole === 'STUDENT' ? 'm.chen@university.edu' : 'recruiter@corporation.com'}
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                style={{ height: '40px', fontSize: '13px' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                {selectedRole === 'STUDENT' ? 'University or College Name' : 'Company / Organization Name'}
              </label>
              <input
                type="text"
                className="modern-input"
                placeholder={selectedRole === 'STUDENT' ? 'e.g. Georgia Institute of Technology' : 'e.g. CloudScale Systems'}
                value={regOrg}
                onChange={(e) => setRegOrg(e.target.value)}
                style={{ height: '40px', fontSize: '13px' }}
                required
              />
            </div>

            {selectedRole === 'STUDENT' && (
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                  Target Career Pathway
                </label>
                <select
                  className="modern-select"
                  value={regTargetCareer}
                  onChange={(e) => setRegTargetCareer(e.target.value)}
                  style={{ height: '40px', fontSize: '13px' }}
                >
                  <option value="Distributed Backend Engineer">Distributed Backend Engineer</option>
                  <option value="Cloud & DevOps Architect">Cloud & DevOps Architect</option>
                  <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                  <option value="Full Stack Systems Developer">Full Stack Systems Developer</option>
                </select>
              </div>
            )}

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                Create Password
              </label>
              <input
                type="password"
                className="modern-input"
                placeholder="At least 8 characters"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                style={{ height: '40px', fontSize: '13px' }}
                required
              />
            </div>

            {registeredSuccess && (
              <div
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  color: 'var(--brand-green)',
                  fontWeight: 600,
                  fontSize: '13px',
                }}
              >
                ✓ Account created! Redirecting to your dashboard...
              </div>
            )}

            <button
              type="submit"
              className="btn-purple"
              style={{
                height: '44px',
                fontSize: '15px',
                marginTop: '6px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Sparkles size={16} />
              <span>Complete Registration</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* =========================================================================
            1-CLICK INSTANT DEMO PERSONAS
            ========================================================================= */}
        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--text-muted)',
              marginBottom: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Zap size={13} color="var(--brand-amber)" />
            <span>Fast 1-Click Demo Evaluation</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('STUDENT')}
              className="modern-card"
              style={{
                padding: '8px 6px',
                textAlign: 'center',
                border: '1px solid var(--brand-blue-border)',
                backgroundColor: 'var(--bg-glass-subtle)',
                cursor: 'pointer',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div style={{ fontSize: '16px', marginBottom: '2px' }}>🎓</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-blue)' }}>Alexandria</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Student (84%)</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('RECRUITER')}
              className="modern-card"
              style={{
                padding: '8px 6px',
                textAlign: 'center',
                border: '1px solid var(--brand-purple-border)',
                backgroundColor: 'var(--bg-glass-subtle)',
                cursor: 'pointer',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div style={{ fontSize: '16px', marginBottom: '2px' }}>🏢</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-purple)' }}>Vanguard</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Recruiter</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('ADMIN')}
              className="modern-card"
              style={{
                padding: '8px 6px',
                textAlign: 'center',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-glass-subtle)',
                cursor: 'pointer',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div style={{ fontSize: '16px', marginBottom: '2px' }}>🛡️</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-main)' }}>Director</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Admin Overseer</div>
            </button>
          </div>
        </div>

        {/* Security & Privacy Notice */}
        <div
          style={{
            marginTop: '20px',
            fontSize: '11px',
            color: 'var(--text-muted)',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <ShieldCheck size={14} color="var(--brand-green)" />
          <span>Protected with 256-bit SSL encryption & Supabase Auth RLS</span>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  return <LoginPage />;
};
