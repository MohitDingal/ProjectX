import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import { type Vector3Tuple } from 'three'
import { useStore, useSelectedDecal } from '@/store/useStore'
import { useThemePalette } from '@/features/theme/useThemeSync'
import { rgbToHex } from '@/utils/color'
import {
  AREA_CENTER,
  AREA_HALF,
  DECAL_BASE_SIZE,
} from '@/utils/constants'
import { uvToLocalPosition } from '@/utils/geometry'

/** Closed-loop corner points for a square centered at (cx, cy) on plane z. */
function squareLoop(cx: number, cy: number, z: number, half: number): Vector3Tuple[] {
  return [
    [cx - half, cy - half, z],
    [cx + half, cy - half, z],
    [cx + half, cy + half, z],
    [cx - half, cy + half, z],
    [cx - half, cy - half, z],
  ]
}

function paletteToHex(channels: string): string {
  const [r, g, b] = channels.split(' ').map(Number)
  return rgbToHex({ r, g, b })
}

/**
 * Editing aids drawn in the scene:
 *  - the fixed customization square (shown while editing, hidden on export)
 *  - a highlight around the currently selected decal
 *
 * Both use `depthTest={false}` so they read clearly over the shirt, and both
 * disappear from exported images because the export toggles `showBoundary` off
 * and clears the selection first.
 */
export function BoundaryOverlay() {
  const show = useStore((s) => s.showBoundary)
  const selected = useSelectedDecal()
  const palette = useThemePalette()

  const accentHex = useMemo(() => paletteToHex(palette.accentLight), [palette.accentLight])

  const boundaryPoints = useMemo(
    () => squareLoop(AREA_CENTER[0], AREA_CENTER[1], AREA_CENTER[2] + 0.004, AREA_HALF),
    [],
  )

  const selectionPoints = useMemo(() => {
    if (!selected) return null
    const [x, y] = uvToLocalPosition(selected.u, selected.v)
    const half = (DECAL_BASE_SIZE * selected.scale) / 2
    return squareLoop(x, y, AREA_CENTER[2] + 0.006, half)
  }, [selected])

  return (
    <group>
      {show && (
        <Line
          points={boundaryPoints}
          color={accentHex}
          lineWidth={1.6}
          dashed
          dashScale={60}
          transparent
          opacity={0.65}
          depthTest={false}
          renderOrder={20}
        />
      )}
      {show && selectionPoints && (
        <Line
          points={selectionPoints}
          color={accentHex}
          lineWidth={2.4}
          transparent
          opacity={0.95}
          depthTest={false}
          renderOrder={21}
        />
      )}
    </group>
  )
}
