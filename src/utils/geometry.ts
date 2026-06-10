import { Vector3 } from 'three'
import {
  AREA_CENTER,
  AREA_HALF,
  DECAL_BASE_SIZE,
} from './constants'
import { clamp } from './color'

/**
 * Clamp a normalized (u, v) position so that a decal of the given scale stays
 * ENTIRELY inside the customization square — not just its center point.
 *
 * The usable range for the center shrinks by half the decal's footprint. If a
 * decal is larger than the square, it is pinned to the center (0, 0).
 */
export function clampUV(u: number, v: number, scale: number): { u: number; v: number } {
  const half = (DECAL_BASE_SIZE * scale) / 2
  // How much of the [-1, 1] range the decal's half-size consumes.
  const margin = clamp(half / AREA_HALF, 0, 1)
  const limit = Math.max(0, 1 - margin)
  return {
    u: clamp(u, -limit, limit),
    v: clamp(v, -limit, limit),
  }
}

/** Convert a normalized (u, v) within the square to a shirt-local position. */
export function uvToLocalPosition(u: number, v: number): [number, number, number] {
  return [
    AREA_CENTER[0] + u * AREA_HALF,
    AREA_CENTER[1] + v * AREA_HALF,
    AREA_CENTER[2],
  ]
}

/**
 * Convert a world-space point that lies on the customization plane back into
 * normalized (u, v) coordinates. The shirt is unrotated at the origin, so the
 * plane's basis is simply world X (right) and world Y (up).
 */
export function worldPointToUV(point: Vector3): { u: number; v: number } {
  return {
    u: (point.x - AREA_CENTER[0]) / AREA_HALF,
    v: (point.y - AREA_CENTER[1]) / AREA_HALF,
  }
}
