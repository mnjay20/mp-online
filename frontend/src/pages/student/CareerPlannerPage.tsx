import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import { CAREER_TRACKS } from '../../services/mockData';
import { PaperCard, BrassPlaque, RubberStamp } from '../../components/common/SkeuoElements';
import { Link } from 'react-router-dom';
import { Compass, CheckCircle2, AlertCircle, ArrowRight, Sparkles, Map } from 'lucide-react';

export const CareerPlannerPage: React.FC = () => {
  const { skills } = useAuth();
  const [selectedCareerId, setSelectedCareerId] = useState(CAREER_TRACKS[0].id);

  const career = CAREER_TRACKS.find((c) => c.id === selectedCareerId) || CAREER_TRACKS[0];

  // Evaluate student gap for this career
  const evaluatedSkills = career.skills.map((req) => {
    const studentSkill = skills.find((s) => s.skill_name.toLowerCase() === req.skill_name.toLowerCase());
    const isMet = !!studentSkill;
    return {
      ...req,
      studentProficiency: studentSkill?.proficiency || 'NONE',
      isVerified: studentSkill?.is_verified || false,
      isMet,
    };
  });

  const metCount = evaluatedSkills.filter((s) => s.isMet).length;
  const matchPercentage = Math.round((metCount / evaluatedSkills.length) * 100);

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
            Career Benchmark & Skill Gap Station
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-faded)', fontStyle: 'italic' }}>
            Calibrate your personal skill set against authoritative corporate role requirements.
          </p>
        </div>
        <BrassPlaque title="Alignment Ratio" subtitle={`${matchPercentage}% Target Match`} />
      </div>

      {/* Career Track Selector Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {CAREER_TRACKS.map((t) => (
          <PaperCard
            key={t.id}
            hoverable
            onClick={() => setSelectedCareerId(t.id)}
            style={{
              cursor: 'pointer',
              border: selectedCareerId === t.id ? '2px solid #b8860b' : '1px solid #d4be94',
              background: selectedCareerId === t.id ? 'linear-gradient(135deg, #fffbf2 0%, #faecd0 100%)' : undefined,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{ fontSize: '17px', margin: 0 }}>{t.title}</h3>
              {selectedCareerId === t.id && <RubberStamp label="ACTIVE" variant="verified" rotate={-2} />}
            </div>
            <p style={{ fontSize: '13px', color: 'var(--ink-faded)', margin: '8px 0 12px 0' }}>
              {t.description}
            </p>
            <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>
              Avg Salary: ${t.average_salary_min.toLocaleString()} – ${t.average_salary_max.toLocaleString()}
            </div>
          </PaperCard>
        ))}
      </div>

      {/* Detailed Skill Gap Evaluation Table */}
      <PaperCard stitched>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #d4be94', paddingBottom: '10px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px' }}>
              Benchmark Matrix: {career.title}
            </h3>
            <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>
              {metCount} of {evaluatedSkills.length} Core Requirements Verified in Dossier
            </span>
          </div>

          <Link to="/student/career-planner/roadmap" className="btn-brass" style={{ fontSize: '13px' }}>
            <Map size={15} /> <span>Synthesize AI Roadmap</span>
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #bda881', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>
                <th style={{ padding: '10px 12px' }}>SKILL REQUIREMENT</th>
                <th style={{ padding: '10px 12px' }}>IMPORTANCE</th>
                <th style={{ padding: '10px 12px' }}>BENCHMARK LEVEL</th>
                <th style={{ padding: '10px 12px' }}>YOUR RECORD</th>
                <th style={{ padding: '10px 12px' }}>EVALUATION</th>
                <th style={{ padding: '10px 12px' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {evaluatedSkills.map((sk, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: '1px solid #e6d8bc',
                    background: idx % 2 === 0 ? 'rgba(255,255,255,0.4)' : 'transparent',
                  }}
                >
                  <td style={{ padding: '12px', fontWeight: 700, color: 'var(--ink-primary)' }}>
                    {sk.skill_name}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        background: sk.importance === 'CRITICAL' ? 'rgba(143, 38, 32, 0.15)' : 'rgba(184, 134, 11, 0.15)',
                        color: sk.importance === 'CRITICAL' ? 'var(--ink-seal-crimson)' : 'var(--ink-primary)',
                        fontWeight: 700,
                      }}
                    >
                      {sk.importance} (Weight {sk.weight})
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', color: 'var(--ink-faded)' }}>
                    {sk.required_proficiency}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {sk.isMet ? (
                      <span style={{ fontWeight: 700, color: 'var(--ink-stamp-green)' }}>
                        {sk.studentProficiency} {sk.isVerified && '✓'}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--ink-muted)', fontStyle: 'italic' }}>Not Recorded</span>
                    )}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {sk.isMet ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--ink-stamp-green)', fontWeight: 700 }}>
                        <CheckCircle2 size={16} /> Met
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--ink-seal-crimson)', fontWeight: 700 }}>
                        <AlertCircle size={16} /> Gap
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {!sk.isMet ? (
                      <Link to="/student/courses" className="btn-paper" style={{ fontSize: '11px', padding: '3px 8px' }}>
                        Enroll in Course
                      </Link>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>Verified</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PaperCard>
    </div>
  );
};
