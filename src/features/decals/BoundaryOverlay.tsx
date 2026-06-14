import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import { type Vector3Tuple } from 'three'
import { useStore, useSelectedDecal } from '@/store/useStore'
import { useThemePalette } from '@/features/theme/useThemeSync'
import { rgbToHex } from '@/utils/color'
import {
  AREAS,
  DECAL_BASE_SIZE,
} from '@/utils/constants'

/** Closed-loop local square corner points on a local Z-offset plane. */
function localSquareLoop(half: number, offsetZ: number): Vector3Tuple[] {
  return [
    [-half, -half, offsetZ],
    [half, -half, offsetZ],
    [half, half, offsetZ],
    [-half, half, offsetZ],
    [-half, -half, offsetZ],
  ]
}

function paletteToHex(channels: string): string {
  const [r, g, b] = channels.split(' ').map(Number)
  return rgbToHex({ r, g, b })
}

/**
 * Boundary lines drawn around the active editing boundary or around the selected decal,
 * mapped to their respective placement areas (chest, back, shoulders).
 */
export function BoundaryOverlay() {
  const show = useStore((s) => s.showBoundary)
  const selected = useSelectedDecal()
  const activeArea = useStore((s) => s.activeArea ?? 'chest')
  const palette = useThemePalette()

  const accentHex = useMemo(() => paletteToHex(palette.accentLight), [palette.accentLight])

  const def = AREAS[activeArea]
  const boundaryPoints = useMemo(() => localSquareLoop(def.halfSize, 0.004), [def.halfSize])

  const selectedArea = selected?.placementArea ?? 'chest'
  const selectedDef = AREAS[selectedArea]
  const selectionPoints = useMemo(() => {
    if (!selected) return null
    const half = (DECAL_BASE_SIZE * selected.scale) / 2
    return localSquareLoop(half, 0.006)
  }, [selected])

  return (
    <group>
      {show && (
        <group position={def.center} rotation={def.rotation}>
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
        </group>
      )}
      {show && selectionPoints && selected && (
        <group position={selectedDef.center} rotation={selectedDef.rotation}>
          <group position={[selected.u * selectedDef.halfSize, selected.v * selectedDef.halfSize, 0]}>
            <Line
              points={selectionPoints}
              color={accentHex}
              lineWidth={2.4}
              transparent
              opacity={0.95}
              depthTest={false}
              renderOrder={21}
            />
          </group>
        </group>
      )}
    </group>
  )
}
