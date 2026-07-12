import { useEffect } from 'react'
import type { RefObject } from 'react'
import type { AudioBands } from '../types'

type AudioFrameOptions = {
  analyserRef: RefObject<AnalyserNode | null>
  frequencyDataRef: RefObject<Uint8Array<ArrayBuffer> | null>
  bandsRef: RefObject<AudioBands>
  updateAnalysisFrame: () => AudioBands
  onFrame?: (frequencyData: Uint8Array<ArrayBuffer>, bands: AudioBands, analyser: AnalyserNode) => void
}

export function useAudioFrame({
  analyserRef,
  frequencyDataRef,
  bandsRef,
  updateAnalysisFrame,
  onFrame,
}: AudioFrameOptions) {
  useEffect(() => {
    let frame = 0

    const tick = () => {
      const analyser = analyserRef.current
      const frequencyData = frequencyDataRef.current

      if (analyser && frequencyData) {
        const bands = updateAnalysisFrame()
        bandsRef.current = bands
        onFrame?.(frequencyData, bands, analyser)
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [analyserRef, frequencyDataRef, bandsRef, updateAnalysisFrame, onFrame])
}
