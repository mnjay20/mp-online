import React from 'react';
import { useAuth } from '../../services/authContext';
import { PaperCard, BrassPlaque, RubberStamp, WaxSeal } from '../../components/common/SkeuoElements';
import { Link } from 'react-router-dom';
import { Briefcase, Users, CheckCircle, TrendingUp, Plus, ArrowRight } from 'lucide-react';

export const RecruiterDashboardPage: React.FC = () => {
  const { jobs, applications } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div
        className="wood-frame"
        style={{
          padding: '18px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '26px', margin: 0, color: '#2b1a03' }}>
            Recruiter Talent Command Center
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-faded)', fontStyle: 'italic' }}>
            Manage candidate pipelines, calibrate ATS weighted skill rubrics, and extend verified appointment offers.
          </p>
        </div>

        <Link to="/recruiter/jobs/new" className="btn-brass">
          <Plus size={16} /> Post New Position
        </Link>
      </div>

      {/* Metric Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <PaperCard stitched style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>ACTIVE REQUISITIONS</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--ink-primary)', margin: '6px 0' }}>{jobs.length}</div>
          <span style={{ fontSize: '12px', color: 'var(--ink-faded)' }}>Open across 2 divisions</span>
        </PaperCard>

        <PaperCard stitched style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>CANDIDATES IN PIPELINE</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--brass-shadow)', margin: '6px 0' }}>{applications.length}</div>
          <span style={{ fontSize: '12px', color: 'var(--ink-faded)' }}>Ranked by AI match score</span>
        </PaperCard>

        <PaperCard stitched style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>INTERVIEWS SCHEDULED</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--ink-navy)', margin: '6px 0' }}>
            {applications.filter((a) => a.status === 'INTERVIEW_SCHEDULED').length || 1}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--ink-faded)' }}>Panel reviews pending</span>
        </PaperCard>

        <PaperCard stitched style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>OFFERS APPOINTED</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--ink-stamp-green)', margin: '6px 0' }}>
            {applications.filter((a) => a.status === 'SELECTED').length}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--ink-faded)' }}>Zero-loss conversion</span>
        </PaperCard>
      </div>

      {/* Quick Action Table: Current Postings & Pipeline Access */}
      <PaperCard stitched>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #d4be94', paddingBottom: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '18px' }}>Active Corporate Postings</h3>
          <Link to="/recruiter/jobs" className="btn-paper" style={{ fontSize: '12px' }}>
            Manage All
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {jobs.map((job) => (
            <div
              key={job.id}
              style={{
                padding: '14px 16px',
                background: '#fbf5e6',
                border: '1px solid #dcd0b7',
                borderRadius: '4px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '16px' }}>{job.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--ink-faded)' }}>
                  {job.company_name} • {job.location} ({job.work_mode}) • ${job.salary_min.toLocaleString()} – ${job.salary_max.toLocaleString()}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <RubberStamp label="ACTIVE" variant="verified" rotate={1} />
                <Link
                  to={`/recruiter/jobs/${job.id}/candidates`}
                  className="btn-brass"
                  style={{ fontSize: '12px', padding: '6px 14px' }}
                >
                  Inspect Candidates ATS <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </PaperCard>
    </div>
  );
};

export const RecruiterJobsPage: React.FC = () => {
  const { jobs } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div
        className="wood-frame"
        style={{
          padding: '18px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '26px', margin: 0, color: '#2b1a03' }}>
            Requisition Catalog & Job Management
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-faded)', fontStyle: 'italic' }}>
            Inspect open roles, adjust weighted skill tags, and monitor applicant volume.
          </p>
        </div>

        <Link to="/recruiter/jobs/new" className="btn-brass">
          <Plus size={16} /> Post New Position
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {jobs.map((job) => (
          <PaperCard key={job.id} stitched>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #d4be94', paddingBottom: '12px', marginBottom: '12px' }}>
              <div>
                <h2 style={{ fontSize: '19px', margin: '0 0 4px 0' }}>{job.title}</h2>
                <div style={{ fontSize: '13px', color: 'var(--ink-faded)' }}>
                  {job.company_name} • {job.location} ({job.work_mode}) • Posted {job.posted_at}
                </div>
              </div>
              <RubberStamp label={job.employment_type} variant="crimson" rotate={-1} />
            </div>

            <p style={{ fontSize: '14px', color: 'var(--ink-primary)', lineHeight: 1.5, margin: '0 0 14px 0' }}>
              {job.description}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              {job.skills.map((sk) => (
                <span
                  key={sk.skill_name}
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    background: '#ebd9b4',
                    padding: '2px 8px',
                    borderRadius: '3px',
                    color: 'var(--ink-primary)',
                  }}
                >
                  ★ {sk.skill_name} (Weight {sk.weight}, {sk.required_proficiency})
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Link to={`/recruiter/jobs/${job.id}/candidates`} className="btn-brass" style={{ fontSize: '13px' }}>
                Open ATS Candidate Pipeline
              </Link>
            </div>
          </PaperCard>
        ))}
      </div>
    </div>
  );
};
