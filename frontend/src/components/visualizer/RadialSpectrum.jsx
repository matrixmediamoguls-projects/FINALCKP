import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

export default function RadialSpectrum({ data, color }) {
  const group = useRef(null);
  const colorValue = useMemo(() => new THREE.Color(color), [color]);
  const bars = useMemo(() => {
    const railCount = 72;
    const sideCount = 22;
    const rail = Array.from({ length: railCount }).flatMap((_, index) => {
      const t = railCount === 1 ? 0 : index / (railCount - 1);
      const centerBias = 1 - Math.abs(t - 0.5) * 2;
      const x = -3.25 + t * 6.5;

      return [
        {
          id: `top-${index}`,
          mode: 'rail',
          originX: x,
          originY: 1.58,
          polarity: 1,
          sampleIndex: index,
          width: 0.026 + centerBias * 0.015,
          idlePhase: index * 0.19,
        },
        {
          id: `bottom-${index}`,
          mode: 'rail',
          originX: x,
          originY: -1.58,
          polarity: -1,
          sampleIndex: index + 17,
          width: 0.026 + centerBias * 0.015,
          idlePhase: index * 0.19 + 1.6,
        },
      ];
    });

    const sides = Array.from({ length: sideCount }).flatMap((_, index) => {
      const t = sideCount === 1 ? 0 : index / (sideCount - 1);
      const y = -1.08 + t * 2.16;
      const sampleIndex = Math.floor(t * railCount);

      return [
        {
          id: `left-${index}`,
          mode: 'side',
          originX: -3.58,
          originY: y,
          polarity: 1,
          sampleIndex: sampleIndex + 31,
          idlePhase: index * 0.31 + 0.8,
        },
        {
          id: `right-${index}`,
          mode: 'side',
          originX: 3.58,
          originY: y,
          polarity: -1,
          sampleIndex: sampleIndex + 47,
          idlePhase: index * 0.31 + 2.1,
        },
      ];
    });

    return [...rail, ...sides];
  }, []);

  useFrame(({ clock }) => {
    if (!group.current) return;

    const time = clock.elapsedTime;
    const hasData = data && data.length > 0;

    group.current.children.forEach((bar) => {
      const config = bar.userData;
      const idx = hasData ? config.sampleIndex % data.length : 0;
      const idle = 0.06 + (Math.sin(time * 1.8 + config.idlePhase) + 1) * 0.055;
      let amp = hasData ? (data[idx] || 0) / 255 : idle;

      amp = Math.pow(Math.max(0.035, amp), 1.42);

      if (config.mode === 'rail') {
        const height = 0.12 + amp * 1.18;
        bar.scale.y = height;
        bar.position.x = config.originX;
        bar.position.y = config.originY + config.polarity * height * 0.5;
      } else {
        const width = 0.18 + amp * 0.96;
        bar.scale.x = width;
        bar.position.x = config.originX + config.polarity * width * 0.5;
        bar.position.y = config.originY;
      }

      bar.material.opacity = 0.18 + amp * 0.5;
      bar.material.emissiveIntensity = 0.7 + amp * 4.8;
    });
  });

  return (
    <group ref={group} position={[0, 0, -0.18]}>
      {bars.map((bar) => (
        <mesh key={bar.id} userData={bar} position={[bar.originX, bar.originY, 0]}>
          <boxGeometry args={bar.mode === 'rail' ? [bar.width, 1, 0.02] : [1, 0.026, 0.02]} />
          <meshStandardMaterial
            color="#08090a"
            emissive={colorValue}
            emissiveIntensity={1.2}
            transparent
            opacity={0.42}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
