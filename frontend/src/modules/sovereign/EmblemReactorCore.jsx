// src/modules/sovereign/EmblemReactorCore.jsx
import { Component, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, useGLTF } from '@react-three/drei';

const REACTOR_FALLBACK = '/media/visualizer/audio-reactive-healthy-frequency-sun.svg';
const REACTOR_MODEL = '/media/visualizer/texturized-new.optimized.glb';

class ReactorErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error('The 3D reactor could not load; using the static reactor.', error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}


function EmblemMesh({ frequencyData, audioLevel }) {
  const groupRef = useRef();
  const { scene } = useGLTF(REACTOR_MODEL);
  const reactor = useMemo(() => {
    let source = null;
    scene.traverse((child) => {
      if (!source && child.isMesh) source = child;
    });
    if (!source) throw new Error('The reactor GLB does not contain a mesh.');

    const clone = source.clone(true);
    clone.traverse((child) => {
      if (!child.isMesh) return;
      child.material = child.material.clone();
    });
    return clone;
  }, [scene]);

  useFrame((_, delta) => {
    const data = frequencyData || [];
    const bassEnd = Math.floor(data.length * 0.12) || 1;
    let bass = 0;
    for (let i = 0; i < bassEnd; i++) bass += data[i] || 0;
    bass = bass / (bassEnd * 255) || 0;

    if (groupRef.current) {
      const targetScale = 1 + Math.max(bass, audioLevel / 100) * 0.045;
      const nextScale = groupRef.current.scale.x
        + (targetScale - groupRef.current.scale.x) * Math.min(1, delta * 7);
      groupRef.current.scale.setScalar(nextScale);
    }
  });


  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={reactor} />
      </Center>
    </group>
  );
}


export default function EmblemReactorCore({ frequencyData, audioLevel }) {
  return (
    <ReactorErrorBoundary
      fallback={<img src={REACTOR_FALLBACK} alt="Musiq Matrix Reclamation frequency reactor" />}
    >
      <Canvas camera={{ position: [0, 0, 2.7], fov: 45 }} gl={{ alpha: true, antialias: true }} style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
        <ambientLight intensity={1.15} />
        <pointLight position={[2, 2, 3]} intensity={1.1} color="#fff4e8" />
        <pointLight position={[-2, -1, 2]} intensity={0.55} color="#ffd2ad" />
        <EmblemMesh frequencyData={frequencyData} audioLevel={audioLevel} />
      </Canvas>
    </ReactorErrorBoundary>
  );
}
