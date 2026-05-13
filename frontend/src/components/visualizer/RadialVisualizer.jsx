import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  fieldFragmentShader,
  fieldVertexShader,
  glowFragmentShader,
  glowVertexShader,
} from './shaders/glowMaterial';

function RadialBars({ audio, color }) {
  const bars = useMemo(() => Array.from({ length: 84 }), []);
  const colorValue = useMemo(() => new THREE.Color(color), [color]);

  return (
    <group>
      {bars.map((_, index) => {
        const freq = audio?.frequencyData || [];
        const sample = (freq[index] || 0) / 255;
        const smoothed = sample * 0.7 + (audio?.bass || 0) * 0.3;
        const angle = (index / bars.length) * Math.PI * 2;
        const length = 0.2 + smoothed * 1.2;
        const radius = 2.9 + length * 0.42;

        return (
          <mesh
            key={index}
            position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
            rotation={[0, 0, angle - Math.PI / 2]}
            scale={[1, length, 1]}
          >
            <boxGeometry args={[0.018, 0.48, 0.018]} />
            <meshBasicMaterial
              color={colorValue}
              transparent
              opacity={0.14 + sample * 0.74}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export default function RadialVisualizer({ audio, color = '#ff5a34', fxEvents = [] }) {
  const groupRef = useRef(null);
  const ringMaterialRef = useRef(null);
  const fieldMaterialRef = useRef(null);
  const latestFx = fxEvents[fxEvents.length - 1]?.type || '';

  const ringUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uEnergy: { value: 0 },
      uColor: { value: new THREE.Color(color) },
    }),
    []
  );

  const fieldUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uEnergy: { value: 0 },
      uColor: { value: new THREE.Color(color) },
    }),
    []
  );

  useEffect(() => {
    ringUniforms.uColor.value.set(color);
    fieldUniforms.uColor.value.set(color);
  }, [color, fieldUniforms, ringUniforms]);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    const bass = audio?.bass || audio?.bassLevel || 0;
    const mid = audio?.mid || audio?.midLevel || 0;
    const energy = audio?.energy || audio?.averageVolume || 0;
    const fxKick = latestFx ? 0.4 : 0;

    if (groupRef.current) {
      groupRef.current.rotation.z += 0.0025 + energy * 0.018;
      groupRef.current.rotation.x = Math.sin(time * 0.24) * 0.08 * mid;
      groupRef.current.scale.setScalar(1 + bass * 0.12 + fxKick);
    }

    if (ringMaterialRef.current) {
      ringMaterialRef.current.uniforms.uTime.value = time;
      ringMaterialRef.current.uniforms.uEnergy.value = energy * 1.5 + fxKick;
    }

    if (fieldMaterialRef.current) {
      fieldMaterialRef.current.uniforms.uTime.value = time;
      fieldMaterialRef.current.uniforms.uEnergy.value = energy + fxKick;
    }
  });

  return (
  <>
    {/* 🌌 BACKGROUND IMAGE (ADD THIS) */}
    <mesh position={[0, 0, -5]}>
      <planeGeometry args={[20, 12]} />
      <meshBasicMaterial
        map={new THREE.TextureLoader().load("/background.jpg")}
      />
    </mesh>

    {/* ⚡ FIELD (YOU ALREADY HAVE THIS) */}
    
    {/* 🔥 MAIN VISUALIZER */}
    <group ref={groupRef}>
      <mesh>
        <torusGeometry args={[2.35, 0.16, 96, 240]} />
        <shaderMaterial
          ref={ringMaterialRef}
          uniforms={ringUniforms}
          vertexShader={glowVertexShader}
          fragmentShader={glowFragmentShader}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* other rings */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[1.28, 0.022, 32, 160]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} blending={THREE.AdditiveBlending} />
      </mesh>

      <mesh rotation={[0, 0, -Math.PI / 8]}>
        <torusGeometry args={[3.22, 0.012, 32, 192]} />
        <meshBasicMaterial color={color} transparent opacity={0.24} blending={THREE.AdditiveBlending} />
      </mesh>

      <RadialBars audio={audio} color={color} />
    </group>
  </>
)
}