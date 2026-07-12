import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js'
import type { AudioBands } from './types'

type Props = {
  bandsRef: RefObject<AudioBands>
  currentTime: number
  isPlaying: boolean
}

const PARTICLE_COUNT = 1600

function makeAtmosphereParticles() {
  const positions = new Float32Array(PARTICLE_COUNT * 3)
  const colors = new Float32Array(PARTICLE_COUNT * 3)

  for (let index = 0; index < PARTICLE_COUNT; index += 1) {
    const spread = Math.random() ** .55
    const angle = Math.random() * Math.PI * 2
    const x = Math.cos(angle) * spread * (2.7 + Math.random() * 1.8)
    const y = (Math.random() - .5) * (1.15 + Math.random() * 1.2)
    const z = (Math.random() - .5) * 2.8

    positions[index * 3] = x
    positions[index * 3 + 1] = y
    positions[index * 3 + 2] = z

    const ember = Math.random()
    colors[index * 3] = ember > .74 ? .64 : .38
    colors[index * 3 + 1] = ember > .74 ? .3 : .08
    colors[index * 3 + 2] = ember > .74 ? .16 : .12
  }

  return { positions, colors }
}

export default function ReactiveArchiveBackground({ bandsRef, currentTime, isPlaying }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const playbackRef = useRef({ currentTime, isPlaying })

  playbackRef.current = { currentTime, isPlaying }

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x050303, .08)

    const camera = new THREE.PerspectiveCamera(62, 1, .1, 100)
    camera.position.set(0, 0, 6.2)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
    renderer.setClearColor(0x050303, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    host.appendChild(renderer.domElement)

    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    const afterimagePass = new AfterimagePass()
    afterimagePass.uniforms.damp.value = .74
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), .9, .52, .18)
    composer.addPass(renderPass)
    composer.addPass(afterimagePass)
    composer.addPass(bloomPass)

    const mainGroup = new THREE.Group()
    scene.add(mainGroup)

    const { positions, colors } = makeAtmosphereParticles()
    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const particleMaterial = new THREE.PointsMaterial({
      size: .026,
      vertexColors: true,
      transparent: true,
      opacity: .74,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    })
    const particles = new THREE.Points(particleGeometry, particleMaterial)
    particles.scale.set(1.25, 1, 1)
    mainGroup.add(particles)

    const ambient = new THREE.AmbientLight(0x2a0b0e, 1)
    const glow = new THREE.PointLight(0x6e1d28, 2.8, 10)
    glow.position.set(0, .2, 2)
    scene.add(ambient, glow)

    let frame = 0
    let width = 1
    let height = 1
    const startedAt = performance.now()

    const resize = () => {
      const rect = host.getBoundingClientRect()
      width = Math.max(1, Math.floor(rect.width))
      height = Math.max(1, Math.floor(rect.height))
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
      composer.setSize(width, height)
      bloomPass.setSize(width, height)
    }

    const render = () => {
      const elapsed = (performance.now() - startedAt) / 1000
      const { currentTime, isPlaying } = playbackRef.current
      const bands = bandsRef.current
      const fallbackPulse = isPlaying ? (Math.sin(currentTime * Math.PI * 3.8) + 1) / 2 : 0
      const level = Math.max(bands.level, isPlaying ? .16 + fallbackPulse * .34 : .04)
      const bass = Math.max(bands.bass, isPlaying ? fallbackPulse * .4 : 0)
      const mid = Math.max(bands.mid, isPlaying ? .1 + ((Math.sin(currentTime * 2.4) + 1) / 2) * .24 : 0)
      const high = Math.max(bands.high, isPlaying ? .06 + ((Math.sin(currentTime * 7.8) + 1) / 2) * .2 : 0)

      mainGroup.rotation.y += .0018 + mid * .003
      mainGroup.rotation.z = Math.sin(elapsed * .13) * (.015 + high * .02)

      const particleScale = 1 + bass * .12
      particles.scale.set(1.25 * particleScale * (1 + high * .03), particleScale * (1 + mid * .02), particleScale)
      particleMaterial.opacity = .16 + level * .3
      particleMaterial.size = .012 + high * .022 + level * .008
      glow.intensity = .9 + level * 2.8

      camera.position.x = Math.sin(elapsed * .18) * (.2 + mid * .5)
      camera.position.y = Math.sin(elapsed * .23) * (.12 + high * .28)
      camera.lookAt(scene.position)

      composer.render()
      frame = requestAnimationFrame(render)
    }

    resize()
    frame = requestAnimationFrame(render)
    window.addEventListener('resize', resize, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      composer.dispose()
      renderer.dispose()
      particleGeometry.dispose()
      particleMaterial.dispose()
      host.removeChild(renderer.domElement)
    }
  }, [bandsRef])

  return <div ref={hostRef} className="reactive-archive-background" aria-hidden="true" />
}
