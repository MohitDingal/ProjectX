import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HeroScene } from '@/features/tshirt/HeroScene'
import { SceneLoader } from '@/components/Loader'
import { Button } from '@/components/Button'
import { SparklesIcon } from '@/components/icons'

const FEATURES = ['Live 3D preview', 'Drag-and-drop artwork', 'Upload PNG & SVG', 'Instant color themes']

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

/** Marketing landing page with a 3D shirt drifting in the background. */
export default function LandingPage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-[100dvh] w-full overflow-hidden bg-surface"
    >
      {/* 3D background (decorative; doesn't capture pointer events) */}
      <div className="pointer-events-none absolute inset-0">
        <HeroScene />
      </div>
      <SceneLoader />

      {/* Legibility gradient + accent glow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-surface via-surface/70 to-transparent" />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-accent/25 blur-[120px]" />

      {/* Top nav */}
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <span className="text-lg font-extrabold tracking-tight text-white">
          Thread<span className="text-accent">smith</span>
        </span>
        <Link
          to="/customize"
          className="text-sm font-semibold text-white/80 transition-colors hover:text-white"
        >
          Open studio →
        </Link>
      </nav>

      {/* Hero content */}
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto flex min-h-[calc(100dvh-5.5rem)] max-w-7xl flex-col justify-center px-6 pb-24"
      >
        <motion.span
          variants={item}
          className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-light"
        >
          <SparklesIcon /> Design studio · 3D
        </motion.span>

        <motion.h1
          variants={item}
          className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl"
        >
          Wear what you
          <span className="block bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">
            actually imagine.
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 max-w-xl text-lg leading-relaxed text-white/70"
        >
          Spin up a tee in seconds. Pick a color and watch the whole studio re-theme around it,
          drop in logos and artwork, then position every detail in real time on a true 3D model.
        </motion.p>

        <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
          <Link to="/customize" aria-label="Make your own T-shirt">
            <Button size="lg" variant="primary">
              Make Your Own
            </Button>
          </Link>
          <span className="text-sm text-white/50">No account needed · Free to design</span>
        </motion.div>

        <motion.ul variants={item} className="mt-12 flex flex-wrap gap-x-6 gap-y-3">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {f}
            </li>
          ))}
        </motion.ul>
      </motion.section>
    </motion.main>
  )
}
