import { Canvas, useFrame } from '@react-three/fiber';
import { AdaptiveDpr, Preload } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Pause, Play, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { RECLAMATION_VISUALIZER_TRACKS, getVisualizerTrack } from '../data/reclamationVisualizerTracks';
import '../styles/ckpVisualizerCore.css';

const emptyBands = {
  sub: 0,
  bass: 0,
  lowMid: 0,
  mid: 0,
  highMid: 0,
  high: 0
};

function averageRange(data, startRatio, endRatio) {
  if (!data?.length) return 0;
  const start = Math.floor(data.length * startRatio);
  const end = Math.max(start + 1, Math.floor(data.length * endRatio));
  let total = 0;

  for (let index = start; index < end; index += 1) {
    total += data[index] || 0;
  }

  return Math.max(0, Math.min(1, total / (end - start) / 255));
}

function mapFFTToBands(data) {
  return {
    sub: averageRange(data, 0.0, 0.03),
    bass: averageRange(data, 0.03, 0.12),
    lowMid: averageRange(data, 0.12, 0.22),
    mid: averageRange(data, 0.22, 0.45),
    highMid: averageRange(data, 0.45, 0.68),
    high: averageRange(data, 0.68, 1.0)
  };
}

function useAudioReactivity(audioRef, isPlaying, currentTrackId, volume, setCurrentTime, setDuration) {
  const [bands, setBands] = useState(emptyBands);
  const [beat, setBeat] = useState({ detected: false, intensity: 0 });
  const graphRef = useRef(null);
  const frameRef = useRef(null);
  const lastBassRef = useRef(0);
  const cooldownRef = useRef(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const track = getVisualizerTrack(currentTrackId);
    audio.src = track.audioSrc;
    audio.volume = volume;
    audio.crossOrigin = 'anonymous';
    audio.load();
    setCurrentTime(0);
    setDuration(0);
    setBands(emptyBands);
    setBeat({ detected: false, intensity: 0 });

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [audioRef, currentTrackId, setCurrentTime, setDuration, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [audioRef, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;

    function ensureGraph() {
      if (graphRef.current) return graphRef.current;
      const context = new AudioContextConstructor();
      const analyser = context.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.78;
      analyser.minDecibels = -88;
      analyser.maxDecibels = -12;
      const source = context.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(context.destination);
      const data = new Uint8Array(analyser.frequencyBinCount);
      graphRef.current = { context, analyser, data };
      return graphRef.current;
    }

    function detectBeat(nextBands) {
      const bassRise = nextBands.bass - lastBassRef.current;
      const detected = cooldownRef.current <= 0 && nextBands.bass > 0.42 && bassRise > 0.12;
      cooldownRef.current = detected ? 10 : Math.max(0, cooldownRef.current - 1);
      lastBassRef.current = nextBands.bass;
      return {
        detected,
        intensity: detected ? Math.min(1, nextBands.bass + bassRise) : Math.max(0, nextBands.bass * 0.35)
      };
    }

    function tick() {
      const graph = graphRef.current;
      if (graph) {
        graph.analyser.getByteFrequencyData(graph.data);
        const nextBands = mapFFTToBands(graph.data);
        setBands(nextBands);
        setBeat(detectBeat(nextBands));
      }
      frameRef.current = requestAnimationFrame(tick);
    }

    async function syncPlayback() {
      const graph = ensureGraph();
      if (isPlaying) {
        if (graph.context.state === 'suspended') await graph.context.resume();
        await audio.play().catch(() => undefined);
        tick();
      } else {
        audio.pause();
        if (frameRef.current) cancelAnimationFrame(frameRef.current);
      }
    }

    syncPlayback();

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [audioRef, isPlaying]);

  return { bands, beat };
}

function EclipseShader({ bands }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uBass: { value: 0 },
          uHigh: { value: 0 }
        },
        vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
        fragmentShader: `
          uniform float uTime;
          uniform float uBass;
          uniform float uHigh;
          varying vec2 vUv;
          void main(){
            vec2 uv = vUv - 0.5;
            float r = length(uv);
            float corona = smoothstep(0.54, 0.2, r) - smoothstep(0.24, 0.04, r);
            float wave = sin((r * 42.0) - uTime * 2.2) * 0.04;
            vec3 color = vec3(0.42 + uBass, 0.02 + uHigh * 0.16, 0.025);
            float alpha = (corona * 0.32 + wave * corona) * smoothstep(0.86, 0.12, r);
            gl_FragColor = vec4(color, alpha);
          }
        `
      }),
    []
  );

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uBass.value = bands.bass;
    material.uniforms.uHigh.value = bands.high;
  });

  return (
    <mesh material={material} position={[0, 0, -1.8]}>
      <planeGeometry args={[14, 8, 1, 1]} />
    </mesh>
  );
}

