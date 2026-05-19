import React from 'react';

const ACT_THEMES = {
  earth: { color: '#4a7c4e', glow: '#2d5a30' },
  water: { color: '#1a6b8a', glow: '#0d4a6b' },
  fire:  { color: '#ff3a1a', glow: '#cc1a00' },
  air:   { color: '#8a6bcc', glow: '#5a3aaa' },
};

export default function ElementalBackground({ act = 'earth', audioLevel = 0 }) {
  const theme = ACT_THEMES[act] || ACT_THEMES.earth;
  const pulse = Math.min(1, 0.15 + audioLevel * 0.5);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        background: '#0a0a0f',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 40%, ${theme.color}${Math.round(pulse * 255).toString(16).padStart(2, '0')} 0%, transparent 65%)`,
          transition: 'background 0.8s ease',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.7) 100%)',
        }}
      />
    </div>
  );
}
