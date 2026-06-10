import { ContactShadows } from '@react-three/drei'

/**
 * Studio-style lighting with a clear key light, soft fills and a grounded
 * contact shadow. Uses lights only (no HDR fetch) so the scene renders
 * identically online or offline.
 */
export function Lighting({ withGroundShadow = true }: { withGroundShadow?: boolean }) {
  return (
    <>
      <hemisphereLight intensity={0.55} groundColor="#1f2937" color="#ffffff" />
      <ambientLight intensity={0.35} />

      <directionalLight
        position={[2, 3, 2.5]}
        intensity={2.1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-camera-near={0.5}
        shadow-camera-far={8}
        shadow-camera-left={-1.5}
        shadow-camera-right={1.5}
        shadow-camera-top={1.5}
        shadow-camera-bottom={-1.5}
      />
      {/* Cool rim light from behind to separate the shirt from the background. */}
      <directionalLight position={[-2, 1.5, -2]} intensity={0.7} color="#bcd4ff" />
      {/* Warm fill from the front-left. */}
      <pointLight position={[-1.5, 0.5, 2]} intensity={0.6} color="#fff4e6" />

      {withGroundShadow && (
        <ContactShadows
          position={[0, -0.62, 0]}
          opacity={0.55}
          scale={3}
          blur={2.6}
          far={1.2}
          resolution={1024}
          color="#000000"
        />
      )}
    </>
  )
}
