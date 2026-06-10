import { useEffect } from 'react'
import { useStore } from '@/store/useStore'

const POS_STEP = 0.04
const SCALE_STEP = 0.05
const ROT_STEP = (5 * Math.PI) / 180

function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null
  if (!el) return false
  return (
    el.tagName === 'INPUT' ||
    el.tagName === 'TEXTAREA' ||
    el.tagName === 'SELECT' ||
    el.isContentEditable
  )
}

/**
 * Keyboard control for the selected decal (accessibility + power users):
 *  - Esc: deselect
 *  - Delete / Backspace: remove
 *  - Arrows: move / scale / rotate depending on the active tool
 */
export function useDecalKeyboard(): void {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return
      const state = useStore.getState()

      if (e.key === 'Escape') {
        state.selectDecal(null)
        return
      }

      const id = state.selectedDecalId
      if (!id) return
      const decal = state.decals.find((d) => d.id === id)
      if (!decal) return

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        state.removeDecal(id)
        return
      }

      let handled = true
      if (state.activeTool === 'move') {
        if (e.key === 'ArrowUp') state.setDecalPosition(id, decal.u, decal.v + POS_STEP)
        else if (e.key === 'ArrowDown') state.setDecalPosition(id, decal.u, decal.v - POS_STEP)
        else if (e.key === 'ArrowLeft') state.setDecalPosition(id, decal.u - POS_STEP, decal.v)
        else if (e.key === 'ArrowRight') state.setDecalPosition(id, decal.u + POS_STEP, decal.v)
        else handled = false
      } else if (state.activeTool === 'scale') {
        if (e.key === 'ArrowUp' || e.key === 'ArrowRight') state.setDecalScale(id, decal.scale + SCALE_STEP)
        else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') state.setDecalScale(id, decal.scale - SCALE_STEP)
        else handled = false
      } else {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') state.setDecalRotation(id, decal.rotation + ROT_STEP)
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') state.setDecalRotation(id, decal.rotation - ROT_STEP)
        else handled = false
      }

      if (handled) e.preventDefault()
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
}
