import type { TrackPreset } from './types'

export const PRESETS: TrackPreset[] = [
  { id: 'echo', title: 'Echo Chamber', artist: 'Synaptic Void', accent: '#7ee9f0', secondary: '#173c50', intensity: .76, bloom: .7, rotation: .32, particles: .72, sensitivity: .68 },
  { id: 'solar', title: 'Solar Drift', artist: 'Luminance', accent: '#f2a65a', secondary: '#54230d', intensity: .88, bloom: .82, rotation: .18, particles: .48, sensitivity: .58 },
  { id: 'core', title: 'Core Ascent', artist: 'Nexus Verge', accent: '#5ce1e6', secondary: '#0c4a55', intensity: .8, bloom: .65, rotation: .45, particles: .7, sensitivity: .6 },
  { id: 'obsidian', title: 'Obsidian Tide', artist: 'Fractal Depths', accent: '#c8d0cf', secondary: '#24292c', intensity: .58, bloom: .5, rotation: .12, particles: .84, sensitivity: .74 },
]
