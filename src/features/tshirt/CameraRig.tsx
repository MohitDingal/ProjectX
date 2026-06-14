import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Vector3 } from 'three'
import { useStore } from '@/store/useStore'
import {
  CAMERA_AZIMUTH_LIMIT,
  CAMERA_MAX_DISTANCE,
  CAMERA_MIN_DISTANCE,
  CAMERA_POLAR_MAX,
  CAMERA_POLAR_MIN,
} from '@/utils/constants'

/**
 * OrbitControls configured for 360-degree rotation.
 * If the user switches placement area in the UI (e.g. Chest, Back, Shoulders),
 * the camera smoothly orbits/transitions to face that specific area.
 * Adjusts camera framing target Y offset on mobile so the shirt stays visible.
 */
export function CameraRig() {
  const isDraggingDecal = useStore((s) => s.isDraggingDecal)
  const activeArea = useStore((s) => s.activeArea ?? 'chest')
  const controlsRef = useRef<any>(null)
  const { camera, size } = useThree()

  const isMobile = size.width < 768
  const targetY = isMobile ? -0.05 : 0.02

  // Target position to lerp towards when activeArea changes
  const targetPos = useRef(new Vector3(0, 0.05, 1.12))

  useEffect(() => {
    const d = 1.12 // matches default framing distance
    const yVal = isMobile ? 0.01 : 0.05 // adjust height offset on mobile
    const yShoulder = isMobile ? 0.04 : 0.08
    switch (activeArea) {
      case 'chest':
        targetPos.current.set(0, yVal, d)
        break
      case 'back':
        targetPos.current.set(0, yVal, -d)
        break
      case 'left-shoulder':
        targetPos.current.set(-d, yShoulder, 0)
        break
      case 'right-shoulder':
        targetPos.current.set(d, yShoulder, 0)
        break
    }
  }, [activeArea, isMobile])

  useFrame((_, delta) => {
    if (!controlsRef.current) return

    // Smoothly transition the camera towards the target position
    if (camera.position.distanceToSquared(targetPos.current) > 0.001) {
      const t = 1 - Math.pow(0.005, delta)
      camera.position.lerp(targetPos.current, t)
      controlsRef.current.update()
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enabled={!isDraggingDecal}
      enablePan={false}
      enableZoom
      enableDamping
      dampingFactor={0.12}
      rotateSpeed={0.45}
      zoomSpeed={0.6}
      minDistance={CAMERA_MIN_DISTANCE}
      maxDistance={CAMERA_MAX_DISTANCE}
      minAzimuthAngle={-CAMERA_AZIMUTH_LIMIT}
      maxAzimuthAngle={CAMERA_AZIMUTH_LIMIT}
      minPolarAngle={CAMERA_POLAR_MIN}
      maxPolarAngle={CAMERA_POLAR_MAX}
      target={[0, targetY, 0]}
    />
  )
}
