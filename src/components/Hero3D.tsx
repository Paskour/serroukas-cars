import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  PresentationControls,
  Float,
  RoundedBox,
  MeshReflectorMaterial,
} from "@react-three/drei";
import { motion } from "framer-motion";
import type { Group } from "three";
import { useLang } from "@/lib/language";

/**
 * High-fidelity procedural luxury sedan. Uses layered RoundedBox panels for
 * soft coach-built surfaces, meshPhysicalMaterial with clearcoat for deep
 * black paint, chrome trim, tinted transmissive glass, gold-accent 5-spoke
 * alloys with brake discs + red calipers, LED matrix headlights with amber
 * DRLs, and a full-width red LED taillight bar.
 */
function LuxurySedan() {
  const group = useRef<Group>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.22;
  });

  const paint = "#08080b";

  // Shared paint material props (typed loosely to avoid TS friction)
  const paintProps = {
    color: paint,
    metalness: 0.95,
    roughness: 0.12,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    envMapIntensity: 1.8,
    reflectivity: 0.7,
  } as const;

  const chromeProps = {
    color: "#f2f2f5",
    metalness: 1,
    roughness: 0.08,
  } as const;

  const glassProps = {
    color: "#04060c",
    metalness: 0.3,
    roughness: 0.02,
    transmission: 0.7,
    thickness: 0.5,
    ior: 1.52,
    envMapIntensity: 2.5,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
  } as const;

  return (
    <group ref={group} position={[0, -0.15, 0]} scale={1.05}>
      {/* Turntable — reflective disc */}
      <mesh position={[0, -0.44, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.7, 96]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={40}
          roughness={0.6}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0a0a0d"
          metalness={0.6}
          mirror={0.5}
        />
      </mesh>
      {/* Red neon ring */}
      <mesh position={[0, -0.428, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.4, 2.62, 128]} />
        <meshStandardMaterial
          color="#E31B23"
          emissive="#E31B23"
          emissiveIntensity={1.4}
          toneMapped={false}
          side={2}
        />
      </mesh>
      {/* Inner glow ring */}
      <mesh position={[0, -0.425, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.3, 2.38, 128]} />
        <meshStandardMaterial
          color="#ff2a33"
          emissive="#ff2a33"
          emissiveIntensity={2.2}
          toneMapped={false}
          side={2}
        />
      </mesh>

      {/* ================= BODY ================= */}
      {/* Rocker sills (dark low panel) */}
      <RoundedBox args={[4.0, 0.14, 1.7]} radius={0.06} smoothness={4} position={[0, -0.22, 0]}>
        <meshStandardMaterial color="#050506" metalness={0.4} roughness={0.7} />
      </RoundedBox>

      {/* Main lower body */}
      <RoundedBox
        args={[4.35, 0.5, 1.8]}
        radius={0.2}
        smoothness={8}
        castShadow
        position={[0, 0.05, 0]}
      >
        <meshPhysicalMaterial {...paintProps} />
      </RoundedBox>

      {/* Upper body / shoulder line */}
      <RoundedBox
        args={[4.15, 0.28, 1.72]}
        radius={0.16}
        smoothness={8}
        castShadow
        position={[0, 0.34, 0]}
      >
        <meshPhysicalMaterial {...paintProps} />
      </RoundedBox>

      {/* Hood — with subtle power bulge */}
      <RoundedBox
        args={[1.6, 0.22, 1.68]}
        radius={0.12}
        smoothness={8}
        castShadow
        position={[1.2, 0.44, 0]}
      >
        <meshPhysicalMaterial {...paintProps} />
      </RoundedBox>
      {/* Hood crease */}
      <RoundedBox args={[1.5, 0.03, 0.5]} radius={0.015} smoothness={4} position={[1.2, 0.56, 0]}>
        <meshPhysicalMaterial {...paintProps} />
      </RoundedBox>

      {/* Cabin / greenhouse */}
      <RoundedBox
        args={[2.35, 0.7, 1.5]}
        radius={0.3}
        smoothness={10}
        castShadow
        position={[-0.15, 0.72, 0]}
      >
        <meshPhysicalMaterial {...paintProps} />
      </RoundedBox>

      {/* Roof panel highlight (slightly lighter for definition) */}
      <RoundedBox args={[2.1, 0.04, 1.35]} radius={0.02} smoothness={4} position={[-0.15, 1.06, 0]}>
        <meshPhysicalMaterial color="#0d0d10" metalness={0.9} roughness={0.15} clearcoat={1} />
      </RoundedBox>

      {/* Trunk */}
      <RoundedBox
        args={[1.5, 0.28, 1.72]}
        radius={0.12}
        smoothness={8}
        castShadow
        position={[-1.4, 0.42, 0]}
      >
        <meshPhysicalMaterial {...paintProps} />
      </RoundedBox>
      {/* Trunk spoiler lip */}
      <RoundedBox args={[1.3, 0.04, 1.65]} radius={0.02} smoothness={4} position={[-1.7, 0.56, 0]}>
        <meshPhysicalMaterial {...paintProps} />
      </RoundedBox>

      {/* Door shut lines (thin dark grooves) */}
      {[0.85, -0.85].map((z) =>
        [0.35, -0.55].map((x, i) => (
          <mesh key={`${z}-${i}`} position={[x, 0.15, z * 1.001]}>
            <boxGeometry args={[0.008, 0.55, 0.02]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
        )),
      )}

      {/* ================= GLASS ================= */}
      {/* Windshield */}
      <mesh position={[0.62, 0.86, 0]} rotation={[0, 0, -0.58]}>
        <boxGeometry args={[0.04, 0.72, 1.36]} />
        <meshPhysicalMaterial {...glassProps} />
      </mesh>
      {/* Rear window */}
      <mesh position={[-0.95, 0.86, 0]} rotation={[0, 0, 0.52]}>
        <boxGeometry args={[0.04, 0.66, 1.36]} />
        <meshPhysicalMaterial {...glassProps} />
      </mesh>
      {/* Side windows */}
      {[0.76, -0.76].map((z, i) => (
        <mesh key={i} position={[-0.15, 0.82, z]}>
          <boxGeometry args={[2.0, 0.52, 0.03]} />
          <meshPhysicalMaterial {...glassProps} />
        </mesh>
      ))}
      {/* B-pillar (blacked out) */}
      {[0.77, -0.77].map((z, i) => (
        <mesh key={i} position={[-0.15, 0.82, z]}>
          <boxGeometry args={[0.08, 0.54, 0.04]} />
          <meshStandardMaterial color="#000" roughness={0.9} />
        </mesh>
      ))}

      {/* ================= CHROME TRIM ================= */}
      {/* Beltline chrome */}
      {[0.79, -0.79].map((z, i) => (
        <mesh key={i} position={[-0.15, 0.52, z]}>
          <boxGeometry args={[2.5, 0.025, 0.045]} />
          <meshStandardMaterial {...chromeProps} />
        </mesh>
      ))}
      {/* Window surround chrome (top) */}
      {[0.78, -0.78].map((z, i) => (
        <mesh key={i} position={[-0.15, 1.08, z]}>
          <boxGeometry args={[2.0, 0.02, 0.04]} />
          <meshStandardMaterial {...chromeProps} />
        </mesh>
      ))}

      {/* ================= FRONT ================= */}
      {/* Front fascia */}
      <RoundedBox args={[0.12, 0.5, 1.65]} radius={0.06} smoothness={6} position={[2.13, 0.12, 0]}>
        <meshPhysicalMaterial {...paintProps} />
      </RoundedBox>

      {/* Grille — chrome frame */}
      <mesh position={[2.17, 0.15, 0]}>
        <boxGeometry args={[0.02, 0.34, 1.3]} />
        <meshStandardMaterial {...chromeProps} />
      </mesh>
      {/* Grille — dark honeycomb interior */}
      <mesh position={[2.155, 0.15, 0]}>
        <boxGeometry args={[0.03, 0.3, 1.24]} />
        <meshStandardMaterial color="#050505" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Grille horizontal slats */}
      {[-0.1, 0, 0.1].map((y, i) => (
        <mesh key={i} position={[2.17, 0.15 + y, 0]}>
          <boxGeometry args={[0.025, 0.015, 1.22]} />
          <meshStandardMaterial {...chromeProps} />
        </mesh>
      ))}
      {/* Chrome center badge */}
      <mesh position={[2.19, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.015, 24]} />
        <meshStandardMaterial {...chromeProps} />
      </mesh>

      {/* LED matrix headlights — cluster of small emissive squares */}
      {[0.58, -0.58].map((z, side) => (
        <group key={side} position={[2.15, 0.34, z]}>
          {/* Housing */}
          <RoundedBox args={[0.06, 0.14, 0.4]} radius={0.03} smoothness={4}>
            <meshStandardMaterial color="#050505" metalness={0.5} roughness={0.4} />
          </RoundedBox>
          {/* LED matrix cells (3x8 grid) */}
          {Array.from({ length: 3 }).flatMap((_, row) =>
            Array.from({ length: 8 }).map((__, col) => (
              <mesh
                key={`${row}-${col}`}
                position={[0.035, 0.045 - row * 0.04, -0.17 + col * 0.045]}
              >
                <boxGeometry args={[0.008, 0.028, 0.03]} />
                <meshStandardMaterial
                  emissive="#f4faff"
                  emissiveIntensity={4}
                  color="#f4faff"
                  toneMapped={false}
                />
              </mesh>
            )),
          )}
          {/* Amber DRL signature strip */}
          <mesh position={[0.038, -0.04, 0]}>
            <boxGeometry args={[0.008, 0.02, 0.36]} />
            <meshStandardMaterial
              emissive="#FF8A3D"
              emissiveIntensity={3.5}
              color="#FF8A3D"
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      {/* Front air intakes (lower) */}
      {[0.7, -0.7].map((z, i) => (
        <mesh key={i} position={[2.14, -0.12, z]}>
          <boxGeometry args={[0.04, 0.15, 0.35]} />
          <meshStandardMaterial color="#020202" roughness={0.9} />
        </mesh>
      ))}

      {/* ================= REAR ================= */}
      {/* Rear fascia */}
      <RoundedBox args={[0.1, 0.45, 1.68]} radius={0.05} smoothness={6} position={[-2.14, 0.15, 0]}>
        <meshPhysicalMaterial {...paintProps} />
      </RoundedBox>

      {/* Full-width red LED taillight bar */}
      <mesh position={[-2.16, 0.32, 0]}>
        <boxGeometry args={[0.03, 0.09, 1.5]} />
        <meshStandardMaterial
          emissive="#E31B23"
          emissiveIntensity={4.5}
          color="#E31B23"
          toneMapped={false}
        />
      </mesh>
      {/* Bright end caps */}
      {[0.65, -0.65].map((z, i) => (
        <mesh key={i} position={[-2.165, 0.32, z]}>
          <boxGeometry args={[0.02, 0.14, 0.22]} />
          <meshStandardMaterial
            emissive="#ff3540"
            emissiveIntensity={6}
            color="#ff3540"
            toneMapped={false}
          />
        </mesh>
      ))}
      {/* Chrome trim under taillight */}
      <mesh position={[-2.15, 0.25, 0]}>
        <boxGeometry args={[0.02, 0.02, 1.5]} />
        <meshStandardMaterial {...chromeProps} />
      </mesh>
      {/* Dual exhaust tips */}
      {[0.55, -0.55].map((z, i) => (
        <mesh key={i} position={[-2.2, -0.22, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.055, 0.055, 0.12, 24]} />
          <meshStandardMaterial {...chromeProps} />
        </mesh>
      ))}

      {/* ================= SIDE MIRRORS ================= */}
      {[0.94, -0.94].map((z, i) => (
        <group key={i} position={[0.75, 0.62, z]}>
          <mesh position={[0, 0, z > 0 ? 0.05 : -0.05]}>
            <boxGeometry args={[0.02, 0.05, 0.1]} />
            <meshPhysicalMaterial {...paintProps} />
          </mesh>
          <RoundedBox args={[0.16, 0.12, 0.22]} radius={0.05} smoothness={5}>
            <meshPhysicalMaterial {...paintProps} />
          </RoundedBox>
          {/* Mirror glass */}
          <mesh position={[0.02, 0, 0]}>
            <boxGeometry args={[0.005, 0.09, 0.18]} />
            <meshStandardMaterial color="#a8c5ff" metalness={1} roughness={0.05} />
          </mesh>
        </group>
      ))}

      {/* Door handles (chrome) */}
      {[0.9, -0.9].map((z) =>
        [0.3, -0.6].map((x, i) => (
          <RoundedBox
            key={`${z}-${i}`}
            args={[0.22, 0.04, 0.04]}
            radius={0.02}
            smoothness={4}
            position={[x, 0.42, z]}
          >
            <meshStandardMaterial {...chromeProps} />
          </RoundedBox>
        )),
      )}

      {/* ================= WHEELS ================= */}
      {[
        [1.4, -0.24, 0.92],
        [1.4, -0.24, -0.92],
        [-1.4, -0.24, 0.92],
        [-1.4, -0.24, -0.92],
      ].map((p, i) => (
        <group key={i} position={p as [number, number, number]}>
          {/* Fender arch (dark trim) */}
          <mesh position={[0, 0.28, 0]}>
            <torusGeometry args={[0.5, 0.06, 8, 24, Math.PI]} />
            <meshStandardMaterial color="#050505" roughness={0.85} />
          </mesh>

          {/* Tyre — outer */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.44, 0.44, 0.3, 48]} />
            <meshStandardMaterial color="#08080a" roughness={0.95} metalness={0.05} />
          </mesh>
          {/* Tyre sidewall detail */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.44, 0.44, 0.302, 48, 1, true]} />
            <meshStandardMaterial color="#0a0a0c" roughness={0.98} />
          </mesh>

          {/* Brake disc (silver) */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <cylinderGeometry args={[0.28, 0.28, 0.31, 32]} />
            <meshStandardMaterial color="#787880" metalness={0.9} roughness={0.4} />
          </mesh>
          {/* Red brake caliper */}
          <mesh position={[0.18, 0.05, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.08, 0.16, 0.12]} />
            <meshStandardMaterial
              color="#E31B23"
              emissive="#7a0d12"
              emissiveIntensity={0.3}
              metalness={0.6}
              roughness={0.35}
            />
          </mesh>

          {/* Alloy face — dark base */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.34, 0.34, 0.32, 48]} />
            <meshStandardMaterial color="#111113" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* 5 spokes with gold accent tips */}
          {Array.from({ length: 5 }).map((_, s) => {
            const a = (s / 5) * Math.PI * 2;
            return (
              <group key={s} rotation={[0, 0, a]}>
                {/* Spoke body (silver) */}
                <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.18, 0]}>
                  <boxGeometry args={[0.09, 0.34, 0.28]} />
                  <meshStandardMaterial color="#d8d8de" metalness={1} roughness={0.18} />
                </mesh>
                {/* Gold accent tip */}
                <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.32, 0]}>
                  <boxGeometry args={[0.07, 0.06, 0.3]} />
                  <meshStandardMaterial
                    color="#d4a24c"
                    emissive="#8a5a1a"
                    emissiveIntensity={0.4}
                    metalness={1}
                    roughness={0.25}
                  />
                </mesh>
              </group>
            );
          })}

          {/* Outer rim lip — chrome */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.36, 0.02, 12, 48]} />
            <meshStandardMaterial {...chromeProps} />
          </mesh>

          {/* Center cap — gold */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.34, 20]} />
            <meshStandardMaterial
              color="#d4a24c"
              emissive="#8a5a1a"
              emissiveIntensity={0.5}
              metalness={1}
              roughness={0.2}
            />
          </mesh>
        </group>
      ))}

      {/* Underglow */}
      <pointLight position={[0, -0.3, 0]} color="#E31B23" intensity={6} distance={4} />
      <pointLight position={[1.5, 0.2, 0]} color="#fff4d6" intensity={1.2} distance={2} />
      <pointLight position={[-1.5, 0.2, 0]} color="#E31B23" intensity={1.5} distance={2} />
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      {/* Key light */}
      <spotLight
        position={[6, 9, 6]}
        angle={0.38}
        penumbra={0.95}
        intensity={2.8}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      {/* Overhead softbox */}
      <rectAreaLight
        position={[0, 6, 0]}
        width={8}
        height={4}
        intensity={3}
        color="#ffffff"
        rotation={[-Math.PI / 2, 0, 0]}
      />
      {/* Red rim */}
      <spotLight position={[-8, 5, -4]} angle={0.5} intensity={4} color="#E31B23" />
      {/* Amber fill */}
      <spotLight position={[5, 3, -8]} angle={0.55} intensity={2.2} color="#FF8A3D" />
      {/* Cool back */}
      <directionalLight position={[-4, 6, 4]} intensity={0.6} color="#a8c5ff" />

      <PresentationControls global polar={[-0.15, 0.15]} azimuth={[-0.7, 0.7]} snap>
        <Float speed={1.1} rotationIntensity={0.04} floatIntensity={0.15}>
          <LuxurySedan />
        </Float>
      </PresentationControls>

      <ContactShadows
        position={[0, -0.44, 0]}
        opacity={0.9}
        scale={14}
        blur={2.6}
        far={5}
        color="#000000"
      />
      <Environment preset="studio" environmentIntensity={0.75} />
    </>
  );
}

