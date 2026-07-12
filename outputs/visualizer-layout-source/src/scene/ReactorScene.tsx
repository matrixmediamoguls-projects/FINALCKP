import { Component, Suspense, useMemo, useRef, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Center, Environment, OrbitControls, useGLTF } from '@react-three/drei'
import { Bloom, DepthOfField, EffectComposer, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import type { AudioBands, VisualizerSettings } from '../types'

type BandsRef = React.RefObject<AudioBands>
type SceneProps = { settings: VisualizerSettings; bandsRef: BandsRef; accent: string; modelUrl: string | null }

class ModelErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

const SILENT_BANDS: AudioBands = { bass: 0, mid: 0, high: 0, level: 0 }
const readBands = (bandsRef: BandsRef) => bandsRef.current ?? SILENT_BANDS

function LoadedModel({ url, bandsRef, settings }: { url: string; bandsRef: BandsRef; settings: VisualizerSettings }) {
  const gltf = useGLTF(url)
  const ref = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (!ref.current) return
    const bands = readBands(bandsRef)
    ref.current.rotation.y += delta * (.055 + settings.rotation * .22)
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * .18) * .025
    const scale = 1.92 + bands.bass * settings.sensitivity * .16
    ref.current.scale.setScalar(scale)
  })

  return (
    <Center position={[0, .15, 0]}>
      <primitive ref={ref} object={gltf.scene} />
    </Center>
  )
}

function ProceduralReactor({ settings, bandsRef, accent }: Omit<SceneProps, 'modelUrl'>) {
  const group = useRef<THREE.Group>(null)
  const halo = useRef<THREE.Group>(null)
  const particles = useRef<THREE.Points>(null)
  const coreOuter = useRef<THREE.Mesh>(null)
  const coreInner = useRef<THREE.Mesh>(null)
  const primaryLight = useRef<THREE.PointLight>(null)
  const positions = useMemo(() => {
    const values = new Float32Array(1200 * 3)
    for (let i = 0; i < 1200; i += 1) {
      const radius = 1.8 + Math.random() * 5.2
      const angle = Math.random() * Math.PI * 2
      values[i * 3] = Math.cos(angle) * radius
      values[i * 3 + 1] = (Math.random() - .42) * 3.4
      values[i * 3 + 2] = Math.sin(angle) * radius
    }
    return values
  }, [])

  useFrame(({ clock }, delta) => {
    const bands = readBands(bandsRef)
    const pulse = 1 + bands.bass * settings.sensitivity * .38

    if (group.current) {
      group.current.rotation.y += delta * (.035 + settings.rotation * .24)
      group.current.rotation.z = Math.sin(clock.elapsedTime * .16) * .045
    }
    if (halo.current) halo.current.rotation.y -= delta * (.045 + bands.mid * .16)
    if (particles.current) particles.current.rotation.y -= delta * (.018 + bands.high * .12)
    if (coreOuter.current) coreOuter.current.scale.setScalar(pulse)
    if (coreInner.current) coreInner.current.scale.setScalar(pulse * .62)
    if (primaryLight.current) primaryLight.current.intensity = 14 * settings.intensity + bands.level * 42
  })

  return (
    <group ref={group} rotation={[.58, 0, .12]}>
      <group ref={halo}>
        {[1.45, 2.1, 2.8, 3.48].map((radius, index) => (
          <mesh key={radius} rotation={[Math.PI / 2 + index * .08, index * .34, 0]}>
            <torusGeometry args={[radius, .028 + index * .014, 10, 192]} />
            <meshStandardMaterial color={index % 2 ? '#241817' : '#0f1011'} metalness={.96} roughness={.18} emissive={index % 2 ? '#c9995f' : accent} emissiveIntensity={settings.intensity * .48} />
          </mesh>
        ))}
      </group>

      {[1.8, 2.44, 3.06].map((radius, index) => (
        <mesh key={`wire-${radius}`} rotation={[Math.PI / 2, index * .68, index * .2]}>
          <torusGeometry args={[radius, .009, 8, 160]} />
          <meshBasicMaterial color={index === 1 ? '#d3a062' : accent} transparent opacity={.42} />
        </mesh>
      ))}

      <mesh ref={coreOuter} rotation={[.22, .2, .08]}>
        <octahedronGeometry args={[.82, 2]} />
        <meshStandardMaterial color="#5c090d" metalness={.55} roughness={.18} emissive={accent} emissiveIntensity={.85} />
      </mesh>
      <mesh ref={coreInner} rotation={[0, .4, 0]}>
        <icosahedronGeometry args={[.58, 3]} />
        <meshBasicMaterial color="#fff2d4" transparent opacity={.82} />
      </mesh>

      <pointLight ref={primaryLight} color={accent} intensity={14 * settings.intensity} distance={13} />
      <points ref={particles}>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
        <pointsMaterial color={accent} size={.018 + settings.particles * .024} transparent opacity={.5} sizeAttenuation />
      </points>
    </group>
  )
}

