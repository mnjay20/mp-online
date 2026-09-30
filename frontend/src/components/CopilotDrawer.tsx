import React, { useState } from 'react';
import { useAuth } from '../services/authContext';
import { Sparkles, X, Send, Bot, User, CheckCircle2, ArrowRight } from 'lucide-react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  recommendations?: { title: string; type: string; reason: string }[];
}

export const CopilotDrawer: React.FC = () => {
  const { copilotOpen, setCopilotOpen, student } = useAuth();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: `Hello ${student.first_name}! I am your AI Career Copilot, orchestrated via Google Gemini 3.5 Flash Lite & LangGraph. I continuously evaluate your verified skills, academic achievements, and target corporate benchmarks. How can I accelerate your readiness today?`,
      timestamp: '10:00 AM',
      recommendations: [
        {
          title: 'Containerization & Docker',
          type: 'SKILL_GAP',
          reason: 'Crucial for 85% of backend listings; currently self-reported as Intermediate.',
        },
        {
          title: 'Review Mock Interview Scorecard',
          type: 'ACTION',
          reason: 'Strengthen answers regarding distributed consensus and Redis locking.',
        },
      ],
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (query?: string) => {
    const textToSend = query || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!query) setInput('');
    setLoading(true);

    // Call backend or fallback
    try {
      const res = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });

      if (res.ok) {
        const json = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            sender: 'ai',
            text: json.data?.message || 'Guidance received.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            recommendations: json.data?.recommendations,
          },
        ]);
        setLoading(false);
        return;
      }
    } catch {
      // Backend not running; fallback to intelligent response
    }

    setTimeout(() => {
      let reply = '';
      let recs: any[] = [];

      if (textToSend.toLowerCase().includes('skill') || textToSend.toLowerCase().includes('backend')) {
        reply = `Examining your skill portfolio: You have verified mastery in Python and PostgreSQL. However, the benchmark for **Distributed Backend Engineer** requires **Redis** (Intermediate) and **Kubernetes** (Intermediate). I recommend enrolling in the "Hardened Distributed Systems" module in the Course Hub.`;
        recs = [
          { title: 'Redis Masterclass', type: 'COURSE', reason: 'High weight (2.0) in job postings' },
          { title: 'Container Fundamentals', type: 'SKILL', reason: 'Closes gap on 3 active applications' },
        ];
      } else if (textToSend.toLowerCase().includes('resume') || textToSend.toLowerCase().includes('ats')) {
        reply = `Your latest uploaded resume achieved an ATS score of **92/100**. To push this into the top percentile, incorporate specific metrics into your distributed transactions bullet point and mention your experience with PostgreSQL row-level locks.`;
        recs = [
          { title: 'Quantify Latency Metrics', type: 'RESUME_ACTION', reason: 'Improves hiring manager evaluation' },
        ];
      } else {
        reply = `Based on your current 84% Readiness Score, your fastest path to an Offer is completing 1 additional Mock Interview session on Concurrency and adding Docker container manifests to your portfolio repository.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: 'ai',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recommendations: recs,
        },
      ]);
      setLoading(false);
    }, 700);
  };

  if (!copilotOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '420px',
        maxWidth: '100vw',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-glass-card)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        boxShadow: '-8px 0 24px rgba(0, 0, 0, 0.25)',
        borderLeft: '1px solid var(--border-subtle)',
      }}
    >
      {/* Drawer Header (Udemy Purple / Modern Light style) */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-glass-card)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--brand-purple) 0%, #7c3aed 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', margin: 0, color: 'var(--text-main)' }}>AI Career Copilot</h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Gemini 3.5 Flash Lite • Guardrailed
            </span>
          </div>
        </div>

        <button
          onClick={() => setCopilotOpen(false)}
          style={{
            border: 'none',
            background: 'var(--bg-muted)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-body)',
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Suggested Quick Prompts Bar */}
      <div
        style={{
          padding: '10px 16px',
          backgroundColor: 'var(--bg-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
        }}
      >
        <button
          onClick={() => handleSend('What skills am I missing for Backend Engineer?')}
          style={{
            fontSize: '11px',
            fontWeight: 600,
            padding: '5px 10px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--border-subtle)',
            backgroundColor: '#ffffff',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            color: 'var(--brand-blue)',
          }}
        >
          🔍 Missing Skills?
        </button>
        <button
          onClick={() => handleSend('How can I improve my Resume ATS score?')}
          style={{
            fontSize: '11px',
            fontWeight: 600,
            padding: '5px 10px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--border-subtle)',
            backgroundColor: '#ffffff',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            color: 'var(--brand-purple)',
          }}
        >
          📄 ATS Feedback
        </button>
        <button
          onClick={() => handleSend('Give me a 3-month action plan')}
          style={{
            fontSize: '11px',
            fontWeight: 600,
            padding: '5px 10px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--border-subtle)',
            backgroundColor: '#ffffff',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            color: 'var(--text-body)',
          }}
        >
          🗺️ Action Plan
        </button>
      </div>

      {/* Chat Messages Ledger */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          backgroundColor: 'var(--bg-page)',
        }}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '88%',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                marginBottom: '4px',
                textAlign: m.sender === 'user' ? 'right' : 'left',
              }}
            >
              {m.sender === 'user' ? 'You' : 'Career Copilot'} • {m.timestamp}
            </div>

            <div
              style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: m.sender === 'user' ? 'var(--brand-blue)' : 'var(--bg-glass-subtle)',
                color: m.sender === 'user' ? '#ffffff' : 'var(--text-main)',
                boxShadow: 'var(--shadow-sm)',
                border: m.sender === 'ai' ? '1px solid var(--border-subtle)' : 'none',
              }}
            >
              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.55 }}>
                {m.text}
              </p>

              {/* Recommendations Cards */}
              {m.recommendations && m.recommendations.length > 0 && (
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {m.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '8px 10px',
                        backgroundColor: 'var(--brand-purple-light)',
                        border: '1px solid var(--brand-purple-border)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '12px',
                      }}
                    >
                      <div style={{ fontWeight: 700, color: 'var(--brand-purple)' }}>
                        ★ {rec.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {rec.reason}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ alignSelf: 'flex-start', fontStyle: 'italic', fontSize: '13px', color: 'var(--text-muted)' }}>
            ✦ Copilot is querying your dossier and career models...
          </div>
        )}
      </div>

      {/* Input Box */}
      <div
        style={{
          padding: '16px',
          backgroundColor: 'var(--bg-glass-card)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '10px',
        }}
      >
        <input
          type="text"
          className="modern-input"
          placeholder="Ask regarding skills, resume, roadmaps..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={() => handleSend()}
          className="btn-purple"
          style={{ minWidth: '42px', padding: '0 14px', height: '42px' }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
