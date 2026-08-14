import { Loader2 } from 'lucide-react';
import { getCategoryColor } from './alchemizrTagCategories';

function TrackResultCard({ result, rank, onOpen }) {
  const accent = getCategoryColor('vibe');

  return (
    <button
      type="button"
      className={`alchemizr-result rank-${rank}`}
      style={{ '--result-accent': accent }}
      onClick={() => onOpen(result)}
    >
      <span className="alchemizr-result-rank">{rank}</span>
      <span className="alchemizr-result-title">{result.title}</span>
      <span className="alchemizr-result-score">{result.score}% Match</span>
    </button>
  );
}

export default function CentralViewport({
  isRunning,
  hasRun,
  results,
  error,
  canRun,
  onRun,
  onOpenTrack,
}) {
  const [topResult, ...runnersUp] = results;

  return (
    <div className="alchemizr-viewport">
      <div className="alchemizr-viewport-spokes" aria-hidden="true" />
      <div className="alchemizr-viewport-core">
        {isRunning && (
          <div className="alchemizr-viewport-state" role="status">
            <Loader2 className="alchemizr-spinner" aria-hidden="true" />
            <p className="alchemizr-eyebrow">Transmuting</p>
          </div>
        )}

        {!isRunning && !hasRun && (
          <div className="alchemizr-viewport-state">
            <p className="alchemizr-eyebrow">Now Manifesting</p>
            <h2 className="alchemizr-idle-title">
              MATRX
              <br />
              ALCHEMIZR
            </h2>
            <button type="button" className="alchemizr-go" disabled={!canRun} onClick={onRun}>
              GO
            </button>
            {!canRun && <p className="alchemizr-hint">Bank at least one tag to run.</p>}
          </div>
        )}

        {!isRunning && hasRun && error && (
          <div className="alchemizr-viewport-state">
            <p className="alchemizr-eyebrow">Transmutation Failed</p>
            <p className="alchemizr-hint">{error}</p>
            <button type="button" className="alchemizr-go" onClick={onRun}>
              RETRY
            </button>
          </div>
        )}

        {!isRunning && hasRun && !error && !topResult && (
          <div className="alchemizr-viewport-state">
            <p className="alchemizr-eyebrow">No Alignment</p>
            <p className="alchemizr-hint">Nothing in the archive carries those tags yet.</p>
            <button type="button" className="alchemizr-go" onClick={onRun}>
              RUN AGAIN
            </button>
          </div>
        )}

        {!isRunning && hasRun && !error && topResult && (
          <div className="alchemizr-viewport-state is-results">
            <p className="alchemizr-eyebrow">Now Manifesting</p>
            <button type="button" className="alchemizr-top-result" onClick={() => onOpenTrack(topResult)}>
              <span className="alchemizr-top-title">{topResult.title}</span>
              <span className="alchemizr-top-score">{topResult.score}% Match</span>
            </button>
            {runnersUp.length > 0 && (
              <div className="alchemizr-runners">
                {runnersUp.map((result, index) => (
                  <TrackResultCard
                    key={result.id}
                    result={result}
                    rank={index + 2}
                    onOpen={onOpenTrack}
                  />
                ))}
              </div>
            )}
            <button type="button" className="alchemizr-rerun" onClick={onRun}>
              Run Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
