import { useStore } from '@/store/useStore'
import { UploadButton } from './UploadButton'

/**
 * Grid of available decals (preloaded + user uploads). Selecting one places it
 * at the center of the customization square, ready to drag.
 */
export function DecalLibrary() {
  const library = useStore((s) => s.library)
  const addDecal = useStore((s) => s.addDecal)

  return (
    <section aria-label="Decal library" className="space-y-4">
      <UploadButton />

      <div className="grid grid-cols-3 gap-2.5">
        {library.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => addDecal({ src: item.src, name: item.name })}
            title={`Add ${item.name}`}
            aria-label={`Add ${item.name} to shirt`}
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
