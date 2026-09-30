import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../services/authContext';
import { 
  LayoutDashboard, 
  UserCheck, 
  Award, 
  Compass, 
  Map, 
  BookOpen, 
  FileText, 
  Mic, 
  Briefcase,
  Layers,
  Settings,
  PlusCircle,
  Building,
  TrendingUp
} from 'lucide-react';

export const DeskNavigation: React.FC = () => {
  const { role } = useAuth();

  return (
    <nav
      style={{
        backgroundColor: 'var(--bg-glass-card)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        border: '1px solid var(--glass-border)',
        marginBottom: '24px',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-glass-sm)',
        padding: '6px 14px',
        overflowX: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          minWidth: 'max-content',
        }}
      >
        {/* Universal Links */}
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
        >
          <TrendingUp size={15} />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/careers"
          className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
        >
          <Compass size={15} />
          <span>Explore Careers</span>
        </NavLink>

        <NavLink
          to="/jobs"
          className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
        >
          <Briefcase size={15} />
          <span>Job Board</span>
        </NavLink>

        <div style={{ width: '1px', height: '22px', backgroundColor: 'var(--border-subtle)', margin: '0 8px' }} />

        {/* STUDENT PORTAL TABS */}
        {role === 'STUDENT' && (
          <>
            <NavLink
              to="/student/dashboard"
              className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
            >
              <LayoutDashboard size={15} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/student/profile"
              className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
            >
              <UserCheck size={15} />
              <span>Portfolio Profile</span>
            </NavLink>

            <NavLink
              to="/student/skills"
              className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
            >
              <Award size={15} />
              <span>Skills Matrix</span>
            </NavLink>

            <NavLink
              to="/student/career-planner"
              className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
            >
              <Compass size={15} />
              <span>Gap Planner</span>
            </NavLink>

            <NavLink
              to="/student/career-planner/roadmap"
              className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
            >
              <Map size={15} />
              <span>AI Roadmap</span>
            </NavLink>

            <NavLink
              to="/student/courses"
              className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
            >
              <BookOpen size={15} />
              <span>Courses Hub</span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  backgroundColor: 'var(--brand-purple-light)',
                  color: 'var(--brand-purple)',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-pill)',
                  marginLeft: '4px',
                }}
              >
                Udemy
              </span>
            </NavLink>

            <NavLink
              to="/student/resume-scanner"
              className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
            >
              <FileText size={15} />
              <span>Resume ATS</span>
            </NavLink>

            <NavLink
              to="/student/interviews"
              className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
            >
              <Mic size={15} />
              <span>Mock Interview</span>
            </NavLink>

            <NavLink
              to="/student/applications"
              className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
            >
              <Layers size={15} />
              <span>Applications</span>
            </NavLink>
          </>
        )}

        {/* RECRUITER PORTAL TABS */}
        {role === 'RECRUITER' && (
          <>
            <NavLink
              to="/recruiter/dashboard"
              className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
            >
              <LayoutDashboard size={15} />
              <span>Recruiter Desk</span>
            </NavLink>

            <NavLink
              to="/recruiter/jobs"
              className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
            >
              <Briefcase size={15} />
              <span>Open Postings</span>
            </NavLink>

            <NavLink
              to="/recruiter/jobs/new"
              className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
            >
              <PlusCircle size={15} />
              <span>Post Position</span>
            </NavLink>

            <NavLink
              to="/recruiter/jobs/job-101/candidates"
              className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
            >
              <Layers size={15} />
              <span>ATS Kanban</span>
            </NavLink>

            <NavLink
              to="/recruiter/company-profile"
              className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
            >
              <Building size={15} />
              <span>Company Profile</span>
            </NavLink>
          </>
        )}

        {/* ADMIN PORTAL TABS */}
        {role === 'ADMIN' && (
          <>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
            >
              <LayoutDashboard size={15} />
              <span>Telemetry Monitor</span>
            </NavLink>

            <NavLink
              to="/admin/courses"
              className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
            >
              <BookOpen size={15} />
              <span>Course Catalog</span>
            </NavLink>

            <NavLink
              to="/admin/skills-taxonomy"
              className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
            >
              <Settings size={15} />
              <span>Skills Taxonomy</span>
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};
