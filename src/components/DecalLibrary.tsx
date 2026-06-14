import { useStore } from '@/store/useStore'
import { UploadButton } from './UploadButton'
import type { PlacementArea } from '@/utils/constants'

const AREAS_LIST: { id: PlacementArea; label: string }[] = [
  { id: 'chest', label: 'Chest (Front)' },
  { id: 'back', label: 'Back' },
  { id: 'left-shoulder', label: 'L Shoulder' },
  { id: 'right-shoulder', label: 'R Shoulder' },
]

/**
 * Grid of available decals (preloaded + user uploads) with placement area controls.
 * Selecting a placement area rotates the camera to face it, and clicking a decal places it there.
 */
export function DecalLibrary() {
  const library = useStore((s) => s.library)
  const addDecal = useStore((s) => s.addDecal)
  const activeArea = useStore((s) => s.activeArea)
  const setActiveArea = useStore((s) => s.setActiveArea)

  return (
    <section aria-label="Decal library" className="space-y-4">
      {/* Placement Area Selector */}
      <div className="flex flex-col gap-2 border-b border-white/10 pb-4">
        <span className="text-[10px] font-black uppercase tracking-wider text-white/50">Placement Area</span>
        <div className="grid grid-cols-2 gap-2">
          {AREAS_LIST.map((area) => {
            const active = activeArea === area.id
            return (
              <button
                key={area.id}
                type="button"
                onClick={() => setActiveArea(area.id)}
                className={`border-2 border-white py-2 text-xs font-black uppercase tracking-wider transition-all duration-150 ${
                  active
                    ? 'bg-accent text-zinc-950 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] -translate-x-0.5 -translate-y-0.5'
                    : 'bg-zinc-950 text-white/70 hover:bg-zinc-900 hover:text-white active:translate-x-0 active:translate-y-0'
                }`}
              >
                {area.label}
              </button>
            )
          })}
        </div>
      </div>

      <UploadButton />

      <div className="grid grid-cols-3 gap-2.5">
        {library.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => addDecal({ src: item.src, name: item.name })}
            title={`Add ${item.name}`}
            aria-label={`Add ${item.name} to ${activeArea}`}
            className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/5 p-2 transition-all hover:border-accent hover:bg-white/10 focus-visible:border-accent"
          >
            <img
              src={item.src}
              alt={item.name}
              loading="lazy"
              className="h-full w-full object-contain transition-transform group-hover:scale-110"
              draggable={false}
            />
            {item.source === 'upload' && (
              <span className="absolute left-1 top-1 rounded bg-accent/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent-fg">
                You
              </span>
            )}
          </button>
        ))}
      </div>
    </section>
  )
}
