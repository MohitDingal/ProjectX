import { useEffect } from 'react'
import { Decal, useTexture } from '@react-three/drei'
import { SRGBColorSpace, type Texture } from 'three'
import type { DecalInstance } from '@/types'
import {
  AREA_PROJECTOR_DEPTH,
  DECAL_BASE_SIZE,
} from '@/utils/constants'
import { uvToLocalPosition } from '@/utils/geometry'
import { useDecalDrag } from './useDecalDrag'

/**
 * A single decal projected onto the parent shirt mesh via DecalGeometry.
 * Position/scale come from the normalized (u, v) + scale stored for the decal;
 * the projector depth is generous so projection survives surface curvature.
 */
export function DecalItem({ decal }: { decal: DecalInstance }) {
  const texture = useTexture(decal.src) as Texture
  const handlers = useDecalDrag(decal.id)

  useEffect(() => {
    texture.colorSpace = SRGBColorSpace
    texture.anisotropy = 8
    texture.needsUpdate = true
  }, [texture])

  const [x, y, z] = uvToLocalPosition(decal.u, decal.v)
  const size = DECAL_BASE_SIZE * decal.scale

  return (
    <Decal
      position={[x, y, z]}
      rotation={[0, 0, decal.rotation]}
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
