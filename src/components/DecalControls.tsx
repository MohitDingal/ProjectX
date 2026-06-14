import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useStore, useSelectedDecal } from '@/store/useStore'
import type { ToolId } from '@/types'
import { DECAL_SCALE_MAX, DECAL_SCALE_MIN } from '@/utils/constants'
import { Slider } from './Slider'
import { Button } from './Button'
import {
  CopyIcon,
  MoveIcon,
  RotateIcon,
  ScaleIcon,
  TrashIcon,
} from './icons'

const TOOLS: { id: ToolId; label: string; Icon: typeof MoveIcon }[] = [
  { id: 'move', label: 'Move', Icon: MoveIcon },
  { id: 'scale', label: 'Scale', Icon: ScaleIcon },
  { id: 'rotate', label: 'Rotate', Icon: RotateIcon },
]

const NUDGE = 0.06
const RAD = Math.PI / 180

/**
 * Editing controls for the currently selected decal: tool selector plus
 * move / scale / rotate / duplicate / delete. Mirrors the keyboard shortcuts
 * wired up in the customizer page.
 */
export function DecalControls() {
  const decal = useSelectedDecal()
  const activeTool = useStore((s) => s.activeTool)
  const setActiveTool = useStore((s) => s.setActiveTool)
  const setDecalPosition = useStore((s) => s.setDecalPosition)
  const setDecalScale = useStore((s) => s.setDecalScale)
  const setDecalRotation = useStore((s) => s.setDecalRotation)
  const duplicateDecal = useStore((s) => s.duplicateDecal)
  const removeDecal = useStore((s) => s.removeDecal)

  if (!decal) return null

  const degrees = Math.round((decal.rotation / Math.PI) * 180)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      className="pointer-events-auto w-[min(92vw,560px)] rounded-2xl border border-white/10 bg-surface-muted/85 p-4 shadow-2xl backdrop-blur-xl"
      role="group"
      aria-label={`Editing ${decal.name}`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="truncate text-sm font-semibold text-white">{decal.name}</p>
          <span className="text-[10px] font-black uppercase text-accent tracking-wider">
            Area: {decal.placementArea ?? 'chest'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => duplicateDecal(decal.id)}
            aria-label="Duplicate decal"
          >
            <CopyIcon /> <span className="hidden sm:inline">Duplicate</span>
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => removeDecal(decal.id)}
            aria-label="Delete decal"
          >
            <TrashIcon /> <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </div>

      {/* Tool selector */}
      <div className="mb-4 grid grid-cols-3 gap-1.5 rounded-xl bg-black/30 p-1" role="tablist">
        {TOOLS.map(({ id, label, Icon }) => {
          const active = activeTool === id
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTool(id)}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-colors ${
                active ? 'bg-accent text-accent-fg' : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <Icon /> {label}
            </button>
          )
        })}
      </div>

      {/* Tool body */}
      {activeTool === 'move' && (
        <div className="space-y-3">
          <p className="text-xs text-white/60">
            Drag the decal on the shirt, or nudge it within the print area:
          </p>
          <div className="mx-auto grid w-32 grid-cols-3 grid-rows-3 gap-1.5">
            <span />
            <NudgeButton label="Up" onClick={() => setDecalPosition(decal.id, decal.u, decal.v + NUDGE)}>↑</NudgeButton>
            <span />
            <NudgeButton label="Left" onClick={() => setDecalPosition(decal.id, decal.u - NUDGE, decal.v)}>←</NudgeButton>
            <NudgeButton label="Center" onClick={() => setDecalPosition(decal.id, 0, 0)}>•</NudgeButton>
            <NudgeButton label="Right" onClick={() => setDecalPosition(decal.id, decal.u + NUDGE, decal.v)}>→</NudgeButton>
            <span />
            <NudgeButton label="Down" onClick={() => setDecalPosition(decal.id, decal.u, decal.v - NUDGE)}>↓</NudgeButton>
            <span />
          </div>
        </div>
      )}

      {activeTool === 'scale' && (
        <Slider
          id="decal-scale"
          label="Size"
          min={DECAL_SCALE_MIN}
          max={DECAL_SCALE_MAX}
          step={0.01}
          value={decal.scale}
          onChange={(v) => setDecalScale(decal.id, v)}
          format={(v) => `${Math.round((v / DECAL_SCALE_MAX) * 100)}%`}
        />
      )}

      {activeTool === 'rotate' && (
        <Slider
          id="decal-rotate"
          label="Rotation"
          min={-180}
          max={180}
          step={1}
          value={degrees}
          onChange={(deg) => setDecalRotation(decal.id, deg * RAD)}
          format={(v) => `${Math.round(v)}°`}
        />
      )}
    </motion.div>
  )
}

function NudgeButton({
  children,
  label,
  onClick,
}: {
  children: ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-9 place-items-center rounded-lg bg-white/10 text-lg leading-none text-white transition-colors hover:bg-accent hover:text-accent-fg"
    >
      {children}
    </button>
  )
}
