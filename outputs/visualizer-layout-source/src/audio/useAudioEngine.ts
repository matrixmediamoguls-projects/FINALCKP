import { useCallback, useEffect, useRef, useState } from 'react'
import type { AudioBands } from '../types'

const EMPTY_BANDS: AudioBands = { bass: 0, mid: 0, high: 0, level: 0 }

export function useAudioEngine() {
  const audioRef = useRef<HTMLAudioElement>(new Audio())
  const contextRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const frequencyDataRef = useRef<Uint8Array<ArrayBuffer> | null>(null)
  const bandsRef = useRef<AudioBands>({ ...EMPTY_BANDS })
  const analysisEnabledRef = useRef(false)

  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolumeState] = useState(.72)
  const [isMuted, setIsMuted] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const ensureGraph = useCallback(() => {
    const audio = audioRef.current

    if (!contextRef.current) {
      contextRef.current = new AudioContext()
    }

    if (!analyserRef.current || !frequencyDataRef.current) {
      const analyser = contextRef.current.createAnalyser()
      analyser.fftSize = 2048
      analyser.smoothingTimeConstant = .82

      if (!sourceRef.current) {
        sourceRef.current = contextRef.current.createMediaElementSource(audio)
      }

      try {
        sourceRef.current.disconnect()
      } catch {
        // Already disconnected; safe to reconnect below.
      }
      sourceRef.current.connect(analyser)
      analyser.connect(contextRef.current.destination)
      analyserRef.current = analyser
      frequencyDataRef.current = new Uint8Array(analyser.frequencyBinCount)
    }
  }, [])

  const disconnectAnalyser = useCallback(() => {
    try {
      sourceRef.current?.disconnect()
    } catch {
      // Already disconnected.
    }
    try {
      analyserRef.current?.disconnect()
    } catch {
      // Already disconnected.
    }
    analyserRef.current = null
    frequencyDataRef.current = null
    bandsRef.current = { ...EMPTY_BANDS }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    audio.volume = .72
    audio.crossOrigin = 'anonymous'
    audio.preload = 'metadata'

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateMeta = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
    const playing = () => setIsPlaying(true)
    const paused = () => setIsPlaying(false)
    const ended = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateMeta)
    audio.addEventListener('durationchange', updateMeta)
    audio.addEventListener('play', playing)
    audio.addEventListener('pause', paused)
    audio.addEventListener('ended', ended)

    return () => {
      audio.pause()
      audio.src = ''
      void contextRef.current?.close()
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateMeta)
      audio.removeEventListener('durationchange', updateMeta)
      audio.removeEventListener('play', playing)
      audio.removeEventListener('pause', paused)
      audio.removeEventListener('ended', ended)
    }
  }, [])

  const updateAnalysisFrame = useCallback(() => {
    const analyser = analyserRef.current
    const frequencyData = frequencyDataRef.current

    if (!analyser || !frequencyData) return bandsRef.current

    analyser.getByteFrequencyData(frequencyData)

    const average = (from: number, to: number) => {
      let total = 0
      const safeTo = Math.min(to, frequencyData.length)
      for (let i = from; i < safeTo; i += 1) total += frequencyData[i]
      return total / Math.max(1, safeTo - from) / 255
    }

    bandsRef.current = {
      bass: average(2, 28),
      mid: average(28, 180),
      high: average(180, 620),
      level: average(2, 620),
    }

    return bandsRef.current
  }, [])

  const revokeBlob = () => {
    const audio = audioRef.current
    if (audio.src.startsWith('blob:')) URL.revokeObjectURL(audio.src)
  }

  const loadAudio = useCallback((file: File) => {
    const audio = audioRef.current
    revokeBlob()
    analysisEnabledRef.current = true
    audio.crossOrigin = null
    audio.src = URL.createObjectURL(file)
    audio.load()
    setFileName(file.name.replace(/\.[^.]+$/, ''))
    setCurrentTime(0)
    setDuration(0)
    setIsPlaying(false)
    bandsRef.current = { ...EMPTY_BANDS }
  }, [])

  const loadUrl = useCallback(async (url: string, title: string, autoplay = false, analyze = true) => {
    const audio = audioRef.current
    revokeBlob()
    analysisEnabledRef.current = analyze
    if (!analyze) disconnectAnalyser()
    if (analyze) {
      audio.crossOrigin = 'anonymous'
    } else {
      audio.removeAttribute('crossorigin')
      audio.crossOrigin = null
    }
    audio.src = url
    audio.load()
    setFileName(title)
    setCurrentTime(0)
    setDuration(0)
    setIsPlaying(false)
    bandsRef.current = { ...EMPTY_BANDS }

    if (autoplay) {
      if (analyze) {
        ensureGraph()
        await contextRef.current?.resume()
      }
      await audio.play()
    }
  }, [disconnectAnalyser, ensureGraph])

  const toggle = useCallback(async () => {
    const audio = audioRef.current
    if (analysisEnabledRef.current) {
      ensureGraph()
      await contextRef.current?.resume()
    }
    if (!audio.src) return
    if (audio.paused) await audio.play()
    else audio.pause()
  }, [ensureGraph])

  const seek = useCallback((time: number) => {
    const audio = audioRef.current
    audio.currentTime = Math.max(0, Math.min(time, Number.isFinite(audio.duration) ? audio.duration : time))
  }, [])

  const setVolume = useCallback((value: number) => {
    audioRef.current.volume = value
    audioRef.current.muted = false
    setIsMuted(false)
    setVolumeState(value)
  }, [])

  const toggleMute = useCallback(() => {
    const next = !audioRef.current.muted
    audioRef.current.muted = next
    setIsMuted(next)
  }, [])

  const toggleLoop = useCallback(() => {
    const next = !audioRef.current.loop
    audioRef.current.loop = next
    setIsLooping(next)
  }, [])

  return {
    audioRef,
    analyserRef,
    frequencyDataRef,
    bandsRef,
    isPlaying,
    duration,
    currentTime,
    volume,
    isMuted,
    isLooping,
    fileName,
    loadAudio,
    loadUrl,
    toggle,
    seek,
    setVolume,
    toggleMute,
    toggleLoop,
    updateAnalysisFrame,
  }
}
