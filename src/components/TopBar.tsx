import { Link } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { downloadShirtSnapshot } from '@/utils/snapshot'
import { Button } from './Button'
import { ArrowLeftIcon, DownloadIcon, ResetIcon } from './icons'

/** Fixed top bar for the customizer: navigation, reset, and PNG export. */
export function TopBar() {
  const color = useStore((s) => s.color)
  const reset = useStore((s) => s.reset)

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-center justify-between gap-3 p-3 md:p-4">
      <div className="pointer-events-auto flex items-center gap-2.5 rounded-2xl border border-white/10 bg-surface-muted/70 px-3 py-2 backdrop-blur-xl">
        <Link
          to="/"
          aria-label="Back to home"
          className="grid h-8 w-8 place-items-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ArrowLeftIcon className="text-lg" />
        </Link>
        <span className="text-sm font-extrabold tracking-tight text-white">
          Thread<span className="text-accent">smith</span>
        </span>
      </div>

      <div className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-white/10 bg-surface-muted/70 px-2.5 py-2 backdrop-blur-xl">
        <span
          className="hidden h-7 w-7 rounded-lg border border-white/20 sm:block"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
        <Button size="sm" variant="ghost" onClick={reset} aria-label="Reset design">
          <ResetIcon /> <span className="hidden sm:inline">Reset</span>
        </Button>
        <Button
          size="sm"
          variant="primary"
          onClick={() => void downloadShirtSnapshot()}
          aria-label="Download design as PNG"
        >
          <DownloadIcon /> Save
        </Button>
      </div>
    </header>
  )
}
