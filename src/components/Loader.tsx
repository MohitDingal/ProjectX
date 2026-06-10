import { useProgress } from '@react-three/drei'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * Full-bleed loading overlay shown while 3D assets stream in. Reads drei's
 * global loading progress, so it works as a plain DOM component over the canvas.
 */
export function SceneLoader() {
  const { active, progress } = useProgress()

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none absolute inset-0 z-10 grid place-items-center bg-surface/70 backdrop-blur-sm"
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-accent" />
            <p className="text-sm font-medium text-white/80">
              Loading studio… {Math.round(progress)}%
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
