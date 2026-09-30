import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import { PaperCard, BrassPlaque, RubberStamp } from '../../components/common/SkeuoElements';
import { UserCheck, BookOpen, Code2, Award, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const { student, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    first_name: student.first_name,
    last_name: student.last_name,
    phone: student.phone,
    city: student.city,
    state: student.state,
    country: student.country,
    bio: student.bio,
    github_url: student.github_url || '',
    linkedin_url: student.linkedin_url || '',
    portfolio_url: student.portfolio_url || '',
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Plaque */}
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
            Academic Portfolio & Credentials Dossier
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-faded)', fontStyle: 'italic' }}>
            Authoritative student identity synchronized with Supabase JWT and verified academic records.
          </p>
        </div>
        <BrassPlaque title="Profile Integrity" subtitle="88% Complete" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Personal Details & Portfolio Links Form */}
        <PaperCard stitched>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #d4be94', paddingBottom: '10px' }}>
            <UserCheck size={18} color="#8a6a2f" />
            <h3 style={{ margin: 0, fontSize: '18px' }}>Personal Bio & Network Coordinates</h3>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-faded)' }}>First Name</label>
                <input
                  type="text"
                  className="input-skeuo"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-faded)' }}>Last Name</label>
                <input
                  type="text"
                  className="input-skeuo"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-faded)' }}>Contact Phone</label>
                <input
                  type="text"
                  className="input-skeuo"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-faded)' }}>City, State</label>
                <input
                  type="text"
                  className="input-skeuo"
                  value={`${formData.city}, ${formData.state}`}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-faded)' }}>Professional Biography</label>
              <textarea
                rows={3}
                className="input-skeuo"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-faded)' }}>GitHub Dossier</label>
              <input
                type="text"
                className="input-skeuo"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-faded)' }}>LinkedIn Profile</label>
              <input
                type="text"
                className="input-skeuo"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
              {saved && (
                <span style={{ fontSize: '13px', color: 'var(--ink-stamp-green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} /> Saved into PostgreSQL Ledger!
                </span>
              )}
              {!saved && <div />}
              <button type="submit" className="btn-brass">
                Seal & Update Portfolio
              </button>
            </div>
          </form>
        </PaperCard>

        {/* Education & Academic Transcript History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <PaperCard stitched>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid #d4be94', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={18} color="#8a6a2f" />
                <h3 style={{ margin: 0, fontSize: '18px' }}>Formal Academic Degree</h3>
              </div>
              <RubberStamp label="GPA 3.88" variant="verified" rotate={-1} />
            </div>

            <div style={{ background: '#fcf6e6', padding: '14px', borderRadius: '4px', border: '1px solid #d4be94' }}>
              <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--ink-primary)' }}>
                Bachelor of Science in Computer Science & Engineering
              </div>
              <div style={{ fontSize: '13px', color: 'var(--ink-faded)', margin: '4px 0' }}>
                Northeastern University • 2023 — 2027 (Expected)
              </div>
              <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>
                Cumulative GPA: 3.88 / 4.00 • Magna Cum Laude Track
              </div>
            </div>
          </PaperCard>

          <PaperCard stitched>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid #d4be94', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Code2 size={18} color="#8a6a2f" />
                <h3 style={{ margin: 0, fontSize: '18px' }}>Featured Artifacts & Repositories</h3>
              </div>
              <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>2 Featured</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: '#fcf6e6', padding: '12px', borderRadius: '4px', border: '1px solid #d4be94' }}>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>Raft Consensus Replication Engine in Python</div>
                <p style={{ margin: '4px 0', fontSize: '12px', color: 'var(--ink-faded)' }}>
                  State machine replication protocol with leader elections, log compaction, and RPC network simulations.
                </p>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--brass-shadow)' }}>
                  Skills: Python • Distributed Systems • Sockets
                </div>
              </div>

              <div style={{ background: '#fcf6e6', padding: '12px', borderRadius: '4px', border: '1px solid #d4be94' }}>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>PostgreSQL High-Throughput Event Store</div>
                <p style={{ margin: '4px 0', fontSize: '12px', color: 'var(--ink-faded)' }}>
                  Partitioned database schema with advisory locking, pgvector semantic search, and zero-loss WAL streaming.
                </p>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--brass-shadow)' }}>
                  Skills: PostgreSQL • Docker • pgvector
                </div>
              </div>
            </div>
          </PaperCard>
        </div>
      </div>
    </div>
  );
};
