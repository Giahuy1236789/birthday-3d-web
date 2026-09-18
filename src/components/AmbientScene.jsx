import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles, Stars } from '@react-three/drei'

const BALLOON_COLORS = ['#f7a9c5', '#bda7ef', '#9cccf4', '#f7cc88', '#e9a7d4', '#96d9cd', '#dcb3ff']

function useScenePreferences() {
  const [preferences, setPreferences] = useState(() => ({ compact: false, reducedMotion: false }))

  useEffect(() => {
    const compactQuery = window.matchMedia('(max-width: 700px), (pointer: coarse)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const sync = () => {
      setPreferences({ compact: compactQuery.matches, reducedMotion: motionQuery.matches })
    }

    sync()
    compactQuery.addEventListener?.('change', sync)
    motionQuery.addEventListener?.('change', sync)

    return () => {
      compactQuery.removeEventListener?.('change', sync)
      motionQuery.removeEventListener?.('change', sync)
    }
  }, [])

  return preferences
}

function DriftField({ compact, reducedMotion }) {
  const points = useRef()
  const count = compact ? 72 : 150
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3)
    for (let index = 0; index < count; index += 1) {
      const offset = index * 3
      values[offset] = (Math.random() - 0.5) * 18
      values[offset + 1] = (Math.random() - 0.5) * 12
      values[offset + 2] = (Math.random() - 0.5) * 6 - 1
    }
    return values
  }, [count])

  useFrame(({ clock }, delta) => {
    if (!points.current || reducedMotion) return
    points.current.rotation.y += delta * 0.012
    points.current.rotation.z = Math.sin(clock.elapsedTime * 0.1) * 0.04
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#fce9ff"
        size={compact ? 0.035 : 0.045}
        sizeAttenuation
        transparent
        opacity={0.62}
        depthWrite={false}
      />
    </points>
  )
}

function BokehOrbs({ reducedMotion }) {
  const group = useRef()
  const orbs = useMemo(
    () => [
      { position: [-6.2, 3.2, -2.5], scale: 1.5, color: '#b780ff', opacity: 0.07 },
      { position: [5.4, -2.7, -1.7], scale: 1.85, color: '#ff8fbe', opacity: 0.06 },
      { position: [4.5, 4.2, -3.8], scale: 0.95, color: '#7dc8ff', opacity: 0.08 },
      { position: [-3.5, -3.9, -3.2], scale: 1.05, color: '#ffd386', opacity: 0.06 },
    ],
    [],
  )

  useFrame(({ clock }) => {
    if (!group.current || reducedMotion) return
    group.current.rotation.z = Math.sin(clock.elapsedTime * 0.11) * 0.05
  })

  return (
    <group ref={group}>
      {orbs.map((orb, index) => (
        <mesh key={index} position={orb.position} scale={orb.scale}>
          <sphereGeometry args={[1, 20, 16]} />
          <meshBasicMaterial color={orb.color} transparent opacity={orb.opacity} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

function FloatingBalloon({ index, color, compact, reducedMotion }) {
  const balloon = useRef()
  const base = useMemo(() => {
    const side = index % 2 === 0 ? -1 : 1
    return {
      x: side * (4.6 + (index % 3) * 1.1),
      y: -5.9 + ((index * 1.93) % 8.6),
      z: -2.2 - (index % 3) * 0.78,
      scale: 0.52 + (index % 3) * 0.11,
      speed: 0.18 + (index % 4) * 0.023,
      phase: index * 1.63,
    }
  }, [index])

  useFrame(({ clock }) => {
    if (!balloon.current || reducedMotion) return
    const time = clock.elapsedTime
    const travel = ((time * base.speed + base.phase) % 12) - 6
    balloon.current.position.y = base.y + travel
    balloon.current.position.x = base.x + Math.sin(time * 0.55 + base.phase) * 0.34
    balloon.current.rotation.z = Math.sin(time * 0.67 + base.phase) * 0.09
  })

  return (
    <group ref={balloon} position={[base.x, base.y, base.z]} scale={base.scale}>
      <mesh>
        <sphereGeometry args={[0.88, compact ? 14 : 20, compact ? 12 : 16]} />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.54}
          roughness={0.22}
          metalness={0.04}
          transmission={0.06}
          clearcoat={0.72}
          clearcoatRoughness={0.2}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, -0.94, 0]} rotation={[Math.PI, 0, 0]} scale={[0.13, 0.2, 0.13]}>
        <coneGeometry args={[1, 1, 8]} />
        <meshStandardMaterial color={color} transparent opacity={0.62} />
      </mesh>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([0, -1.08, 0, 0.09, -2.1, 0.04]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#f6dbe6" transparent opacity={0.34} />
      </line>
    </group>
  )
}

function AmbientWorld({ compact, reducedMotion, dimmed }) {
  const balloonCount = compact ? 4 : 7

  return (
    <>
      <ambientLight intensity={0.46} color="#bd9bff" />
      <pointLight position={[-5, 3, 2]} color="#c982ff" intensity={dimmed ? 12 : 20} distance={14} decay={2} />
      <pointLight position={[5, -2, 1]} color="#ff9cc8" intensity={dimmed ? 10 : 17} distance={13} decay={2} />
      <Stars
        radius={40}
        depth={22}
        count={compact ? 520 : 1150}
        factor={compact ? 2.1 : 2.7}
        saturation={0.2}
        fade
        speed={reducedMotion ? 0 : 0.32}
      />
      <DriftField compact={compact} reducedMotion={reducedMotion} />
      <Sparkles
        count={compact ? 36 : 72}
        scale={[15, 10, 5]}
        size={compact ? 1.45 : 1.9}
        speed={reducedMotion ? 0 : 0.19}
        noise={[0.42, 0.34, 0.18]}
        opacity={dimmed ? 0.34 : 0.63}
        color="#f9e6ff"
      />
      <BokehOrbs reducedMotion={reducedMotion} />
      {Array.from({ length: balloonCount }, (_, index) => (
        <FloatingBalloon
          key={index}
          index={index}
          color={BALLOON_COLORS[index % BALLOON_COLORS.length]}
          compact={compact}
          reducedMotion={reducedMotion}
        />
      ))}
    </>
  )
}

/** A fixed, non-interactive dreamy night-sky layer for the complete page. */
export default function AmbientScene({ dimmed = false }) {
  const { compact, reducedMotion } = useScenePreferences()

  return (
    <div
      className="ambient-scene"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        opacity: dimmed ? 0.43 : 1,
        transition: 'opacity 900ms ease',
      }}
    >
      <Canvas
        dpr={[1, compact ? 1.15 : 1.45]}
        camera={{ position: [0, 0, 10], fov: 46 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        style={{ display: 'block', width: '100%', height: '100%', background: 'transparent' }}
      >
        <AmbientWorld compact={compact} reducedMotion={reducedMotion} dimmed={dimmed} />
      </Canvas>
    </div>
  )
}
