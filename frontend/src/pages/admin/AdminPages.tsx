import React, { useState } from 'react';
import { PLATFORM_COURSES, MASTER_SKILLS } from '../../services/mockData';
import { PaperCard, BrassPlaque, RubberStamp } from '../../components/common/SkeuoElements';
import { ShieldCheck, Server, Database, Cpu, Plus, Trash2 } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
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
            System Infrastructure & Telemetry Console
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-faded)', fontStyle: 'italic' }}>
            Superuser platform monitoring: Express backend (:5000), FastAPI AI engine (:8000), Supabase PostgreSQL.
          </p>
        </div>

        <BrassPlaque title="Superuser Access" subtitle="Role: ADMIN (Full Clearance)" />
      </div>

      {/* Service Health Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <PaperCard stitched style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Server size={32} color="#8a6a2f" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '16px' }}>Express.js Backend</div>
            <div style={{ fontSize: '12px', color: 'var(--ink-faded)' }}>Port 5000 • JWT Guard Active</div>
            <RubberStamp label="STATUS: OPERATIONAL" variant="verified" rotate={0} className="mt-2" />
          </div>
        </PaperCard>

        <PaperCard stitched style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Cpu size={32} color="#8a6a2f" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '16px' }}>FastAPI AI Service</div>
            <div style={{ fontSize: '12px', color: 'var(--ink-faded)' }}>Gemini 3.5 Flash Lite • LangGraph</div>
            <RubberStamp label="STATUS: READY" variant="verified" rotate={0} className="mt-2" />
          </div>
        </PaperCard>

        <PaperCard stitched style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Database size={32} color="#8a6a2f" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '16px' }}>Supabase PostgreSQL</div>
            <div style={{ fontSize: '12px', color: 'var(--ink-faded)' }}>RLS Enabled • pgvector Embeddings</div>
            <RubberStamp label="STATUS: CONNECTED" variant="verified" rotate={0} className="mt-2" />
          </div>
        </PaperCard>
      </div>

      {/* Aggregate Platform Telemetry Ledger */}
      <PaperCard ruled>
        <h3 style={{ margin: '0 0 14px 0', fontSize: '18px' }}>Platform Aggregate Metrics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.6)', padding: '12px', borderRadius: '4px', border: '1px solid #d4be94' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>REGISTERED STUDENTS</div>
            <div style={{ fontSize: '24px', fontWeight: 800 }}>1,248</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.6)', padding: '12px', borderRadius: '4px', border: '1px solid #d4be94' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>VERIFIED RECRUITERS</div>
            <div style={{ fontSize: '24px', fontWeight: 800 }}>86</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.6)', padding: '12px', borderRadius: '4px', border: '1px solid #d4be94' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>RESUMES ANALYZED</div>
            <div style={{ fontSize: '24px', fontWeight: 800 }}>3,412</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.6)', padding: '12px', borderRadius: '4px', border: '1px solid #d4be94' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>MOCK INTERVIEWS COMPLETED</div>
            <div style={{ fontSize: '24px', fontWeight: 800 }}>942</div>
          </div>
        </div>
      </PaperCard>
    </div>
  );
};

