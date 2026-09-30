import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import { MASTER_SKILLS } from '../../services/mockData';
import { PaperCard, BrassPlaque, RubberStamp, WaxSeal } from '../../components/common/SkeuoElements';
import { ProficiencyLevel } from '../../types';
import { Award, Plus, Trash2, CheckCircle2, ShieldAlert } from 'lucide-react';

export const StudentSkillsPage: React.FC = () => {
  const { skills, addSkill, removeSkill } = useAuth();
  const [selectedSkillId, setSelectedSkillId] = useState(MASTER_SKILLS[0].id);
  const [proficiency, setProficiency] = useState<ProficiencyLevel>('INTERMEDIATE');
  const [years, setYears] = useState(2);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const master = MASTER_SKILLS.find((s) => s.id === selectedSkillId);
    if (!master) return;

    if (skills.some((s) => s.skill_name === master.name)) {
      alert('This skill is already registered in your portfolio!');
      return;
    }

    addSkill({
      skill_id: master.id,
      skill_name: master.name,
      category: master.category,
      proficiency,
      source: 'SELF_REPORTED',
      years_experience: Number(years),
      is_verified: false,
    });
  };

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
            Technical Competencies & Skills Ledger
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-faded)', fontStyle: 'italic' }}>
            Verified technical badges hold 3.0x weight in recruiter candidate search queries.
          </p>
        </div>
        <BrassPlaque title="Skills Verified" subtitle={`${skills.filter((s) => s.is_verified).length} of ${skills.length} Authenticated`} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Form to Register / Claim a New Skill */}
        <PaperCard stitched>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #d4be94', paddingBottom: '10px' }}>
            <Award size={18} color="#8a6a2f" />
            <h3 style={{ margin: 0, fontSize: '18px' }}>Endorse New Skill Into Dossier</h3>
          </div>

          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-faded)' }}>Master Skill Taxonomy</label>
              <select
                className="input-skeuo"
                value={selectedSkillId}
                onChange={(e) => setSelectedSkillId(e.target.value)}
              >
                {MASTER_SKILLS.map((sk) => (
                  <option key={sk.id} value={sk.id}>
                    {sk.name} ({sk.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-faded)' }}>Proficiency Calibration</label>
              <select
                className="input-skeuo"
                value={proficiency}
                onChange={(e) => setProficiency(e.target.value as ProficiencyLevel)}
              >
                <option value="BEGINNER">BEGINNER — Fundamental knowledge</option>
                <option value="ELEMENTARY">ELEMENTARY — Academic assignments</option>
                <option value="INTERMEDIATE">INTERMEDIATE — Practical production projects</option>
                <option value="ADVANCED">ADVANCED — Deep systems mastery & architecture</option>
                <option value="EXPERT">EXPERT — Industry contributor & optimization</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-faded)' }}>Years of Experience</label>
              <input
                type="number"
                min="1"
                max="10"
                className="input-skeuo"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
              />
            </div>

            <button type="submit" className="btn-brass" style={{ marginTop: '8px' }}>
              <Plus size={16} /> Register Skill in Ledger
            </button>
          </form>
        </PaperCard>

        {/* Existing Skills Portfolio List */}
        <PaperCard stitched>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #d4be94', paddingBottom: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Recorded Skills ({skills.length})</h3>
            <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>
              Click to view verification proof
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {skills.map((s) => (
              <div
                key={s.id}
                style={{
                  padding: '12px 14px',
                  background: '#fbf5e6',
                  border: '1px solid #dcd0b7',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--ink-primary)' }}>
                      {s.skill_name}
                    </span>
                    {s.is_verified ? (
                      <RubberStamp label="VERIFIED" variant="verified" rotate={1} />
                    ) : (
                      <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)', background: '#ebd9b4', padding: '1px 6px', borderRadius: '3px' }}>
                        SELF-REPORTED
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-faded)', marginTop: '2px' }}>
                    Level: <strong>{s.proficiency}</strong> • {s.years_experience} {s.years_experience === 1 ? 'Year' : 'Years'} Exp • {s.category}
                  </div>
                </div>

                <button
                  onClick={() => removeSkill(s.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--ink-muted)',
                    padding: '4px',
                  }}
                  title="Remove from ledger"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </PaperCard>
      </div>
    </div>
  );
};
