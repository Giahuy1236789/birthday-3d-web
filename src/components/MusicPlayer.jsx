import { motion, useReducedMotion } from 'framer-motion'
import { Music2, Volume2, VolumeX } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

const fallbackNotes = [
  [523.25, 0],
  [659.25, 0.24],
  [783.99, 0.48],
  [1046.5, 0.72],
  [783.99, 1.02],
  [659.25, 1.28],
  [587.33, 1.56],
  [659.25, 1.8],
]

function playFallbackPhrase(context, master) {
  const start = context.currentTime + 0.05

  fallbackNotes.forEach(([frequency, offset], index) => {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const noteStart = start + offset
    const noteEnd = noteStart + 0.42

    oscillator.type = index % 3 === 0 ? 'triangle' : 'sine'
    oscillator.frequency.setValueAtTime(frequency, noteStart)
    gain.gain.setValueAtTime(0.0001, noteStart)
    gain.gain.exponentialRampToValueAtTime(0.22, noteStart + 0.045)
    gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd)
    oscillator.connect(gain)
    gain.connect(master)
    oscillator.start(noteStart)
    oscillator.stop(noteEnd + 0.03)
  })
}

/**
 * Background audio with a small, generated chime as a graceful fallback.
 * `showToggle` can hide the floating control, and `compact` hides its text label.
 */
