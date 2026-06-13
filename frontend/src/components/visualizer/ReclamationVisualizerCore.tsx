import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

import useAudioAnalyzer from "../../hooks/useAudioAnalyzer";
import VisualizerCore from "./VisualizerCore";

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
};

const reclamationCoreStyles = `
.ckp-visualizer-core-experience {
  width: min(1180px, calc(100vw - 32px));
  margin: 0 auto;
  padding: clamp(16px, 2.2vw, 30px);
  border-radius: 34px;
  background:
    linear-gradient(145deg, rgba(255, 45, 24, 0.12), transparent 28%),
    radial-gradient(circle at 50% 0%, rgba(255, 65, 24, 0.14), transparent 38%),
    linear-gradient(180deg, rgba(10, 10, 12, 0.98), rgba(0, 0, 0, 0.98));
  border: 1px solid rgba(255, 72, 42, 0.22);
  box-shadow: 0 28px 90px rgba(0, 0, 0, 0.74), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  color: #f7f1e8;
}

.ckp-visualizer-core-viewport {
  position: relative;
  width: 100%;
  border-radius: 30px;
  isolation: isolate;
}

.ckp-visualizer-core-viewport::before,
.ckp-visualizer-core-viewport::after {
  content: "";
  position: absolute;
  pointer-events: none;
  z-index: 2;
  inset: -1px;
  border-radius: 30px;
}

.ckp-visualizer-core-viewport::before {
  background:
    linear-gradient(90deg, rgba(255, 26, 16, 0.58), transparent 16%, transparent 84%, rgba(255, 26, 16, 0.58)),
    linear-gradient(180deg, rgba(255, 156, 62, 0.22), transparent 18%, transparent 82%, rgba(255, 36, 22, 0.26));
  opacity: 0.24;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  padding: 1px;
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

.ckp-visualizer-core-controls {
  display: grid;
  grid-template-columns: minmax(160px, 1fr) auto minmax(220px, 2fr) minmax(150px, 0.7fr);
  gap: 14px;
  align-items: center;
  margin-top: 18px;
  padding: 13px 15px;
  border: 1px solid rgba(255, 68, 42, 0.18);
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(21, 16, 16, 0.92), rgba(4, 4, 5, 0.92));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.ckp-audio-file-control {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 71, 48, 0.3);
  background: rgba(255, 35, 22, 0.08);
  color: #ffb59a;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  cursor: pointer;
  transition: border-color 180ms ease, background 180ms ease, transform 180ms ease;
}

.ckp-audio-file-control:hover {
  border-color: rgba(255, 92, 58, 0.68);
  background: rgba(255, 48, 26, 0.15);
  transform: translateY(-1px);
}

.ckp-audio-file-control input {
  display: none;
}

.ckp-play-control {
  min-width: 104px;
  min-height: 42px;
  border: 1px solid rgba(255, 54, 36, 0.55);
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(255, 58, 32, 0.24), rgba(130, 0, 0, 0.28));
  color: #fff4ec;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 0 26px rgba(255, 33, 17, 0.16);
}

.ckp-play-control:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
}

.ckp-progress-control,
.ckp-volume-control {
  display: grid;
  gap: 7px;
}

.ckp-progress-meta,
.ckp-volume-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(255, 232, 218, 0.72);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.ckp-track-name {
  max-width: 34ch;
  overflow: hidden;
  color: rgba(255, 172, 132, 0.92);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ckp-progress-control input,
.ckp-volume-control input {
  width: 100%;
  accent-color: #ff2718;
}

@media (max-width: 860px) {
  .ckp-visualizer-core-controls {
    grid-template-columns: 1fr;
  }

  .ckp-play-control,
  .ckp-audio-file-control {
    width: 100%;
  }
}
`;

export default function ReclamationVisualizerCore() {
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState("No audio selected");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.82);
  const objectUrlRef = useRef<string | null>(null);

  const analyzer = useAudioAnalyzer(audioElement, {
    enabled: Boolean(audioElement),
    fftSize: 2048,
    smoothingTimeConstant: 0.84,
  });

  const progressValue = useMemo(() => {
    if (!duration) return 0;
    return Math.min(duration, currentTime);
  }, [currentTime, duration]);

  useEffect(() => {
    if (!audioElement) return;
    audioElement.volume = volume;
  }, [audioElement, volume]);

  useEffect(
    () => () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    },
    []
  );

  const handleAudioSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const nextUrl = URL.createObjectURL(file);
    objectUrlRef.current = nextUrl;
    setAudioSrc(nextUrl);
    setFileName(file.name);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
  };

  const handlePlayPause = async () => {
    if (!audioElement || !audioSrc) return;

    await analyzer.resume();

    if (audioElement.paused) {
      await audioElement.play();
    } else {
      audioElement.pause();
    }
  };

  const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
    if (!audioElement) return;

    const nextTime = Number(event.target.value);
    audioElement.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleVolume = (event: ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(event.target.value));
  };

  return (
    <section className="ckp-visualizer-core-experience" aria-label="CKP Reclamation Visualizer Core Experience">
      <style>{reclamationCoreStyles}</style>

      <div className="ckp-visualizer-core-viewport">
        <VisualizerCore analyzer={analyzer} isPlaying={isPlaying} />
      </div>

      <div className="ckp-visualizer-core-controls" aria-label="Demo audio controls">
        <label className="ckp-audio-file-control">
          Select Audio
          <input type="file" accept="audio/*" onChange={handleAudioSelection} />
        </label>

        <button className="ckp-play-control" type="button" onClick={handlePlayPause} disabled={!audioSrc}>
          {isPlaying ? "Pause" : "Play"}
        </button>

        <div className="ckp-progress-control">
          <div className="ckp-progress-meta">
            <span>{formatTime(currentTime)}</span>
            <span className="ckp-track-name">{fileName}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.01}
            value={progressValue}
            onChange={handleSeek}
            disabled={!audioSrc || !duration}
            aria-label="Audio progress"
          />
        </div>

        <div className="ckp-volume-control">
          <div className="ckp-volume-meta">
            <span>Volume</span>
            <span>{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolume}
            aria-label="Volume"
          />
        </div>
      </div>

      <audio
        ref={setAudioElement}
        src={audioSrc ?? undefined}
        preload="metadata"
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime || 0)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
    </section>
  );
}
