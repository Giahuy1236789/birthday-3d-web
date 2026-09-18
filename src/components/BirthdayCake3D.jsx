import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

const CANDLE_LAYOUT = [
  { position: [0, 0, 0], color: '#ffd36e', height: 0.82 },
  { position: [-0.54, 0, 0.24], color: '#bda5ff', height: 0.7 },
  { position: [0.53, 0, 0.19], color: '#ff9cb8', height: 0.72 },
  { position: [-0.27, 0, -0.48], color: '#a8ddff', height: 0.66 },
  { position: [0.35, 0, -0.47], color: '#ffe0a3', height: 0.76 },
]

const TIER_LAYOUT = [
  { radius: 2.22, height: 1.04, y: 0.78, cake: '#e783aa', icing: '#fff0f4', sprinkles: '#ffd67c' },
  { radius: 1.65, height: 0.92, y: 1.8, cake: '#bf82cf', icing: '#fcecf9', sprinkles: '#bcf0e8' },
  { radius: 1.12, height: 0.84, y: 2.69, cake: '#e99bb8', icing: '#fff4e7', sprinkles: '#e6bdff' },
]

function usePresentationPreferences() {
  const [preferences, setPreferences] = useState(() => ({ compact: false, reducedMotion: false }))

  useEffect(() => {
    const compactQuery = window.matchMedia('(max-width: 640px), (pointer: coarse)')
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

function Flame({ position, blown, index, reducedMotion }) {
  const flame = useRef()
  const innerFlame = useRef()
  const glow = useRef()
  const strength = useRef(blown ? 0 : 1)

  useFrame(({ clock }, delta) => {
    const target = blown ? 0 : 1
    strength.current = THREE.MathUtils.damp(strength.current, target, blown ? 7.5 : 5.5, delta)

    const flicker = reducedMotion ? 1 : 0.92 + Math.sin(clock.elapsedTime * 8.7 + index * 1.91) * 0.1
    const scale = Math.max(strength.current * flicker, 0.001)

    if (flame.current) {
      flame.current.scale.set(0.82 * scale, 1.25 * scale, 0.82 * scale)
      flame.current.rotation.z = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 5.2 + index) * 0.12 * strength.current
    }

    if (innerFlame.current) {
      innerFlame.current.scale.setScalar(Math.max(scale, 0.001))
    }

    if (glow.current) {
      glow.current.intensity = 1.45 * strength.current
    }
  })

  return (
    <group position={position}>
      <pointLight ref={glow} color="#ffb14a" distance={3.1} decay={2.15} intensity={blown ? 0 : 1.45} />
      <mesh ref={flame} castShadow>
        <sphereGeometry args={[0.15, 14, 12]} />
        <meshStandardMaterial
          color="#ff9a35"
          emissive="#ff5c22"
          emissiveIntensity={3.2}
          transparent
          opacity={0.95}
          roughness={0.25}
        />
      </mesh>
      <mesh ref={innerFlame} position={[0, -0.02, 0]}>
        <sphereGeometry args={[0.075, 12, 10]} />
        <meshBasicMaterial color="#fff7bc" transparent opacity={0.98} />
      </mesh>
    </group>
  )
}

function Candle({ position, color, height, blown, index, reducedMotion }) {
  const candleY = 3.25 + height / 2
  const flameY = 3.25 + height + 0.18

  return (
    <group position={position}>
      <mesh position={[0, candleY, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.11, height, 16]} />
        <meshStandardMaterial color={color} roughness={0.34} metalness={0.08} />
      </mesh>
      <mesh position={[0, candleY - height * 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.095, 0.014, 6, 16]} />
        <meshStandardMaterial color="#fff6e8" roughness={0.38} />
      </mesh>
      <mesh position={[0, 3.25 + height + 0.025, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.1, 8]} />
        <meshStandardMaterial color="#2f1e36" roughness={0.9} />
      </mesh>
      <Flame position={[0, flameY, 0]} blown={blown} index={index} reducedMotion={reducedMotion} />
    </group>
  )
}

function IcingDrips({ radius, y, color, count = 18 }) {
  const drips = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        const angle = (index / count) * Math.PI * 2
        const length = 0.18 + ((index * 7) % 5) * 0.035
        return {
          key: index,
          position: [Math.cos(angle) * (radius - 0.01), y - length * 0.48, Math.sin(angle) * (radius - 0.01)],
          scale: [0.105, length, 0.105],
        }
      }),
    [count, radius, y],
  )

  return drips.map(({ key, position, scale }) => (
    <mesh key={key} position={position} scale={scale} castShadow>
      <sphereGeometry args={[1, 10, 8]} />
      <meshStandardMaterial color={color} roughness={0.4} />
    </mesh>
  ))
}

