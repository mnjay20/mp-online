import React, { useState } from 'react';
import { MOCK_RESUME_ANALYSIS } from '../../services/mockData';
import { PaperCard, BrassPlaque, RubberStamp } from '../../components/common/SkeuoElements';
import { AnalogGauge } from '../../components/common/AnalogGauge';
import { FileUp, CheckCircle, AlertTriangle, Download, Sparkles, RefreshCw } from 'lucide-react';

export const ResumeScannerPage: React.FC = () => {
  const [analysis, setAnalysis] = useState(MOCK_RESUME_ANALYSIS);
  const [isScanning, setIsScanning] = useState(false);
  const [targetRole, setTargetRole] = useState('Distributed Backend Engineer');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setTimeout(() => {
      setAnalysis({
        ...MOCK_RESUME_ANALYSIS,
        file_name: file.name,
        uploaded_at: 'Just now',
        ats_score: Math.floor(88 + Math.random() * 8),
      });
      setIsScanning(false);
    }, 1200);
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
            Resume Intelligence & ATS Diagnostic Bureau
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-faded)', fontStyle: 'italic' }}>
            Uploaded to private Supabase Storage bucket; parsed in-memory with instant semantic keyword analysis.
          </p>
        </div>

        <BrassPlaque title="ATS Rating" subtitle={`${analysis.ats_score}/100 Match`} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Upload Station Card */}
        <PaperCard stitched style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #d4be94', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Document Deposit Box</h3>
              <RubberStamp label="PRIVATE" variant="navy" rotate={-2} />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-faded)' }}>Calibrate Against Role:</label>
              <select
                className="input-skeuo"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                style={{ marginTop: '4px' }}
              >
                <option value="Distributed Backend Engineer">Distributed Backend Engineer</option>
                <option value="Cloud & DevOps Architect">Cloud & DevOps Architect</option>
                <option value="Machine Learning Engineer">Machine Learning Engineer</option>
              </select>
            </div>

            {/* Dropzone Box with stitched border */}
            <div
              style={{
                border: '2px dashed #bda881',
                borderRadius: '6px',
                padding: '28px 16px',
                textAlign: 'center',
                background: '#fbf6e8',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <input
                type="file"
                accept=".pdf,.docx,application/pdf"
                onChange={handleFileUpload}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer',
                }}
              />
              <FileUp size={36} color="#8a6a2f" style={{ margin: '0 auto 10px auto' }} />
              <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--ink-primary)' }}>
                Deposit New Resume (.PDF or .DOCX)
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ink-faded)', marginTop: '4px' }}>
                Maximum size 5 MB • Text extracted in-memory
              </div>
            </div>

            {isScanning && (
              <div style={{ marginTop: '14px', textAlign: 'center', fontSize: '13px', fontStyle: 'italic', color: 'var(--ink-primary)' }}>
                ✦ Extracting vector keywords and analyzing ATS parseability...
              </div>
            )}

            <div style={{ marginTop: '16px', padding: '12px', background: '#f5ead2', borderRadius: '4px', border: '1px solid #d4be94' }}>
              <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>CURRENT PARSED FILE</div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink-primary)' }}>{analysis.file_name}</div>
              <div style={{ fontSize: '12px', color: 'var(--ink-faded)' }}>Scanned: {analysis.uploaded_at}</div>
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => alert('Signed 60-second time-limited URL generated from Supabase Private Bucket: resumes.')}
              className="btn-paper"
              style={{ fontSize: '12px' }}
            >
              <Download size={14} /> Download Secure Copy
            </button>
          </div>
        </PaperCard>

        {/* Diagnostic Station (Analog Gauge + Keyword Cloud) */}
        <PaperCard stitched style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <BrassPlaque title="ATS Parseability Gauge" subtitle="Keyword Compatibility" style={{ marginBottom: '16px' }} />
          <AnalogGauge value={analysis.ats_score} title="ATS Caliber" subtitle="Evaluated for Backend Roles" />

          {/* Extracted vs Missing Keywords */}
          <div style={{ width: '100%', marginTop: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-stamp-green)', marginBottom: '6px' }}>
              ✓ Extracted Keywords ({analysis.extracted_skills.length})
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
              {analysis.extracted_skills.map((sk) => (
                <span key={sk} style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', background: 'rgba(36, 88, 59, 0.1)', color: 'var(--ink-stamp-green)', padding: '2px 8px', borderRadius: '3px', border: '1px solid rgba(36, 88, 59, 0.2)' }}>
                  {sk}
                </span>
              ))}
            </div>

            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-seal-crimson)', marginBottom: '6px' }}>
              ⚠ Missing Keywords in Target Job Profiles
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {analysis.missing_skills.map((sk) => (
                <span key={sk} style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', background: 'rgba(143, 38, 32, 0.1)', color: 'var(--ink-seal-crimson)', padding: '2px 8px', borderRadius: '3px', border: '1px solid rgba(143, 38, 32, 0.2)' }}>
                  {sk}
                </span>
              ))}
            </div>
          </div>
        </PaperCard>
      </div>

      {/* AI Qualitative Feedback & Bullet Point Improvements */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        <PaperCard stitched>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', borderBottom: '1px solid #d4be94', paddingBottom: '10px' }}>
            <CheckCircle size={18} color="var(--ink-stamp-green)" />
            <h3 style={{ margin: 0, fontSize: '17px' }}>Dossier Strengths</h3>
          </div>
          <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: 1.6, color: 'var(--ink-primary)' }}>
            {analysis.strengths.map((str, idx) => (
              <li key={idx} style={{ marginBottom: '8px' }}>{str}</li>
            ))}
          </ul>
        </PaperCard>

        <PaperCard stitched>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', borderBottom: '1px solid #d4be94', paddingBottom: '10px' }}>
            <AlertTriangle size={18} color="var(--ink-seal-crimson)" />
            <h3 style={{ margin: 0, fontSize: '17px' }}>Actionable Enhancements</h3>
          </div>
          <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: 1.6, color: 'var(--ink-primary)' }}>
            {analysis.improvements.map((imp, idx) => (
              <li key={idx} style={{ marginBottom: '8px' }}>{imp}</li>
            ))}
          </ul>
        </PaperCard>
      </div>
    </div>
  );
};
