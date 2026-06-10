# Threadsmith — 3D T‑Shirt Customizer

A production‑quality React + Three.js web app for designing T‑shirts in 3D. Pick a
color (the entire UI re‑themes around it), drop in logos/artwork, and position every
decal in real time on a front‑facing 3D shirt — with placement constrained to a fixed
print area.

> Built with React 18, Vite, React Three Fiber, Drei, Three.js, Zustand, Tailwind CSS,
> Framer Motion and TypeScript.

---

## ✨ Features

- **Landing page** with a full‑screen 3D shirt drifting in the background and a
  **“Make Your Own”** call‑to‑action.
- **Front‑locked 3D viewer** — orbit is clamped to a narrow front window, so the back of
  the shirt is never reachable. Subtle zoom and movement are allowed.
- **Live color customization** with a swatch grid, full HSV picker and hex input.
  Color changes smoothly animate on the model.
- **Dynamic theming** — the accent color of the whole app is derived from the shirt color
  with WCAG‑aware contrast, then pushed into CSS variables Tailwind reads.
- **Decal system** with a preloaded library of inline‑SVG artwork.
- **Uploads** — drag‑and‑drop or pick **PNG / SVG** files (validated, 5 MB cap, graceful
  errors). SVGs are normalized to a crisp resolution.
- **Drag‑to‑place** decals directly on the shirt surface with real‑time feedback.
- **Hard boundary constraint** — decals are clamped so the *entire* decal stays inside a
  fixed square print area. The boundary is visualized while editing and hidden on export.
- **Per‑decal controls** — move (drag / nudge / arrow keys), scale, rotate, duplicate,
  delete.
- **PNG export** of the finished design (boundary + selection hidden automatically).
- **Responsive** desktop / tablet / mobile layout, **keyboard accessible**, reduced‑motion
  aware.

---

## 🚀 Getting started

**Prerequisites:** Node.js 18+ (tested on Node 22) and npm.

```bash
# install dependencies
npm install

# start the dev server (http://localhost:5173)
npm run dev

# type-check the project
npm run typecheck

# production build (type-checks, then bundles to dist/)
npm run build

# preview the production build locally
npm run preview
```

The 3D model (`public/shirt_baked.glb`) ships with the repo and is copied into the build
automatically.

---

## 🧱 Project structure

```
src/
├── components/        # Reusable UI (Button, Slider, ColorPicker, panels, icons…)
├── pages/             # LandingPage, CustomizerPage (route targets, lazy-loaded)
├── features/
│   ├── tshirt/        # Canvas scenes, shirt model, lighting, front-locked camera
│   ├── decals/        # Decal projection, drag logic, boundary overlay, presets
│   └── theme/         # Color → palette derivation + CSS-variable sync
├── hooks/             # useDecalKeyboard (a11y/power-user shortcuts)
├── store/             # Zustand store (shirt + decals + UI state)
├── utils/             # color math, geometry/clamping, texture processing, constants
├── types/             # Shared TypeScript types
├── App.tsx            # Router + Suspense + theme sync
└── main.tsx           # Entry
```

---

## 🏛 Architecture overview

### Decal projection onto the mesh
Decals are projected onto the shirt with Three.js `DecalGeometry` via drei’s `<Decal>`,
rendered as children of the shirt mesh. `DecalGeometry` wraps the texture onto the actual
surface (including the chest’s curvature), so artwork deforms with the cloth instead of
floating. The projector box uses a generous depth so projection stays valid where the
surface curves away — without bleeding through to the back.

### Constraining decals to the square
Placement coordinates are decoupled from world geometry. Each decal stores a normalized
position `(u, v) ∈ [-1, 1]` *inside* a fixed customization square centered on the chest.

```
worldPosition = center + u·halfWidth·X + v·halfHeight·Y   (fixed front-facing Z)
```

Because position lives in normalized square‑space, the boundary constraint is simply
`clamp(u)` / `clamp(v)` — it is **impossible to represent an out‑of‑bounds decal**. The
clamp also shrinks the usable range by the decal’s half‑size (see
[`utils/geometry.ts`](src/utils/geometry.ts)), so the *whole* decal — not just its center —
stays inside the square at any scale. Dragging raycasts the pointer onto the square’s
math‑plane, converts the hit to `(u, v)`, clamps, and writes to the store.

### Camera lock (front only)
Drei `OrbitControls` with `enablePan=false`, azimuth clamped to ±~23°, polar angle clamped
near the horizon, and a narrow min/max distance for subtle zoom. Controls auto‑disable
while a decal is being dragged so the two gestures never fight. All tuning lives in
[`utils/constants.ts`](src/utils/constants.ts).

### Dynamic theme
[`utils/color.ts`](src/utils/color.ts) converts the shirt hex into an accessible accent
palette (nudging lightness/saturation so even white/black/gray shirts yield a vibrant,
legible accent; foreground colors chosen by WCAG contrast). `useThemeSync` writes the
palette to CSS custom properties on `<html>`; Tailwind’s `accent`/`surface` colors read
those variables, so the entire UI re‑themes instantly.

### State management (Zustand)
A single store ([`store/useStore.ts`](src/store/useStore.ts)) with three concerns:

- **Shirt** — `color`, `roughness`, `metalness`.
- **Decals** — array of `{ id, src, name, u, v, rotation, scale }` + `selectedDecalId`.
  All mutators that touch position/scale route through the boundary clamp.
- **UI** — `activeTool`, `showBoundary`, `isDraggingDecal`, plus the decal library.

State persists for the whole session. The accent palette is derived from `color` (not
stored) and memoized.

### Component hierarchy
```
App (router + theme sync)
├── LandingPage
│   └── HeroScene (Canvas) → Lighting, Float→SpinningShirt
└── CustomizerPage
    ├── Experience (Canvas)
    │   ├── Lighting
    │   ├── ShirtModel (mesh + animated color)
    │   │   ├── DecalLayer → DecalItem × N  (drei <Decal>)
    │   │   └── BoundaryOverlay (square + selection highlight)
    │   └── CameraRig (front-locked OrbitControls)
    ├── TopBar (nav · reset · PNG export)
    ├── ControlPanel (Color / Artwork tabs → ColorPicker, DecalLibrary, Upload)
    └── DecalControls (move / scale / rotate / duplicate / delete)
```

---

## ⌨️ Keyboard shortcuts (with a decal selected)

| Key | Action |
| --- | --- |
| Arrow keys | Move / scale / rotate (depends on the active tool) |
| `Delete` / `Backspace` | Delete the decal |
| `Esc` | Deselect |

---

## 🔧 Tuning the print area

The customization square and camera framing are intentionally centralized as constants in
[`src/utils/constants.ts`](src/utils/constants.ts) (`AREA_CENTER`, `AREA_HALF`,
`AREA_PROJECTOR_DEPTH`, `DECAL_BASE_SIZE`, and the `CAMERA_*` values). Adjust these to
move/resize the printable area or reframe the shirt — everything else (clamping, drag,
overlay) follows automatically.

---

## 📦 Performance notes

- Route‑level code splitting (`React.lazy`) + manual vendor chunks (`three` isolated from
  the app for long‑term caching).
- Decal textures and the GLB load lazily via Suspense.
- `dpr={[1, 2]}` caps pixel ratio; lighting is light‑only (no runtime HDR fetch) so the
  scene renders identically online/offline.

## 🙏 Credits

3D model `shirt_baked.glb` originates from the open‑source
[project_threejs_ai](https://github.com/adrianhajdin/project_threejs_ai) repository.
