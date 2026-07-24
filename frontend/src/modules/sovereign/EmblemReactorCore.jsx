// src/modules/sovereign/EmblemReactorCore.jsx
import { Component, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bounds, useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const REACTOR_FALLBACK = '/media/visualizer/audio-reactive-healthy-frequency-sun.svg';
const REACTOR_MODEL = 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/objects/texturized-new.glb';

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
  const meshRef = useRef();
  const { scene } = useGLTF(REACTOR_MODEL);
  const uniforms = useMemo(() => ({
    uBass: { value: 0 }, uMid: { value: 0 }, uTreble: { value: 0 }, uTime: { value: 0 },
    uRimColor: { value: new THREE.Color('#00e0ff') },
  }), []);


  useEffect(() => {
    scene.traverse((child) => { if (child.isMesh && !meshRef.current) meshRef.current = child; });
  }, [scene]);


  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh?.material) return;
    mesh.material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', `#include <common>\nuniform float uBass;\nuniform float uMid;\nuniform float uTime;`)
        .replace('#include <begin_vertex>', `#include <begin_vertex>
          float disp = sin(position.y * 6.0 + uTime * 2.0) * uBass * 0.06 + sin(position.x * 9.0 - uTime * 1.5) * uMid * 0.03;
          transformed += normal * disp;`);
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>\nuniform float uTreble;\nuniform vec3 uRimColor;`)
        .replace('#include <dithering_fragment>', `gl_FragColor.rgb += uRimColor * uTreble * 0.8;\n#include <dithering_fragment>`);
      mesh.material.userData.shader = shader;
    };
    mesh.material.needsUpdate = true;
  }, [meshRef.current]);


  useFrame((state, delta) => {
    const data = frequencyData || [];
    const bassEnd = Math.floor(data.length * 0.12) || 1;
    const midEnd = Math.floor(data.length * 0.5) || 1;
    let bass = 0, mid = 0, treble = 0;
    for (let i = 0; i < bassEnd; i++) bass += data[i] || 0;
    for (let i = bassEnd; i < midEnd; i++) mid += data[i] || 0;
    for (let i = midEnd; i < data.length; i++) treble += data[i] || 0;
    bass = bass / (bassEnd * 255) || 0;
    mid = mid / ((midEnd - bassEnd) * 255) || 0;
    treble = treble / ((data.length - midEnd) * 255) || 0;


    uniforms.uBass.value = THREE.MathUtils.lerp(uniforms.uBass.value, bass, 0.25);
    uniforms.uMid.value = THREE.MathUtils.lerp(uniforms.uMid.value, mid, 0.25);
    uniforms.uTreble.value = THREE.MathUtils.lerp(uniforms.uTreble.value, treble, 0.25);
    uniforms.uTime.value += delta;
    const shader = meshRef.current?.material?.userData?.shader;
    if (shader) {
      shader.uniforms.uBass.value = uniforms.uBass.value;
      shader.uniforms.uMid.value = uniforms.uMid.value;
      shader.uniforms.uTreble.value = uniforms.uTreble.value;
      shader.uniforms.uTime.value = uniforms.uTime.value;
    }
    if (groupRef.current) {
      const s = 1 + (audioLevel / 100) * 0.18;
      groupRef.current.scale.set(s, s, s);
      groupRef.current.rotation.y += delta * (0.15 + mid * 0.5);
    }
  });


  return (
    <Bounds fit clip observe margin={1.1}>
      <group ref={groupRef}>
        <primitive object={scene} />
      </group>
    </Bounds>
  );
}


export default function EmblemReactorCore({ frequencyData, audioLevel }) {
  return (
    <ReactorErrorBoundary
      fallback={<img src={REACTOR_FALLBACK} alt="Musiq Matrix Reclamation frequency reactor" />}
    >
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }} gl={{ alpha: true, antialias: true }} style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
        <ambientLight intensity={0.35} />
        <pointLight position={[2, 2, 3]} intensity={2.2} color="#00e0ff" />
        <pointLight position={[-2, -1, 2]} intensity={1.1} color="#6a5cff" />
        <EmblemMesh frequencyData={frequencyData} audioLevel={audioLevel} />
        <EffectComposer>
          <Bloom intensity={1.5} luminanceThreshold={0.12} luminanceSmoothing={0.6} />
        </EffectComposer>
      </Canvas>
    </ReactorErrorBoundary>
  );
}
