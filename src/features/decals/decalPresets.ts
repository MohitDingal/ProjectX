import type { LibraryItem } from '@/types'

/** Wrap raw SVG markup into an inline data URL usable as a texture source. */
function svg(markup: string): string {
  const doc = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="256" height="256">${markup}</svg>`
  return `data:image/svg+xml,${encodeURIComponent(doc)}`
}

/**
 * A small, colorful starter library so users can drop artwork onto the shirt
 * immediately. All are inline SVGs (no network requests, scale crisply).
 */
export const PRESET_DECALS: LibraryItem[] = [
  {
    id: 'preset-bolt',
    name: 'Bolt',
    source: 'preset',
    src: svg(
      '<path d="M58 6 L26 56 H46 L40 94 L74 40 H52 Z" fill="#facc15" stroke="#a16207" stroke-width="3" stroke-linejoin="round"/>',
    ),
  },
  {
    id: 'preset-star',
    name: 'Star',
    source: 'preset',
    src: svg(
      '<path d="M50 6 L61 38 H95 L67 58 L78 92 L50 71 L22 92 L33 58 L5 38 H39 Z" fill="#f97316" stroke="#7c2d12" stroke-width="3" stroke-linejoin="round"/>',
    ),
  },
  {
    id: 'preset-heart',
    name: 'Heart',
    source: 'preset',
    src: svg(
      '<path d="M50 86 C16 60 12 36 28 24 C40 15 50 24 50 32 C50 24 60 15 72 24 C88 36 84 60 50 86 Z" fill="#ef4444" stroke="#7f1d1d" stroke-width="3" stroke-linejoin="round"/>',
    ),
  },
  {
    id: 'preset-smiley',
    name: 'Smiley',
    source: 'preset',
    src: svg(
      '<circle cx="50" cy="50" r="42" fill="#fde047" stroke="#854d0e" stroke-width="4"/><circle cx="37" cy="42" r="6" fill="#1f2937"/><circle cx="63" cy="42" r="6" fill="#1f2937"/><path d="M32 60 Q50 80 68 60" fill="none" stroke="#1f2937" stroke-width="5" stroke-linecap="round"/>',
    ),
  },
  {
    id: 'preset-atom',
    name: 'Atom',
    source: 'preset',
    src: svg(
      '<g fill="none" stroke="#22d3ee" stroke-width="4"><ellipse cx="50" cy="50" rx="42" ry="16"/><ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(60 50 50)"/><ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(120 50 50)"/></g><circle cx="50" cy="50" r="8" fill="#0891b2"/>',
    ),
  },
  {
    id: 'preset-mountain',
    name: 'Peak',
    source: 'preset',
    src: svg(
      '<circle cx="72" cy="26" r="12" fill="#fbbf24"/><path d="M6 84 L34 40 L52 66 L68 44 L94 84 Z" fill="#10b981" stroke="#065f46" stroke-width="3" stroke-linejoin="round"/><path d="M28 49 L34 40 L40 49 Z" fill="#ecfdf5"/>',
    ),
  },
  {
    id: 'preset-target',
    name: 'Target',
    source: 'preset',
    src: svg(
      '<circle cx="50" cy="50" r="42" fill="none" stroke="#e11d48" stroke-width="8"/><circle cx="50" cy="50" r="26" fill="none" stroke="#e11d48" stroke-width="8"/><circle cx="50" cy="50" r="8" fill="#e11d48"/>',
    ),
  },
  {
    id: 'preset-wave',
    name: 'Wave',
    source: 'preset',
    src: svg(
      '<g fill="none" stroke-width="7" stroke-linecap="round"><path d="M8 40 Q29 18 50 40 T92 40" stroke="#3b82f6"/><path d="M8 58 Q29 36 50 58 T92 58" stroke="#60a5fa"/><path d="M8 76 Q29 54 50 76 T92 76" stroke="#93c5fd"/></g>',
    ),
  },
  {
    id: 'preset-diamond',
    name: 'Gem',
    source: 'preset',
    src: svg(
      '<path d="M30 18 H70 L92 42 L50 92 L8 42 Z" fill="#a855f7" stroke="#581c87" stroke-width="3" stroke-linejoin="round"/><path d="M30 18 L50 42 L70 18 M8 42 H92 M50 42 V92" stroke="#e9d5ff" stroke-width="2" fill="none"/>',
    ),
  },
]
