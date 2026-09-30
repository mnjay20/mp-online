import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../services/authContext';
import { AnalogGauge } from '../../components/common/AnalogGauge';
import { PLATFORM_COURSES } from '../../services/mockData';
import { 
  Compass, 
  Sparkles, 
  Award, 
  BookOpen, 
  FileText, 
  Mic, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Briefcase,
  Users,
  GraduationCap,
  Layers,
  ChevronDown,
  ChevronUp,
  Lock,
  Search,
  Star,
  PlayCircle,
  Clock,
  Building2
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setRole } = useAuth();
  const [activeStation, setActiveStation] = useState<'ATS' | 'INTERVIEW' | 'ROADMAP' | 'RECRUITER'>('ATS');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the AI ATS Scanner evaluate technical resumes differently than legacy software?',
      a: 'Unlike keyword-stuffing regex parsers, our engine utilizes in-memory document parsing and Gemini 3.5 Flash Lite semantic vector embeddings. It evaluates quantifiable impact metrics, architecture depth, and compares bullet points against the exact skill weights set by corporate hiring managers.',
    },
    {
      q: 'What powers the Adaptive Mock Interview Studio?',
      a: 'The studio employs a multi-turn LangGraph state machine. As you answer via microphone voice transcription or text, the AI evaluates technical depth, clarity, and fault tolerance, dynamically asking follow-up questions just like a Senior Principal Engineer.',
    },
    {
      q: 'How does the Dual-Source Course Hub resolve student skill gaps?',
      a: 'When an assessment or target career highlights a skill gap (e.g., Redis or Kubernetes), the platform queries our internal academy modules first. If not covered, it executes a live Tavily web search, categorizing verified courses into Free and Professional certification tiers.',
    },
    {
      q: 'How do corporate recruiters leverage the weighted ATS pipeline?',
      a: 'Recruiters define positions with custom skill weights (1.0 to 3.0) and required proficiency minimums. Incoming student applications are automatically ranked by an AI match score, with transparent breakdowns of verified vs missing skills.',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
      {/* =========================================================================
          HERO SECTION (LinkedIn + Udemy style, Light Theme)
          ========================================================================= */}
      <div
        className="modern-card hero-card"
        style={{
          padding: '56px 40px',
          boxShadow: 'var(--shadow-sm)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center' }}>
          {/* Top Accredited Pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span className="badge-pill badge-purple" style={{ padding: '4px 12px', fontSize: '12px' }}>
              <Sparkles size={13} /> AI Career Readiness Intelligence
            </span>
            <span className="badge-pill badge-blue" style={{ padding: '4px 12px', fontSize: '12px' }}>
              ✓ Accredited Platform
            </span>
          </div>

          <h1
            style={{
              fontSize: '44px',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              color: 'var(--text-main)',
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
              marginBottom: '16px',
            }}
          >
            Where Campus Talent Becomes <span style={{ color: 'var(--brand-blue)' }}>Corporate Leadership</span>
          </h1>

          <p
            style={{
              fontSize: '18px',
              color: 'var(--text-body)',
              lineHeight: 1.6,
              marginBottom: '32px',
              maxWidth: '720px',
              margin: '0 auto 32px auto',
            }}
          >
            The authoritative career intelligence and employability platform. Bridge the divide between university transcripts and corporate engineering expectations with AI ATS scoring, live voice mock interviews, and skill-gap roadmaps.
          </p>

          {/* Quick Search & CTAs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '28px' }}>
            <Link
              to="/student/dashboard"
              onClick={() => setRole('STUDENT')}
              className="btn-primary"
              style={{ fontSize: '15px', padding: '12px 28px' }}
            >
              <GraduationCap size={18} /> Launch Student Portal
            </Link>

            <Link
              to="/recruiter/dashboard"
              onClick={() => setRole('RECRUITER')}
              className="btn-secondary"
              style={{ fontSize: '15px', padding: '12px 28px' }}
            >
              <Briefcase size={18} /> Employer Recruiter Portal
            </Link>

            <Link
              to="/login"
              className="btn-outline-blue"
              style={{ fontSize: '15px', padding: '12px 24px' }}
            >
              <Lock size={16} /> Sign In
            </Link>
          </div>

          {/* Technical Trust Strip */}
          <div
            style={{
              display: 'inline-flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              fontSize: '13px',
              color: 'var(--text-muted)',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '20px',
              width: '100%',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="var(--brand-blue)" /> PostgreSQL 15+ & pgvector
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="var(--brand-purple)" /> Google Gemini 3.5 Flash Lite
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="var(--status-success)" /> LangGraph Stateful Flows
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          CHOOSE YOUR DESTINATION PORTAL (Gateway Cards)
          ========================================================================= */}
      <div id="portal-access">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <span className="badge-pill badge-blue" style={{ fontSize: '12px' }}>
              <Layers size={13} /> Dedicated Station Hubs
            </span>
          </div>
          <h2 style={{ fontSize: '28px', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
            Choose Your Destination Portal
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', margin: 0, maxWidth: '640px', marginInline: 'auto' }}>
            Campus2Corporate connects the entire career ecosystem. Select your dedicated workspace below to begin.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Card 1: Student Candidate */}
          <div
            className="glass-panel"
            style={{
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              borderTop: '4px solid var(--brand-blue)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(10, 102, 194, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--brand-blue)',
                  }}
                >
                  <GraduationCap size={26} />
                </div>
                <span className="badge-pill badge-blue" style={{ fontSize: '11px' }}>
                  Student Workspace
                </span>
              </div>

              <h3 style={{ fontSize: '20px', margin: '0 0 8px 0', color: 'var(--text-main)' }}>
                Student Candidate Portal
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.5, marginBottom: '18px' }}>
                Benchmark your readiness score, scan resumes against AI ATS filters, practice in live voice mock interviews, and resolve skill gaps with tailored courses.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <CheckCircle2 size={15} color="var(--brand-blue)" /> 7-Component Employability Readiness Score
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <CheckCircle2 size={15} color="var(--brand-blue)" /> Real-Time Gemini AI ATS Resume Scanner
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--brand-blue)"' }}>
                  <CheckCircle2 size={15} color="var(--brand-blue)" /> Adaptive Voice Technical Interview Studio
                </div>
              </div>
            </div>

            <Link
              to="/student/dashboard"
              onClick={() => setRole('STUDENT')}
              className="btn-primary"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '11px',
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              <span>Enter Student Portal</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Card 2: Corporate Recruiter */}
          <div
            className="glass-panel"
            style={{
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              borderTop: '4px solid var(--brand-purple)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(86, 36, 208, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--brand-purple)',
                  }}
                >
                  <Briefcase size={26} />
                </div>
                <span className="badge-pill badge-purple" style={{ fontSize: '11px' }}>
                  Recruiter Workspace
                </span>
              </div>

              <h3 style={{ fontSize: '20px', margin: '0 0 8px 0', color: 'var(--text-main)' }}>
                Corporate Recruiter Portal
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.5, marginBottom: '18px' }}>
                Publish job requisitions with precision skill weighting (1.0 to 3.0), screen candidate pipelines with AI match scores, and track hiring stages on a Kanban board.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <CheckCircle2 size={15} color="var(--brand-purple)" /> Weighted Skill Requisition Builder
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--brand-purple)' }}>
                  <CheckCircle2 size={15} color="var(--brand-purple)" /> Automated AI Candidate Ranking & ATS Scores
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--brand-purple)' }}>
                  <CheckCircle2 size={15} color="var(--brand-purple)" /> Interactive Drag-and-Drop Hiring Kanban
                </div>
              </div>
            </div>

            <Link
              to="/recruiter/dashboard"
              onClick={() => setRole('RECRUITER')}
              className="btn-purple"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '11px',
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              <span>Enter Recruiter Portal</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Card 3: Institutional Administrator */}
          <div
            className="glass-panel"
            style={{
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              borderTop: '4px solid #0f172a',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(15, 23, 42, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0f172a',
                  }}
                >
                  <ShieldCheck size={26} />
                </div>
                <span className="badge-pill" style={{ fontSize: '11px', backgroundColor: 'rgba(15, 23, 42, 0.08)', color: '#0f172a' }}>
                  Admin Console
                </span>
              </div>

              <h3 style={{ fontSize: '20px', margin: '0 0 8px 0', color: 'var(--text-main)' }}>
                Institutional Admin Console
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.5, marginBottom: '18px' }}>
                Monitor campus-wide employability telemetry, manage verified internal courses, audit skill taxonomies, and coordinate academic accreditation.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <CheckCircle2 size={15} color="var(--brand-blue)" /> Real-Time Employability & Hiring Telemetry
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <CheckCircle2 size={15} color="var(--brand-blue)" /> Dual-Source Course Catalog & Video Uploads
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <CheckCircle2 size={15} color="var(--brand-blue)" /> O*NET / ESCO Industry Skills Taxonomy Curator
                </div>
              </div>
            </div>

            <Link
              to="/admin/dashboard"
              onClick={() => setRole('ADMIN')}
              className="btn-secondary"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '11px',
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              <span>Enter Admin Console</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE WORKBENCH STATIONS (4 Tabs)
          ========================================================================= */}
      <div>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '24px', margin: 0 }}>Interactive Platform Capabilities</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Explore how Campus2Corporate powers your employability lifecycle
            </p>
          </div>
        </div>

        {/* Tab Switcher Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '16px' }}>
          <button
            onClick={() => setActiveStation('ATS')}
            className={activeStation === 'ATS' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '13px', padding: '8px 18px' }}
          >
            <FileText size={15} /> 1. Resume ATS Diagnostic Desk
          </button>
          <button
            onClick={() => setActiveStation('INTERVIEW')}
            className={activeStation === 'INTERVIEW' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '13px', padding: '8px 18px' }}
          >
            <Mic size={15} /> 2. Adaptive Voice Mock Studio
          </button>
          <button
            onClick={() => setActiveStation('ROADMAP')}
            className={activeStation === 'ROADMAP' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '13px', padding: '8px 18px' }}
          >
            <Compass size={15} /> 3. Benchmark Compass & Roadmap
          </button>
          <button
            onClick={() => setActiveStation('RECRUITER')}
            className={activeStation === 'RECRUITER' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '13px', padding: '8px 18px' }}
          >
            <Layers size={15} /> 4. Recruiter ATS Matchmaker
          </button>
        </div>

        {/* Station Card Preview */}
        <div className="modern-card" style={{ padding: '32px' }}>
          {activeStation === 'ATS' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'center' }}>
              <div>
                <span className="badge-pill badge-success" style={{ marginBottom: '10px' }}>
                  ✓ 92% ATS Caliber Verified
                </span>
                <h3 style={{ fontSize: '24px', margin: '8px 0' }}>Semantic Resume Intelligence</h3>
                <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '20px' }}>
                  Deposit your PDF or DOCX dossier into private Supabase Storage. Text is extracted in-memory and parsed into structured vector embeddings, matching skills against real corporate requirements.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                  <div style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="var(--status-success)" />
                    <span>Quantified impact metric validation (concurrency, query latency)</span>
                  </div>
                  <div style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="var(--status-success)" />
                    <span>Missing skill clouds benchmarked against live market vacancies</span>
                  </div>
                </div>

                <Link to="/student/resume-scanner" className="btn-primary">
                  Launch Diagnostic Scanner <ArrowRight size={15} />
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--bg-subtle)', padding: '28px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                <AnalogGauge value={92} title="ATS Caliber" subtitle="Evaluated for Distributed Backend Roles" />
                <div style={{ marginTop: '16px', display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <span className="badge-pill badge-success">✓ Python (Expert)</span>
                  <span className="badge-pill badge-success">✓ PostgreSQL (Advanced)</span>
                  <span className="badge-pill badge-blue">Docker (Intermediate)</span>
                </div>
              </div>
            </div>
          )}

          {activeStation === 'INTERVIEW' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'center' }}>
              <div>
                <span className="badge-pill badge-purple" style={{ marginBottom: '10px' }}>
                  ★ Adaptive LangGraph State Machine
                </span>
                <h3 style={{ fontSize: '24px', margin: '8px 0' }}>Voice-Enabled Mock Interview Simulator</h3>
                <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '20px' }}>
                  Experience authentic technical examinations. The AI reads prompts aloud using Web Speech synthesis, captures your audio answers via speech-to-text, and adapts questions dynamically.
                </p>

                <div style={{ background: 'var(--brand-purple-light)', borderLeft: '4px solid var(--brand-purple)', padding: '14px', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-purple)', textTransform: 'uppercase' }}>Sample Question:</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '2px', color: 'var(--text-main)' }}>
                    "How do you prevent duplicate transaction executions and race conditions in a distributed payment system?"
                  </div>
                </div>

                <Link to="/student/interviews" className="btn-purple">
                  Enter Mock Studio <ArrowRight size={15} />
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--bg-subtle)', padding: '28px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                <AnalogGauge value={91} title="Session Depth" subtitle="Graded on Distributed Consensus" variant="purple" />
                <div style={{ marginTop: '14px', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
                  Verdict: <strong style={{ color: 'var(--status-success)' }}>STRONG HIRE</strong> • Clarity: 93% • Depth: 90%
                </div>
              </div>
            </div>
          )}

          {activeStation === 'ROADMAP' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'center' }}>
              <div>
                <span className="badge-pill badge-blue" style={{ marginBottom: '10px' }}>
                  🧭 10 Tech Career Benchmarks
                </span>
                <h3 style={{ fontSize: '24px', margin: '8px 0' }}>Career Compass & Milestone Roadmaps</h3>
                <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '20px' }}>
                  Select from 10 corporate career benchmarks. Our LangGraph workflow analyzes your recorded skills against market demands and generates adaptive 3-month or 6-month actionable milestone timelines.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                  <div style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="var(--brand-blue)" />
                    <span>Month 1: Storage Layer & Relational Hardening</span>
                  </div>
                  <div style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="var(--brand-blue)" />
                    <span>Month 2: Containerization & Cloud Fleet Orchestration</span>
                  </div>
                </div>

                <Link to="/student/career-planner/roadmap" className="btn-primary">
                  Synthesize AI Roadmap <ArrowRight size={15} />
                </Link>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Calibrated Tech Pathways</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['Distributed Backend', 'Cloud Architect', 'DevOps & SRE', 'Machine Learning', 'Full Stack Systems', 'Security Analyst', 'Data Engineer'].map((t) => (
                    <span key={t} className="badge-pill badge-gray" style={{ fontSize: '12px' }}>
                      ★ {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeStation === 'RECRUITER' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'center' }}>
              <div>
                <span className="badge-pill badge-success" style={{ marginBottom: '10px' }}>
                  💼 Recruiter ATS Suite
                </span>
                <h3 style={{ fontSize: '24px', margin: '8px 0' }}>Weighted ATS Candidate Matchmaker</h3>
                <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '20px' }}>
                  Recruiters post positions with weighted skill criteria (1.0 to 3.0) and required proficiencies. Candidates are ranked in an ATS Kanban with instant match score breakdowns and stage transition controls.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                  <div style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="var(--status-success)" />
                    <span>5-Stage ATS Pipeline: Applied ➔ Reviewing ➔ Interview ➔ Offer ➔ Appointed</span>
                  </div>
                  <div style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="var(--status-success)" />
                    <span>Verified skill checks with candidate score breakdown modals</span>
                  </div>
                </div>

                <Link to="/recruiter/dashboard" className="btn-primary">
                  Enter Recruiter Desk <ArrowRight size={15} />
                </Link>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px' }}>
                  CANDIDATE ATS MATCH KANBAN
                </div>
                <div className="modern-card" style={{ padding: '14px', borderLeft: '4px solid var(--brand-blue)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>Alexandria Vance</strong>
                    <span className="badge-pill badge-success">91% MATCH</span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Staff Distributed Systems Engineer
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          FEATURED COURSES HUB (UDEMY STYLE CARDS)
          ========================================================================= */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '24px', margin: 0 }}>Featured Career Readiness Courses</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Handpicked curriculum modules targeting the most critical industry skill gaps
            </p>
          </div>
          <Link to="/student/courses" className="btn-outline-blue" style={{ fontSize: '13px' }}>
            Browse All Courses <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {PLATFORM_COURSES.map((crs) => (
            <div key={crs.id} className="modern-card hoverable" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <span className="badge-pill badge-purple" style={{ fontSize: '11px' }}>
                    {crs.difficulty}
                  </span>
                  <div className="rating-stars">
                    <Star size={14} fill="var(--star-gold)" />
                    <span>{crs.rating || 4.9}</span>
                  </div>
                </div>

                <h3 style={{ fontSize: '17px', margin: '4px 0 8px 0', lineHeight: 1.35 }}>
                  {crs.title}
                </h3>

                <p style={{ fontSize: '13px', color: 'var(--text-body)', lineHeight: 1.5, marginBottom: '14px' }}>
                  {crs.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} /> {crs.duration_hours} Hours
                  </span>
                  <span>• {crs.provider}</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: '16px', color: 'var(--brand-purple)' }}>
                  {crs.price || 'Free'}
                </span>
                <Link to="/student/courses" className="btn-primary" style={{ fontSize: '12px', padding: '6px 14px' }}>
                  Enroll Course
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          PLATFORM EMPLOYABILITY TELEMETRY
          ========================================================================= */}
      <div className="modern-card" style={{ padding: '36px 32px', background: 'var(--bg-glass-card)' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '24px', margin: '0 0 6px 0' }}>Certified Platform Employability Telemetry</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
            Real metrics aggregated across partner universities and corporate hiring teams
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', textAlign: 'center' }}>
          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>VERIFIED CANDIDATES</div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--brand-blue)', margin: '6px 0' }}>1,248</div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Across 14 Universities</span>
          </div>

          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>ENTERPRISE RECRUITERS</div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--brand-purple)', margin: '6px 0' }}>86</div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Actively Hiring Roles</span>
          </div>

          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>OFFER APPOINTMENT RATE</div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--status-success)', margin: '6px 0' }}>94.2%</div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Verified Acceptance</span>
          </div>

          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>CAREER BENCHMARKS</div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-main)', margin: '6px 0' }}>10</div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Core Tech Tracks</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TESTIMONIALS (LinkedIn Endorsement Style)
          ========================================================================= */}
      <div>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', margin: '0 0 6px 0' }}>Endorsed by Engineering Leaders</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
            What university deans, hiring directors, and appointed students say
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <div className="modern-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-body)', fontStyle: 'italic', marginBottom: '16px' }}>
              "Campus2Corporate gave our graduating seniors an unfair advantage. The realistic mock interview simulations on concurrency and the ATS diagnostic transformed their confidence."
            </p>
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--brand-blue-light)', color: 'var(--brand-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                TS
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>Dr. Thaddeus Sterling</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Dean of Computer Science</div>
              </div>
            </div>
          </div>

          <div className="modern-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-body)', fontStyle: 'italic', marginBottom: '16px' }}>
              "The weighted ATS skill criteria builder eliminated 90% of resume noise. When candidate profiles reach our Kanban with 90%+ match scores, we know they can write production code on Day 1."
            </p>
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--brand-purple-light)', color: 'var(--brand-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                EV
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>Eleanor Vance-Croft</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>VP of Talent, Vanguard Systems</div>
              </div>
            </div>
          </div>

          <div className="modern-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-body)', fontStyle: 'italic', marginBottom: '16px' }}>
              "I followed the 3-Month AI Roadmap generated for Distributed Backend Engineer. The Redis locking module in the Course Hub directly mirrored the exact questions asked in my final offer panel."
            </p>
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--status-success-bg)', color: 'var(--status-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                MC
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>Marcus Chen</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Distributed Systems Engineer @ Aether Cloud</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          FAQ ACCORDION (Modern Light Theme)
          ========================================================================= */}
      <div className="modern-card" style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '22px', margin: '0 0 16px 0' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              style={{
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-subtle)',
                overflow: 'hidden',
              }}
            >
              <div
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                style={{
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '15px',
                  color: 'var(--text-main)',
                }}
              >
                <span>{faq.q}</span>
                {expandedFaq === idx ? <ChevronUp size={18} color="var(--brand-blue)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
              </div>

              {expandedFaq === idx && (
                <div
                  style={{
                    padding: '0 16px 16px 16px',
                    fontSize: '14px',
                    color: 'var(--text-body)',
                    lineHeight: 1.6,
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '12px',
                    backgroundColor: 'var(--bg-glass-card)',
                  }}
                >
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          BOTTOM CTA (Modern Banner, Light Theme)
          ========================================================================= */}
      <div
        className="modern-card"
        style={{
          padding: '48px 36px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, var(--brand-blue-light) 0%, var(--brand-purple-light) 100%)',
          border: '1px solid var(--brand-blue-border)',
        }}
      >
        <h2 style={{ fontSize: '32px', margin: '0 0 12px 0', color: 'var(--text-main)' }}>
          Start Your Employability Journey Today
        </h2>
        <p style={{ maxWidth: '620px', margin: '0 auto 24px auto', fontSize: '16px', color: 'var(--text-body)', lineHeight: 1.6 }}>
          Join thousands of university candidates achieving offer readiness. No arbitrary gates—benchmark your engineering abilities directly against corporate expectations.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <Link
            to="/register"
            className="btn-primary"
            style={{ fontSize: '15px', padding: '12px 28px' }}
          >
            Create Free Student Account <ArrowRight size={16} />
          </Link>
          <Link
            to="/login"
            className="btn-secondary"
            style={{ fontSize: '15px', padding: '12px 24px' }}
          >
            Sign In to Existing Dossier
          </Link>
        </div>
      </div>
    </div>
  );
};
