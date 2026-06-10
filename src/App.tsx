import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useThemeSync } from './features/theme/useThemeSync'

// Route-level code splitting: each page (and its 3D scene) loads on demand.
const LandingPage = lazy(() => import('./pages/LandingPage'))
const CustomizerPage = lazy(() => import('./pages/CustomizerPage'))

function FullScreenFallback() {
  return (
    <div className="grid h-[100dvh] w-full place-items-center bg-surface" role="status" aria-live="polite">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-accent" />
      <span className="sr-only">Loading…</span>
    </div>
  )
}

/**
 * Root application shell.
 * - Keeps the document theme in sync with the selected shirt color.
 * - Declares the two routes: marketing landing page and the customizer.
 */
export default function App() {
  // Pushes the derived accent palette into CSS variables on <html>.
  useThemeSync()

  const location = useLocation()

  return (
    <Suspense fallback={<FullScreenFallback />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/customize" element={<CustomizerPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  )
}