export const AdminCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState(PLATFORM_COURSES);
  const [newTitle, setNewTitle] = useState('');
  const [newProvider, setNewProvider] = useState('Platform Academy');
  const [newDifficulty, setNewDifficulty] = useState('ADVANCED');
  const [newHours, setNewHours] = useState(25);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    const added = {
      id: `crs-${Date.now()}`,
      title: newTitle,
      provider: newProvider,
      url: '#',
      description: 'Platform Internal Engineering curriculum course module.',
      difficulty: newDifficulty as any,
      duration_hours: Number(newHours),
      is_free: true,
      price: 'Free',
      rating: 5.0,
      skills: ['Distributed Systems'],
    };
    setCourses([added, ...courses]);
    setNewTitle('');
    alert('Course added to platform repository!');
  };

  const handleDelete = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
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
            Course Catalog Management (Admin)
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-faded)', fontStyle: 'italic' }}>
            Curate and govern internal academy courses mapped to student skill gap queries.
          </p>
        </div>
        <BrassPlaque title="Academy Catalog" subtitle={`${courses.length} Active Modules`} />
      </div>

      <PaperCard stitched>
        <h3 style={{ margin: '0 0 14px 0', fontSize: '18px' }}>Add New Academy Module</h3>
        <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '12px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-faded)' }}>Module Title</label>
            <input
              type="text"
              className="input-skeuo"
              placeholder="e.g. Advanced Raft Consensus"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-faded)' }}>Provider</label>
            <input
              type="text"
              className="input-skeuo"
              value={newProvider}
              onChange={(e) => setNewProvider(e.target.value)}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-faded)' }}>Difficulty</label>
            <select
              className="input-skeuo"
              value={newDifficulty}
              onChange={(e) => setNewDifficulty(e.target.value)}
            >
              <option value="BEGINNER">BEGINNER</option>
              <option value="INTERMEDIATE">INTERMEDIATE</option>
              <option value="ADVANCED">ADVANCED</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-faded)' }}>Duration (Hours)</label>
            <input
              type="number"
              className="input-skeuo"
              value={newHours}
              onChange={(e) => setNewHours(Number(e.target.value))}
            />
          </div>
          <button type="submit" className="btn-brass" style={{ height: '42px' }}>
            <Plus size={16} /> Add Module
          </button>
        </form>
      </PaperCard>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {courses.map((crs) => (
          <PaperCard key={crs.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '16px' }}>{crs.title}</div>
              <div style={{ fontSize: '13px', color: 'var(--ink-faded)' }}>
                {crs.provider} • {crs.difficulty} • {crs.duration_hours} Hours
              </div>
            </div>
            <button
              onClick={() => handleDelete(crs.id)}
              className="btn-paper"
              style={{ color: 'var(--ink-seal-crimson)' }}
            >
              <Trash2 size={16} /> Delete
            </button>
          </PaperCard>
        ))}
      </div>
    </div>
  );
};

export const AdminTaxonomyPage: React.FC = () => {
  const [skills, setSkills] = useState(MASTER_SKILLS);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Cloud & DevOps');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    setSkills([...skills, { id: `sk-${Date.now()}`, name: newName, category: newCategory }]);
    setNewName('');
    alert('Skill added to Master Taxonomy!');
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
            Skills & Career Taxonomy Authority
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-faded)', fontStyle: 'italic' }}>
            Authoritative platform taxonomy for dropdown auto-completes and career requirement weighting.
          </p>
        </div>
        <BrassPlaque title="Master Taxonomy" subtitle={`${skills.length} Registered Skills`} />
      </div>

      <PaperCard stitched>
        <h3 style={{ margin: '0 0 14px 0', fontSize: '18px' }}>Register New Market Skill</h3>
        <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr auto', gap: '12px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-faded)' }}>Skill Name</label>
            <input
              type="text"
              className="input-skeuo"
              placeholder="e.g. OpenTelemetry"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-faded)' }}>Category</label>
            <select
              className="input-skeuo"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            >
              <option value="Programming Languages">Programming Languages</option>
              <option value="Databases & Storage">Databases & Storage</option>
              <option value="Cloud & DevOps">Cloud & DevOps</option>
              <option value="Distributed Systems">Distributed Systems</option>
              <option value="Frontend Development">Frontend Development</option>
              <option value="APIs & Protocols">APIs & Protocols</option>
            </select>
          </div>
          <button type="submit" className="btn-brass" style={{ height: '42px' }}>
            <Plus size={16} /> Add to Taxonomy
          </button>
        </form>
      </PaperCard>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
        {skills.map((sk) => (
          <PaperCard key={sk.id} style={{ padding: '14px' }}>
            <div style={{ fontWeight: 700, fontSize: '15px' }}>{sk.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--ink-faded)', marginTop: '2px' }}>{sk.category}</div>
          </PaperCard>
        ))}
      </div>
    </div>
  );
};
