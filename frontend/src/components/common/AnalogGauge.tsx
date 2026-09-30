import React from 'react';

interface ModernGaugeProps {
  value: number; // 0 - 100
  title: string;
  size?: number;
  subtitle?: string;
  variant?: 'blue' | 'purple' | 'green';
}

export const AnalogGauge: React.FC<ModernGaugeProps> = ({ 
  value, 
  title, 
  size = 140,
  subtitle,
  variant = 'blue'
}) => {
  const clamped = Math.max(0, Math.min(100, value));
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  const colorConfig = {
    blue: {
      stroke: 'url(#gaugeGradientBlue)',
      text: 'var(--brand-blue)',
      bg: 'var(--brand-blue-light)',
    },
    purple: {
      stroke: 'url(#gaugeGradientPurple)',
      text: 'var(--brand-purple)',
      bg: 'var(--brand-purple-light)',
    },
    green: {
      stroke: '#059669',
      text: '#059669',
      bg: '#ecfdf5',
    },
  };

  const active = colorConfig[variant] || colorConfig.blue;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id="gaugeGradientBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0a66c2" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <linearGradient id="gaugeGradientPurple" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5624d0" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>

          {/* Background Track Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Active Fill Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={clamped >= 80 ? 'url(#gaugeGradientBlue)' : clamped >= 60 ? '#f59e0b' : '#dc2626'}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
          />
        </svg>

        {/* Center Percentage Display */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: size > 120 ? '28px' : '22px',
              color: 'var(--text-main)',
              lineHeight: 1,
            }}
          >
            {clamped}%
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginTop: '4px',
            }}
          >
            {title}
          </span>
        </div>
      </div>

      {subtitle && (
        <span
          style={{
            marginTop: '10px',
            fontSize: '12px',
            color: 'var(--text-muted)',
            fontWeight: 500,
          }}
        >
          {subtitle}
        </span>
      )}
    </div>
  );
};
