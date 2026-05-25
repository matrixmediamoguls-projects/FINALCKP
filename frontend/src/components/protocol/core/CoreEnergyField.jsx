import { useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";

export default function CoreEnergyField() {
  const mesh = useRef();

  useFrame(({ clock }) => {
    mesh.current.rotation.z = clock.elapsedTime * 0.15;
  });

  return (
    <Sphere ref={mesh} args={[1.4, 128, 128]}>
      <MeshDistortMaterial
        color="#ff003c"
        emissive="#ff003c"
        emissiveIntensity={4}
        distort={0.45}
        speed={3}
      />
    </Sphere>
  );
}