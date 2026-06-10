import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { type Group } from 'three'
import { Lighting } from './Lighting'
import { ShirtModel } from './ShirtModel'

/** Slowly rotating shirt used purely as decorative landing-page background. */
function SpinningShirt() {
  const ref = useRef<Group>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.3
  })
  return (
    <group ref={ref}>
      <ShirtModel />
    </group>
  )
}

/**
 * Decorative hero scene. Unlike the customizer, it rotates freely (no
 * front-only constraint applies to the marketing background).
 */
export function HeroScene() {
  return (
    <Canvas
      className="r3f-canvas"
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.02, 1.05], fov: 30 }}
    >
      <Suspense fallback={null}>
        <Lighting withGroundShadow={false} />
        <Float speed={1.3} rotationIntensity={0.25} floatIntensity={0.7}>
          <SpinningShirt />
        </Float>
      </Suspense>
    </Canvas>
  )
}
