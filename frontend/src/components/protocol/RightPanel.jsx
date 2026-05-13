import React from 'react';

function fmt(sec) {
  const s = Number.isFinite(sec) ? Math.max(0, sec) : 0;
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

function CircularMeter({ value = 0 }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const safeValue = Math.min(1, Math.max(0, value));
  const filled = circ * safeValue;

  return (
    <div className="rp-meter">
      <svg viewBox="0 0 100 100" className="rp-meter-svg">
        <circle cx="50" cy="50" r={r} className="rp-meter-track" />
        <circle
          cx="50"
          cy="50"
          r={r}
          className="rp-meter-fill"
          strokeDasharray={`${filled} ${circ}`}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="rp-meter-label">
        <span>INTENSITY</span>
        <strong>{Math.round(safeValue * 100)}%</strong>
      </div>
    </div>
  );
}

function AudioBar({ label, value = 0 }) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div className="rp-abar">
      <span className="rp-abar-label">{label}</span>
      <div className="rp-abar-track">
        <div className="rp-abar-fill" style={{ width: `${safeValue}%` }} />
      </div>
      <span className="rp-abar-pct">{safeValue}%</span>
    </div>
  );
}

function MiniWave({ isPlaying }) {
  return (
    <div className="rp-mini-wave" aria-hidden="true">
      {Array.from({ length: 40 }).map((_, i) => (
        <span key={i} className={`rp-mini-bar${isPlaying ? ' rp-mini-bar--on' : ''}`} style={{ '--i': i }} />
      ))}
    </div>
  );
}

export default function RightPanel({ act, track, audio, currentTime = 0, duration = 0, isPlaying }) {
  const bass = Math.round((audio?.bass ?? 0) * 100) || 82;
  const mids = Math.round((audio?.mid ?? 0) * 100) || 64;
  const treble = Math.round((audio?.high ?? 0) * 100) || 71;
  const intensity = audio?.energy || audio?.averageVolume || ((track?.intensity || 78) / 100);
  const title = track?.title || 'BREAK THE CODE';
  const artist = track?.artist || 'CHROMA KEY';
  const album = track?.album || 'RECLAMATION: ACT THREE';
  const emblem = act?.protocolEmblem || act?.emblem || '';
  const accentColor = act?.color || '#ff2a2a';

  return (
    <aside className="rp-root">
      <div className="rp-section">
        <div className="rp-section-hd">
          <span className="rp-section-icon" style={{ color: accentColor }}>O</span>
          <span>TRACK INFO</span>
          <button type="button" className="rp-dots" aria-label="More">...</button>
        </div>
        <h2 className="rp-title" style={{ color: accentColor }}>{title}</h2>
        <dl className="rp-meta">
          <dt>ARTIST</dt><dd>{artist}</dd>
          <dt>ALBUM</dt><dd>{album}</dd>
          <dt>TIME</dt><dd>{fmt(currentTime || 84)} / {fmt(duration || track?.duration || 227)}</dd>
        </dl>
        <MiniWave isPlaying={isPlaying} />
      </div>

      <div className="rp-section rp-section--emblem">
        <div className="rp-section-hd">
          <span className="rp-section-icon" style={{ color: accentColor }}>O</span>
          <span>PROTOCOL EMBLEM</span>
          <button type="button" className="rp-dots" aria-label="More">...</button>
        </div>
        <div className="rp-emblem-wrap">
          {emblem && <img src={emblem} alt="" className="rp-emblem-img" />}
          <div className="rp-emblem-name" style={{ color: accentColor }}>
            CHROMA KEY<br />PROTOCOL
          </div>
          <div className="rp-emblem-tagline">TRUST NONE. VERIFY ALL. ACT THREE</div>
        </div>
      </div>

      <div className="rp-section rp-section--audio">
        <div className="rp-section-hd">
          <span className="rp-section-icon" style={{ color: accentColor }}>O</span>
          <span>AUDIO ANALYSIS</span>
          <button type="button" className="rp-dots" aria-label="More">...</button>
        </div>
        <CircularMeter value={intensity} />
        <AudioBar label="BASS" value={bass} />
        <AudioBar label="MIDS" value={mids} />
        <AudioBar label="TREBLE" value={treble} />
      </div>
    </aside>
  );
}
