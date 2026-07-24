export function orderVisualizerQueue(tracks = []) {
  return [...tracks].sort((a, b) => (
    (a.track_order ?? Number.MAX_SAFE_INTEGER)
    - (b.track_order ?? Number.MAX_SAFE_INTEGER)
  ));
}

export function getAdjacentTrackIndex({
  activeIndex,
  direction,
  queueLength,
  shuffle = false,
  random = Math.random,
}) {
  if (!queueLength) return -1;

  if (shuffle && direction > 0 && queueLength > 1) {
    const candidates = Array.from({ length: queueLength }, (_, index) => index)
      .filter((index) => index !== activeIndex);
    return candidates[Math.floor(random() * candidates.length)];
  }

  const nextIndex = activeIndex + direction;
  return nextIndex >= 0 && nextIndex < queueLength ? nextIndex : -1;
}
