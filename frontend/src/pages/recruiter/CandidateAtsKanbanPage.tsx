import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import { PaperCard, BrassPlaque, RubberStamp, WaxSeal } from '../../components/common/SkeuoElements';
import { ApplicationStatus } from '../../types';
import { Users, CheckCircle, XCircle, ArrowRight, Eye, ChevronRight } from 'lucide-react';

const KANBAN_STAGES: { status: ApplicationStatus; title: string; color: string }[] = [
  { status: 'APPLIED', title: 'New Submissions', color: '#b8860b' },
  { status: 'REVIEWING', title: 'Under Dossier Review', color: '#2b1a03' },
  { status: 'INTERVIEW_SCHEDULED', title: 'Interview Scheduled', color: '#1f2f45' },
  { status: 'OFFER', title: 'Offer Extended', color: '#24583b' },
  { status: 'SELECTED', title: 'Appointed (Hired)', color: '#153824' },
];

export const CandidateAtsKanbanPage: React.FC = () => {
  const { applications, updateApplicationStatus, jobs } = useAuth();
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);

  const activeJob = jobs[0];

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
            ATS Candidate Pipeline & Match Kanban
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-faded)', fontStyle: 'italic' }}>
            Applicants ranked by AI weighted match scores. Transition stages strictly follow governance state machines.
          </p>
        </div>

        <BrassPlaque title="Active Requisition" subtitle={activeJob ? activeJob.title : 'All Positions'} />
      </div>

      {/* Kanban Board Columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, minmax(240px, 1fr))',
          gap: '16px',
          overflowX: 'auto',
          paddingBottom: '16px',
        }}
      >
        {KANBAN_STAGES.map((col) => {
          const colApps = applications.filter((a) => a.status === col.status);

          return (
            <div
              key={col.status}
              style={{
                background: '#ebd9b4',
                border: '1px solid #d4be94',
                borderRadius: '6px',
                padding: '14px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                minHeight: '480px',
              }}
            >
              {/* Column Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '2px solid #bda881',
                  paddingBottom: '8px',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--ink-primary)' }}>
                  {col.title}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    background: '#fcf6e6',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    border: '1px solid #d4be94',
                  }}
                >
                  {colApps.length}
                </span>
              </div>

              {/* Candidate Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {colApps.map((app) => (
                  <PaperCard
                    key={app.id}
                    hoverable
                    onClick={() => setSelectedCandidate(app)}
                    style={{
                      padding: '12px',
                      cursor: 'pointer',
                      borderLeft: `4px solid ${col.color}`,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <strong style={{ fontSize: '14px', color: 'var(--ink-primary)' }}>Alexandria Vance</strong>
                      <span
                        style={{
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 800,
                          color: app.match_score >= 80 ? 'var(--ink-stamp-green)' : 'var(--brass-shadow)',
                        }}
                      >
                        {app.match_score}% MATCH
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--ink-faded)', margin: '4px 0 8px 0' }}>
                      {app.job_title}
                    </div>

                    {/* Quick Stage Transition Actions */}
                    <div
                      style={{
                        borderTop: '1px solid #e6d8bc',
                        paddingTop: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: '10px', color: 'var(--ink-muted)' }}>GPA: 3.88 • CS Senior</span>

                      {col.status === 'APPLIED' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateApplicationStatus(app.id, 'REVIEWING');
                          }}
                          className="btn-paper"
                          style={{ fontSize: '10px', padding: '2px 6px' }}
                        >
                          Review →
                        </button>
                      )}

                      {col.status === 'REVIEWING' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateApplicationStatus(app.id, 'INTERVIEW_SCHEDULED');
                          }}
                          className="btn-brass"
                          style={{ fontSize: '10px', padding: '2px 6px' }}
                        >
                          Interview →
                        </button>
                      )}

                      {col.status === 'INTERVIEW_SCHEDULED' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateApplicationStatus(app.id, 'OFFER');
                          }}
                          className="btn-brass"
                          style={{ fontSize: '10px', padding: '2px 6px' }}
                        >
                          Offer →
                        </button>
                      )}

                      {col.status === 'OFFER' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateApplicationStatus(app.id, 'SELECTED');
                          }}
                          className="btn-brass"
                          style={{ fontSize: '10px', padding: '2px 6px' }}
                        >
                          Appoint ✓
                        </button>
                      )}
                    </div>
                  </PaperCard>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Candidate Dossier Inspection Modal */}
      {selectedCandidate && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(30, 20, 10, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setSelectedCandidate(null)}
        >
          <div
            style={{ maxWidth: '640px', width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <PaperCard stitched style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #d4be94', paddingBottom: '12px', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '22px' }}>Candidate Evaluation Dossier</h2>
                  <span style={{ fontSize: '13px', color: 'var(--ink-faded)' }}>
                    Candidate: Alexandria Vance • Requisition: {selectedCandidate.job_title}
                  </span>
                </div>
                <RubberStamp label={`${selectedCandidate.match_score}% FIT`} variant="verified" rotate={-1} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '15px' }}>Weighted Skill Overlap Breakdown</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 10px', background: '#f5ead2', borderRadius: '4px' }}>
                    <span><strong>Python (Weight 3.0)</strong> • Required: ADVANCED</span>
                    <span style={{ color: 'var(--ink-stamp-green)', fontWeight: 700 }}>EXPERT (Verified ✓)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 10px', background: '#f5ead2', borderRadius: '4px' }}>
                    <span><strong>PostgreSQL (Weight 3.0)</strong> • Required: ADVANCED</span>
                    <span style={{ color: 'var(--ink-stamp-green)', fontWeight: 700 }}>ADVANCED (Verified ✓)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 10px', background: '#f5ead2', borderRadius: '4px' }}>
                    <span><strong>Docker (Weight 2.0)</strong> • Required: INTERMEDIATE</span>
                    <span style={{ color: 'var(--ink-primary)', fontWeight: 700 }}>INTERMEDIATE (Self-reported)</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button onClick={() => setSelectedCandidate(null)} className="btn-paper">
                  Close Dossier
                </button>
                <button
                  onClick={() => {
                    updateApplicationStatus(selectedCandidate.id, 'INTERVIEW_SCHEDULED');
                    setSelectedCandidate(null);
                  }}
                  className="btn-brass"
                >
                  Fast-Track to Interview
                </button>
              </div>
            </PaperCard>
          </div>
        </div>
      )}
    </div>
  );
};
