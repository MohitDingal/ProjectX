import { useEffect } from 'react'
import { Decal, useTexture } from '@react-three/drei'
import { SRGBColorSpace, type Texture } from 'three'
import type { DecalInstance } from '@/types'
import {
  AREA_PROJECTOR_DEPTH,
  DECAL_BASE_SIZE,
  AREAS,
} from '@/utils/constants'
import { uvToLocalPosition } from '@/utils/geometry'
import { useDecalDrag } from './useDecalDrag'

/**
 * A single decal projected onto the parent shirt mesh via DecalGeometry.
 * Position, rotation and scale are calculated based on its placement area (chest, back, shoulders).
 */
export function DecalItem({ decal }: { decal: DecalInstance }) {
  const texture = useTexture(decal.src) as Texture
  const handlers = useDecalDrag(decal.id)

  useEffect(() => {
    texture.colorSpace = SRGBColorSpace
    texture.anisotropy = 8
    texture.needsUpdate = true
  }, [texture])

  const area = decal.placementArea ?? 'chest'
  const def = AREAS[area]
  const [x, y, z] = uvToLocalPosition(decal.u, decal.v, area)
  const size = DECAL_BASE_SIZE * decal.scale

  return (
    <Decal
      position={[x, y, z]}
      rotation={[def.rotation[0], def.rotation[1], decal.rotation]}
      scale={[size, size, AREA_PROJECTOR_DEPTH]}
      {...handlers}
    >
      <meshStandardMaterial
        map={texture}
        transparent
        depthTest
        depthWrite={false}
        polygonOffset
        polygonOffsetFactor={-10}
        polygonOffsetUnits={-10}
        roughness={0.85}
        metalness={0}
      />
    </Decal>
  )
}
