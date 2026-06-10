import { useCallback, useMemo, useRef } from 'react'
import { Plane, Vector3 } from 'three'
import type { ThreeEvent } from '@react-three/fiber'
import { useStore } from '@/store/useStore'
import { AREA_CENTER } from '@/utils/constants'
import { worldPointToUV } from '@/utils/geometry'

/**
 * Pointer handlers that let a decal be dragged across the shirt while staying
 * inside the customization square.
 *
 * On drag, the pointer ray is intersected with the square's math-plane to get a
 * world point, which is converted to normalized (u, v) and clamped by the store.
 * Object-level pointer capture (R3F) keeps move/up events flowing to this decal
 * even when the pointer leaves the projected geometry.
 */
export function useDecalDrag(id: string) {
  const dragging = useRef(false)
  const selectDecal = useStore((s) => s.selectDecal)
  const setDecalPosition = useStore((s) => s.setDecalPosition)
  const setDraggingDecal = useStore((s) => s.setDraggingDecal)

  // Plane z = AREA_CENTER.z  →  normal (0,0,1), constant = -z.
  const plane = useMemo(() => new Plane(new Vector3(0, 0, 1), -AREA_CENTER[2]), [])
  const hitPoint = useMemo(() => new Vector3(), [])

  const onPointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation()
      selectDecal(id)
      // Dragging always repositions the decal (constrained to the square),
      // regardless of which tool's controls are currently emphasized.
      ;(e.target as Element | null)?.setPointerCapture?.(e.pointerId)
      dragging.current = true
      setDraggingDecal(true)
    },
    [id, selectDecal, setDraggingDecal],
  )

  const onPointerMove = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!dragging.current) return
      e.stopPropagation()
      const point = e.ray.intersectPlane(plane, hitPoint)
      if (!point) return
      const { u, v } = worldPointToUV(point)
      setDecalPosition(id, u, v)
    },
    [id, plane, hitPoint, setDecalPosition],
  )

  const end = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!dragging.current) return
      e.stopPropagation()
      ;(e.target as Element | null)?.releasePointerCapture?.(e.pointerId)
      dragging.current = false
      setDraggingDecal(false)
    },
    [setDraggingDecal],
  )

  return { onPointerDown, onPointerMove, onPointerUp: end, onPointerCancel: end }
}
