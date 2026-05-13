import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import EnergyFX from './EnergyFX';
import RadialSpectrum from './RadialSpectrum';
import { useAudio } from '../../hooks/useAudio';
import { getVisualizerAct } from './visualizerAssets';

function CameraPulse({ pulse }) {
  useFrame(({ camera, clock }) => {
    const drift = Math.sin(clock.elapsedTime * 0.42) * 0.08;
    const targetZ = 6.9 - pulse * 0.72;
    camera.position.z += (targetZ - camera.position.z) * 0.06;
    camera.position.x += (drift - camera.position.x) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function VisualizerScene({ act_id, track, audioData }) {
  const act = getVisualizerAct(act_id, track);
  const { dataArray, pulse } = useAudio(track, audioData);
  const group = useRef(null);
  const isFire = act.id === 'act_three';
  const spectrumColor = isFire ? '#dff8ff' : act.color;

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.x = Math.sin(clock.elapsedTime * 0.2) * 0.035;
    group.current.rotation.y = Math.cos(clock.elapsedTime * 0.18) * 0.035;
  });

  return (
    <>
      <CameraPulse pulse={pulse} />
      <ambientLight intensity={0.45} />
      <pointLight position={[0, 0, 4]} intensity={(isFire ? 1.55 : 2.8) + pulse * (isFire ? 1.15 : 2.6)} color={isFire ? '#ffd2c2' : act.color} />
      <group ref={group}>
        <EnergyFX pulse={pulse} color={act.color} contained={isFire} />
        <RadialSpectrum data={dataArray} color={spectrumColor} />
      </group>
    </>
  );
}

export default function ChromaVisualizer({ act_id, track, audioData }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.9], fov: 45, near: 0.1, far: 100 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <VisualizerScene act_id={act_id} track={track} audioData={audioData} />
    </Canvas>
  );
}
