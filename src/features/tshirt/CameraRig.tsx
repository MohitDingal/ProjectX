import { OrbitControls } from '@react-three/drei'
import { useStore } from '@/store/useStore'
import {
  CAMERA_AZIMUTH_LIMIT,
  CAMERA_MAX_DISTANCE,
  CAMERA_MIN_DISTANCE,
  CAMERA_POLAR_MAX,
  CAMERA_POLAR_MIN,
} from '@/utils/constants'

/**
 * OrbitControls locked to the FRONT of the shirt. Azimuth is clamped to a
 * narrow window so the back is never reachable; polar angle stays near the
 * horizon; panning is disabled and zoom is limited to a subtle range.
 *
 * Controls are disabled while a decal is being dragged so the two gestures
 * never fight each other.
 */
export function CameraRig() {
  const isDraggingDecal = useStore((s) => s.isDraggingDecal)

  return (
    <OrbitControls
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
      target={[0, 0.02, 0]}
    />
  )
}
