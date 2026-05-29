import { Pause, Play, SkipBack, SkipForward } from "lucide-react";

export default function QuickControlsPanel({
  isPlaying,
  onPlayPause,
  onPrev,
  onNext,
  progress,
  currentTime,
  duration,
  volume,
  onVolumeChange,
  onSeek,
}) {
  return (
    <section className="pva-panel pva-controls">
      <div className="pva-panel-title">QUICK CONTROLS</div>

      <div className="pva-controls-row">
        <button type="button" onClick={onPrev} aria-label="Previous">
          <SkipBack size={18} />
        </button>
        <button type="button" onClick={onPlayPause} aria-label={isPlaying ? "Pause" : "Play"} className="is-main">
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button type="button" onClick={onNext} aria-label="Next">
          <SkipForward size={18} />
        </button>
      </div>

      <div className="pva-seek" onClick={onSeek} role="button" tabIndex={0}>
        <i style={{ width: `${progress}%` }} />
      </div>
      <div className="pva-time">
        <span>{currentTime}</span>
        <span>{duration}</span>
      </div>

      <label className="pva-volume">
        <span>VOLUME</span>
        <input type="range" min={0} max={100} value={volume} onChange={(e) => onVolumeChange(Number(e.target.value))} />
      </label>
    </section>
  );
}
