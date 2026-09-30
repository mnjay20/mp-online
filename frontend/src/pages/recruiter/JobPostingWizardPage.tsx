import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import { MASTER_SKILLS } from '../../services/mockData';
import { PaperCard, BrassPlaque, RubberStamp } from '../../components/common/SkeuoElements';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { ProficiencyLevel } from '../../types';

export const JobPostingWizardPage: React.FC = () => {
  const { addJob } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('Vanguard Systems Ledger');
  const [location, setLocation] = useState('Boston, MA');
  const [workMode, setWorkMode] = useState<'REMOTE' | 'HYBRID' | 'ONSITE'>('HYBRID');
  const [employmentType, setEmploymentType] = useState<'FULL_TIME' | 'INTERNSHIP'>('FULL_TIME');
  const [salaryMin, setSalaryMin] = useState(120000);
  const [salaryMax, setSalaryMax] = useState(165000);
  const [description, setDescription] = useState('');

  const [skillsReq, setSkillsReq] = useState([
    { skill_name: 'Python', weight: 3.0, required_proficiency: 'ADVANCED' as ProficiencyLevel, is_required: true },
    { skill_name: 'PostgreSQL', weight: 2.5, required_proficiency: 'ADVANCED' as ProficiencyLevel, is_required: true },
  ]);

  const addSkillRequirement = () => {
    setSkillsReq((prev) => [
      ...prev,
      { skill_name: 'Docker', weight: 2.0, required_proficiency: 'INTERMEDIATE', is_required: false },
    ]);
  };

  const removeSkillRequirement = (index: number) => {
    setSkillsReq((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert('Please enter a role title');
      return;
    }

    addJob({
      title,
      company_name: companyName,
      company_logo: '🏛️',
      location,
      work_mode: workMode,
      employment_type: employmentType,
      salary_min: Number(salaryMin),
      salary_max: Number(salaryMax),
      experience_min: 1,
      experience_max: 4,
      description,
      skills: skillsReq,
    });

    alert('Job requisition published to PostgreSQL database!');
    navigate('/recruiter/jobs');
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
            Job & Internship Requisition Wizard
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-faded)', fontStyle: 'italic' }}>
            Define positions with granular skill importance weights (1.0–3.0) and required proficiencies for AI ATS scoring.
          </p>
        </div>

        <BrassPlaque title="Requisition Bureau" subtitle="Weighted Skill Matching" />
      </div>

      <PaperCard stitched>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-faded)' }}>Requisition Title</label>
              <input
                type="text"
                className="input-skeuo"
                placeholder="e.g. Lead Distributed Systems Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-faded)' }}>Hiring Entity</label>
              <input
                type="text"
                className="input-skeuo"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-faded)' }}>Location</label>
              <input
                type="text"
                className="input-skeuo"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-faded)' }}>Work Mode</label>
              <select
                className="input-skeuo"
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as any)}
              >
                <option value="REMOTE">REMOTE</option>
                <option value="HYBRID">HYBRID</option>
                <option value="ONSITE">ONSITE</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-faded)' }}>Employment Format</label>
              <select
                className="input-skeuo"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value as any)}
              >
                <option value="FULL_TIME">FULL_TIME</option>
                <option value="INTERNSHIP">INTERNSHIP</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-faded)' }}>Job Description & Responsibilities</label>
            <textarea
              rows={4}
              className="input-skeuo"
              placeholder="Outline role objectives, team dynamics, and architectural scope..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Weighted Skill Criteria Builder */}
          <div style={{ borderTop: '1px solid #d4be94', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px' }}>Weighted Skill Criteria Engine</h3>
                <span style={{ fontSize: '12px', color: 'var(--ink-faded)' }}>
                  Weights determine ATS candidate sorting rankings
                </span>
              </div>
              <button
                type="button"
                onClick={addSkillRequirement}
                className="btn-paper"
                style={{ fontSize: '12px', padding: '4px 10px' }}
              >
                <Plus size={14} /> Add Skill Criteria
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {skillsReq.map((req, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1.5fr 1fr auto',
                    gap: '10px',
                    alignItems: 'center',
                    background: '#fbf6e8',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: '1px solid #dcd0b7',
                  }}
                >
                  <select
                    className="input-skeuo"
                    value={req.skill_name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSkillsReq((prev) => prev.map((s, i) => (i === idx ? { ...s, skill_name: val } : s)));
                    }}
                  >
                    {MASTER_SKILLS.map((sk) => (
                      <option key={sk.id} value={sk.name}>
                        {sk.name}
                      </option>
                    ))}
                  </select>

                  <div>
                    <label style={{ fontSize: '10px', color: 'var(--ink-muted)', display: 'block' }}>WEIGHT (1-3)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="1.0"
                      max="5.0"
                      className="input-skeuo"
                      value={req.weight}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSkillsReq((prev) => prev.map((s, i) => (i === idx ? { ...s, weight: val } : s)));
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '10px', color: 'var(--ink-muted)', display: 'block' }}>MIN PROFICIENCY</label>
                    <select
                      className="input-skeuo"
                      value={req.required_proficiency}
                      onChange={(e) => {
                        const val = e.target.value as ProficiencyLevel;
                        setSkillsReq((prev) => prev.map((s, i) => (i === idx ? { ...s, required_proficiency: val } : s)));
                      }}
                    >
                      <option value="BEGINNER">BEGINNER</option>
                      <option value="INTERMEDIATE">INTERMEDIATE</option>
                      <option value="ADVANCED">ADVANCED</option>
                      <option value="EXPERT">EXPERT</option>
                    </select>
                  </div>

                  <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={req.is_required}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSkillsReq((prev) => prev.map((s, i) => (i === idx ? { ...s, is_required: checked } : s)));
                      }}
                    />
                    Required
                  </label>

                  <button
                    type="button"
                    onClick={() => removeSkillRequirement(idx)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button type="submit" className="btn-brass" style={{ padding: '10px 24px' }}>
              Publish Requisition to Market
            </button>
          </div>
        </form>
      </PaperCard>
    </div>
  );
};
