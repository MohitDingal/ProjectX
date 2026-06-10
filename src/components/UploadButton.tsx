import { useRef, useState, type DragEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store/useStore'
import {
  processUploadedFile,
  UploadError,
  UPLOAD_ACCEPT,
} from '@/utils/decalTexture'
import { UploadIcon } from './icons'

/**
 * Drag-and-drop / click upload zone for PNG and SVG artwork. Validates files,
 * surfaces errors gracefully, adds successful uploads to the library, and drops
 * them onto the shirt immediately.
 */
export function UploadButton() {
  const addLibraryItem = useStore((s) => s.addLibraryItem)
  const addDecal = useStore((s) => s.addDecal)

  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const ingest = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    setBusy(true)
    setError(null)
    try {
      for (const file of Array.from(fileList)) {
        const { name, src } = await processUploadedFile(file)
        const item = addLibraryItem({ name, src })
        addDecal({ src: item.src, name: item.name })
      }
    } catch (err) {
      setError(err instanceof UploadError ? err.message : 'Something went wrong while uploading.')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const onDrop = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setDragActive(false)
    void ingest(e.dataTransfer.files)
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        aria-label="Upload PNG or SVG artwork"
        className={`flex w-full flex-col items-center gap-1.5 rounded-xl border border-dashed px-4 py-5 text-center transition-colors ${
          dragActive ? 'border-accent bg-accent/10' : 'border-white/20 hover:border-white/40 hover:bg-white/5'
        }`}
      >
        <UploadIcon className="text-xl text-accent" />
        <span className="text-sm font-medium text-white">
          {busy ? 'Processing…' : 'Upload artwork'}
        </span>
        <span className="text-xs text-white/50">Drag & drop or click · PNG, SVG · max 5 MB</span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={UPLOAD_ACCEPT}
        multiple
        className="hidden"
        onChange={(e) => void ingest(e.target.files)}
      />

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            className="rounded-lg bg-red-500/15 px-3 py-2 text-xs font-medium text-red-300"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
