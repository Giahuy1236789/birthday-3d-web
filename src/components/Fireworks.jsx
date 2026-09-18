import confetti from 'canvas-confetti'
import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

const colors = ['#fff4c8', '#ffd1e7', '#cbb8ff', '#a8ddff', '#ffaf83']

/**
 * Renders a short, restartable canvas-confetti firework sequence whenever `active`
 * becomes true. The canvas never intercepts clicks from the page beneath it.
 */
export default function Fireworks({ active = false }) {
  const canvasRef = useRef(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (!active || reducedMotion || !canvasRef.current) return undefined

    const canvas = canvasRef.current
    const fire = confetti.create(canvas, {
      resize: true,
      useWorker: true,
      disableForReducedMotion: true,
    })
    const timers = []
    let launchIndex = 0

    const launch = (origin, particleCount = 52) => {
      fire({
        particleCount,
        spread: 72,
        startVelocity: 38,
        ticks: 210,
        gravity: 1.08,
        scalar: 0.92,
        origin,
        colors,
      })
      fire({
        particleCount: Math.round(particleCount * 0.46),
        spread: 118,
        startVelocity: 25,
        ticks: 180,
        gravity: 0.98,
        scalar: 0.66,
        origin,
        colors: ['#fff9e6', '#ffd876', '#f5b8df'],
      })
    }

    const launches = [
      { x: 0.18, y: 0.34 },
      { x: 0.8, y: 0.3 },
      { x: 0.5, y: 0.2 },
      { x: 0.34, y: 0.42 },
      { x: 0.7, y: 0.38 },
    ]

    launch(launches[0], 64)
    timers.push(window.setTimeout(() => launch(launches[1], 60), 220))
    timers.push(window.setTimeout(() => launch(launches[2], 72), 510))

    const interval = window.setInterval(() => {
      launchIndex = (launchIndex + 1) % launches.length
      launch(launches[launchIndex], 46)
    }, 920)

    timers.push(window.setTimeout(() => window.clearInterval(interval), 4300))

    return () => {
      window.clearInterval(interval)
      timers.forEach((timer) => window.clearTimeout(timer))
      fire.reset()
    }
  }, [active, reducedMotion])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 80,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        mixBlendMode: 'screen',
      }}
    />
  )
}
