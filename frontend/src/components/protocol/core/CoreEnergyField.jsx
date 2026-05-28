import { useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";

export default function CoreEnergyField({
  bass = 0,
  mid = 0,
  emotionalIntensity = 0,
  shockwave = 0,
}) {
  const mesh = useRef();

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
    mesh.current.scale.setScalar(1 + bass * 0.14 + shockwave * 0.2);
  });

  return (
    <Sphere ref={mesh} args={[1.4, 128, 128]}>
      <MeshDistortMaterial
        color="#ff003c"
        emissive="#ff003c"
        emissiveIntensity={4 + bass * 5 + shockwave * 8}
        distort={0.45 + bass * 0.35 + emotionalIntensity * 0.18}
        speed={3 + mid * 6}
      />
    </Sphere>
  );
}
