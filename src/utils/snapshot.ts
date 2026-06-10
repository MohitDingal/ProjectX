import { useStore } from '@/store/useStore'

/** Wait for the given number of animation frames. */
function nextFrames(count: number): Promise<void> {
  return new Promise((resolve) => {
    const step = (n: number) => (n <= 0 ? resolve() : requestAnimationFrame(() => step(n - 1)))
    step(count)
  })
}

/**
 * Export the current shirt as a PNG. The customization boundary and selection
 * highlight are hidden first (and restored afterwards) so they never appear in
 * the exported image — satisfying the "invisible in final views" requirement.
 *
 * Relies on the canvas being created with `preserveDrawingBuffer: true`.
 */
export async function downloadShirtSnapshot(filename = 'my-tshirt.png'): Promise<void> {
  const { setShowBoundary, selectDecal, showBoundary, selectedDecalId } = useStore.getState()

  setShowBoundary(false)
  selectDecal(null)

  // Let the renderer draw at least one clean frame without the overlays.
  await nextFrames(2)

  const canvas = document.querySelector('canvas.r3f-canvas') as HTMLCanvasElement | null
  if (canvas) {
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  // Restore the editing state.
  setShowBoundary(showBoundary)
  if (selectedDecalId) selectDecal(selectedDecalId)
}
