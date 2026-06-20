import { useEffect, useRef, useState } from 'react';
import { getTrackById } from '../../lib/supabase/tracks';
import { getVisualizerRequirementsByTrack } from '../../lib/supabase/visualizerRequirements';
import { useAudioAnalyzer } from '../../lib/audio/useAudioAnalyzer';

export default function AudioVisualizerCore({ selectedTrackId, tracks = [], onTrackChange, isPlaying, onPlayStateChange }) {
  const audioRef = useRef(null);
  const [track, setTrack] = useState(null);
  const [requirements, setRequirements] = useState(null);
  const { start, stop, frequencyData, audioLevel } = useAudioAnalyzer(audioRef);

  useEffect(() => {
    let active = true;
    Promise.all([
      getTrackById(selectedTrackId),
      getVisualizerRequirementsByTrack(selectedTrackId)
    ]).then(([trackData, visualizerData]) => {
      if (!active) return;
      setTrack(trackData);
      setRequirements(visualizerData);
    });
    return () => {
      active = false;
    };
  }, [selectedTrackId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && track?.audio_url) {
      audio.play().then(start).catch(() => onPlayStateChange?.(false));
    } else {
      audio.pause();
      stop();
    }
  }, [isPlaying, track?.audio_url, start, stop, onPlayStateChange]);

  const bars = frequencyData.slice(0, 36);
  const accent = requirements?.accent_color || requirements?.primary_color || '#ef4444';

  return (
    <section className="relative flex min-h-[680px] flex-col overflow-hidden rounded-[2rem] border border-red-500/30 bg-black/55 p-5 shadow-[0_0_80px_rgba(127,29,29,0.35)] backdrop-blur-2xl">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.36em] text-red-300/70">Audio Visualizer Core</p>
          <h1 className="mt-2 text-3xl font-black uppercase tracking-[0.12em] text-white">{track?.title || 'Select Track'}</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">Clear center viewport remains protected. Reactive rings, spectrum, and waveform respond to the selected sonic artifact.</p>
        </div>
        <div className="rounded-full border border-red-400/30 px-4 py-2 text-xs uppercase tracking-[0.24em] text-red-100">
          Level {audioLevel}
        </div>
      </div>

      <div className="relative grid flex-1 place-items-center overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(127,29,29,0.28),rgba(0,0,0,0.86)_62%)]">
        {requirements?.video_url || requirements?.loop_visual_url ? (
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-70"
            src={requirements.video_url || requirements.loop_visual_url}
            muted
            loop
            playsInline
            autoPlay
          />
        ) : null}

        <div className="relative z-10 flex aspect-square w-[min(58vw,430px)] items-center justify-center rounded-full border border-red-300/15 bg-black/30">
          <div
            className="absolute inset-6 rounded-full border border-red-400/20"
            style={{ boxShadow: `0 0 ${24 + audioLevel}px ${accent}` }}
          />
          <div className="relative h-44 w-44 rounded-full border border-white/15 bg-black/70 shadow-[inset_0_0_40px_rgba(255,255,255,0.05)]" />
          {bars.map((value, index) => {
            const rotation = (index / Math.max(bars.length, 1)) * 360;
            const height = 18 + value * 0.55;
            return (
              <span
                key={index}
                className="absolute left-1/2 top-1/2 w-1 origin-bottom rounded-full bg-red-300/80"
                style={{
                  height,
                  transform: `rotate(${rotation}deg) translateY(-190px)`,
                  boxShadow: `0 0 14px ${accent}`
                }}
              />
            );
          })}
        </div>
      </div>

      <audio ref={audioRef} src={track?.audio_url || undefined} preload="metadata" />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
        <button
          type="button"
          onClick={() => onPlayStateChange?.(!isPlaying)}
          className="rounded-full border border-red-400/40 bg-red-950/50 px-6 py-2 text-sm font-bold uppercase tracking-[0.2em] text-white hover:bg-red-800/60"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
          {tracks.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onTrackChange?.(item.id)}
              className={`whitespace-nowrap rounded-full border px-3 py-2 text-xs uppercase tracking-[0.16em] ${item.id === selectedTrackId ? 'border-red-300 bg-red-900/60 text-white' : 'border-white/10 bg-black/30 text-zinc-400'}`}
            >
              {item.track_order}. {item.title}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