export function Hero3D() {
  const { tr } = useLang();

  return (
    <section id="home" className="relative min-h-dvh overflow-hidden pt-24">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-radial-red)" }}
      />
      <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-accent/10 blur-3xl -z-10 animate-float" />

      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-4 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 py-10 lg:py-20"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-[11px] font-mono tracking-widest text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            {tr("heroKicker")}
          </div>
          <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl leading-[0.9] tracking-tight">
            <span className="block">{tr("heroTitle1")}</span>
            <span className="block text-gradient-red">{tr("heroTitle2")}</span>
            <span className="block">{tr("heroTitle3")}</span>
          </h1>
          <p className="mt-6 max-w-lg text-base sm:text-lg text-muted-foreground">
            {tr("heroSub")}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#vehicles"
              className="btn-hero btn-hero-hover rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wider"
            >
              {tr("ctaSee")}
            </a>
            <a
              href="#book"
              className="glass hover:bg-white/5 transition rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wider"
            >
              {tr("ctaBook")}
            </a>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg">
            {[
              { n: "45", label: tr("statYears") },
              { n: "1.200+", label: tr("statVehicles") },
              { n: "4", label: tr("statCategories") },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="glass rounded-2xl p-4"
              >
                <div className="font-display text-3xl sm:text-4xl text-gradient-red">{s.n}</div>
                <div className="mt-1 text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 3D stage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="relative h-[440px] sm:h-[560px] lg:h-[680px]"
        >
          <div className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-br from-surface-elevated/50 via-background to-surface/30 border border-white/5 shadow-[var(--shadow-elegant)]">
            {/* Studio backdrop gradients */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 25%, oklch(0.32 0.02 260 / 0.7), transparent 60%), radial-gradient(circle at 20% 85%, oklch(0.58 0.22 25 / 0.18), transparent 55%), radial-gradient(circle at 80% 80%, oklch(0.55 0.18 45 / 0.12), transparent 50%)",
              }}
            />
            <Canvas
              shadows
              dpr={[1, 2]}
              camera={{ position: [5.4, 2.2, 5.8], fov: 30 }}
              gl={{ antialias: true, alpha: true }}
            >
              <Suspense fallback={null}>
                <Scene />
              </Suspense>
            </Canvas>
          </div>

          {/* Floating spec cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="absolute top-8 left-4 glass-strong rounded-2xl px-4 py-3 hidden sm:block"
          >
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {tr("year")}
            </div>
            <div className="font-mono text-xl font-semibold">2024</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15 }}
            className="absolute bottom-16 right-4 glass-strong rounded-2xl px-4 py-3 hidden sm:block"
          >
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {tr("price")}
            </div>
            <div className="font-mono text-xl font-semibold text-gradient-red">€ 42.900</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="absolute bottom-4 left-8 glass-strong rounded-2xl px-4 py-3 hidden sm:block"
          >
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {tr("fuel")}
            </div>
            <div className="font-mono text-xl font-semibold">Diesel</div>
          </motion.div>

          <div className="absolute top-4 right-4 glass rounded-full px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            ↔ Drag to rotate
          </div>
        </motion.div>
      </div>
    </section>
  );
}
