import { motion } from 'framer-motion'
import { Experience } from '@/features/tshirt/Experience'
import { TopBar } from '@/components/TopBar'
import { ControlPanel } from '@/components/ControlPanel'
import { DecalControls } from '@/components/DecalControls'
import { SceneLoader } from '@/components/Loader'
import { useDecalKeyboard } from '@/hooks/useDecalKeyboard'

/** The full customization experience. */
export default function CustomizerPage() {
  useDecalKeyboard()

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="relative h-[100dvh] w-full overflow-hidden bg-surface"
    >
      {/* 3D stage */}
      <Experience />
      <SceneLoader />

      {/* Subtle vignette so floating panels stay legible over the scene. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgb(var(--surface-rgb)/0.6)_100%)]" />

      {/* Overlay UI */}
      <TopBar />
      <ControlPanel />

      {/* Selected-decal controls: top-center on mobile, bottom-center (offset
          past the side panel) on desktop. */}
      <div className="pointer-events-none fixed left-0 right-0 top-[4.75rem] z-20 flex justify-center px-3 md:bottom-6 md:left-[356px] md:right-4 md:top-auto">
        <DecalControls />
      </div>
    </motion.main>
  )
}
