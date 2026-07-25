export function getVisibleLyricLines(timedLyrics = [], elapsedSeconds = 0, windowSize = 4) {
  if (!timedLyrics.length) return [];

  const elapsedMs = Math.max(0, Number(elapsedSeconds) || 0) * 1000;
  const activeIndex = timedLyrics.findIndex(
    (line) => elapsedMs >= line.start_ms && elapsedMs < line.end_ms,
  );
  const latestStartedIndex = timedLyrics.findLastIndex((line) => elapsedMs >= line.start_ms);
  const windowStart = activeIndex >= 0 ? activeIndex : Math.max(0, latestStartedIndex);

  return timedLyrics
    .slice(windowStart, windowStart + windowSize)
    .map((line) => line.line_text);
}
