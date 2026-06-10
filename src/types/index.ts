/** Editing tools available for the currently selected decal. */
export type ToolId = 'move' | 'scale' | 'rotate'

/** Transform of a decal, expressed in customization-square space. */
export interface DecalTransform {
  /** Normalized horizontal position within the square, clamped to [-1, 1]. */
  u: number
  /** Normalized vertical position within the square, clamped to [-1, 1]. */
  v: number
  /** Rotation around the surface normal, in radians. */
  rotation: number
  /** Uniform scale multiplier applied to DECAL_BASE_SIZE. */
  scale: number
}

/** A decal placed on the shirt. */
export interface DecalInstance extends DecalTransform {
  id: string
  /** Image source for the texture (data URL for uploads, path for presets). */
  src: string
  /** Human-readable label, shown in the layers list. */
  name: string
}

export type LibrarySource = 'preset' | 'upload'

/** An entry in the decal library panel (preloaded or user-uploaded). */
export interface LibraryItem {
  id: string
  name: string
  src: string
  source: LibrarySource
}

/** Accent palette derived from the active shirt color. */
export interface ThemePalette {
  /** "r g b" channel strings so Tailwind's alpha modifier works. */
  accent: string
  accentDark: string
  accentLight: string
  /** Contrast-safe foreground for text/icons placed on the accent color. */
  accentFg: string
  surface: string
  surfaceMuted: string
  /** The originating hex color, kept for convenience. */
  baseHex: string
}
