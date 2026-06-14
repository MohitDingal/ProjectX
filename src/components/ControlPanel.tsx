import { useState, type ReactNode } from 'react'
import { ColorPicker } from './ColorPicker'
import { DecalLibrary } from './DecalLibrary'
import { PaletteIcon, SparklesIcon } from './icons'

type Tab = 'color' | 'art'

function ChevronDownIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width="1.1em"
      height="1.1em"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

/**
 * Main editing panel. Floats on the left on desktop, and becomes a collapsible bottom sheet
 * on mobile screens. Tabs keep the panel compact, and can be collapsed down out of the viewport.
 */
export function ControlPanel() {
  const [tab, setTab] = useState<Tab>('color')
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={`pointer-events-auto fixed bottom-0 left-0 right-0 z-20 flex max-h-[54dvh] flex-col rounded-2xl rounded-b-none border-2 border-white bg-zinc-950 shadow-2xl transition-transform duration-300 ease-out md:bottom-auto md:right-auto md:left-4 md:top-24 md:max-h-[calc(100dvh-9rem)] md:w-[340px] md:rounded-2xl md:translate-y-0 ${
        isCollapsed ? 'translate-y-[calc(100%-56px)]' : 'translate-y-0'
      }`}
      aria-label="Design controls"
    >
      <div className="flex items-center justify-between border-b-2 border-white p-2 gap-2">
        <div className="flex flex-1 gap-1">
          <TabButton
            active={tab === 'color'}
            onClick={() => {
              setTab('color')
              setIsCollapsed(false)
            }}
            Icon={PaletteIcon}
          >
            Color
          </TabButton>
          <TabButton
            active={tab === 'art'}
            onClick={() => {
              setTab('art')
              setIsCollapsed(false)
            }}
            Icon={SparklesIcon}
          >
            Artwork
          </TabButton>
        </div>

        {/* Mobile Collapse/Expand Trigger */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand panel' : 'Collapse panel'}
          className="grid h-9 w-9 place-items-center border-2 border-white bg-zinc-900 text-white transition-all hover:bg-zinc-800 md:hidden"
        >
          <ChevronDownIcon
            className={`transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </button>
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
      className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold transition-colors ${
        active ? 'bg-accent text-accent-fg' : 'text-white/70 hover:bg-white/10'
      }`}
    >
      <Icon /> {children}
    </button>
  )
}
