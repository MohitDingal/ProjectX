import { HexColorPicker, HexColorInput } from 'react-colorful'
import { useStore } from '@/store/useStore'
import { PRESET_COLORS } from '@/utils/constants'
import { CheckIcon } from './icons'

/**
 * Shirt color control: quick swatches, a full HSV picker, and a hex input.
 * Updating the color re-tints the 3D shirt and re-themes the whole UI.
 */
export function ColorPicker() {
  const color = useStore((s) => s.color)
  const setColor = useStore((s) => s.setColor)

  return (
    <section aria-label="Shirt color" className="space-y-4">
      <div className="grid grid-cols-6 gap-2">
        {PRESET_COLORS.map((swatch) => {
          const active = swatch.toLowerCase() === color.toLowerCase()
          return (
            <button
              key={swatch}
              type="button"
              onClick={() => setColor(swatch)}
              aria-label={`Use color ${swatch}`}
              aria-pressed={active}
              className="relative grid aspect-square place-items-center rounded-lg border border-white/15 transition-transform hover:scale-105 focus-visible:scale-105"
              style={{ backgroundColor: swatch }}
            >
              {active && (
                <CheckIcon
                  className="text-base drop-shadow"
                  style={{ color: '#fff', mixBlendMode: 'difference' }}
                />
              )}
            </button>
          )
        })}
      </div>

      <div className="tshirt-color-picker">
        <HexColorPicker color={color} onChange={setColor} />
      </div>

      <label className="flex items-center gap-2 text-xs text-white/70">
        Hex
        <HexColorInput
          color={color}
          onChange={setColor}
          prefixed
          className="w-28 rounded-lg border border-white/15 bg-black/30 px-3 py-2 font-mono text-sm uppercase text-white outline-none focus:border-accent"
          aria-label="Hex color value"
        />
      </label>
    </section>
  )
}
