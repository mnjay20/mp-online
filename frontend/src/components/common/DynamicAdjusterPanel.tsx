import React from 'react';
import { useDynamicUi, UiTheme, UiDensity, UiFontSize, UiGlassEffect } from '../../services/dynamicUiContext';
import { 
  SlidersHorizontal, 
  Sun, 
  Moon, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  Type, 
  RotateCcw, 
  X, 
  Check, 
  Layers, 
  Smartphone,
  Monitor
} from 'lucide-react';

export const DynamicAdjusterPanel: React.FC = () => {
  const {
    theme,
    setTheme,
    density,
    setDensity,
    fontSize,
    setFontSize,
    glassEffect,
    setGlassEffect,
    isAdjusterOpen,
    setIsAdjusterOpen,
    triggerStartupLoading,
  } = useDynamicUi();

  if (!isAdjusterOpen) {
    return (
      <button
        onClick={() => setIsAdjusterOpen(true)}
        className="glass-panel"
        title="Open Dynamic UI Controls"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '88px', // Adjacent to Copilot floating button
          zIndex: 900,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          borderRadius: 'var(--radius-pill)',
          cursor: 'pointer',
          backgroundColor: 'var(--bg-glass-card)',
          backdropFilter: 'var(--glass-blur)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--shadow-glass-md)',
          color: 'var(--text-main)',
          fontSize: '13px',
          fontWeight: 600,
          transition: 'all 0.2s ease',
        }}
      >
        <SlidersHorizontal size={16} color="var(--brand-blue)" />
        <span className="hide-on-mobile">Adjust UI</span>
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsAdjusterOpen(false);
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '380px',
          maxWidth: '100%',
          height: '100%',
          backgroundColor: 'var(--bg-glass-card)',
          backdropFilter: 'var(--glass-blur)',
          borderLeft: '1px solid var(--glass-border)',
          boxShadow: 'var(--shadow-glass-lg)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
          overflowY: 'auto',
          animation: 'slideInRight 0.25s ease-out',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--brand-blue) 0%, var(--brand-purple) 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SlidersHorizontal size={17} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', margin: 0, color: 'var(--text-main)' }}>Dynamic UI Adjuster</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
                Live adjust theme, density, scaling & glass
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdjusterOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', flex: 1 }}>
          {/* Section 1: Color Theme */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
              Color Theme Mode
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setTheme('light')}
                style={{
                  padding: '10px 8px',
                  borderRadius: 'var(--radius-md)',
                  border: theme === 'light' ? '2px solid var(--brand-blue)' : '1px solid var(--border-subtle)',
                  backgroundColor: theme === 'light' ? 'rgba(10, 102, 194, 0.08)' : 'var(--bg-glass-subtle)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: theme === 'light' ? 700 : 500,
                }}
              >
                <Sun size={18} color="#d97706" />
                <span>Light</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                style={{
                  padding: '10px 8px',
                  borderRadius: 'var(--radius-md)',
                  border: theme === 'dark' ? '2px solid var(--brand-blue)' : '1px solid var(--border-subtle)',
                  backgroundColor: theme === 'dark' ? 'rgba(10, 102, 194, 0.08)' : 'var(--bg-glass-subtle)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: theme === 'dark' ? 700 : 500,
                }}
              >
                <Moon size={18} color="#38bdf8" />
                <span>Dark Glass</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('midnight')}
                style={{
                  padding: '10px 8px',
                  borderRadius: 'var(--radius-md)',
                  border: theme === 'midnight' ? '2px solid var(--brand-purple)' : '1px solid var(--border-subtle)',
                  backgroundColor: theme === 'midnight' ? 'rgba(86, 36, 208, 0.08)' : 'var(--bg-glass-subtle)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: theme === 'midnight' ? 700 : 500,
                }}
              >
                <Sparkles size={18} color="#a855f7" />
                <span>Midnight</span>
              </button>
            </div>
          </div>

          {/* Section 2: UI Density */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
              Information Density
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setDensity('compact')}
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-md)',
                  border: density === 'compact' ? '2px solid var(--brand-blue)' : '1px solid var(--border-subtle)',
                  backgroundColor: density === 'compact' ? 'rgba(10, 102, 194, 0.08)' : 'var(--bg-glass-subtle)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: density === 'compact' ? 700 : 500,
                }}
              >
                Compact
              </button>

              <button
                type="button"
                onClick={() => setDensity('normal')}
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-md)',
                  border: density === 'normal' ? '2px solid var(--brand-blue)' : '1px solid var(--border-subtle)',
                  backgroundColor: density === 'normal' ? 'rgba(10, 102, 194, 0.08)' : 'var(--bg-glass-subtle)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: density === 'normal' ? 700 : 500,
                }}
              >
                Default
              </button>

              <button
                type="button"
                onClick={() => setDensity('spacious')}
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-md)',
                  border: density === 'spacious' ? '2px solid var(--brand-blue)' : '1px solid var(--border-subtle)',
                  backgroundColor: density === 'spacious' ? 'rgba(10, 102, 194, 0.08)' : 'var(--bg-glass-subtle)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: density === 'spacious' ? 700 : 500,
                }}
              >
                Spacious
              </button>
            </div>
          </div>

          {/* Section 3: Font Scaling */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
              Font Scale / Text Legibility
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setFontSize('sm')}
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-md)',
                  border: fontSize === 'sm' ? '2px solid var(--brand-blue)' : '1px solid var(--border-subtle)',
                  backgroundColor: fontSize === 'sm' ? 'rgba(10, 102, 194, 0.08)' : 'var(--bg-glass-subtle)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: fontSize === 'sm' ? 700 : 500,
                }}
              >
                Small (90%)
              </button>

              <button
                type="button"
                onClick={() => setFontSize('md')}
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-md)',
                  border: fontSize === 'md' ? '2px solid var(--brand-blue)' : '1px solid var(--border-subtle)',
                  backgroundColor: fontSize === 'md' ? 'rgba(10, 102, 194, 0.08)' : 'var(--bg-glass-subtle)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: fontSize === 'md' ? 700 : 500,
                }}
              >
                Default
              </button>

              <button
                type="button"
                onClick={() => setFontSize('lg')}
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-md)',
                  border: fontSize === 'lg' ? '2px solid var(--brand-blue)' : '1px solid var(--border-subtle)',
                  backgroundColor: fontSize === 'lg' ? 'rgba(10, 102, 194, 0.08)' : 'var(--bg-glass-subtle)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: fontSize === 'lg' ? 700 : 500,
                }}
              >
                Large (110%)
              </button>
            </div>
          </div>

          {/* Section 4: Glassmorphic Refraction */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
              Glassmorphism & Transparency
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setGlassEffect('full')}
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-md)',
                  border: glassEffect === 'full' ? '2px solid var(--brand-blue)' : '1px solid var(--border-subtle)',
                  backgroundColor: glassEffect === 'full' ? 'rgba(10, 102, 194, 0.08)' : 'var(--bg-glass-subtle)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: glassEffect === 'full' ? 700 : 500,
                }}
              >
                Frost (16px)
              </button>

              <button
                type="button"
                onClick={() => setGlassEffect('subtle')}
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-md)',
                  border: glassEffect === 'subtle' ? '2px solid var(--brand-blue)' : '1px solid var(--border-subtle)',
                  backgroundColor: glassEffect === 'subtle' ? 'rgba(10, 102, 194, 0.08)' : 'var(--bg-glass-subtle)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: glassEffect === 'subtle' ? 700 : 500,
                }}
              >
                Subtle (6px)
              </button>

              <button
                type="button"
                onClick={() => setGlassEffect('flat')}
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-md)',
                  border: glassEffect === 'flat' ? '2px solid var(--brand-blue)' : '1px solid var(--border-subtle)',
                  backgroundColor: glassEffect === 'flat' ? 'rgba(10, 102, 194, 0.08)' : 'var(--bg-glass-subtle)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: glassEffect === 'flat' ? 700 : 500,
                }}
              >
                Solid Flat
              </button>
            </div>
          </div>

          {/* Section 5: Replay Startup Animation */}
          <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
              Startup Animation
            </label>
            <button
              type="button"
              onClick={() => {
                setIsAdjusterOpen(false);
                triggerStartupLoading();
              }}
              className="btn-secondary"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '9px',
                fontSize: '13px',
              }}
            >
              <RotateCcw size={15} />
              <span>Replay Startup Loading Animation</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
          Changes apply dynamically across all portals and persist in browser storage.
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
