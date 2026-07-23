import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft, ChevronLeft, ChevronRight, Disc3, Maximize2, Pause, Play,
  Radio, Settings, Shuffle, SkipBack, SkipForward, Volume1, Volume2,
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

export default function AudioVisualizerCore({
  selectedTrackId,
  activeTrackData,
  tracks = [],
  onTrackChange,
  isPlaying,
  onPlayStateChange,
  onExit,
}) {
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
    else {
      audio.pause();
      stop();
    }
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
        <button type="button" className="sav-exit" onClick={onExit}><ArrowLeft /> Sovereign Chamber</button>
        <div className="sav-wordmark"><span>MM</span><div><strong>MUSIQ MATRIX</strong><small>Private listening archive</small></div></div>
        <div className="sav-session"><i /> Live session · Act III</div>
      </header>

      <section className="sav-listening-room">
        <aside className="sav-record-notes">
          <p className="sav-kicker">Now transmitting · {String(activeIndex + 1).padStart(2, '0')}</p>
          <h1>{activeTrack?.title || 'Reclamation'}</h1>
          <p className="sav-artist">{activeTrack?.artist || 'Musiq Matrix'} · Act III</p>
          <div className="sav-cover-wrap"><img src={cover} alt="" /><span>MMR–III / {String(activeIndex + 1).padStart(2, '0')}</span></div>
          <dl>
            <div><dt>Light code</dt><dd>The Flame Remembers. The Signal Returns.</dd></div>
            <div><dt>Shadow code</dt><dd>Erasure · Distortion · Falsehood</dd></div>
          </dl>
        </aside>

        <section className="sav-stage" aria-label="Audio-reactive frequency sculpture">
          <div className="sav-stage-heading"><span>Audio-reactive sculpture</span><strong>{isPlaying ? 'Signal active' : 'Awaiting playback'}</strong></div>
          <div className="sav-reactor-wrap">
            <div className="sav-reactor-halo" />
            <img src={REACTOR} alt="Musiq Matrix Reclamation frequency reactor" />
            <div className="sav-reactor-pulse" />
          </div>
          <div className="sav-meter" aria-hidden="true">{bars.map((height, index) => <i key={index} style={{ height: `${height}%`, animationDelay: `${index * -37}ms` }} />)}</div>
          <div className="sav-bands"><span>Low frequency</span><span>Mid field</span><span>High frequency</span></div>
        </section>

        <aside className="sav-transmission">
          <p className="sav-kicker">Lyrical transmission</p>
          <blockquote>{lyrics.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}</blockquote>
          <div className="sav-signal-card"><Radio /><div><span>Archive status</span><strong>{activeTrack?.audio_url ? 'Audio source online' : 'Text transmission only'}</strong></div></div>
          <div className="sav-signal-card"><Disc3 /><div><span>Reactor state</span><strong>{isPlaying ? 'Analyzing live signal' : 'Ready for playback'}</strong></div></div>
        </aside>
      </section>

      <section className="sav-tracklist">
        <header><div><p className="sav-kicker">The Reclamation archive</p><h2>Choose a transmission</h2></div><span>{queue.length} recordings</span></header>
        <div className="sav-track-rail">
          <button type="button" onClick={() => selectRelative(-1)} aria-label="Previous track"><ChevronLeft /></button>
          <div>
            {queue.map((item, index) => (
              <button type="button" key={item.id} className={item.id === activeId ? 'active' : ''} onClick={() => { onTrackChange?.(item.id); onPlayStateChange?.(true); }}>
                <img src={item.cover_url || item.cover_image_url || cover} alt="" />
                <span>{String(item.track_order || index + 1).padStart(2, '0')}</span>
                <strong>{item.title}</strong><i />
              </button>
            ))}
          </div>
          <button type="button" onClick={() => selectRelative(1)} aria-label="Next track"><ChevronRight /></button>
        </div>
      </section>

      <section className="sav-controls" aria-label="Playback controls">
        <div><button type="button" aria-label="Shuffle"><Shuffle /></button><button type="button" onClick={() => selectRelative(-1)} aria-label="Previous"><SkipBack /></button><button className="sav-play" type="button" onClick={() => onPlayStateChange?.(!isPlaying)} aria-label={isPlaying ? 'Pause' : 'Play'}>{isPlaying ? <Pause /> : <Play />}</button><button type="button" onClick={() => selectRelative(1)} aria-label="Next"><SkipForward /></button></div>
        <div className="sav-seek"><b>{formatTime(elapsed)}</b><input type="range" aria-label="Track progress" min="0" max={duration || 1} value={elapsed} onChange={(event) => { if (audioRef.current) audioRef.current.currentTime = Number(event.target.value); }} style={{ '--progress': `${progress}%` }} /><b>{formatTime(duration)}</b></div>
        <div className="sav-utility" aria-hidden="true"><Volume1 /><span /><Volume2 /><Settings /><Maximize2 /></div>
      </section>

      <footer className="sav-footer"><div><span className="sav-seeker-mark" /><p>MUSIQ MATRIX<br /><b>SOVEREIGN ARCHIVE</b></p></div><strong>{activeTrack?.audio_url ? 'MEDIA · CONNECTED' : 'ARCHIVE · READY'}</strong></footer>
      <audio ref={audioRef} src={activeTrack?.audio_url || undefined} crossOrigin="anonymous" preload="metadata" onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)} onTimeUpdate={(event) => setElapsed(event.currentTarget.currentTime)} onEnded={() => selectRelative(1)} />
    </section>
  );
}
