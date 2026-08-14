import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Pause, Play, X } from 'lucide-react';
import { TAG_CATEGORIES } from './alchemizrTagCategories';
import { extractSpotifyId, formatDuration } from './alchemizrMatching';

export default function TrackDetailModal({ track, onClose }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
    return () => {
      audioRef.current?.pause();
    };
  }, [track?.id]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!track) return null;

  const spotifyId = extractSpotifyId(track.spotify_uri);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="alchemizr-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="alchemizr-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${track.title} details`}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="alchemizr-modal-close" aria-label="Close" onClick={onClose}>
          <X aria-hidden="true" />
        </button>

        <div className="alchemizr-modal-head">
          {track.cover_art_url && (
            <img src={track.cover_art_url} alt={`${track.title} cover art`} />
          )}
          <div>
            <p className="alchemizr-eyebrow">{track.score}% Match</p>
            <h3>{track.title}</h3>
            <p className="alchemizr-hint">{track.artist || 'Musiq Matrix'}</p>
          </div>
        </div>

        <dl className="alchemizr-metadata">
          <div>
            <dt>BPM</dt>
            <dd>{track.bpm ?? '—'}</dd>
          </div>
          <div>
            <dt>Duration</dt>
            <dd>{formatDuration(track.duration_ms)}</dd>
          </div>
          <div>
            <dt>Album</dt>
            <dd>{track.album || '—'}</dd>
          </div>
        </dl>

        <div className="alchemizr-modal-tags">
          {TAG_CATEGORIES.map((category) => {
            const tags = track[category.column] || [];
            if (!tags.length) return null;
            return (
              <div key={category.id} className="alchemizr-modal-tag-row">
                <span className="alchemizr-eyebrow" style={{ color: category.color }}>
                  {category.label}
                </span>
                <span>{tags.join(' · ')}</span>
              </div>
            );
          })}
        </div>

        <div className="alchemizr-modal-actions">
          <button
            type="button"
            className="alchemizr-action"
            disabled={!track.local_audio_url}
            onClick={togglePlayback}
          >
            {isPlaying ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
            {isPlaying ? 'Pause' : 'Stream Locally'}
          </button>

          {spotifyId ? (
            <a
              className="alchemizr-action"
              href={`https://open.spotify.com/track/${spotifyId}`}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink aria-hidden="true" />
              Open in Spotify
            </a>
          ) : (
            <span className="alchemizr-action is-disabled">
              <ExternalLink aria-hidden="true" />
              No Spotify URI
            </span>
          )}
        </div>

        {track.local_audio_url && (
          <audio
            ref={audioRef}
            src={track.local_audio_url}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
          >
            <track kind="captions" />
          </audio>
        )}
      </div>
    </div>
  );
}
