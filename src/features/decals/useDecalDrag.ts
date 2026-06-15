import { useCallback, useMemo, useRef } from 'react'
import { Plane, Vector3 } from 'three'
import type { ThreeEvent } from '@react-three/fiber'
import { useStore } from '@/store/useStore'
import { AREAS } from '@/utils/constants'
import { worldPointToUV } from '@/utils/geometry'

/**
 * Pointer handlers that let a decal be dragged across the shirt while staying
 * inside the customization square of its active placement area.
 */
export function useDecalDrag(id: string) {
  const dragging = useRef(false)
  const selectDecal = useStore((s) => s.selectDecal)
  const setDecalPosition = useStore((s) => s.setDecalPosition)
  const setDraggingDecal = useStore((s) => s.setDraggingDecal)

  const decal = useStore((s) => s.decals.find((d) => d.id === id))
  const area = decal?.placementArea ?? 'chest'
  const def = AREAS[area]

  const plane = useMemo(() => {
    const normal = new Vector3(...def.normal)
    const center = new Vector3(...def.center)
    return new Plane().setFromNormalAndCoplanarPoint(normal, center)
  }, [def])

  const hitPoint = useMemo(() => new Vector3(), [])

  const onPointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation()
      selectDecal(id)
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
      const { u, v } = worldPointToUV(point, area)
      setDecalPosition(id, u, v)
    },
    [id, plane, hitPoint, setDecalPosition, area],
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
