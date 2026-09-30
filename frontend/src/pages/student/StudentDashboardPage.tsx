import React from 'react';
import { useAuth } from '../../services/authContext';
import { AnalogGauge } from '../../components/common/AnalogGauge';
import { PaperCard, BrassPlaque, RubberStamp, WaxSeal } from '../../components/common/SkeuoElements';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Award, 
  Compass, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';

export const StudentDashboardPage: React.FC = () => {
  const { student, skills, jobs, applications, setCopilotOpen } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner Plaque */}
      <div
        className="wood-frame"
        style={{
          padding: '20px 28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <h1 style={{ fontSize: '28px', margin: 0, color: '#2b1a03' }}>
              Candidate Career Dossier
            </h1>
            <RubberStamp label="ACCREDITED" variant="verified" rotate={2} />
          </div>
          <p style={{ margin: 0, fontSize: '15px', color: 'var(--ink-faded)', fontStyle: 'italic' }}>
            Welcome to your executive workbench, {student.first_name}. All metrics are calibrated against verified market requirements.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/student/resume-scanner" className="btn-brass">
            📄 Upload Resume
          </Link>
          <Link to="/student/interviews" className="btn-wood">
            🎙️ Launch Mock Studio
          </Link>
        </div>
      </div>

      {/* Primary Gauge Station (Analog Readiness & ATS Health) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Readiness Score Gauge Card */}
        <PaperCard stitched style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <BrassPlaque title="Readiness Index" subtitle="Overall Employability" style={{ marginBottom: '16px' }} />
          <AnalogGauge value={student.readiness_score} title="Readiness" subtitle="Top 8% of graduating cohort" />
          <p style={{ fontSize: '13px', color: 'var(--ink-faded)', marginTop: '12px', lineHeight: 1.4 }}>
            Aggregated from verified skill badges, academic GPA (3.88), and project portfolio verification.
          </p>
        </PaperCard>

        {/* ATS Resume Health Gauge Card */}
        <PaperCard stitched style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <BrassPlaque title="Resume ATS Score" subtitle="Parsed via AI Scanner" style={{ marginBottom: '16px' }} />
          <AnalogGauge value={92} title="ATS Caliber" subtitle="Parsed format: PDF (Standard IEEE)" />
          <p style={{ fontSize: '13px', color: 'var(--ink-faded)', marginTop: '12px', lineHeight: 1.4 }}>
            Optimal keyword alignment for **Distributed Backend Roles**. 2 minor phrasing improvements suggested.
          </p>
        </PaperCard>

        {/* Target Goal Summary Folio */}
        <PaperCard ruled style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>
                  Target Career Goal
                </span>
                <h3 style={{ fontSize: '20px', margin: '4px 0 0 0', color: 'var(--ink-primary)' }}>
                  Distributed Backend Engineer
                </h3>
              </div>
              <WaxSeal letter="GOAL" size="sm" />
            </div>

            <div style={{ fontSize: '14px', color: 'var(--ink-faded)', marginBottom: '16px' }}>
              Target Graduation: <strong>June 2027</strong> • Average Compensation: <strong>$115,000 – $185,000</strong>
            </div>

            <div style={{ background: 'rgba(184, 134, 11, 0.1)', padding: '10px 14px', borderRadius: '4px', border: '1px solid rgba(184, 134, 11, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700 }}>
                <AlertTriangle size={15} color="#8f2620" />
                <span>Critical Gap: Redis & Containerization</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ink-faded)', marginTop: '4px' }}>
                Required for 4 upcoming openings in your target market.
              </div>
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="/student/career-planner" className="btn-paper" style={{ fontSize: '13px' }}>
              <span>Inspect Gap Matrix</span> <ArrowRight size={14} />
            </Link>
          </div>
        </PaperCard>
      </div>

      {/* Workbench Lower Deck: Active Applications & Recommended Openings */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Active Application Stage Tracker */}
        <PaperCard stitched>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #d4be94', paddingBottom: '10px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Active Application Pipeline</h3>
              <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>
                Direct ATS Synchronized
              </span>
            </div>
            <Link to="/student/applications" className="btn-paper" style={{ fontSize: '12px', padding: '4px 10px' }}>
              View All ({applications.length})
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {applications.map((app) => (
              <div
                key={app.id}
                style={{
                  padding: '12px 16px',
                  background: '#fbf5e6',
                  border: '1px solid #dcd0b7',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: 'inset 0 1px 0 #fff',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--ink-primary)' }}>
                    {app.job_title}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-faded)' }}>
                    {app.company_name} • Applied {app.applied_at}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>
                      MATCH SCORE
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ink-stamp-green)' }}>
                      {app.match_score}%
                    </div>
                  </div>
                  <RubberStamp label={app.status.replace('_', ' ')} variant="crimson" rotate={-2} />
                </div>
              </div>
            ))}
          </div>
        </PaperCard>

        {/* Recommended Openings */}
        <PaperCard stitched>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #d4be94', paddingBottom: '10px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Matched Opportunities</h3>
              <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>
                PGVector Embedding Ranking
              </span>
            </div>
            <Link to="/jobs" className="btn-paper" style={{ fontSize: '12px', padding: '4px 10px' }}>
              Browse Board
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {jobs.slice(0, 2).map((job) => (
              <div
                key={job.id}
                style={{
                  padding: '12px 16px',
                  background: '#fbf5e6',
                  border: '1px solid #dcd0b7',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--ink-primary)' }}>
                    {job.company_logo} {job.title}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-faded)' }}>
                    {job.company_name} • {job.location} ({job.work_mode})
                  </div>
                </div>

                <Link
                  to="/jobs"
                  className="btn-brass"
                  style={{ fontSize: '12px', padding: '5px 12px' }}
                >
                  Inspect & Apply
                </Link>
              </div>
            ))}
          </div>
        </PaperCard>
      </div>
    </div>
  );
};
