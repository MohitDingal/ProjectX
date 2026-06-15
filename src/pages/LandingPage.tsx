import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SparklesIcon, CheckIcon } from '@/components/icons'

const FEATURES = ['Live 3D preview', 'Drag-and-drop artwork', 'Upload PNG & SVG', 'Instant color themes']

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

/** Marketing landing page with a neo-brutalist interactive showcase board. */
export default function LandingPage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-[100dvh] w-full overflow-hidden bg-zinc-950"
    >
      {/* Top nav */}
      <header className="relative z-20 w-full border-b-[3px] border-white bg-zinc-950 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span className="text-base font-black tracking-tighter uppercase text-white select-none sm:text-lg md:text-xl">
            THREAD
            <span className="ml-1.5 border-2 border-white bg-accent px-1.5 py-0.5 text-zinc-950 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] sm:px-2">
              SMITH
            </span>
          </span>
          <Link
            to="/customize"
            className="inline-flex h-9 items-center justify-center border-2 border-white bg-zinc-950 px-4 text-sm font-black uppercase text-white shadow-[2px_2px_0px_0px_rgb(var(--accent-rgb))] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgb(var(--accent-rgb))] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_0px_rgb(var(--accent-rgb))]"
          >
            Open studio →
          </Link>
        </div>
      </header>

      {/* Hero content */}
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto grid min-h-[calc(100dvh-4.25rem)] max-w-7xl grid-cols-1 items-center gap-12 px-6 py-12 lg:grid-cols-12 lg:py-16"
      >
        {/* Left Column: Headline and CTAs */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left">
          <motion.span
            variants={item}
            className="mb-5 inline-flex w-fit items-center gap-2 border-2 border-accent bg-accent/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-accent-light"
          >
            <SparklesIcon /> Design studio · 3D
          </motion.span>

          <motion.h1
            variants={item}
            className="max-w-2xl text-4xl font-black leading-[1.0] tracking-tighter text-white sm:text-6xl md:text-7xl uppercase"
          >
            Wear what you
            <span className="block text-accent drop-shadow-[4px_4px_0px_rgba(255,255,255,1)] my-2">
              actually imagine.
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-base leading-relaxed text-zinc-300 md:text-lg"
          >
            Spin up a tee in seconds. Pick a color and watch the whole studio re-theme around it,
            drop in logos and artwork, then position every detail in real time on a true 3D model.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/customize"
              aria-label="Make your own T-shirt"
              className="inline-flex h-14 items-center justify-center gap-2 border-[3px] border-white bg-accent px-8 text-base font-black uppercase text-zinc-950 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_0px_rgba(255,255,255,1)]"
            >
              Make Your Own
            </Link>
            <span className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">
              No account needed · Free to design
            </span>
          </motion.div>

          <motion.ul variants={item} className="mt-12 flex flex-wrap gap-3">
            {FEATURES.map((f) => (
              <li
                key={f}
                className="flex items-center gap-2 border-2 border-white/10 bg-zinc-900/40 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white/80"
              >
                <span className="h-2 w-2 bg-accent" />
                {f}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Right Column: Animated brand showcase board */}
        <motion.div
          variants={item}
          className="lg:col-span-5 relative flex h-[460px] w-full items-center justify-center select-none"
        >
          {/* Scale/Responsive wrapper */}
          <div className="relative flex h-full w-full items-center justify-center scale-[0.8] xs:scale-90 sm:scale-100 origin-center">
            
            {/* Main Showcase Panel / Central Product Card */}
            <motion.div
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative flex h-[350px] w-[270px] flex-col justify-between border-[3px] border-white bg-zinc-900 p-4 shadow-[8px_8px_0px_0px_rgb(var(--accent-rgb))] transition-shadow duration-300"
            >
              {/* Board Header details */}
              <div className="flex items-center justify-between border-b-2 border-white/20 pb-2 text-[10px] font-mono tracking-wider text-white/40">
                <span>MODEL: TS-3D</span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  ACTIVE
                </span>
              </div>

              {/* Central T-shirt Illustration (SVG) */}
              <div className="flex flex-1 items-center justify-center py-4">
                <motion.svg
                  viewBox="0 0 100 100"
                  className="h-32 w-32 filter drop-shadow-[4px_4px_0px_rgba(0,0,0,0.5)]"
                  animate={{
                    fill: [
                      "rgb(var(--accent-rgb))",
                      "#ef4444", // red
                      "#10b981", // green
                      "#f59e0b", // amber
                      "#8b5cf6", // purple
                      "rgb(var(--accent-rgb))"
                    ]
                  }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  {/* Clean geometric T-shirt outline path */}
                  <path
                    d="M 30,12 
                       C 35,22 65,22 70,12 
                       L 88,20 
                       C 84,32 78,36 74,34 
                       L 74,88 
                       L 26,88 
                       L 26,34 
                       C 22,36 16,32 12,20 
                       Z"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  {/* Decal symbol overlay inside the shirt */}
                  <path
                    d="M 50,40 L 53,48 L 61,48 L 54,53 L 57,61 L 50,56 L 43,61 L 46,53 L 39,48 L 47,48 Z"
                    fill="#ffffff"
                    className="mix-blend-difference opacity-80"
                  />
                </motion.svg>
              </div>

              {/* Board Footer details */}
              <div className="border-t-2 border-white/20 pt-2 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono tracking-wider text-white/40">EDITION</span>
                  <span className="text-xs font-black text-white">THREADSMITH 1.0</span>
                </div>
                <div className="h-6 w-12 bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                  <div className="flex gap-[2px] h-full items-center">
                    <div className="w-[2px] h-4 bg-white/40" />
                    <div className="w-[1px] h-4 bg-white/40" />
                    <div className="w-[3px] h-4 bg-white/40" />
                    <div className="w-[1px] h-4 bg-white/40" />
                    <div className="w-[2px] h-4 bg-white/40" />
                    <div className="w-[1px] h-4 bg-white/40" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* FLOATING CHIPS AROUND THE BOARD */}

            {/* 1. Color Selector Chip */}
            <motion.div
              animate={{
                y: [0, -8, 0],
                rotate: [-1, 2, -1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-[10px] left-[-30px] flex flex-col gap-1.5 border-2 border-white bg-zinc-950 p-2.5 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
            >
              <span className="text-[9px] font-black tracking-wider text-white/60 uppercase">COLOR PALETTE</span>
              <div className="flex items-center gap-1.5">
                <span className="h-4 w-4 border border-white/30 bg-accent" />
                <span className="h-4 w-4 border border-white/30 bg-red-500" />
                <span className="h-4 w-4 border border-white/30 bg-emerald-500" />
                <span className="h-4 w-4 border border-white/30 bg-amber-500" />
                <span className="h-4 w-4 border border-white/30 bg-violet-500" />
              </div>
            </motion.div>

            {/* 2. Size Chip */}
            <motion.div
              animate={{
                y: [0, 8, 0],
                rotate: [1, -2, 1],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute bottom-[30px] right-[-30px] border-2 border-white bg-zinc-950 px-3 py-2 text-xs font-black uppercase tracking-wider text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
            >
              SIZE: <span className="bg-accent px-1.5 py-0.5 text-zinc-950 ml-1">L</span>
            </motion.div>

            {/* 3. Decal Badge */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 3, 0],
              }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-[80px] right-[-45px] flex items-center gap-2 border-2 border-white bg-zinc-950 p-2 text-xs font-black uppercase text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
            >
              <SparklesIcon className="text-accent text-sm" />
              <span>DECAL: ACTIVE</span>
            </motion.div>

            {/* 4. Organic Cotton tag */}
            <motion.div
              animate={{
                y: [0, 6, 0],
                rotate: [-2, 1, -2],
              }}
              transition={{
                duration: 4.8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute bottom-[60px] left-[-45px] border-2 border-white bg-zinc-950 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wide text-accent shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
            >
              100% ORGANIC COTTON
            </motion.div>

            {/* 5. Status Badge */}
            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 4.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-[-35px] right-[20px] flex items-center gap-1.5 border-2 border-white bg-zinc-950 px-3 py-1 text-xs font-black tracking-wide text-emerald-400 shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
            >
              <CheckIcon className="text-sm" />
              <span>PREVIEW: OK</span>
            </motion.div>

          </div>
        </motion.div>
      </motion.section>
    </motion.main>
  )
}
