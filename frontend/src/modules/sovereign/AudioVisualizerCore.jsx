import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft, ChevronRight, List, LockKeyhole, Maximize2, Pause, Play,
  Settings, Shuffle, SkipBack, SkipForward, Volume1, Volume2,
} from 'lucide-react';
import { getTrackById } from '../../lib/supabase/tracks';
import { getVisualizerRequirementsByTrack } from '../../lib/supabase/visualizerRequirements';
import { useAudioAnalyzer } from '../../lib/audio/useAudioAnalyzer';
import './SovereignArchiveVisualizer.css';

const FALLBACK_TRACKS = [
  'Welcome To The Fire', 'Reclamation', 'Know Your Names', 'Hold On',
  'Demonic Schemes', 'Second Edition', 'Thought Form', 'Remember The Price',
  'Blueprint Of The Divine', 'Hostile Rewrite',
].map((title, index) => ({ id: `fallback-${index + 1}`, title, track_order: index + 1 }));

const REACTOR = '/media/visualizer/audio-reactive-healthy-frequency-sun.svg';
const FALLBACK_COVER = '/media/visualizer/foolish-pride-cover.png';

function formatTime(seconds) {
  const value = Number(seconds) || 0;
  return `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(Math.floor(value % 60)).padStart(2, '0')}`;
}

function Card({ title, className = '', children }) {
  return <section className={`sav-card ${className}`}><header><i />{title}</header>{children}</section>;
}

