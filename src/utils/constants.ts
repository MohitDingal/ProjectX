/**
 * Central tuning constants for the 3D scene and the decal system.
 *
 * The customization square is defined in the shirt mesh's LOCAL space.
 * The shirt group sits at the origin with no rotation, so local space and
 * world space coincide — which keeps the drag math (see useDecalDrag) trivial.
 */

export const SHIRT_MODEL_URL = '/shirt_baked.glb'

/** Center of the printable square on the chest (shirt-local coordinates). */
export const AREA_CENTER: readonly [number, number, number] = [0, 0.04, 0.13]

/** Half-width and half-height of the square (it is square by requirement). */
export const AREA_HALF = 0.13

/**
 * Depth of the decal projector box. Generous enough that the projection still
 * lands on the chest where the surface curves away, while staying clear of the
 * back of the shirt so artwork never bleeds through.
 */
export const AREA_PROJECTOR_DEPTH = 0.25

/** World-space edge length of a decal at scale = 1. */
export const DECAL_BASE_SIZE = 0.11

export const DECAL_SCALE_MIN = 0.35
export const DECAL_SCALE_MAX = 2.2

/** Default shirt color (a friendly blue). */
export const DEFAULT_SHIRT_COLOR = '#3b82f6'

/** Quick-pick swatches shown next to the color picker. */
export const PRESET_COLORS: readonly string[] = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#22c55e', // green
  '#f59e0b', // amber
  '#a855f7', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
  '#0ea5e9', // sky
  '#f8fafc', // white
  '#1e293b', // slate
  '#111827', // near-black
  '#eab308', // gold
]

/** Camera framing for the customizer (front-facing, locked). */
export const CAMERA_POSITION: [number, number, number] = [0, 0.05, 0.95]
export const CAMERA_FOV = 28

/** Azimuth (left/right) limit in radians — small enough to never see the back. */
export const CAMERA_AZIMUTH_LIMIT = 0.4 // ≈ 23°
/** Polar (up/down) limits in radians, around the horizon. */
export const CAMERA_POLAR_MIN = Math.PI / 2 - 0.35
export const CAMERA_POLAR_MAX = Math.PI / 2 + 0.18
export const CAMERA_MIN_DISTANCE = 0.7
export const CAMERA_MAX_DISTANCE = 1.25