function ParticleField({ bands }) {
  const pointsRef = useRef(null);
  const { positions, colors } = useMemo(() => {
    const count = 1200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const radius = 2.1 + Math.random() * 4.9;
      const theta = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5.2;
      positions[i * 3 + 2] = Math.sin(theta) * radius - 1.2;
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 0.05 + Math.random() * 0.15;
      colors[i * 3 + 2] = 0.03 + Math.random() * 0.08;
    }

    return { positions, colors };
  }, []);

  useFrame(({ clock }) => {
    const points = pointsRef.current;
    if (!points) return;
    const array = points.geometry.attributes.position.array;

    for (let i = 0; i < array.length / 3; i += 1) {
      const index = i * 3;
      const x = array[index];
      const z = array[index + 2];
      const angle = Math.atan2(z, x) + 0.0007 + bands.high * 0.0018;
      const radius = Math.sqrt(x * x + z * z) + Math.sin(clock.elapsedTime + i) * bands.bass * 0.0015;
      array[index] = Math.cos(angle) * radius;
      array[index + 1] += Math.sin(clock.elapsedTime * 1.4 + i * 0.02) * bands.highMid * 0.002;
      array[index + 2] = Math.sin(angle) * radius;
    }

    points.geometry.attributes.position.needsUpdate = true;
    points.rotation.z += 0.0004 + bands.mid * 0.0012;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} vertexColors transparent opacity={0.82} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function FrequencyRings({ bands, beat }) {
  const groupRef = useRef(null);
  const rings = [2.8, 3.25, 3.7, 4.15];

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    group.rotation.z += 0.002 + bands.mid * 0.009;
    group.children.forEach((child, index) => {
      const scale = 1 + bands.bass * (0.08 + index * 0.025) + beat.intensity * 0.08;
      child.scale.set(scale, scale, scale);
      child.rotation.z += (index % 2 === 0 ? 1 : -1) * (0.002 + bands.highMid * 0.006);
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, 0.15]}>
      {rings.map((radius, index) => (
        <mesh key={radius}>
          <torusGeometry args={[radius, 0.008 + index * 0.003, 12, 192]} />
          <meshBasicMaterial color={index % 2 === 0 ? '#ff2a2a' : '#ff7a18'} transparent opacity={0.22 + index * 0.08} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function WebGLReactiveLayer({ bands, beat }) {
  return (
    <div className="ckp-webgl-layer" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 9], fov: 45 }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
        <AdaptiveDpr pixelated={false} />
        <ambientLight intensity={0.65} />
        <pointLight position={[0, 0, 5]} intensity={3.2} color="#ff2b2b" />
        <EclipseShader bands={bands} />
        <ParticleField bands={bands} />
        <FrequencyRings bands={bands} beat={beat} />
        <Preload all />
      </Canvas>
    </div>
  );
}

function ModuleFrame({ title, code, children }) {
  return (
    <section className="ckp-module-frame">
      <div className="ckp-module-header">
        <h3>{title}</h3>
        <span>{code}</span>
      </div>
      <div className="ckp-module-body">{children}</div>
    </section>
  );
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export default function CKPVisualizerCore() {
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const [currentTrackId, setCurrentTrackId] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const track = getVisualizerTrack(currentTrackId);
  const { bands, beat } = useAudioReactivity(audioRef, isPlaying, currentTrackId, volume, setCurrentTime, setDuration);
  const activeLyricIndex = track.lyrics.findIndex((line) => currentTime >= line.start && currentTime < line.end);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--ckp-sub', bands.sub.toFixed(3));
    root.style.setProperty('--ckp-bass', bands.bass.toFixed(3));
    root.style.setProperty('--ckp-low-mid', bands.lowMid.toFixed(3));
    root.style.setProperty('--ckp-mid', bands.mid.toFixed(3));
    root.style.setProperty('--ckp-high-mid', bands.highMid.toFixed(3));
    root.style.setProperty('--ckp-high', bands.high.toFixed(3));
    root.style.setProperty('--ckp-beat', beat.intensity.toFixed(3));
  }, [bands, beat]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.src = track.videoSrc;
    video.muted = true;
    video.playsInline = true;
    video.load();
  }, [track.videoSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) video.play().catch(() => undefined);
    else video.pause();
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    const video = videoRef.current;
    if (!audio || !video) return undefined;

    const sync = () => {
      const drift = Math.abs(video.currentTime - audio.currentTime);
      if (drift > 0.22) video.currentTime = audio.currentTime;
      setCurrentTime(audio.currentTime);
    };

    const finish = () => nextTrack();
    const metadata = () => setDuration(audio.duration || video.duration || 0);
    audio.addEventListener('timeupdate', sync);
    audio.addEventListener('loadedmetadata', metadata);
    audio.addEventListener('ended', finish);
    video.addEventListener('loadedmetadata', metadata);

    return () => {
      audio.removeEventListener('timeupdate', sync);
      audio.removeEventListener('loadedmetadata', metadata);
      audio.removeEventListener('ended', finish);
      video.removeEventListener('loadedmetadata', metadata);
    };
  });

  function selectTrack(trackId) {
    setCurrentTrackId(trackId);
    setIsPlaying(false);
    setCurrentTime(0);
  }

  function nextTrack() {
    const index = RECLAMATION_VISUALIZER_TRACKS.findIndex((item) => item.id === currentTrackId);
    const next = RECLAMATION_VISUALIZER_TRACKS[(index + 1) % RECLAMATION_VISUALIZER_TRACKS.length];
    selectTrack(next.id);
  }

  function previousTrack() {
    const index = RECLAMATION_VISUALIZER_TRACKS.findIndex((item) => item.id === currentTrackId);
    const previous = RECLAMATION_VISUALIZER_TRACKS[(index - 1 + RECLAMATION_VISUALIZER_TRACKS.length) % RECLAMATION_VISUALIZER_TRACKS.length];
    selectTrack(previous.id);
  }

  function seek(value) {
    const audio = audioRef.current;
    const video = videoRef.current;
    if (audio) audio.currentTime = value;
    if (video) video.currentTime = value;
    setCurrentTime(value);
  }

  return (
    <main className="ckp-visualizer-shell" data-beat={beat.detected ? 'true' : 'false'}>
      <audio ref={audioRef} preload="metadata" />
      <div className="ckp-mainframe-grid" />
      <WebGLReactiveLayer bands={bands} beat={beat} />

      <header className="ckp-visualizer-topbar">
        <a className="ckp-back-link" href="/experiencemode">← Experience Mode</a>
        <div className="ckp-protocol-status"><span /> Visualizer Core Active</div>
      </header>

      <section className="ckp-visualizer-layout">
        <aside className="ckp-module-column left">
          <ModuleFrame title="Now Playing" code="CKP/NP">
            <div className="ckp-now-playing">
              <span>{String(track.order).padStart(2, '0')}</span>
              <h2>{track.title}</h2>
              {track.subtitle && <p>{track.subtitle}</p>}
              <small>{track.chamber}</small>
            </div>
          </ModuleFrame>

          <ModuleFrame title="Sonic Artifact" code="ARTIFACT/III">
            <p className="ckp-artifact-copy">{track.artifact}</p>
            <div className="ckp-artifact-meter"><span /><span /><span /></div>
          </ModuleFrame>

          <ModuleFrame title="Audio Analyzer" code="FFT/LIVE">
            <div className="ckp-band-stack">
              {Object.entries(bands).map(([name, value]) => (
                <div className="ckp-band-row" key={name}>
                  <span>{name}</span>
                  <div><i style={{ transform: `scaleX(${Math.max(0.04, value)})` }} /></div>
                  <b>{Math.round(value * 100)}</b>
                </div>
              ))}
            </div>
          </ModuleFrame>
        </aside>

        <section className="ckp-center-stage">
          <div className="ckp-center-viewport">
            <video ref={videoRef} className="ckp-reclamation-video" preload="metadata" />
            <div className="ckp-viewport-overlay scanline" />
            <div className="ckp-viewport-overlay reactive-vignette" />
            <div className="ckp-viewport-label"><span>Rendered Cinematic Feed</span><b>{track.title}</b></div>
          </div>
        </section>

        <aside className="ckp-module-column right">
          <ModuleFrame title="Reclamation University" code="RU/ACTIVE">
            <div className="ckp-university-card">
              <p>{track.universityCode}</p>
              <div><span>Lesson Node</span><b>{String(track.order).padStart(2, '0')}</b></div>
            </div>
          </ModuleFrame>

          <ModuleFrame title="Lyrics Protocol" code="LYR/SYNC">
            <div className="ckp-lyrics-feed">
              {track.lyrics.length === 0 && <p className="empty">Lyric timing file not loaded for this track.</p>}
              {track.lyrics.map((line, index) => (
                <p key={`${line.start}-${line.text}`} className={index === activeLyricIndex ? 'active' : index < activeLyricIndex ? 'passed' : ''}>{line.text}</p>
              ))}
            </div>
          </ModuleFrame>
        </aside>
      </section>

      <section className="ckp-track-carousel" aria-label="Track selection carousel">
        <div>
          {RECLAMATION_VISUALIZER_TRACKS.map((item) => (
            <motion.button key={item.id} type="button" className={`ckp-track-chip ${item.id === currentTrackId ? 'active' : ''}`} onClick={() => selectTrack(item.id)} whileHover={{ y: -5 }} whileTap={{ scale: 0.97 }}>
              <span>{String(item.order).padStart(2, '0')}</span>
              <b>{item.title}</b>
            </motion.button>
          ))}
        </div>
      </section>

      <footer className="ckp-media-controls">
        <button type="button" onClick={previousTrack}><SkipBack size={18} /></button>
        <button className="primary" type="button" onClick={() => setIsPlaying((value) => !value)}>{isPlaying ? <Pause size={22} /> : <Play size={22} />}</button>
        <button type="button" onClick={nextTrack}><SkipForward size={18} /></button>
        <span>{formatTime(currentTime)}</span>
        <input type="range" min="0" max={duration || 0} step="0.01" value={currentTime} onChange={(event) => seek(Number(event.target.value))} />
        <span>{formatTime(duration)}</span>
        <label><Volume2 size={16} /><input type="range" min="0" max="1" step="0.01" value={volume} onChange={(event) => setVolume(Number(event.target.value))} /></label>
      </footer>
    </main>
  );
}
