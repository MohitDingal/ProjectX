/**
 * Validation and conversion of user-uploaded files into decal image sources.
 * Supports PNG and SVG, returns a data URL usable as a Three.js texture.
 */

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024 // 5 MB
export const UPLOAD_ACCEPT = '.png,.svg,image/png,image/svg+xml'

export class UploadError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UploadError'
  }
}

export interface ProcessedUpload {
  name: string
  src: string
}

function inferType(file: File): string {
  if (file.type) return file.type
  const ext = file.name.toLowerCase().split('.').pop()
  if (ext === 'png') return 'image/png'
  if (ext === 'svg') return 'image/svg+xml'
  return ''
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new UploadError('Could not read the file.'))
    reader.readAsDataURL(file)
  })
}

function utf8ToBase64(str: string): string {
  // Handles non-ASCII characters that may appear in SVG markup.
  return btoa(unescape(encodeURIComponent(str)))
}

/**
 * Ensure an uploaded SVG has explicit pixel dimensions so it rasterizes at a
 * crisp resolution when used as a texture (many SVGs only declare a viewBox).
 */
function normalizeSvg(svgText: string): string {
  try {
    const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml')
    const svg = doc.documentElement
    if (svg.nodeName.toLowerCase() !== 'svg' || doc.querySelector('parsererror')) {
      throw new UploadError('That SVG file appears to be invalid.')
    }

    const TARGET = 512
    const hasW = svg.getAttribute('width')
    const hasH = svg.getAttribute('height')
    if (!hasW || !hasH) {
      const viewBox = svg.getAttribute('viewBox')
      let aspect = 1
      if (viewBox) {
        const parts = viewBox.split(/[\s,]+/).map(Number)
        if (parts.length === 4 && parts[3] > 0) aspect = parts[2] / parts[3]
      } else {
        svg.setAttribute('viewBox', '0 0 100 100')
      }
      const w = aspect >= 1 ? TARGET : Math.round(TARGET * aspect)
      const h = aspect >= 1 ? Math.round(TARGET / aspect) : TARGET
      svg.setAttribute('width', String(w))
      svg.setAttribute('height', String(h))
    }
    return new XMLSerializer().serializeToString(svg)
  } catch (err) {
    if (err instanceof UploadError) throw err
    throw new UploadError('That SVG file could not be processed.')
  }
}

/** Validate and convert a single uploaded file into a decal source. */
export async function processUploadedFile(file: File): Promise<ProcessedUpload> {
  const type = inferType(file)

  if (type !== 'image/png' && type !== 'image/svg+xml') {
    throw new UploadError('Unsupported file type. Please upload a PNG or SVG.')
  }
  if (file.size === 0) {
    throw new UploadError('That file is empty.')
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new UploadError('File is too large. Maximum size is 5 MB.')
  }

  const niceName = file.name.replace(/\.[^.]+$/, '') || 'Upload'

  if (type === 'image/png') {
    const src = await readAsDataURL(file)
    return { name: niceName, src }
  }

  // SVG: read text, normalize dimensions, re-encode as a data URL.
  const text = await file.text()
  const normalized = normalizeSvg(text)
  return {
    name: niceName,
    src: `data:image/svg+xml;base64,${utf8ToBase64(normalized)}`,
  }
}
