import React, { useState } from 'react';
import { PaperCard, BrassPlaque, RubberStamp } from '../../components/common/SkeuoElements';
import { Building, Globe, MapPin, CheckCircle2 } from 'lucide-react';

export const CompanyProfilePage: React.FC = () => {
  const [name, setName] = useState('Vanguard Systems Ledger');
  const [website, setWebsite] = useState('https://vanguardledger.internal');
  const [location, setLocation] = useState('Boston, Massachusetts');
  const [about, setAbout] = useState(
    'A high-reliability institutional financial infrastructure provider engineering transaction settlement and distributed databases.'
  );
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
            Corporate Folio & Recruiter Profile
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-faded)', fontStyle: 'italic' }}>
            Corporate credentials presented to prospective students and academic partners.
          </p>
        </div>
        <BrassPlaque title="Enterprise Dossier" subtitle="Verified Employer Entity" />
      </div>

      <PaperCard stitched style={{ maxWidth: '780px', margin: '0 auto' }}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-faded)' }}>Corporate Entity Name</label>
            <input
              type="text"
              className="input-skeuo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-faded)' }}>Corporate Website</label>
              <input
                type="text"
                className="input-skeuo"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-faded)' }}>Headquarters Location</label>
              <input
                type="text"
                className="input-skeuo"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-faded)' }}>Company Mission & Engineering Culture</label>
            <textarea
              rows={4}
              className="input-skeuo"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            {saved ? (
              <span style={{ color: 'var(--ink-stamp-green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> Saved into Employer Registry!
              </span>
            ) : <div />}

            <button type="submit" className="btn-brass">
              Update Corporate Folio
            </button>
          </div>
        </form>
      </PaperCard>
    </div>
  );
};