function SprinkleRing({ radius, y, color, count = 14 }) {
  const sprinkles = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        const angle = (index / count) * Math.PI * 2 + 0.16
        return {
          key: index,
          position: [Math.cos(angle) * (radius + 0.014), y + (index % 2 ? 0.05 : -0.04), Math.sin(angle) * (radius + 0.014)],
          rotation: [0.65 + (index % 3) * 0.18, -angle, 0.45],
        }
      }),
    [count, radius, y],
  )

  return sprinkles.map(({ key, position, rotation }) => (
    <mesh key={key} position={position} rotation={rotation} castShadow>
      <capsuleGeometry args={[0.027, 0.14, 4, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.22} roughness={0.34} />
    </mesh>
  ))
}

function CakeTier({ radius, height, y, cake, icing, sprinkles }) {
  const icingY = y + height / 2 + 0.075

  return (
    <group>
      <mesh position={[0, y, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius * 0.98, radius, height, 48]} />
        <meshStandardMaterial color={cake} roughness={0.46} metalness={0.02} />
      </mesh>
      <mesh position={[0, icingY, 0]} castShadow>
        <cylinderGeometry args={[radius * 1.025, radius * 1.035, 0.16, 48]} />
        <meshStandardMaterial color={icing} roughness={0.31} metalness={0.02} />
      </mesh>
      <IcingDrips radius={radius * 1.025} y={icingY - 0.03} color={icing} count={Math.round(radius * 9)} />
      <SprinkleRing radius={radius * 1.005} y={y - height * 0.12} color={sprinkles} count={Math.round(radius * 8)} />
    </group>
  )
}

