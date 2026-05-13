import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import RadialVisualizer from './RadialVisualizer';

function CameraDirector({ audio }) {
  useFrame(({ camera, clock }) => {
    const energy = audio?.energy || audio?.averageVolume || 0;
    const mid = audio?.mid || audio?.midLevel || 0;
    const targetZ = 7.4 - energy * 2.1;

    camera.position.z += (targetZ - camera.position.z) * 0.045;
    camera.position.x += (Math.sin(clock.elapsedTime * 0.72) * mid * 0.42 - camera.position.x) * 0.05;
    camera.position.y += (Math.cos(clock.elapsedTime * 0.63) * mid * 0.32 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function VisualizerCore({ audio, color, fxEvents }) {
  return (
    <div className="rv-stage">
      <Canvas
        className="rv-canvas"
        camera={{ position: [0, 0, 7.4], fov: 46, near: 0.1, far: 100 }}
        dpr={[1, 1.7]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <CameraDirector audio={audio} />
        <RadialVisualizer audio={audio} color={color} fxEvents={fxEvents} />
      </Canvas>
    </div>
  );
}
