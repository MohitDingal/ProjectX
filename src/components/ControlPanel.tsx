import { useState, type ReactNode } from 'react'
import { ColorPicker } from './ColorPicker'
import { DecalLibrary } from './DecalLibrary'
import { PaletteIcon, SparklesIcon } from './icons'

type Tab = 'color' | 'art'

/**
 * Main editing panel. Floats on the left on desktop and becomes a bottom sheet
 * on small screens. Tabs keep the panel compact and touch-friendly.
 */
export function ControlPanel() {
  const [tab, setTab] = useState<Tab>('color')

  return (
    <aside
      className="pointer-events-auto fixed bottom-0 left-0 right-0 z-20 flex max-h-[54dvh] flex-col rounded-2xl rounded-b-none border border-white/10 bg-surface-muted/85 shadow-2xl backdrop-blur-xl md:bottom-auto md:right-auto md:left-4 md:top-24 md:max-h-[calc(100dvh-9rem)] md:w-[340px] md:rounded-2xl"
      aria-label="Design controls"
    >
      <div className="flex gap-1 border-b border-white/10 p-2">
        <TabButton active={tab === 'color'} onClick={() => setTab('color')} Icon={PaletteIcon}>
          Color
        </TabButton>
        <TabButton active={tab === 'art'} onClick={() => setTab('art')} Icon={SparklesIcon}>
          Artwork
        </TabButton>
      </div>

      <div className="scroll-thin overflow-y-auto p-4">
        {tab === 'color' ? <ColorPicker /> : <DecalLibrary />}
      </div>
    </aside>
  )
}

function TabButton({
  active,
  onClick,
  Icon,
  children,
}: {
  active: boolean
  onClick: () => void
  Icon: typeof PaletteIcon
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
        active ? 'bg-accent text-accent-fg' : 'text-white/70 hover:bg-white/10'
      }`}
    >
      <Icon /> {children}
    </button>
  )
}
