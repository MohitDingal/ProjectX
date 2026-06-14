import { Link } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { downloadShirtSnapshot } from '@/utils/snapshot'
import { ArrowLeftIcon, DownloadIcon, ResetIcon } from './icons'

/** Fixed top bar for the customizer: navigation, reset, and PNG export. */
export function TopBar() {
  const color = useStore((s) => s.color)
  const reset = useStore((s) => s.reset)

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-16 w-full items-center justify-between border-b-[3px] border-white bg-zinc-950 px-4 md:h-20 md:px-6">
      <div className="flex items-center gap-3">
        <Link
          to="/"
          aria-label="Back to home"
          className="grid h-9 w-9 place-items-center border-2 border-white bg-zinc-950 text-white shadow-[2px_2px_0px_0px_rgb(var(--accent-rgb))] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgb(var(--accent-rgb))] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_0px_rgb(var(--accent-rgb))]"
        >
          <ArrowLeftIcon className="text-lg" strokeWidth={2.5} />
        </Link>
        <span className="text-base font-black tracking-tighter uppercase text-white select-none sm:text-lg md:text-xl">
          THREAD
          <span className="ml-1.5 border-2 border-white bg-accent px-1.5 py-0.5 text-zinc-950 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] sm:px-2">
            SMITH
          </span>
        </span>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <span
          className="hidden h-9 w-9 border-2 border-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] sm:block"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
        <button
          type="button"
          onClick={reset}
          aria-label="Reset design"
          className="inline-flex h-9 items-center justify-center gap-2 border-2 border-white bg-zinc-950 px-3 text-sm font-black uppercase text-white shadow-[2px_2px_0px_0px_rgb(var(--accent-rgb))] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgb(var(--accent-rgb))] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_0px_rgb(var(--accent-rgb))]"
        >
          <ResetIcon strokeWidth={2.2} />
          <span className="hidden sm:inline">Reset</span>
        </button>
        <button
          type="button"
          onClick={() => void downloadShirtSnapshot()}
          aria-label="Download design as PNG"
          className="inline-flex h-9 items-center justify-center gap-2 border-2 border-white bg-accent px-3 text-sm font-black uppercase text-zinc-950 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_0px_rgba(255,255,255,1)]"
        >
          <DownloadIcon strokeWidth={2.2} />
          <span>Save</span>
        </button>
      </div>
    </header>
  )
}