export default function MusicPlayer({
  music,
  shouldPlay = false,
  showToggle = true,
  compact = false,
}) {
  const audioRef = useRef(null)
  const fallbackRef = useRef({ context: null, master: null, interval: null })
  const mutedRef = useRef(false)
  const [muted, setMuted] = useState(false)
  const [usingFallback, setUsingFallback] = useState(!music)
  const [isPlaying, setIsPlaying] = useState(false)
  const [needsGesture, setNeedsGesture] = useState(false)
  const reducedMotion = useReducedMotion()

  const setFallbackVolume = useCallback((isMuted) => {
    const { context, master } = fallbackRef.current
    if (!context || !master || context.state === 'closed') return

    const now = context.currentTime
    master.gain.cancelScheduledValues(now)
    master.gain.setTargetAtTime(isMuted ? 0.0001 : 0.14, now, 0.04)
  }, [])

  const stopFallback = useCallback(() => {
    const engine = fallbackRef.current
    if (engine.interval) {
      window.clearInterval(engine.interval)
      engine.interval = null
    }
    if (engine.context?.state === 'running') {
      engine.context.suspend().catch(() => {})
    }
    setIsPlaying(false)
  }, [])

  const startFallback = useCallback(async () => {
    const engine = fallbackRef.current
    const AudioContextClass = window.AudioContext || window.webkitAudioContext

    if (!AudioContextClass) return false

    if (!engine.context || engine.context.state === 'closed') {
      const context = new AudioContextClass()
      const master = context.createGain()
      master.gain.value = mutedRef.current ? 0.0001 : 0.14
      master.connect(context.destination)
      engine.context = context
      engine.master = master
    }

    try {
      if (engine.context.state === 'suspended') await engine.context.resume()
      setFallbackVolume(mutedRef.current)

      if (!engine.interval) {
        playFallbackPhrase(engine.context, engine.master)
        engine.interval = window.setInterval(() => {
          if (engine.context?.state === 'running') {
            playFallbackPhrase(engine.context, engine.master)
          }
        }, 2240)
      }

      setNeedsGesture(false)
      setIsPlaying(true)
      return true
    } catch {
      setNeedsGesture(true)
      setIsPlaying(false)
      return false
    }
  }, [setFallbackVolume])

  const attemptAudio = useCallback(async () => {
    const audio = audioRef.current
    if (!audio || !music) return false

    audio.volume = 0.46
    audio.muted = mutedRef.current

    try {
      await audio.play()
      setNeedsGesture(false)
      setIsPlaying(true)
      return true
    } catch {
      // A real loading failure fires `onError`; a play rejection normally means
      // that the browser is waiting for a direct user gesture.
      if (audio.error) setUsingFallback(true)
      else setNeedsGesture(true)
      setIsPlaying(false)
      return false
    }
  }, [music])

  useEffect(() => {
    mutedRef.current = muted
    const audio = audioRef.current
    if (audio) audio.muted = muted
    setFallbackVolume(muted)
  }, [muted, setFallbackVolume])

  useEffect(() => {
    setUsingFallback(!music)
    setNeedsGesture(false)
  }, [music])

  useEffect(() => {
    if (!usingFallback) {
      stopFallback()
      return undefined
    }
    if (!shouldPlay) {
      stopFallback()
      return undefined
    }
    startFallback()
    return undefined
  }, [shouldPlay, startFallback, stopFallback, usingFallback])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || usingFallback) return undefined

    if (!shouldPlay) {
      audio.pause()
      setIsPlaying(false)
      return undefined
    }

    attemptAudio()
    return undefined
  }, [attemptAudio, shouldPlay, usingFallback])

  useEffect(() => () => {
    const engine = fallbackRef.current
    if (engine.interval) {
      window.clearInterval(engine.interval)
      engine.interval = null
    }
    if (engine.context && engine.context.state !== 'closed') {
      engine.context.close().catch(() => {})
    }
  }, [])

  const handleSourceError = () => {
    if (!music) return
    audioRef.current?.pause()
    setUsingFallback(true)
    setNeedsGesture(false)
  }

  const toggleSound = async () => {
    if (needsGesture && shouldPlay) {
      setMuted(false)
      if (usingFallback) await startFallback()
      else await attemptAudio()
      return
    }

    const nextMuted = !muted
    setMuted(nextMuted)
    if (!nextMuted && shouldPlay) {
      if (usingFallback) await startFallback()
      else await attemptAudio()
    }
  }

  const canToggle = shouldPlay || isPlaying || needsGesture
  const statusText = !shouldPlay
    ? 'Nhạc sẽ bắt đầu khi mở món quà'
    : needsGesture
      ? 'Chạm để bật nhạc'
      : muted
        ? 'Bật nhạc nền'
        : 'Tắt nhạc nền'

  return (
    <>
      <audio
        ref={audioRef}
        src={music || undefined}
        loop
        preload="auto"
        onError={handleSourceError}
        onPlay={() => {
          setIsPlaying(true)
          setNeedsGesture(false)
        }}
        onPause={() => setIsPlaying(false)}
        style={{ display: 'none' }}
      />

      {showToggle && (
        <>
          <style>{`
            .birthday-music-toggle {
              position: fixed;
              right: max(1rem, env(safe-area-inset-right));
              top: max(1rem, env(safe-area-inset-top));
              z-index: 92;
              display: inline-flex;
              align-items: center;
              gap: .58rem;
              min-height: 2.9rem;
              padding: .48rem .78rem .48rem .58rem;
              border: 1px solid rgba(255,255,255,.28);
              border-radius: 999px;
              color: #fff9fd;
              background: rgba(28, 17, 63, .58);
              box-shadow: 0 10px 28px rgba(9, 5, 37, .28), inset 0 1px 0 rgba(255,255,255,.12);
              backdrop-filter: blur(14px);
              font: inherit;
              font-size: .77rem;
              font-weight: 700;
              letter-spacing: .035em;
              cursor: pointer;
              transition: opacity .2s ease, border-color .2s ease, background .2s ease;
              -webkit-tap-highlight-color: transparent;
            }
            .birthday-music-toggle:hover:not(:disabled),
            .birthday-music-toggle:focus-visible {
              border-color: rgba(255,225,245,.68);
              background: rgba(66, 35, 111, .76);
              outline: none;
            }
            .birthday-music-toggle:disabled { opacity: .58; cursor: not-allowed; }
            .birthday-music-toggle__icon {
              display: grid;
              width: 1.8rem;
              height: 1.8rem;
              place-items: center;
              border-radius: 50%;
              background: linear-gradient(135deg, rgba(255,186,220,.92), rgba(185,159,255,.92));
              color: #35205d;
              box-shadow: 0 0 17px rgba(246, 167, 213, .38);
            }
            .birthday-music-toggle__bars { display: inline-flex; align-items: end; gap: 2px; height: .7rem; }
            .birthday-music-toggle__bars i { width: 2px; border-radius: 2px; background: currentColor; opacity: .75; }
            @media (max-width: 480px) {
              .birthday-music-toggle { padding-right: .58rem; }
              .birthday-music-toggle__label { display: none; }
            }
          `}</style>
          <motion.button
            type="button"
            className="birthday-music-toggle"
            aria-label={statusText}
            aria-pressed={!muted}
            title={statusText}
            disabled={!canToggle}
            onClick={toggleSound}
            whileHover={reducedMotion ? undefined : { scale: 1.035 }}
            whileTap={reducedMotion ? undefined : { scale: 0.96 }}
          >
            <span className="birthday-music-toggle__icon" aria-hidden="true">
              {muted || !shouldPlay ? <VolumeX size={16} strokeWidth={2.25} /> : <Volume2 size={16} strokeWidth={2.25} />}
            </span>
            {!compact && (
              <span className="birthday-music-toggle__label">
                {needsGesture ? 'Bật nhạc' : muted ? 'Đang tắt' : isPlaying ? 'Đang phát' : 'Nhạc nền'}
              </span>
            )}
            {isPlaying && !muted && !compact && (
              <span className="birthday-music-toggle__bars" aria-hidden="true">
                {[0.45, 0.78, 0.56].map((height, index) => (
                  <motion.i
                    key={index}
                    style={{ height: `${height}rem` }}
                    animate={reducedMotion ? undefined : { scaleY: [0.55, 1, 0.6] }}
                    transition={{ duration: 0.72 + index * 0.12, repeat: Infinity, repeatType: 'mirror' }}
                  />
                ))}
              </span>
            )}
            {!compact && !isPlaying && !muted && shouldPlay && <Music2 size={13} aria-hidden="true" />}
          </motion.button>
        </>
      )}
    </>
  )
}
