import { useMemo, useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Color, Mesh, MeshStandardMaterial, type Object3D } from 'three'
import { useStore } from '@/store/useStore'
import { SHIRT_MODEL_URL } from '@/utils/constants'

interface GLTFResult {
  nodes: Record<string, Object3D>
  materials: Record<string, MeshStandardMaterial>
}

/**
 * Loads the baked T-shirt GLB and renders it with a material whose color we
 * animate toward the store's selected color (smooth transitions). Any children
 * (decals, boundary overlay) are projected onto this mesh.
 */
export function ShirtModel({ children }: { children?: ReactNode }) {
  const { nodes, materials } = useGLTF(SHIRT_MODEL_URL) as unknown as GLTFResult

  // Resolve the shirt mesh by its known name, with a defensive fallback.
  const meshNode = useMemo<Mesh>(() => {
    const known = nodes.T_Shirt_male
    if (known && (known as Mesh).isMesh) return known as Mesh
    for (const key of Object.keys(nodes)) {
      const n = nodes[key]
      if ((n as Mesh).isMesh) return n as Mesh
    }
    throw new Error('No mesh found in the shirt model.')
  }, [nodes])

  // Clone the baked material so animating its color never mutates the cache.
  const material = useMemo(() => {
    const base = (materials.lambert1 ?? (meshNode.material as MeshStandardMaterial))
    const cloned = base.clone() as MeshStandardMaterial
    cloned.color = new Color(useStore.getState().color)
    return cloned
  }, [materials, meshNode])

  const tmpColor = useRef(new Color())

  useFrame((_, delta) => {
    const { color, roughness, metalness } = useStore.getState()
    tmpColor.current.set(color)
    // Frame-rate independent exponential smoothing.
    const t = 1 - Math.pow(0.0015, delta)
    material.color.lerp(tmpColor.current, t)
    material.roughness = roughness
    material.metalness = metalness
  })

  return (
    <group dispose={null}>
      <mesh geometry={meshNode.geometry} material={material} castShadow receiveShadow>
        {children}
      </mesh>
    </group>
  )
}

useGLTF.preload(SHIRT_MODEL_URL)
