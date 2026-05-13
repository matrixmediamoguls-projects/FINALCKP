import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export default function EnergyFX({ pulse, color, contained = false }) {
  const inner = useRef(null);
  const outer = useRef(null);
  const field = useRef(null);
  const glow = contained ? 0.42 : 1;

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    if (inner.current) {
      inner.current.rotation.z += 0.006 + pulse * 0.018;
      inner.current.scale.setScalar(1 + pulse * 0.18);
      inner.current.material.opacity = (0.18 + pulse * 0.42) * glow;
    }
    if (outer.current) {
      outer.current.rotation.z -= 0.003 + pulse * 0.012;
      outer.current.scale.setScalar(1.02 + pulse * 0.3);
      outer.current.material.opacity = (0.12 + pulse * 0.28) * glow;
    }
    if (field.current) {
      field.current.rotation.z = time * 0.08;
      field.current.material.opacity = (0.05 + pulse * 0.18) * glow;
    }
  });

  return (
    <group>
      <mesh ref={field} position={[0, 0, -0.22]}>
        <circleGeometry args={[contained ? 3.25 : 4.1, 160]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={contained ? 0.035 : 0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={inner} position={[0, 0, 0.02]}>
        <ringGeometry args={[2.03, 2.1, 180]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={contained ? 0.12 : 0.28}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={outer} position={[0, 0, 0.01]}>
        <ringGeometry args={[2.75, 2.86, 220]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={contained ? 0.075 : 0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
