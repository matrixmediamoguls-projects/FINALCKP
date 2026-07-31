import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Volume2 } from "lucide-react";

function formatTime(value) {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function MaterialNarrationBar({ src, label = "Listen to this section" }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rate, setRate] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const sync = () => {
      setCurrentTime(audio.currentTime || 0);
      setDuration(audio.duration || 0);
    };
    const stop = () => setPlaying(false);

    audio.addEventListener("timeupdate", sync);
    audio.addEventListener("loadedmetadata", sync);
    audio.addEventListener("ended", stop);
    return () => {
      audio.removeEventListener("timeupdate", sync);
      audio.removeEventListener("loadedmetadata", sync);
      audio.removeEventListener("ended", stop);
    };
  }, [src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setPlaying(false);
    setCurrentTime(0);
  }, [src]);

  if (!src) return null;

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      await audio.play();
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const restart = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
  };

  const changeRate = (event) => {
    const nextRate = Number(event.target.value);
    setRate(nextRate);
    if (audioRef.current) audioRef.current.playbackRate = nextRate;
  };

  return (
    <section className="hme-narration" aria-label="Section narration">
      <audio ref={audioRef} src={src} preload="metadata" />
      <button type="button" className="hme-narration-play" onClick={toggle} aria-label={playing ? "Pause narration" : "Play narration"}>
        {playing ? <Pause size={17} /> : <Play size={17} />}
      </button>
      <div className="hme-narration-copy">
        <span><Volume2 size={14} /> Narration</span>
        <strong>{label}</strong>
      </div>
      <input
        type="range"
        min="0"
        max={duration || 0}
        step="0.1"
        value={Math.min(currentTime, duration || 0)}
        onChange={(event) => {
          const nextTime = Number(event.target.value);
          if (audioRef.current) audioRef.current.currentTime = nextTime;
          setCurrentTime(nextTime);
        }}
        aria-label="Narration position"
      />
      <span className="hme-narration-time">{formatTime(currentTime)} / {formatTime(duration)}</span>
      <select value={rate} onChange={changeRate} aria-label="Narration speed">
        <option value="0.75">0.75×</option>
        <option value="1">1×</option>
        <option value="1.25">1.25×</option>
        <option value="1.5">1.5×</option>
      </select>
      <button type="button" className="hme-narration-restart" onClick={restart} aria-label="Restart narration">
        <RotateCcw size={15} />
      </button>
    </section>
  );
}
