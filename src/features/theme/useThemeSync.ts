import { useEffect, useMemo } from 'react'
import { useStore } from '@/store/useStore'
import { buildPalette } from '@/utils/color'
import type { ThemePalette } from '@/types'

/**
 * Derive the accent palette from the active shirt color, memoized so it only
 * recomputes when the color changes.
 */
export function useThemePalette(): ThemePalette {
  const color = useStore((s) => s.color)
  return useMemo(() => buildPalette(color), [color])
}

/**
 * Sync the derived palette into CSS custom properties on the document root.
 * Tailwind's `accent`/`surface` colors read these variables, so the entire UI
 * re-themes automatically when the shirt color changes.
 */
export function useThemeSync(): void {
  const palette = useThemePalette()

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--accent-rgb', palette.accent)
    root.style.setProperty('--accent-dark-rgb', palette.accentDark)
    root.style.setProperty('--accent-light-rgb', palette.accentLight)
    root.style.setProperty('--accent-fg-rgb', palette.accentFg)
    root.style.setProperty('--surface-rgb', palette.surface)
    root.style.setProperty('--surface-muted-rgb', palette.surfaceMuted)
  }, [palette])
}
