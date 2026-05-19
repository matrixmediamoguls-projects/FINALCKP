export const DEFAULT_VISUALIZER_PATH = "/visualizer/act_three";

export function normalizeVisualizerActId(routeActId, currentTrack) {
  if (routeActId) return routeActId;
  if (currentTrack?.act_id) return currentTrack.act_id;
  return "act_three";
}
