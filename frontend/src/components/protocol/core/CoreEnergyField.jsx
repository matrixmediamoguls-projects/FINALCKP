import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function CoreEnergyField({
  bass = 0,
  mid = 0,
  emotionalIntensity = 0,
  shockwave = 0,
}) {
  const mesh = useRef();
  const innerRing = useRef();
  const outerRing = useRef();
  const spikeField = useRef();

  useFrame(({ clock, camera }) => {
    const cameraApi = {
      pushForward({ intensity }) {
        camera.position.z = 4 - Math.min(1.8, intensity);
      },
      orbit({ speed }) {
        camera.position.x = Math.sin(clock.elapsedTime * 8 * speed) * (0.45 + mid);
      },
      ascend({ speed }) {
        camera.position.y = Math.sin(clock.elapsedTime * 0.9) * speed * 0.8;
      },
    };

    cameraApi.pushForward({ intensity: bass * 2 });
    cameraApi.orbit({ speed: mid * 0.03 });
    cameraApi.ascend({ speed: emotionalIntensity });

    camera.lookAt(0, 0, 0);

    if (!mesh.current) return;
    mesh.current.rotation.z = clock.elapsedTime * (0.15 + mid * 0.32);
    mesh.current.rotation.x = Math.sin(clock.elapsedTime * 0.8) * emotionalIntensity * 0.12;
    mesh.current.scale.setScalar(1 + bass * 0.2 + shockwave * 0.3);

    if (innerRing.current) {
      innerRing.current.rotation.z = -clock.elapsedTime * (0.6 + mid * 1.8);
      innerRing.current.scale.setScalar(1 + bass * 0.18 + shockwave * 0.28);
    }

    if (outerRing.current) {
      outerRing.current.rotation.x = Math.PI / 2 + Math.sin(clock.elapsedTime * 0.5) * 0.14;
      outerRing.current.rotation.z = clock.elapsedTime * (0.28 + emotionalIntensity * 0.9);
      outerRing.current.scale.setScalar(1 + mid * 0.16 + shockwave * 0.22);
    }

    if (spikeField.current) {
      spikeField.current.rotation.y = clock.elapsedTime * (0.18 + mid * 0.42);
      spikeField.current.rotation.z = -clock.elapsedTime * (0.12 + bass * 0.38);
      spikeField.current.scale.setScalar(1 + emotionalIntensity * 0.16 + bass * 0.1);
    }
  });

  return (
    <group>
      <mesh ref={mesh}>
        <sphereGeometry args={[1.28, 128, 128]} />
        <meshStandardMaterial
          color="#ff2a22"
          emissive="#ff120b"
          emissiveIntensity={2.7 + bass * 6.2 + shockwave * 8.4}
          roughness={0.18}
          metalness={0.44}
          wireframe
        />
      </mesh>

      <mesh ref={spikeField}>
        <icosahedronGeometry args={[1.72, 2]} />
        <meshStandardMaterial
          color="#ff6954"
          emissive="#ff1b12"
          emissiveIntensity={1.25 + emotionalIntensity * 3.2 + shockwave * 3.4}
          transparent
          opacity={0.2 + mid * 0.22 + shockwave * 0.18}
          wireframe
        />
      </mesh>

      <mesh ref={innerRing} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.72, 0.018 + bass * 0.02, 12, 160]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ff2a22"
          emissiveIntensity={2 + bass * 4.2 + shockwave * 5.8}
          transparent
          opacity={0.58 + bass * 0.24}
        />
      </mesh>

      <mesh ref={outerRing} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.12, 0.012 + mid * 0.018, 10, 192]} />
        <meshStandardMaterial
          color="#ff3428"
          emissive="#9b0707"
          emissiveIntensity={1.25 + mid * 3.4 + emotionalIntensity * 1.8}
          transparent
          opacity={0.42 + emotionalIntensity * 0.2}
        />
      </mesh>
    </group>
  );
}