export default function AudioVisualizerCore({ selectedTrackId, activeTrackData, tracks = [], onTrackChange, isPlaying, onPlayStateChange }) {
  const audioRef = useRef(null);
  const [track, setTrack] = useState(activeTrackData || null);
  const [requirements, setRequirements] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const { start, stop, frequencyData, audioLevel } = useAudioAnalyzer(audioRef);

  useEffect(() => {
    if (!selectedTrackId || String(selectedTrackId).startsWith('fallback-')) {
      setTrack(activeTrackData || null);
      setRequirements(null);
      return undefined;
    }
    let active = true;
    Promise.all([getTrackById(selectedTrackId), getVisualizerRequirementsByTrack(selectedTrackId)])
      .then(([trackData, visualizerData]) => {
        if (!active) return;
        setTrack(trackData || activeTrackData || null);
        setRequirements(visualizerData || null);
      });
    return () => { active = false; };
  }, [selectedTrackId, activeTrackData]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying && track?.audio_url) audio.play().then(start).catch(() => onPlayStateChange?.(false));
    else { audio.pause(); stop(); }
  }, [isPlaying, track?.audio_url, start, stop, onPlayStateChange]);

  const queue = tracks.length ? tracks.slice(0, 10) : FALLBACK_TRACKS;
  const activeId = selectedTrackId || queue[0]?.id;
  const activeTrack = track || activeTrackData || queue.find((item) => item.id === activeId) || queue[0];
  const activeIndex = Math.max(0, queue.findIndex((item) => item.id === activeId));
  const cover = activeTrack?.cover_url || activeTrack?.cover_image_url || requirements?.cover_image_url || FALLBACK_COVER;
  const lyrics = String(activeTrack?.display_text || activeTrack?.lyrics || 'THE FLAME REMEMBERS.\nTHE SIGNAL RETURNS.\nRECLAIM WHAT WAS ALWAYS YOURS.')
    .split('\n').filter(Boolean).slice(0, 4);
  const bars = useMemo(() => Array.from({ length: 42 }, (_, index) => {
    const sampled = frequencyData[index * 2] ?? 30 + Math.abs(Math.sin(index * .67)) * 90;
    return Math.max(12, Math.min(100, sampled * .52 + (isPlaying ? audioLevel * .25 : 0)));
  }), [frequencyData, audioLevel, isPlaying]);
  const progress = duration ? Math.min(100, elapsed / duration * 100) : 0;

  const selectRelative = (direction) => {
    if (!queue.length) return;
    const next = queue[(activeIndex + direction + queue.length) % queue.length];
    onTrackChange?.(next.id);
    onPlayStateChange?.(true);
  };

  return (
    <section className={`sav-shell ${isPlaying ? 'is-playing' : ''}`} style={{ '--sav-energy': Math.max(.12, audioLevel / 100) }}>
      <div className="sav-atmosphere" aria-hidden="true" />
      <header className="sav-museum-header">
        <div className="sav-wordmark"><span>MM</span><strong>MUSIQ MATRIX</strong></div>
        <p>SOVEREIGN MODE · ACT III</p>
      </header>

      <section className="sav-dashboard">
        <aside className="sav-stack">
          <Card title="NOW PLAYING" className="sav-now-playing">
            <div className="sav-track-summary"><img src={cover} alt="" /><div><h2>{activeTrack?.title || 'Reclamation'}</h2><p>{activeTrack?.artist || 'Musiq Matrix'}</p><span className="sav-mini-progress" style={{ '--progress': `${progress}%` }} /><small>{formatTime(elapsed)} <b>{formatTime(duration)}</b></small></div></div>
          </Card>
          <Card title="AUDIO REACTOR" className="sav-meter-card">
            <div className="sav-meter" aria-hidden="true">{bars.map((height, index) => <i key={index} style={{ height: `${height}%`, animationDelay: `${index * -37}ms` }} />)}</div>
            <div className="sav-bands"><span>BASS</span><span>MID</span><span>TREBLE</span></div>
          </Card>
          <Card title="ALBUM STATUS" className="sav-status-card">
            <div className="sav-status"><LockKeyhole /><div><p>ACCESS &amp; PROTOCOL</p><h3>UNLOCKED</h3><small>ALL SYSTEMS OPERATIONAL</small></div></div>
          </Card>
        </aside>

        <section className="sav-stage" aria-label="Primary audio visualizer">
          <div className="sav-title"><p>CHROMA KEY / ACT THREE</p><h1>RECLAMATION</h1></div>
          <div className="sav-reactor-wrap">
            <div className="sav-reactor-halo" />
            <img src={REACTOR} alt="Musiq Matrix Reclamation frequency reactor" />
            <div className="sav-reactor-pulse" />
          </div>
          <div className="sav-plaque"><strong>RECLAMATION ARCHIVE</strong><span>MMR-III</span></div>
        </section>

        <aside className="sav-stack sav-stack-right">
          <Card title="RECLAMATION UNIVERSITY">
            <div className="sav-copy"><h3>PRIMARY LIGHT CODE</h3><p>The Flame Remembers.<br />The Signal Returns.</p><h3>PRIMARY SHADOW CODE</h3><p>Erasure, Distortion, Falsehood</p></div>
            <button className="sav-action" type="button">ENTER UNIVERSITY <ChevronRight /></button>
          </Card>
          <Card title="LYRICS PROTOCOL">
            <blockquote>{lyrics.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}</blockquote>
            <button className="sav-action" type="button">VIEW FULL LYRICS <ChevronRight /></button>
          </Card>
        </aside>
      </section>

      <section className="sav-tracklist">
        <header><h2>TRACKLIST: ACT III — RECLAMATION</h2><button type="button"><List /> VIEW FULL LIST</button></header>
        <div className="sav-track-rail"><button type="button" onClick={() => selectRelative(-1)} aria-label="Previous track"><ChevronLeft /></button><div>
          {queue.map((item, index) => <button type="button" key={item.id} className={item.id === activeId ? 'active' : ''} onClick={() => { onTrackChange?.(item.id); onPlayStateChange?.(true); }}><img src={item.cover_url || item.cover_image_url || cover} alt="" /><span>{String(item.track_order || index + 1).padStart(2, '0')}</span><strong>{item.title}</strong><i /></button>)}
        </div><button type="button" onClick={() => selectRelative(1)} aria-label="Next track"><ChevronRight /></button></div>
      </section>

      <section className="sav-controls" aria-label="Playback controls">
        <div><button type="button" aria-label="Shuffle"><Shuffle /></button><button type="button" onClick={() => selectRelative(-1)} aria-label="Previous"><SkipBack /></button><button className="sav-play" type="button" onClick={() => onPlayStateChange?.(!isPlaying)} aria-label={isPlaying ? 'Pause' : 'Play'}>{isPlaying ? <Pause /> : <Play />}</button><button type="button" onClick={() => selectRelative(1)} aria-label="Next"><SkipForward /></button></div>
        <div className="sav-seek"><b>{formatTime(elapsed)}</b><input type="range" aria-label="Track progress" min="0" max={duration || 1} value={elapsed} onChange={(event) => { audioRef.current.currentTime = Number(event.target.value); }} style={{ '--progress': `${progress}%` }} /><b>{formatTime(duration)}</b></div>
        <div className="sav-utility" aria-hidden="true"><Volume1 /><span /><Volume2 /><Settings /><Maximize2 /></div>
      </section>

      <footer className="sav-footer"><div><span className="sav-seeker-mark" /><p>SEEKER ID<br /><b>MM-7777</b></p></div><nav><span>DASHBOARD</span><span>ELEMENTAL PROTOCOLS</span><span>ARCHIVE</span><span>INTEL</span></nav><strong>SUPABASE · CONNECTED</strong></footer>
      <audio ref={audioRef} src={activeTrack?.audio_url || undefined} crossOrigin="anonymous" preload="metadata" onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)} onTimeUpdate={(event) => setElapsed(event.currentTarget.currentTime)} onEnded={() => selectRelative(1)} />
    </section>
  );
}
