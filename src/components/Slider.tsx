import { type ChangeEvent } from 'react'

interface SliderProps {
  id: string
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  /** Formats the value for display (e.g. degrees, percentage). */
  format?: (value: number) => string
}

/** Accessible range slider whose accent tracks the active theme color. */
export function Slider({
  id,
  label,
  value,
  min,
  max,
  step = 0.01,
  onChange,
  format,
}: SliderProps) {
  const handle = (e: ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value))
  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-medium text-white/70">
          {label}
        </label>
        <span className="tabular-nums text-xs font-semibold text-white/90">
          {format ? format(value) : value.toFixed(2)}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handle}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/15"
        style={{ accentColor: 'rgb(var(--accent-rgb))' }}
        aria-valuetext={format ? format(value) : value.toFixed(2)}
      />
    </div>
  )
}