function StageGeometry({ bandsRef, accent }: { bandsRef: BandsRef; accent: string }) {
  const platform = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    const bands = readBands(bandsRef)
    if (platform.current) platform.current.rotation.y += delta * (.012 + bands.bass * .018)
  })
  return (
    <group ref={platform} position={[0, -1.76, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.1, 4.8, 192]} />
        <meshStandardMaterial color="#090909" metalness={.88} roughness={.22} emissive={accent} emissiveIntensity={.18} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.018, 0]}>
        <circleGeometry args={[6.5, 192]} />
        <meshStandardMaterial color="#050505" metalness={.72} roughness={.34} />
      </mesh>
    </group>
  )
}

function ReactiveLights({ bandsRef, accent }: { bandsRef: BandsRef; accent: string }) {
  const spot = useRef<THREE.SpotLight>(null)
  const front = useRef<THREE.PointLight>(null)
  const side = useRef<THREE.PointLight>(null)

  useFrame(() => {
    const bands = readBands(bandsRef)
    if (spot.current) spot.current.intensity = 8 + bands.level * 18
    if (front.current) front.current.intensity = 10 + bands.level * 44
    if (side.current) side.current.intensity = 2.2 + bands.bass * 6
  })

  return (
    <>
      <spotLight ref={spot} position={[0, 6.2, 4.5]} angle={.42} penumbra={.72} intensity={8} color="#fff2df" />
      <pointLight ref={front} position={[0, .5, 1.8]} intensity={10} color={accent} distance={12} />
      <pointLight ref={side} position={[-4.6, -1.1, -2]} intensity={2.2} color="#c9995f" distance={10} />
    </>
  )
}

export function ReactorScene({ settings, bandsRef, accent, modelUrl }: SceneProps) {
  return (
    <Canvas camera={{ position: [0, 3.35, 8.4], fov: 39 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: false }}>
      <color attach="background" args={['#030303']} />
      <fog attach="fog" args={['#030303', 8.5, 18]} />
      <ambientLight intensity={.22} />
      <directionalLight position={[4, 7, 5]} intensity={1.55} color="#fff2df" />
      <ReactiveLights bandsRef={bandsRef} accent={accent} />
      <Suspense fallback={null}>
        <StageGeometry bandsRef={bandsRef} accent={accent} />
        {modelUrl ? (
          <ModelErrorBoundary
            key={modelUrl}
            fallback={<ProceduralReactor settings={settings} bandsRef={bandsRef} accent={accent} />}
          >
            <LoadedModel url={modelUrl} bandsRef={bandsRef} settings={settings} />
          </ModelErrorBoundary>
        ) : <ProceduralReactor settings={settings} bandsRef={bandsRef} accent={accent} />}
        <Environment preset="warehouse" />
      </Suspense>
      <OrbitControls enablePan={false} minDistance={5.2} maxDistance={11.5} enableDamping dampingFactor={.08} />
      <EffectComposer multisampling={0}>
        <Bloom intensity={.55 + settings.bloom * 1.55} luminanceThreshold={.12} mipmapBlur />
        <DepthOfField focusDistance={.022} focalLength={.026} bokehScale={1.15} />
        <Vignette eskil={false} offset={.18} darkness={.76} />
      </EffectComposer>
    </Canvas>
  )
}
