import type { ThemePalette } from '@/types'

export interface RGB {
  r: number
  g: number
  b: number
}
export interface HSL {
  h: number
  s: number
  l: number
}

/** Parse `#rgb` / `#rrggbb` into 0–255 channels. Falls back to mid-gray. */
export function hexToRgb(hex: string): RGB {
  let h = hex.trim().replace(/^#/, '')
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('')
  }
  const int = Number.parseInt(h, 16)
  if (Number.isNaN(int) || h.length !== 6) return { r: 128, g: 128, b: 128 }
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 }
}

export function rgbToHex({ r, g, b }: RGB): string {
  const to2 = (n: number) => Math.round(clamp(n, 0, 255)).toString(16).padStart(2, '0')
  return `#${to2(r)}${to2(g)}${to2(b)}`
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const d = max - min
  let h = 0
  if (d !== 0) {
    switch (max) {
      case rn:
        h = ((gn - bn) / d) % 6
        break
      case gn:
        h = (bn - rn) / d + 2
        break
      default:
        h = (rn - gn) / d + 4
    }
    h *= 60
    if (h < 0) h += 360
  }
  const l = (max + min) / 2
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  return { h, s: s * 100, l: l * 100 }
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const sn = s / 100
  const ln = l / 100
  const c = (1 - Math.abs(2 * ln - 1)) * sn
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = ln - c / 2
  let r = 0
  let g = 0
  let b = 0
  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 }
}

/** Relative luminance per WCAG 2.1. */
export function relativeLuminance({ r, g, b }: RGB): number {
  const lin = (c: number) => {
    const cs = c / 255
    return cs <= 0.03928 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

/** WCAG contrast ratio between two colors (1–21). */
export function contrastRatio(a: RGB, b: RGB): number {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  const lighter = Math.max(la, lb)
  const darker = Math.min(la, lb)
  return (lighter + 0.05) / (darker + 0.05)
}

/** Pick black or white text for maximum contrast on the given background. */
export function readableTextOn(bg: RGB): RGB {
  const white = { r: 255, g: 255, b: 255 }
  const black = { r: 17, g: 17, b: 17 }
  return contrastRatio(bg, white) >= contrastRatio(bg, black) ? white : black
}

const channels = ({ r, g, b }: RGB): string =>
  `${Math.round(r)} ${Math.round(g)} ${Math.round(b)}`

/**
 * Build an accessible accent palette from the chosen shirt color.
 *
 * The accent is nudged toward a usable mid-lightness/saturation so that very
 * dark, very light, or fully desaturated shirts still yield a legible,
 * vibrant UI accent. Foreground colors are chosen for WCAG contrast.
 */
export function buildPalette(hex: string): ThemePalette {
  const baseHsl = rgbToHsl(hexToRgb(hex))

  // Keep some chroma even for white/black/gray shirts.
  const sat = clamp(baseHsl.s < 12 ? 70 : baseHsl.s, 45, 92)

  const accent = hslToRgb({ h: baseHsl.h, s: sat, l: clamp(baseHsl.l, 48, 62) })
  const accentDark = hslToRgb({ h: baseHsl.h, s: sat, l: clamp(baseHsl.l - 14, 30, 48) })
  const accentLight = hslToRgb({ h: baseHsl.h, s: clamp(sat - 25, 25, 70), l: 86 })

  // Dark, slightly hue-tinted surfaces keep the UI cohesive with the accent.
  const surface = hslToRgb({ h: baseHsl.h, s: 22, l: 9 })
  const surfaceMuted = hslToRgb({ h: baseHsl.h, s: 20, l: 15 })

  return {
    accent: channels(accent),
    accentDark: channels(accentDark),
    accentLight: channels(accentLight),
    accentFg: channels(readableTextOn(accent)),
    surface: channels(surface),
    surfaceMuted: channels(surfaceMuted),
    baseHex: hex,
  }
}
