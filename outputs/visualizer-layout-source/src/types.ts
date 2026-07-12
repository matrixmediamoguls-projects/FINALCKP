export type VisualizerSettings = {
  intensity: number
  bloom: number
  rotation: number
  particles: number
  sensitivity: number
}

export type TrackPreset = VisualizerSettings & {
  id: string
  title: string
  artist: string
  accent: string
  secondary: string
}

export type AudioBands = { bass: number; mid: number; high: number; level: number }
