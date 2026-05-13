import './Visualizer.css';
import '../protocol/Protocol.css';
import ChromaVisualizer from './ChromaVisualizer';
import LyricsEngine from '../lyrics/LyricsEngine';
import LeftPanel from '../protocol/LeftPanel';
import RightPanel from '../protocol/RightPanel';
import { getVisualizerAct } from './visualizerAssets';
import {
  Camera,
  Cpu,
  Gauge,
  Maximize2,
  ScanLine,
  Settings,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';

const makeSpectrumBars = (audioData, count, offset = 0) => {
  const frequencyData = audioData?.frequencyData || [];

  return Array.from({ length: count }).map((_, index) => {
    const sampleIndex = frequencyData.length
      ? Math.min(frequencyData.length - 1, Math.floor(((index + offset) / count) * frequencyData.length))
      : 0;
    const sample = frequencyData.length ? frequencyData[sampleIndex] / 255 : 0;
    const idle = 0.18 + (((index * 17 + offset * 11) % 100) / 100) * 0.48;
    return Math.max(0.12, Math.min(1, sample || idle));
  });
};

const controlTiles = [
  { label: 'Visual Mode', value: 'Cinematic', Icon: ScanLine },
  { label: 'Reactive Level', value: 'High', Icon: Gauge },
  { label: 'Particles', value: 'Enabled', Icon: Cpu },
  { label: 'Light React', value: 'Enabled', Icon: Sparkles },
  { label: 'Camera FX', value: 'Subtle', Icon: Camera },
  { label: 'Theme', value: 'Red Protocol', Icon: SlidersHorizontal },
];

function HudActions() {
  return (
    <div className="viz-hud-actions" aria-label="Visualizer tools">
      <button type="button" className="viz-hud-action" aria-label="Toggle fit">
        <SlidersHorizontal size={15} strokeWidth={1.8} />
      </button>
      <button type="button" className="viz-hud-action" aria-label="Fullscreen">
        <Maximize2 size={15} strokeWidth={1.8} />
      </button>
      <button type="button" className="viz-hud-action" aria-label="Settings">
        <Settings size={15} strokeWidth={1.8} />
      </button>
    </div>
  );
}

function GateCard({ side }) {
  return (
    <div className={`viz-gate-card viz-gate-card--${side}`} aria-hidden="true">
      <span className="viz-gate-lock">LOCK</span>
      <strong>GATEKEEPER<br />PROTOCOL</strong>
      <em>ACCESS DENIED</em>
    </div>
  );
}

function ControlDeck({ act }) {
  const sigil = act?.protocolEmblem || act?.emblem;

  return (
    <div className="viz-control-deck" aria-label="Visualizer control status">
      <div className="viz-control-rail">
        {controlTiles.slice(0, 3).map(({ label, value, Icon }) => (
          <button key={label} type="button" className="viz-control-tile">
            <Icon size={18} strokeWidth={1.8} />
            <span>{label}</span>
            <strong>{value}</strong>
          </button>
        ))}
      </div>
      <button type="button" className="viz-control-sigil" aria-label="Protocol sigil">
        {sigil && <img src={sigil} alt="" />}
      </button>
      <div className="viz-control-rail">
        {controlTiles.slice(3).map(({ label, value, Icon }) => (
          <button key={label} type="button" className="viz-control-tile">
            <Icon size={18} strokeWidth={1.8} />
            <span>{label}</span>
            <strong>{value}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function VisualizerFrame({ act_id = 'act_three', track = {}, audioData, playback, error }) {
  const act = getVisualizerAct(act_id, track);
  const pulse = Math.max(0, Math.min(1, audioData?.energy || audioData?.averageVolume || 0));
  const leftSpectrum = makeSpectrumBars(audioData, 36, 0);
  const rightSpectrum = makeSpectrumBars(audioData, 36, 19).reverse();
  const floorSpectrum = makeSpectrumBars(audioData, 28, 41);

  return (
    <div
      className={`viz-root viz-${act.id}`}
      style={{
        '--viz-accent': act.color,
        '--viz-accent-2': act.color2,
        '--viz-bg-image': `url(${act.bg})`,
        '--viz-pulse': pulse,
      }}
    >
      {playback?.audioRef && (
        <audio
          ref={playback.audioRef}
          className="viz-audio-element"
          crossOrigin="anonymous"
          onTimeUpdate={playback.handleTimeUpdate}
          onLoadedMetadata={playback.handleLoadedMetadata}
          onEnded={playback.nextTrack}
        />
      )}

      <div className="viz-bg" aria-hidden="true" />
      <div className="viz-bg-wash" aria-hidden="true" />

      <div className="viz-frame-shell" aria-hidden="true">
        <span className="viz-corner viz-corner-tl" />
        <span className="viz-corner viz-corner-tr" />
        <span className="viz-corner viz-corner-bl" />
        <span className="viz-corner viz-corner-br" />
      </div>
      <GateCard side="left" />
      <GateCard side="right" />

      <header className="viz-top-hud">
        <div className="viz-hud-status">
          <span className={`viz-hud-dot${playback?.isPlaying ? ' viz-hud-dot--on' : ''}`} />
          <span>{playback?.isPlaying ? 'AUDIO LINK ESTABLISHED' : 'STANDBY'}</span>
          <small>44.1kHz / 24bit</small>
        </div>
        <div className="viz-hud-title">
          <strong>CHROMA KEY PROTOCOL</strong>
          <span>AUDIO VISUALIZER ENGINE</span>
        </div>
        <HudActions />
      </header>

      <div className="viz-canvas">
        <ChromaVisualizer act_id={act.id} track={track} audioData={audioData} />
      </div>

      <div className="viz-core-overlay" aria-hidden="true">
        <div className="viz-spectrum-deck">
          <div className="viz-spectrum-wing viz-spectrum-wing-left">
            {leftSpectrum.map((level, index) => (
              <span key={`left-${index}`} style={{ '--viz-level': level }} />
            ))}
          </div>
          <div className="viz-spectrum-readout">
            <span>isolated spectrum</span>
            <strong>signal glass</strong>
          </div>
          <div className="viz-spectrum-wing viz-spectrum-wing-right">
            {rightSpectrum.map((level, index) => (
              <span key={`right-${index}`} style={{ '--viz-level': level }} />
            ))}
          </div>
          <div className="viz-spectrum-floor">
            {floorSpectrum.map((level, index) => (
              <span key={`floor-${index}`} style={{ '--viz-level': level }} />
            ))}
          </div>
        </div>
        <div className="viz-dom-ring viz-dom-ring-a" />
        <div className="viz-dom-ring viz-dom-ring-b" />
        <img src={act.emblem} alt="" className="viz-core-emblem" />
      </div>

      <div className="viz-lyrics">
        <LyricsEngine act_id={act.id} track={track} playback={playback} audioData={audioData} />
      </div>

      <LeftPanel
        act={act}
        track={track}
        tracks={playback?.tracks || []}
        currentIndex={playback?.currentIndex || 0}
        selectTrack={playback?.selectTrack}
        isPlaying={playback?.isPlaying}
        togglePlay={playback?.togglePlay}
        nextTrack={playback?.nextTrack}
        prevTrack={playback?.prevTrack}
        duration={playback?.duration || 0}
        audioData={audioData}
      />

      <RightPanel
        act={act}
        track={track}
        audio={audioData}
        currentTime={playback?.currentTime || 0}
        duration={playback?.duration || 0}
        isPlaying={playback?.isPlaying}
      />

      <ControlDeck act={act} />

      {error && <div className="viz-error">{error}</div>}
    </div>
  );
}