function CakeModel({ blown, onInteraction, compact, reducedMotion }) {
  const cake = useRef()
  const dragging = useRef(false)
  const rotation = useRef(0.3)
  const pointerX = useRef(0)
  const pointerY = useRef(0)
  const pitch = useRef(0)

  useEffect(() => {
    const stopDragging = () => {
      dragging.current = false
    }

    window.addEventListener('pointerup', stopDragging)
    window.addEventListener('pointercancel', stopDragging)

    return () => {
      window.removeEventListener('pointerup', stopDragging)
      window.removeEventListener('pointercancel', stopDragging)
    }
  }, [])

  const beginDrag = (event) => {
    event.stopPropagation()
    dragging.current = true
    pointerX.current = event.nativeEvent?.clientX ?? event.clientX ?? 0
    pointerY.current = event.nativeEvent?.clientY ?? event.clientY ?? 0
    event.target?.setPointerCapture?.(event.pointerId)
    if (typeof onInteraction === 'function') onInteraction()
  }

  const moveDrag = (event) => {
    if (!dragging.current) return
    event.stopPropagation()
    const nextX = event.nativeEvent?.clientX ?? event.clientX ?? pointerX.current
    const nextY = event.nativeEvent?.clientY ?? event.clientY ?? pointerY.current
    rotation.current += (nextX - pointerX.current) * 0.011
    pitch.current = THREE.MathUtils.clamp(pitch.current + (nextY - pointerY.current) * 0.0022, -0.14, 0.14)
    pointerX.current = nextX
    pointerY.current = nextY
  }

  const endDrag = (event) => {
    event?.target?.releasePointerCapture?.(event.pointerId)
    dragging.current = false
  }

  useFrame(({ clock }, delta) => {
    if (!cake.current) return

    if (!dragging.current && !reducedMotion) rotation.current += delta * 0.18

    cake.current.rotation.y = rotation.current
    cake.current.rotation.x = THREE.MathUtils.damp(cake.current.rotation.x, pitch.current, 4, delta)
    cake.current.position.y = -1.58 + (reducedMotion ? 0 : Math.sin(clock.elapsedTime * 1.25) * 0.07)
  })

  return (
    <group
      ref={cake}
      position={[0, -1.58, 0]}
      onPointerDown={beginDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
    >
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <cylinderGeometry args={[2.7, 2.78, 0.16, 64]} />
        <meshStandardMaterial color="#f8d896" metalness={0.62} roughness={0.24} />
      </mesh>
      <mesh position={[0, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.43, 0.045, 8, 64]} />
        <meshStandardMaterial color="#fff6dc" metalness={0.52} roughness={0.22} />
      </mesh>
      {TIER_LAYOUT.map((tier) => (
        <CakeTier key={tier.radius} {...tier} />
      ))}
      <mesh position={[0, 3.23, 0]} castShadow>
        <sphereGeometry args={[0.3, 16, 12]} />
        <meshStandardMaterial color="#fff4df" roughness={0.3} />
      </mesh>
      {CANDLE_LAYOUT.slice(0, compact ? 4 : CANDLE_LAYOUT.length).map((candle, index) => (
        <Candle key={index} {...candle} blown={blown} index={index} reducedMotion={reducedMotion} />
      ))}
    </group>
  )
}

function Scene({ blown, onInteraction, compact, reducedMotion }) {
  return (
    <>
      <fog attach="fog" args={['#241436', 7, 16]} />
      <ambientLight intensity={1.65} color="#ffe8f4" />
      <hemisphereLight intensity={1.3} color="#c4a5ff" groundColor="#2d143c" />
      <pointLight position={[-4, 6, 4]} intensity={44} color="#ff9ec4" distance={12} decay={2} />
      <pointLight position={[4, 3, 3]} intensity={32} color="#8ec9ff" distance={10} decay={2} />
      <pointLight position={[0, -1, 4]} intensity={18} color="#ffcf7a" distance={8} decay={2} />
      <CakeModel
        blown={blown}
        onInteraction={onInteraction}
        compact={compact}
        reducedMotion={reducedMotion}
      />
      <Sparkles
        count={compact ? 22 : 45}
        scale={[7.2, 7.2, 4]}
        size={compact ? 2.1 : 2.8}
        speed={reducedMotion ? 0 : 0.24}
        opacity={0.55}
        color="#fff4d2"
      />
      <ContactShadows position={[0, -1.67, 0]} opacity={0.55} scale={6.5} blur={2.7} far={4.2} color="#2c123a" />
    </>
  )
}

/**
 * Self-contained, draggable 3D birthday cake.
 * `blown` softly fades the candle flames; `onInteraction` is called when the cake is grabbed.
 */
export default function BirthdayCake3D({ blown = false, onInteraction }) {
  const { compact, reducedMotion } = usePresentationPreferences()

  return (
    <div
      className="birthday-cake-3d"
      role="img"
      aria-label={blown ? 'Bánh sinh nhật với những ngọn nến đã tắt' : 'Bánh sinh nhật ba tầng với những ngọn nến đang cháy'}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '280px',
        cursor: 'grab',
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      <Canvas
        dpr={[1, compact ? 1.25 : 1.65]}
        camera={{ position: [0, 3.2, 9.6], fov: compact ? 39 : 35 }}
        gl={{ alpha: true, antialias: !compact, powerPreference: 'high-performance' }}
        shadows={!compact}
        onPointerUp={(event) => event.stopPropagation()}
        style={{ display: 'block', width: '100%', height: '100%', background: 'transparent' }}
      >
        <Scene
          blown={blown}
          onInteraction={onInteraction}
          compact={compact}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </div>
  )
}
