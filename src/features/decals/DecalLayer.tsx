import { Suspense } from 'react'
import { useStore } from '@/store/useStore'
import { DecalItem } from './DecalItem'

/**
 * Renders every placed decal as a child of the shirt mesh. Wrapped in Suspense
 * because each decal texture loads asynchronously.
 */
export function DecalLayer() {
  const decals = useStore((s) => s.decals)
  return (
    <Suspense fallback={null}>
      {decals.map((decal) => (
        <DecalItem key={decal.id} decal={decal} />
      ))}
    </Suspense>
  )
}
