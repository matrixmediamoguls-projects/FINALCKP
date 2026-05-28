import "../../styles/reclamation-codex.css";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import OrbitalSystem from "../../systems/OrbitalSystem";
import useReclamationTracks from "../../modules/ImmersiveProtocol/useReclamationTracks";
import { useAudio } from "../../context/AudioProvider";

const supportModules = [
  {
    id: "vma",
    title: "VMA Module",
    subtitle: "Ask the assistant for signal interpretation",
    status: "Online",
    route: "/vma",
    telemetry: "AI",
  },
  {
    id: "seeker",
    title: "Seeker Profile",
    subtitle: "Review identity, tier, and act progress",
    status: "Synced",
    route: "/seeker",
    telemetry: "ID",
  },
  {
    id: "codex",
    title: "Codex Archive",
    subtitle: "Read the Reclamation lore layer",
    status: "Indexed",
    route: "/codex",
    telemetry: "CX",
  },
  {
    id: "artifacts",
    title: "Sonic Artifacts",
    subtitle: "Inspect recovered Act III signals",
    status: "Cached",
    route: "/protocol/3?module=artifacts",
    telemetry: "SA",
  },
];

const lyricLines = [
  "I'm breaking the code, I'm rewriting the system",
  "The keys in my hands, I'm taking back what's mine",
  "No firewall can hold me, no gate can keep me out",
  "I'm the glitch in their plan, watch the whole thing rise",
];

function ConsolePanel({ title, children, className = "" }) {
  return (
    <section className={`ckp-console-panel ${className}`}>
      <div className="ckp-panel-title">
        {title}
        <span />
      </div>
      {children}
    </section>
  );
}

function ModuleCard({ module, compact = false }) {
  return (
    <Link
      className={`ckp-module-card${compact ? " is-compact" : ""}`}
      to={module.route}
    >
      <span className="ckp-module-card__index">
        {module.index || module.telemetry}
      </span>

      <span className="ckp-module-card__copy">
        <strong>{module.title}</strong>
        <em>{module.subtitle}</em>
      </span>

      <span className="ckp-module-card__status">
        {module.status}
      </span>
    </Link>
  );
}

