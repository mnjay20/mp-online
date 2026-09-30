import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface LoadingScreenProps {
  onComplete?: () => void;
  minDuration?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  onComplete, 
  minDuration = 2000 
}) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Employability Neural Engine...');
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const steps = [
      { at: 20, text: 'Connecting to Supabase PostgreSQL & pgvector...' },
      { at: 45, text: 'Calibrating Google Gemini 3.5 Flash Lite Models...' },
      { at: 70, text: 'Loading Authoritative Tech Career Benchmarks...' },
      { at: 90, text: 'Synchronizing Employability Portals...' },
      { at: 100, text: 'Ready! Launching Campus2Corporate...' },
    ];

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.floor((elapsed / minDuration) * 100));
      setProgress(currentProgress);

      const matchingStep = [...steps].reverse().find((s) => currentProgress >= s.at);
      if (matchingStep) {
        setStatusText(matchingStep.text);
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 400);
        }, 300);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [minDuration, onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        backgroundImage: `
          radial-gradient(circle at 50% 35%, rgba(86, 36, 208, 0.15) 0%, transparent 60%),
          radial-gradient(circle at 20% 80%, rgba(10, 102, 194, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(14, 165, 233, 0.12) 0%, transparent 50%),
          linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)
        `,
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.4s ease-out',
        pointerEvents: fadeOut ? 'none' : 'auto',
      }}
    >
      {/* Animated Glowing Orbital Rings & Logo */}
      <div
        style={{
          position: 'relative',
          width: '140px',
          height: '140px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '32px',
        }}
      >
        {/* Outer Pulsing Glow */}
        <div
          style={{
            position: 'absolute',
            width: '130px',
            height: '130px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(86, 36, 208, 0.35) 0%, transparent 70%)',
            animation: 'pulseGlow 2s infinite ease-in-out',
          }}
        />

        {/* Spinning Orbital Gradient Ring */}
        <div
          style={{
            position: 'absolute',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: 'var(--brand-blue)',
            borderRightColor: 'var(--brand-purple)',
            animation: 'spinRing 1.5s infinite linear',
          }}
        />

        {/* Counter-Spinning Secondary Ring */}
        <div
          style={{
            position: 'absolute',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            border: '2px dashed rgba(124, 58, 237, 0.4)',
            animation: 'spinRingReverse 3s infinite linear',
          }}
        />

        {/* Center Logo Badge */}
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, var(--brand-blue) 0%, var(--brand-purple) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '26px',
            fontFamily: 'var(--font-heading)',
            boxShadow: '0 8px 24px rgba(86, 36, 208, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.5)',
            border: '2px solid rgba(255, 255, 255, 0.8)',
            zIndex: 2,
            animation: 'badgeFloat 2s infinite ease-in-out',
          }}
        >
          C2C
        </div>
      </div>

      {/* Brand Title */}
      <div
        style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 800,
          fontSize: '26px',
          color: 'var(--text-main)',
          letterSpacing: '-0.02em',
          marginBottom: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span>Campus</span>
        <span style={{ color: 'var(--brand-blue)' }}>2</span>
        <span style={{ color: 'var(--brand-purple)' }}>Corporate</span>
      </div>

      <div
        style={{
          fontSize: '13px',
          color: 'var(--text-muted)',
          marginBottom: '28px',
          fontFamily: 'var(--font-body)',
        }}
      >
        AI Career Readiness & Employability Intelligence
      </div>

      {/* Progress Bar Container */}
      <div
        style={{
          width: '320px',
          height: '6px',
          backgroundColor: 'rgba(226, 232, 240, 0.8)',
          borderRadius: '9999px',
          overflow: 'hidden',
          marginBottom: '14px',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--brand-blue) 0%, var(--brand-purple) 100%)',
            borderRadius: '9999px',
            transition: 'width 0.1s linear',
            boxShadow: '0 0 10px rgba(86, 36, 208, 0.5)',
          }}
        />
      </div>

      {/* Live Status Text & Percentage */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '320px',
          fontSize: '12px',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <span>{statusText}</span>
        <span style={{ fontWeight: 700, color: 'var(--brand-purple)' }}>{progress}%</span>
      </div>

      <style>{`
        @keyframes spinRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spinRingReverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.15); opacity: 0.9; }
        }
        @keyframes badgeFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
};
