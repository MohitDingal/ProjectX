import { Vector3 } from 'three'
import {
  AREAS,
  type PlacementArea,
  DECAL_BASE_SIZE,
} from './constants'
import { clamp } from './color'

/**
 * Clamp a normalized (u, v) position so that a decal of the given scale stays
 * ENTIRELY inside the customization square — not just its center point.
 */
export function clampUV(
  u: number,
  v: number,
  scale: number,
  area: PlacementArea = 'chest'
): { u: number; v: number } {
  const def = AREAS[area]
  const half = (DECAL_BASE_SIZE * scale) / 2
  const margin = clamp(half / def.halfSize, 0, 1)
  const limit = Math.max(0, 1 - margin)
  return {
    u: clamp(u, -limit, limit),
    v: clamp(v, -limit, limit),
  }
}

/** Convert a normalized (u, v) within the active square to a shirt-local position. */
export function uvToLocalPosition(
  u: number,
  v: number,
  area: PlacementArea = 'chest'
): [number, number, number] {
  const def = AREAS[area]
  const [cx, cy, cz] = def.center
  const h = def.halfSize

  switch (area) {
    case 'chest':
      return [cx + u * h, cy + v * h, cz]
    case 'back':
      // From the back view (looking -Z): u increases to the left (which is world -X)
      return [cx - u * h, cy + v * h, cz]
    case 'left-shoulder':
      // From left view (looking -X): u increases to the right (world +Z)
      return [cx, cy + v * h, cz + u * h]
    case 'right-shoulder':
      // From right view (looking +X): u increases to the left (world -Z)
      return [cx, cy + v * h, cz - u * h]
  }
}

/** Convert a world-space point on the active customization plane back to normalized (u, v). */
export function worldPointToUV(
  point: Vector3,
  area: PlacementArea = 'chest'
): { u: number; v: number } {
  const def = AREAS[area]
  const [cx, cy, cz] = def.center
  const h = def.halfSize

  switch (area) {
    case 'chest':
      return {
        u: (point.x - cx) / h,
        v: (point.y - cy) / h,
      }
    case 'back':
      return {
        u: -(point.x - cx) / h,
        v: (point.y - cy) / h,
      }
    case 'left-shoulder':
      return {
        u: (point.z - cz) / h,
        v: (point.y - cy) / h,
      }
    case 'right-shoulder':
      return {
        u: -(point.z - cz) / h,
        v: (point.y - cy) / h,
      }
  }
}
