import React from 'react';
import { CheckCircle2, ShieldCheck, Star } from 'lucide-react';

export const BrassPlaque: React.FC<{
  title: string;
  subtitle?: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ title, subtitle, className = '', style }) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '6px 14px',
        backgroundColor: 'var(--brand-blue-light)',
        border: '1px solid var(--brand-blue-border)',
        borderRadius: 'var(--radius-md)',
        ...style,
      }}
      className={className}
    >
      <span
        style={{
          fontSize: '13px',
          fontWeight: 700,
          color: 'var(--brand-blue)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          fontFamily: 'var(--font-heading)',
        }}
      >
        {title}
      </span>
      {subtitle && (
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
          {subtitle}
        </span>
      )}
    </div>
  );
};

export const WaxSeal: React.FC<{
  letter?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  title?: string;
}> = ({ letter = 'C2C', size = 'md', className = '', title }) => {
  const sizeMap = {
    sm: { width: '32px', height: '32px', fontSize: '11px' },
    md: { width: '42px', height: '42px', fontSize: '14px' },
    lg: { width: '56px', height: '56px', fontSize: '18px' },
  };

  const current = sizeMap[size] || sizeMap.md;

  return (
    <div
      title={title}
      style={{
        width: current.width,
        height: current.height,
        borderRadius: 'var(--radius-md)',
        background: 'linear-gradient(135deg, var(--brand-blue) 0%, var(--brand-purple) 100%)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: current.fontSize,
        fontFamily: 'var(--font-heading)',
        boxShadow: '0 4px 10px rgba(10, 102, 194, 0.25)',
        flexShrink: 0,
      }}
      className={className}
    >
      <span>{letter}</span>
    </div>
  );
};

export const RubberStamp: React.FC<{
  label: string;
  variant?: 'crimson' | 'verified' | 'navy' | 'gold';
  rotate?: number;
  className?: string;
}> = ({ label, variant = 'verified', className = '' }) => {
  const styles = {
    verified: { bg: 'var(--status-success-bg)', text: 'var(--status-success)', border: 'var(--status-success-border)' },
    crimson: { bg: 'var(--status-danger-bg)', text: 'var(--status-danger)', border: 'var(--status-danger-border)' },
    navy: { bg: 'var(--brand-blue-light)', text: 'var(--brand-blue)', border: 'var(--brand-blue-border)' },
    gold: { bg: 'var(--status-warning-bg)', text: 'var(--status-warning)', border: 'var(--status-warning-border)' },
  };

  const active = styles[variant] || styles.verified;

  return (
    <span
      className={`badge-pill ${className}`}
      style={{
        backgroundColor: active.bg,
        color: active.text,
        border: `1px solid ${active.border}`,
        fontSize: '11px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.02em',
      }}
    >
      {variant === 'verified' && <CheckCircle2 size={12} />}
      {label}
    </span>
  );
};

export const PaperCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  stitched?: boolean;
  ruled?: boolean;
  hoverable?: boolean;
  onClick?: () => void;
}> = ({
  children,
  className = '',
  style,
  hoverable = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`modern-card ${hoverable ? 'hoverable' : ''} ${className}`}
      style={{
        padding: '24px',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
