import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { useReducedMotion } from 'framer-motion';
import ActiveTagBank from './ActiveTagBank';
import CategoryBadge from './CategoryBadge';
import CentralViewport from './CentralViewport';
import FallingTag from './FallingTag';
import TrackDetailModal from './TrackDetailModal';
import { AMBIENT_BUZZWORDS, TAG_CATEGORIES } from './alchemizrTagCategories';
import { countBankedTags } from './alchemizrMatching';
import {
  alchemizrReducer,
  initialAlchemizrState,
  selectBankedTagChips,
} from './alchemizrReducer';
import { fetchAlchemizrMatches, getTagDictionary } from '../../../lib/supabase/matrxAlchemizr';
import './matrxAlchemizr.css';

const RAIN_SPAWN_INTERVAL_MS = 900;
const MIN_FALL_SECONDS = 8;
const FALL_SECONDS_SPREAD = 6;

export default function MatrxAlchemizr() {
  const [state, dispatch] = useReducer(alchemizrReducer, initialAlchemizrState);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    let active = true;
    getTagDictionary().then((tagPools) => {
      if (active) dispatch({ type: 'LOAD_TAG_POOLS', tagPools });
    });
    return () => {
      active = false;
    };
  }, []);

  const activePool = useMemo(
    () => (state.activeCategory ? state.tagPools[state.activeCategory] || [] : []),
    [state.activeCategory, state.tagPools],
  );

  // The rain engine. Tags spawn on a slow interval and the reducer caps how many
  // can be airborne at once, so a long session never grows the DOM without bound.
  useEffect(() => {
    if (prefersReducedMotion || !state.activeCategory || !activePool.length) return undefined;

    let spawnCount = 0;
    const spawn = () => {
      const source = activePool[spawnCount % activePool.length];
      spawnCount += 1;
      dispatch({
        type: 'SPAWN_TAG',
        tag: {
          id: `${source.category}-${source.label}-${Date.now()}-${spawnCount}`,
          label: source.label,
          category: source.category,
          color: source.color,
          left: 4 + Math.random() * 88,
          duration: MIN_FALL_SECONDS + Math.random() * FALL_SECONDS_SPREAD,
        },
      });
    };

    spawn();
    const timer = setInterval(spawn, RAIN_SPAWN_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [prefersReducedMotion, state.activeCategory, activePool]);

  const bankedChips = useMemo(() => selectBankedTagChips(state), [state]);
  const bankedCount = countBankedTags(state.bankedTags);

  const handleRun = useCallback(async () => {
    if (state.isRunning || countBankedTags(state.bankedTags) === 0) return;
    dispatch({ type: 'RUN_START' });
    try {
      const results = await fetchAlchemizrMatches(state.bankedTags);
      dispatch({ type: 'RUN_SUCCESS', results });
    } catch {
      dispatch({ type: 'RUN_FAILURE', error: 'The archive did not answer. Try running again.' });
    }
  }, [state.bankedTags, state.isRunning]);

  const handleCollect = useCallback((tag) => dispatch({ type: 'COLLECT_TAG', tag }), []);

  return (
    <div className="alchemizr">
      <div className="alchemizr-buzzwords" aria-hidden="true">
        {AMBIENT_BUZZWORDS.map((word, index) => (
          <span key={word} className={`alchemizr-buzzword slot-${index + 1}`}>
            {word}
          </span>
        ))}
      </div>

      <div className="alchemizr-device">
        <header className="alchemizr-arc">
          <div className="alchemizr-arc-dials">
            {TAG_CATEGORIES.map((category) => (
              <CategoryBadge
                key={category.id}
                category={category}
                isActive={state.activeCategory === category.id}
                bankedCount={state.bankedTags[category.id]?.length || 0}
                onSelect={(id) => dispatch({ type: 'SELECT_CATEGORY', category: id })}
              />
            ))}
          </div>
          <p className="alchemizr-nameplate">
            <span>The Matrx</span>
            <strong>Alchemizr</strong>
          </p>
        </header>

        <div className="alchemizr-chamber">
          <div className="alchemizr-rain" aria-hidden={prefersReducedMotion ? 'true' : undefined}>
            {!prefersReducedMotion &&
              state.fallingTags.map((tag) => (
                <FallingTag
                  key={tag.id}
                  tag={tag}
                  onCollect={handleCollect}
                  onExpire={(tagId) => dispatch({ type: 'EXPIRE_TAG', tagId })}
                />
              ))}
          </div>

          <CentralViewport
            isRunning={state.isRunning}
            hasRun={state.hasRun}
            results={state.results}
            error={state.error}
            canRun={bankedCount > 0}
            onRun={handleRun}
            onOpenTrack={(track) => dispatch({ type: 'SELECT_TRACK', track })}
          />
        </div>

        {prefersReducedMotion && state.activeCategory && (
          <div className="alchemizr-static-pool">
            <p className="alchemizr-eyebrow">Available Tags</p>
            <div className="alchemizr-static-tags">
              {activePool.map((tag) => (
                <button
                  key={`${tag.category}-${tag.label}`}
                  type="button"
                  style={{ '--chip-color': tag.color }}
                  onClick={() => handleCollect({ ...tag, id: `${tag.category}-${tag.label}` })}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <ActiveTagBank
          chips={bankedChips}
          onRemove={(category, label) => dispatch({ type: 'REMOVE_BANKED_TAG', category, label })}
          onClear={() => dispatch({ type: 'CLEAR_BANK' })}
        />
      </div>

      <TrackDetailModal track={state.selectedTrack} onClose={() => dispatch({ type: 'CLOSE_MODAL' })} />
    </div>
  );
}
