import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Lighting } from './Lighting'
import { CameraRig } from './CameraRig'
import { ShirtModel } from './ShirtModel'
import { DecalLayer } from '@/features/decals/DecalLayer'
import { BoundaryOverlay } from '@/features/decals/BoundaryOverlay'
import { useStore } from '@/store/useStore'
import { CAMERA_FOV, CAMERA_POSITION } from '@/utils/constants'

/**
 * The interactive customizer scene: front-locked camera, lit shirt with placed
 * decals, and the editing boundary overlay.
 */
export function Experience() {
  const selectDecal = useStore((s) => s.selectDecal)

  return (
    <Canvas
      className="r3f-canvas"
      shadows
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      camera={{ position: CAMERA_POSITION, fov: CAMERA_FOV }}
      onPointerMissed={() => selectDecal(null)}
    >
      <Suspense fallback={null}>
        <Lighting />
        <ShirtModel>
          <DecalLayer />
          <BoundaryOverlay />
        </ShirtModel>
        <CameraRig />
      </Suspense>
    </Canvas>
  )
}
