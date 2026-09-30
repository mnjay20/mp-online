import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import { PaperCard, BrassPlaque, RubberStamp } from '../../components/common/SkeuoElements';
import { Briefcase, MapPin, DollarSign, CheckCircle2, Search, Filter } from 'lucide-react';

export const JobsExplorerPage: React.FC = () => {
  const { jobs, applyToJob, applications } = useAuth();
  const [filterMode, setFilterMode] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const filteredJobs = jobs.filter((j) => {
    const matchMode = filterMode === 'ALL' || j.work_mode === filterMode;
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company_name.toLowerCase().includes(search.toLowerCase());
    return matchMode && matchSearch;
  });

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
            Corporate Job & Internship Exchange
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-faded)', fontStyle: 'italic' }}>
            Authoritative postings from verified hiring entities. One-click submission computes instant match scores.
          </p>
        </div>

        <BrassPlaque title="Active Openings" subtitle={`${jobs.length} Verified Requisitions`} />
      </div>

      {/* Filter and Search Bar */}
      <PaperCard style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
          <Search size={18} color="var(--ink-muted)" />
          <input
            type="text"
            className="input-skeuo"
            placeholder="Search by role title, technologies, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>WORK MODE:</span>
          {['ALL', 'REMOTE', 'HYBRID', 'ONSITE'].map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={filterMode === mode ? 'btn-brass' : 'btn-paper'}
              style={{ fontSize: '12px', padding: '4px 10px' }}
            >
              {mode}
            </button>
          ))}
        </div>
      </PaperCard>

      {/* Jobs List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredJobs.map((job) => {
          const hasApplied = applications.some((a) => a.job_id === job.id);

          return (
            <PaperCard key={job.id} stitched>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #d4be94', paddingBottom: '12px', marginBottom: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px' }}>{job.company_logo || '🏛️'}</span>
                    <div>
                      <h2 style={{ fontSize: '20px', margin: 0 }}>{job.title}</h2>
                      <div style={{ fontSize: '13px', color: 'var(--ink-faded)' }}>
                        {job.company_name} • {job.location} ({job.work_mode}) • Posted {job.posted_at}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <RubberStamp label={job.employment_type} variant="crimson" rotate={1} />
                  <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--ink-primary)' }}>
                    ${job.salary_min.toLocaleString()} — ${job.salary_max.toLocaleString()}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--ink-primary)', marginBottom: '14px' }}>
                {job.description}
              </p>

              {/* Required Skills */}
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>
                  EVALUATION SKILL WEIGHTS:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  {job.skills.map((sk) => (
                    <span
                      key={sk.skill_name}
                      style={{
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        padding: '2px 8px',
                        borderRadius: '3px',
                        background: '#ebd9b4',
                      }}
                    >
                      ★ {sk.skill_name} ({sk.required_proficiency}, W: {sk.weight})
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #d4be94', paddingTop: '12px' }}>
                <span style={{ fontSize: '12px', color: 'var(--ink-faded)' }}>
                  Experience Req: {job.experience_min}–{job.experience_max} Years
                </span>

                {hasApplied ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--ink-stamp-green)', fontWeight: 700, fontSize: '13px' }}>
                    <CheckCircle2 size={16} /> Application Submitted to ATS
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      applyToJob(job.id);
                      alert(`Successfully submitted application for ${job.title}! Recruiter ATS pipeline notified.`);
                    }}
                    className="btn-brass"
                  >
                    Submit Application Dossier
                  </button>
                )}
              </div>
            </PaperCard>
          );
        })}
      </div>
    </div>
  );
};
