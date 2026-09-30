import React from 'react';
import { CAREER_TRACKS } from '../../services/mockData';
import { PaperCard, BrassPlaque, RubberStamp } from '../../components/common/SkeuoElements';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight, DollarSign } from 'lucide-react';

export const CareersExplorerPage: React.FC = () => {
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
            Authoritative Career Pathways & Benchmarks
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-faded)', fontStyle: 'italic' }}>
            Comprehensive competencies, market compensation bands, and demand calibrations across 10 corporate tracks.
          </p>
        </div>
        <BrassPlaque title="Market Telemetry" subtitle="Q3 2026 Index" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {CAREER_TRACKS.map((career) => (
          <PaperCard key={career.id} stitched style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <RubberStamp label={career.demand_level} variant="verified" rotate={-1} />
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>
                  Ref: {career.id}
                </span>
              </div>

              <h2 style={{ fontSize: '20px', margin: '6px 0 8px 0', color: 'var(--ink-primary)' }}>
                {career.title}
              </h2>

              <p style={{ fontSize: '14px', color: 'var(--ink-faded)', lineHeight: 1.5, marginBottom: '16px' }}>
                {career.description}
              </p>

              <div style={{ background: '#fcf6e6', padding: '10px 14px', borderRadius: '4px', border: '1px solid #d4be94', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>
                  BASE COMPENSATION SPECTRUM
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--ink-primary)' }}>
                  ${career.average_salary_min.toLocaleString()} — ${career.average_salary_max.toLocaleString()}
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-faded)', marginBottom: '6px' }}>
                  Critical Required Competencies:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {career.skills.map((sk) => (
                    <span
                      key={sk.skill_name}
                      style={{
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        padding: '2px 8px',
                        borderRadius: '3px',
                        background: '#ebd9b4',
                        color: 'var(--ink-primary)',
                      }}
                    >
                      {sk.skill_name} ({sk.importance})
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #d4be94', paddingTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
              <Link to="/student/career-planner" className="btn-brass" style={{ fontSize: '12px' }}>
                Benchmark My Skills Against Role <ArrowRight size={14} />
              </Link>
            </div>
          </PaperCard>
        ))}
      </div>
    </div>
  );
};
