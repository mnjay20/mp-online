import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import { PaperCard, BrassPlaque, RubberStamp, WaxSeal } from '../../components/common/SkeuoElements';
import { ApplicationStatus } from '../../types';
import { Briefcase, Clock, CheckCircle2, ChevronRight, AlertCircle, XCircle } from 'lucide-react';

const STAGES: ApplicationStatus[] = [
  'APPLIED',
  'REVIEWING',
  'INTERVIEW_SCHEDULED',
  'OFFER',
  'SELECTED',
];

export const StudentApplicationsPage: React.FC = () => {
  const { applications } = useAuth();
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');

  const activeApp = applications.find((a) => a.id === selectedAppId) || applications[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Plaque Header */}
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
            Application Tracking Registry (ATS)
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-faded)', fontStyle: 'italic' }}>
            Direct state-machine synchronization with corporate recruiter portals and review audit logs.
          </p>
        </div>

        <BrassPlaque title="Active Submissions" subtitle={`${applications.length} Requisitions Tracked`} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Left: Application Ledger List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {applications.map((app) => (
            <PaperCard
              key={app.id}
              hoverable
              onClick={() => setSelectedAppId(app.id)}
              style={{
                cursor: 'pointer',
                border: activeApp?.id === app.id ? '2px solid #b8860b' : '1px solid #d4be94',
                background: activeApp?.id === app.id ? 'linear-gradient(135deg, #fffbf2 0%, #faecd0 100%)' : undefined,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '17px' }}>{app.job_title}</h3>
                  <div style={{ fontSize: '13px', color: 'var(--ink-faded)' }}>
                    {app.company_name} • Submitted {app.applied_at}
                  </div>
                </div>
                <RubberStamp label={app.status.replace('_', ' ')} variant="crimson" rotate={-2} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #e0d1b4' }}>
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>
                  MATCH SCORE: <strong style={{ color: 'var(--ink-stamp-green)' }}>{app.match_score}%</strong>
                </span>
                <span style={{ fontSize: '12px', color: 'var(--ink-faded)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Inspect Audit Trail <ChevronRight size={14} />
                </span>
              </div>
            </PaperCard>
          ))}
        </div>

        {/* Right: Selected Application Lifecycle Stepper & Audit Log */}
        {activeApp && (
          <PaperCard stitched style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ borderBottom: '1px solid #d4be94', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '20px' }}>{activeApp.job_title}</h2>
                  <div style={{ fontSize: '14px', color: 'var(--ink-faded)' }}>
                    {activeApp.company_name} • Application Ref: {activeApp.id}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>
                    AI ATS SCORE
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--ink-stamp-green)' }}>
                    {activeApp.match_score}%
                  </div>
                </div>
              </div>
            </div>

            {/* Lifecycle Progression Stepper */}
            <div>
              <div style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)', marginBottom: '12px' }}>
                LIFECYCLE STATUS PIPELINE
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#fbf6e8',
                  padding: '14px',
                  borderRadius: '6px',
                  border: '1px solid #d4be94',
                  overflowX: 'auto',
                }}
              >
                {STAGES.map((stg, idx) => {
                  const currentIdx = STAGES.indexOf(activeApp.status as any);
                  const isDone = currentIdx >= idx;
                  const isCurrent = activeApp.status === stg;

                  return (
                    <div
                      key={stg}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        minWidth: '90px',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: isCurrent
                            ? 'linear-gradient(135deg, #b8860b, #7a5806)'
                            : isDone
                            ? 'linear-gradient(135deg, #24583b, #153824)'
                            : '#ebd9b4',
                          color: isDone || isCurrent ? '#fff' : 'var(--ink-muted)',
                          fontSize: '11px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: isCurrent ? '0 0 0 3px rgba(184, 134, 11, 0.3)' : undefined,
                        }}
                      >
                        {idx + 1}
                      </div>
                      <span
                        style={{
                          fontSize: '10px',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: isCurrent ? 800 : 500,
                          color: isCurrent ? 'var(--ink-primary)' : 'var(--ink-muted)',
                        }}
                      >
                        {stg.replace('_', ' ')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Audit History Timeline */}
            <div>
              <div style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)', marginBottom: '10px' }}>
                TRANSITION AUDIT TIMELINE
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeApp.status_history?.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '10px 14px',
                      background: '#fcf6e6',
                      borderLeft: '3px solid #b8860b',
                      borderRadius: '0 4px 4px 0',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <strong>{h.to_status}</strong>
                      <span style={{ color: 'var(--ink-muted)' }}>{new Date(h.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--ink-primary)', marginTop: '2px' }}>
                      {h.notes}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-faded)', fontStyle: 'italic', marginTop: '2px' }}>
                      Action by: {h.changed_by} ({h.role})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </PaperCard>
        )}
      </div>
    </div>
  );
};