function formatTrackDuration(track) {
  if (track.duration) return track.duration;

  const seconds = Number(
    track.duration_seconds ?? track.duration_in_seconds
  );

  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "--:--";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function formatPlaybackTime(seconds) {
  const value = Number(seconds);

  if (!Number.isFinite(value) || value <= 0) {
    return "0:00";
  }

  const minutes = Math.floor(value / 60);
  const remainingSeconds = Math.floor(value % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function buildTimedLyrics(track, duration) {
  const parsedLines = Array.isArray(track?.lyric_lines)
    ? track.lyric_lines.filter((line) => line?.text)
    : [];

  if (parsedLines.length) {
    const hasTiming = parsedLines.some((line) => Number.isFinite(Number(line.time)));
    const estimatedStep = duration && parsedLines.length
      ? duration / Math.max(parsedLines.length, 1)
      : 8;

    return parsedLines.map((line, index) => ({
      id: line.id || `${track?.id || "track"}-lyric-${index}`,
      text: line.text,
      time: hasTiming && Number.isFinite(Number(line.time))
        ? Number(line.time)
        : index * estimatedStep,
    }));
  }

  const source = track?.lyrics || track?.display_text;
  const rawLines = source
    ? source
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
    : lyricLines;

  const step = duration && rawLines.length
    ? duration / Math.max(rawLines.length, 1)
    : 8;

  return rawLines.map((line, index) => ({
    id: `${track?.id || "fallback"}-lyric-${index}`,
    text: line,
    time: index * step,
  }));
}

export default function ReclamationCodex() {
  const {
    tracks: reclamationTracks,
    loading: tracksLoading,
    error: tracksError,
  } = useReclamationTracks();
  const audio = useAudio();

  const [activeTrackIndex, setActiveTrackIndex] = useState(0);

  useEffect(() => {
    if (activeTrackIndex >= reclamationTracks.length) {
      setActiveTrackIndex(0);
    }
  }, [activeTrackIndex, reclamationTracks.length]);

  const activeTrack =
    reclamationTracks[activeTrackIndex] ||
    reclamationTracks[0];
  const currentAudioTrack = audio?.currentTrack;
  const isCurrentReclamationTrack =
    currentAudioTrack?.id === activeTrack?.id ||
    currentAudioTrack?.track_id === activeTrack?.track_id;
  const isActiveTrackPlaying =
    Boolean(isCurrentReclamationTrack && audio?.isPlaying);
  const playerDuration =
    isCurrentReclamationTrack && audio?.duration
      ? audio.duration
      : Number(activeTrack?.duration_seconds ?? activeTrack?.duration_in_seconds) || 0;
  const playerCurrentTime =
    isCurrentReclamationTrack && audio?.currentTime
      ? audio.currentTime
      : 0;
  const playerProgress =
    playerDuration > 0
      ? Math.min(100, (playerCurrentTime / playerDuration) * 100)
      : 0;

  const activeLyricLines = useMemo(
    () => buildTimedLyrics(activeTrack, playerDuration),
    [activeTrack, playerDuration]
  );

  const activeLyricIndex = useMemo(() => {
    if (!activeLyricLines.length) return -1;

    let currentIndex = 0;

    activeLyricLines.forEach((line, index) => {
      if (playerCurrentTime >= Number(line.time || 0)) {
        currentIndex = index;
      }
    });

    return currentIndex;
  }, [activeLyricLines, playerCurrentTime]);

  const lyricWindow = useMemo(() => {
    if (!activeLyricLines.length) return [];

    const start = Math.max(0, activeLyricIndex - 1);
    const end = Math.min(activeLyricLines.length, start + 5);

    return activeLyricLines.slice(Math.max(0, end - 5), end);
  }, [activeLyricIndex, activeLyricLines]);

  const playReclamationTrack = (track, index) => {
    setActiveTrackIndex(index);
    audio?.playTrack?.(track, index, reclamationTracks);
  };

  const toggleActiveTrackPlayback = () => {
    if (!activeTrack) return;

    if (isCurrentReclamationTrack) {
      audio?.togglePlayback?.();
      return;
    }

    playReclamationTrack(activeTrack, activeTrackIndex);
  };

  const playPreviousTrack = () => {
    if (!reclamationTracks.length) return;
    const previousIndex =
      activeTrackIndex === 0
        ? reclamationTracks.length - 1
        : activeTrackIndex - 1;

    playReclamationTrack(
      reclamationTracks[previousIndex],
      previousIndex
    );
  };

  const playNextTrack = () => {
    if (!reclamationTracks.length) return;
    const nextIndex =
      (activeTrackIndex + 1) % reclamationTracks.length;

    playReclamationTrack(
      reclamationTracks[nextIndex],
      nextIndex
    );
  };

  const seekActiveTrack = (event) => {
    if (!isCurrentReclamationTrack || !playerDuration) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.max(
      0,
      Math.min(1, (event.clientX - rect.left) / rect.width)
    );

    audio?.seek?.(ratio * playerDuration);
  };

  return (
    <main className="reclamation-codex">
      <div className="reclamation-background" />
      <div className="reclamation-overlay" />

      <header className="ckp-topbar">
        <div className="ckp-act-brand">
          <img
            src="/emblem/reclamation_core_emblem.png"
            alt=""
          />

          <div>
            <strong>ACT THREE &gt;&gt;&gt;</strong>
            <span>RECLAMATION</span>
          </div>
        </div>

        <div className="ckp-title-lockup">
          <h1>CHROMA KEY PROTOCOL</h1>
          <p>AUDIO VISUALIZER ENGINE</p>
        </div>

        <div className="ckp-status-cluster">
          <span>CKP MAINFRAME: ONLINE</span>

          <Link to="/vma">
            VMA MODULE
          </Link>

          <button
            type="button"
            aria-label="Open protocol menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className="reclamation-console">
        <aside className="ckp-side-rail ckp-side-rail--left">
          <ConsolePanel title="Reclamation Tracklist">
            {tracksError && (
              <p className="ckp-tracklist-status">
                {tracksError}
              </p>
            )}

            <ol className="ckp-tracklist">
              {tracksLoading ? (
                <li className="is-loading">
                  <span>--</span>
                  <strong>Loading Supabase tracks</strong>
                  <em>--:--</em>
                </li>
              ) : (
                reclamationTracks.map((track, index) => {
                  const number = String(
                    track.sort_order ?? index + 1
                  ).padStart(2, "0");

                  const title =
                    track.title ||
                    track.name ||
                    `Track ${number}`;

                  const isActive =
                    index === activeTrackIndex;

                  return (
                    <li
                      key={
                        track.id ||
                        track.track_id ||
                        number
                      }
                      className={
                        isActive ? "is-active" : ""
                      }
                    >
                      <button
                        type="button"
                        onClick={() =>
                          playReclamationTrack(track, index)
                        }
                        aria-current={
                          isActive
                            ? "true"
                            : undefined
                        }
                      >
                        <span>{number}</span>

                        <strong>{title}</strong>

                        <em>
                          {formatTrackDuration(track)}
                        </em>
                      </button>
                    </li>
                  );
                })
              )}
            </ol>
          </ConsolePanel>

          <ConsolePanel
            title="Active Transmission"
            className="ckp-now-playing"
          >
            <Link
              className="ckp-transmission-card"
              to="/listen/3"
            >
              <span>
                {activeTrack?.act || "ACT III"}
              </span>

              <strong>
                {activeTrack?.title ||
                  activeTrack?.name ||
                  "Guided Listen"}
              </strong>

              <div className="ckp-mini-wave" />

              <small>
                {isActiveTrackPlaying
                  ? "Playing from Supabase transmission"
                  : activeTrack?.audio_url
                    ? "Ready from Supabase transmission"
                    : "Resume Act III audio chamber"}
              </small>
            </Link>
          </ConsolePanel>

          <ConsolePanel
            title="Audio Player"
            className="ckp-audio-player-panel"
          >
            <div className="ckp-audio-player">
              <div className="ckp-audio-player__meta">
                <span>
                  {isActiveTrackPlaying ? "Now Playing" : "Ready"}
                </span>

                <strong>
                  {activeTrack?.title ||
                    activeTrack?.name ||
                    "Select a track"}
                </strong>

                <em>
                  {activeTrack?.artist ||
                    activeTrack?.act ||
                    "Act III Reclamation"}
                </em>
              </div>

              <div
                className="ckp-audio-progress"
                onClick={seekActiveTrack}
                role="button"
                tabIndex={0}
                onKeyDown={() => {}}
                aria-label="Seek current track"
              >
                <i style={{ width: `${playerProgress}%` }} />
              </div>

              <div className="ckp-audio-time">
                <span>
                  {formatTrackDuration({
                    duration_seconds: playerCurrentTime,
                  })}
                </span>

                <span>
                  {formatTrackDuration({
                    duration_seconds: playerDuration,
                  })}
                </span>
              </div>

              <div className="ckp-audio-controls">
                <button
                  type="button"
                  onClick={playPreviousTrack}
                  aria-label="Previous track"
                >
                  PREV
                </button>

                <button
                  type="button"
                  onClick={toggleActiveTrackPlayback}
                  className="is-main"
                  disabled={!activeTrack?.audio_url}
                >
                  {isActiveTrackPlaying ? "PAUSE" : "PLAY"}
                </button>

                <button
                  type="button"
                  onClick={playNextTrack}
                  aria-label="Next track"
                >
                  NEXT
                </button>
              </div>
            </div>
          </ConsolePanel>

          <ConsolePanel title="Module Controls">
            <div
              className="ckp-control-row"
              aria-label="Module shortcuts"
            >
              <button
                type="button"
                onClick={toggleActiveTrackPlayback}
                className={isActiveTrackPlaying ? "is-primary" : ""}
              >
                {isActiveTrackPlaying ? "II" : "PLAY"}
              </button>

              <Link to="/activation?act=3">
                ACT
              </Link>

              <Link to="/journal?act=3">
                JRN
              </Link>

              <Link
                to="/visualizer/3"
                className="is-primary"
              >
                VIZ
              </Link>

              <Link to="/vma">
                VMA
              </Link>

              <Link to="/seeker">
                ID
              </Link>
            </div>

            <div className="ckp-volume">
              <span>{audio?.isPlaying ? "PLAY" : "SYNC"}</span>

              <div>
                <i
                  style={{
                    width: `${
                      audio?.duration
                        ? Math.min(
                            100,
                            (audio.currentTime /
                              audio.duration) *
                              100
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>

              <strong>
                {audio?.duration
                  ? formatTrackDuration({
                      duration_seconds:
                        audio.duration -
                        audio.currentTime,
                    })
                  : "READY"}
              </strong>
            </div>
          </ConsolePanel>
        </aside>

        <section
          className="ckp-center-stack"
          aria-label="Act Three spectrum analyzer"
        >
          <section className="ckp-analyzer-frame">
            <div className="ckp-analyzer-topline">
              <span>
                FREQ: 44.1 KHZ
                <br />
                RES: 24 BIT
              </span>

              <strong>
                DECRYPTION ACTIVE
              </strong>

              <span>
                SIGNAL: STRONG
                <br />
                SOURCE: CKP CORE
              </span>
            </div>

            <div className="ckp-waveform ckp-waveform--left" />
            <div className="ckp-waveform ckp-waveform--right" />
            <div className="ckp-crosshair" />

            <div className="reclamation-stage">
              <div className="reclamation-system-shell">
                <OrbitalSystem
                  currentTrack={activeTrack}
                />
              </div>
            </div>
          </section>

          <section className="ckp-lyrics-frame">
            <div
              className="ckp-lyrics-meter"
              aria-hidden="true"
            >
              {Array.from({ length: 28 }).map(
                (_, index) => (
                  <span
                    key={index}
                    style={{
                      "--bar": `${
                        18 + ((index * 19) % 74)
                      }%`,
                    }}
                  />
                )
              )}
            </div>

            <div className="ckp-lyrics-copy">
              <strong>LYRICS PROTOCOL</strong>

              {lyricWindow.map((line) => (
                <p
                  key={line.id}
                  className={
                    activeLyricLines[activeLyricIndex]?.id === line.id
                      ? "is-current"
                      : playerCurrentTime > Number(line.time || 0)
                        ? "is-past"
                        : "is-upcoming"
                  }
                >
                  <span>{formatPlaybackTime(line.time)}</span>
                  {line.text}
                </p>
              ))}

              <div className="ckp-progress">
                <span>{formatPlaybackTime(playerCurrentTime)}</span>

                <div>
                  <i style={{ width: `${playerProgress}%` }} />
                </div>

                <span>{formatPlaybackTime(playerDuration)}</span>
              </div>
            </div>
          </section>
        </section>

        <aside className="ckp-side-rail ckp-side-rail--right">
          <ConsolePanel
            title="Support Modules"
            className="ckp-context-card"
          >
            <div className="ckp-module-grid">
              {supportModules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  compact
                />
              ))}
            </div>
          </ConsolePanel>

          <ConsolePanel title="Context Module">
            <Link
              className="ckp-lore-module"
              to="/codex"
            >
              <strong>
                Reclamation Codex
              </strong>

              <span>
                Open the archive layer for
                Act III language, symbols,
                and protocol context.
              </span>
            </Link>
          </ConsolePanel>

          <ConsolePanel title="Frequency Module">
            <Link
              className="ckp-frequency-module"
              to="/visualizer/3"
            >
              <div
                className="ckp-frequency-bars"
                aria-hidden="true"
              >
                {Array.from({ length: 80 }).map(
                  (_, index) => (
                    <span
                      key={index}
                      style={{
                        "--bar": `${
                          12 + ((index * 37) % 84)
                        }%`,
                      }}
                    />
                  )
                )}
              </div>

              <div className="ckp-band-labels">
                <span>20</span>
                <span>80</span>
                <span>320</span>
                <span>1.2K</span>
                <span>5K</span>
                <span>20K</span>
              </div>
            </Link>
          </ConsolePanel>
        </aside>
      </div>
    </main>
  );
}
