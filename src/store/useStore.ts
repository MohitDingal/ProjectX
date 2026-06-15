import { create } from 'zustand'
import type { DecalInstance, DecalTransform, LibraryItem, ToolId } from '@/types'
import {
  DECAL_SCALE_MAX,
  DECAL_SCALE_MIN,
  DEFAULT_SHIRT_COLOR,
} from '@/utils/constants'
import { clamp } from '@/utils/color'
import { clampUV } from '@/utils/geometry'
import { PRESET_DECALS } from '@/features/decals/decalPresets'

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export interface StoreState {
  // --- Shirt ---
  color: string
  roughness: number
  metalness: number

  // --- Decals ---
  decals: DecalInstance[]
  selectedDecalId: string | null

  // --- Library ---
  library: LibraryItem[]

  // --- UI ---
  activeArea: 'chest' | 'back' | 'left-shoulder' | 'right-shoulder'
  activeTool: ToolId
  showBoundary: boolean
  isDraggingDecal: boolean

  // --- Shirt actions ---
  setColor: (hex: string) => void
  setMaterial: (partial: Partial<{ roughness: number; metalness: number }>) => void

  // --- Decal actions ---
  addDecal: (item: Pick<LibraryItem, 'src' | 'name'>) => string
  removeDecal: (id: string) => void
  duplicateDecal: (id: string) => void
  selectDecal: (id: string | null) => void
  updateDecal: (id: string, patch: Partial<DecalTransform>) => void
  setDecalPosition: (id: string, u: number, v: number) => void
  setDecalScale: (id: string, scale: number) => void
  setDecalRotation: (id: string, rotation: number) => void
  clearDecals: () => void

  // --- Library actions ---
  addLibraryItem: (item: Omit<LibraryItem, 'id' | 'source'>) => LibraryItem

  // --- UI actions ---
  setActiveArea: (area: 'chest' | 'back' | 'left-shoulder' | 'right-shoulder') => void
  setActiveTool: (tool: ToolId) => void
  setShowBoundary: (show: boolean) => void
  setDraggingDecal: (dragging: boolean) => void

  reset: () => void
}

const selectedDecal = (state: StoreState): DecalInstance | undefined =>
  state.decals.find((d) => d.id === state.selectedDecalId)

export const useStore = create<StoreState>((set, get) => ({
  // --- Shirt ---
  color: DEFAULT_SHIRT_COLOR,
  roughness: 0.75,
  metalness: 0.05,

  // --- Decals ---
  decals: [],
  selectedDecalId: null,

  // --- Library ---
  library: [...PRESET_DECALS],

  // --- UI ---
  activeArea: 'chest',
  activeTool: 'move',
  showBoundary: true,
  isDraggingDecal: false,

  // --- Shirt actions ---
  setColor: (hex) => set({ color: hex }),
  setMaterial: (partial) => set((s) => ({ ...s, ...partial })),

  // --- Decal actions ---
  addDecal: ({ src, name }) => {
    const id = newId()
    const decal: DecalInstance = {
      id,
      src,
      name,
      u: 0,
      v: 0,
      rotation: 0,
      scale: 1,
      placementArea: get().activeArea,
    }
    set((s) => ({ decals: [...s.decals, decal], selectedDecalId: id, activeTool: 'move' }))
    return id
  },

  removeDecal: (id) =>
    set((s) => ({
      decals: s.decals.filter((d) => d.id !== id),
      selectedDecalId: s.selectedDecalId === id ? null : s.selectedDecalId,
    })),

  duplicateDecal: (id) => {
    const source = get().decals.find((d) => d.id === id)
    if (!source) return
    const copy: DecalInstance = { ...source, id: newId() }
    const offset = clampUV(source.u + 0.12, source.v - 0.12, source.scale)
    copy.u = offset.u
    copy.v = offset.v
    set((s) => ({ decals: [...s.decals, copy], selectedDecalId: copy.id }))
  },

  selectDecal: (id) => set({ selectedDecalId: id }),

  updateDecal: (id, patch) =>
    set((s) => ({
      decals: s.decals.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    })),

  setDecalPosition: (id, u, v) =>
    set((s) => ({
      decals: s.decals.map((d) => {
        if (d.id !== id) return d
        const clamped = clampUV(u, v, d.scale)
        return { ...d, ...clamped }
      }),
    })),

  setDecalScale: (id, scale) =>
    set((s) => ({
      decals: s.decals.map((d) => {
        if (d.id !== id) return d
        const nextScale = clamp(scale, DECAL_SCALE_MIN, DECAL_SCALE_MAX)
        // Re-clamp position so a larger decal can't spill past the boundary.
        const clamped = clampUV(d.u, d.v, nextScale)
        return { ...d, scale: nextScale, ...clamped }
      }),
    })),

  setDecalRotation: (id, rotation) =>
    set((s) => ({
      decals: s.decals.map((d) => (d.id === id ? { ...d, rotation } : d)),
    })),

  clearDecals: () => set({ decals: [], selectedDecalId: null }),

  // --- Library actions ---
  addLibraryItem: ({ name, src }) => {
    const item: LibraryItem = { id: newId(), name, src, source: 'upload' }
    set((s) => ({ library: [item, ...s.library] }))
    return item
  },

  // --- UI actions ---
  setActiveArea: (area) => set({ activeArea: area }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setShowBoundary: (show) => set({ showBoundary: show }),
  setDraggingDecal: (dragging) => set({ isDraggingDecal: dragging }),

  reset: () =>
    set({
      color: DEFAULT_SHIRT_COLOR,
      roughness: 0.75,
      metalness: 0.05,
      decals: [],
      selectedDecalId: null,
      activeArea: 'chest',
      activeTool: 'move',
      showBoundary: true,
      isDraggingDecal: false,
    }),
}))

/** Convenience hook: the currently selected decal (or undefined). */
export const useSelectedDecal = (): DecalInstance | undefined =>
  useStore(selectedDecal)
