import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

const fallbackWishes = [
  'Luôn vui vẻ nhé ❤️',
  'Tuổi mới thật nhiều may mắn ✨',
  'Luôn xinh đẹp và hạnh phúc 🌷',
  'Mọi điều tốt đẹp sẽ đến 🌟',
  'Cứ rực rỡ theo cách của bạn nhé!',
]

const balloonColors = [
  { main: '#f39ac5', shade: '#b24d83' },
  { main: '#b7a1f5', shade: '#7656bf' },
  { main: '#8bc7f2', shade: '#3d85b8' },
  { main: '#f4b76f', shade: '#c0712f' },
  { main: '#f3a9af', shade: '#bd5b70' },
  { main: '#a6dec7', shade: '#4d9d7b' },
]

const slots = [4, 13, 23, 34, 45, 58, 69, 80, 90, 28, 74, 52]

const popParticles = [
  [-30, -38],
  [0, -48],
  [32, -34],
  [44, 2],
  [24, 35],
  [-20, 38],
  [-43, 8],
]

function createBalloons(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: `balloon-${index}`,
    color: balloonColors[index % balloonColors.length],
    left: slots[index % slots.length],
    size: 52 + ((index * 11) % 25),
    duration: 15 + ((index * 7) % 9),
    delay: -((index * 2.45) % 17),
    sway: index % 2 === 0 ? 22 + index * 1.5 : -(20 + index * 1.5),
    messageIndex: index,
  }))
}

/**
 * A lightweight floating balloon layer. `onWish` receives the selected wish text.
 */
export default function Balloons({ messages = [], onWish }) {
  const reducedMotion = useReducedMotion()
  const wishes = Array.isArray(messages) && messages.length ? messages : fallbackWishes
  const balloons = useMemo(
    () => createBalloons(Math.min(12, Math.max(9, wishes.length + 4))),
    [wishes.length],
  )
  const [popped, setPopped] = useState(() => new Set())
  const [bursting, setBursting] = useState(() => new Set())
  const [notice, setNotice] = useState(null)
  const timers = useRef([])

  useEffect(() => () => {
    timers.current.forEach((timer) => window.clearTimeout(timer))
  }, [])

  const popBalloon = (balloon) => {
    if (popped.has(balloon.id) || bursting.has(balloon.id)) return

    const wish = wishes[balloon.messageIndex % wishes.length]
    setBursting((current) => new Set([...current, balloon.id]))
    if (typeof onWish === 'function') {
      onWish(wish)
    } else {
      setNotice({ id: `${balloon.id}-${Date.now()}`, text: wish })
    }

    const popTimer = window.setTimeout(() => {
      setPopped((current) => new Set([...current, balloon.id]))
      setBursting((current) => {
        const next = new Set(current)
        next.delete(balloon.id)
        return next
      })
    }, 260)

    timers.current.push(popTimer)
    if (typeof onWish !== 'function') {
      const noticeTimer = window.setTimeout(() => setNotice(null), 3200)
      timers.current.push(noticeTimer)
    }
  }

  return (
    <div className="birthday-balloons" aria-label="Bong bóng lời chúc">
      <style>{`
        .birthday-balloons {
          position: fixed;
          inset: 0;
          z-index: 12;
          pointer-events: none;
          overflow: hidden;
        }
        .birthday-balloon {
          position: absolute;
          bottom: -12rem;
          display: grid;
          place-items: start center;
          border: 0;
          padding: 0;
          background: transparent;
          pointer-events: auto;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        .birthday-balloon__orb {
          position: relative;
          width: var(--balloon-size);
          height: calc(var(--balloon-size) * 1.22);
          border: 1px solid rgba(255, 255, 255, .6);
          border-radius: 50% 50% 48% 48%;
          box-shadow: inset -11px -15px 20px rgba(62, 21, 76, .16), 0 10px 24px rgba(16, 9, 52, .22);
          transition: filter .2s ease, box-shadow .2s ease;
        }
        .birthday-balloon:hover .birthday-balloon__orb,
        .birthday-balloon:focus-visible .birthday-balloon__orb {
          filter: brightness(1.08) saturate(1.1);
          box-shadow: inset -11px -15px 20px rgba(62, 21, 76, .16), 0 0 0 4px rgba(255,255,255,.2), 0 12px 32px rgba(255, 177, 219, .42);
        }
        .birthday-balloon:focus-visible { outline: none; }
        .birthday-balloon__shine {
          position: absolute;
          top: 17%;
          left: 21%;
          width: 21%;
          height: 31%;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(255,255,255,.85), rgba(255,255,255,0));
          transform: rotate(22deg);
        }
        .birthday-balloon__knot {
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 10px solid var(--balloon-knot);
          filter: drop-shadow(0 2px 1px rgba(38, 13, 59, .16));
        }
        .birthday-balloon__string {
          width: 1px;
          height: 92px;
          margin-top: -1px;
          background: linear-gradient(to bottom, rgba(255,255,255,.88), rgba(255,255,255,.06));
          opacity: .72;
        }
        .birthday-balloon__spark {
          position: absolute;
          top: 48%;
          left: 50%;
          width: 7px;
          height: 7px;
          margin: -4px;
          border-radius: 999px;
          background: rgba(255, 247, 208, .95);
          box-shadow: 0 0 10px 3px rgba(255, 222, 139, .7);
          pointer-events: none;
        }
        .birthday-balloon__notice {
          position: fixed;
          left: 50%;
          bottom: 2.25rem;
          max-width: min(27rem, calc(100vw - 2.5rem));
          padding: .8rem 1.1rem;
          border: 1px solid rgba(255,255,255,.35);
          border-radius: 999px;
          color: #fff7fb;
          background: rgba(31, 18, 68, .72);
          box-shadow: 0 14px 36px rgba(6, 4, 33, .34), inset 0 1px 0 rgba(255,255,255,.14);
          backdrop-filter: blur(14px);
          font-size: .9rem;
          font-weight: 600;
          letter-spacing: .01em;
          text-align: center;
          pointer-events: none;
        }
        @media (max-width: 700px) {
          .birthday-balloon:nth-of-type(n + 8) { display: none; }
          .birthday-balloon__string { height: 66px; }
          .birthday-balloon__notice { bottom: 1.15rem; font-size: .82rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .birthday-balloon__orb { transition: none; }
        }
      `}</style>

      <AnimatePresence>
        {balloons.filter((balloon) => !popped.has(balloon.id)).map((balloon) => {
          const isBursting = bursting.has(balloon.id)
          const wish = wishes[balloon.messageIndex % wishes.length]
          const travel = reducedMotion
            ? { y: 0, x: 0, rotate: 0, opacity: 0.76 }
            : {
                y: ['12vh', '-124vh'],
                x: [0, balloon.sway, -balloon.sway * 0.45, 0],
                rotate: [0, 2.5, -2, 0],
                opacity: [0, 0.92, 0.92, 0],
              }

          return (
            <motion.button
              key={balloon.id}
              type="button"
              className="birthday-balloon"
              aria-label={`Bật một lời chúc: ${wish}`}
              onClick={() => popBalloon(balloon)}
              initial={reducedMotion ? false : { opacity: 0, scale: 0.88, y: '14vh' }}
              animate={isBursting
                ? { opacity: [1, 1, 0], scale: [1, 1.34, 0.12], rotate: [0, 9, -16] }
                : travel}
              transition={isBursting
                ? { duration: 0.26, ease: 'easeOut' }
                : {
                    duration: reducedMotion ? 0 : balloon.duration,
                    delay: reducedMotion ? 0 : balloon.delay,
                    repeat: reducedMotion ? 0 : Infinity,
                    repeatType: 'loop',
                    ease: 'linear',
                  }}
              style={{
                left: `${balloon.left}%`,
                bottom: reducedMotion ? `${10 + ((balloon.messageIndex * 13) % 58)}vh` : undefined,
                '--balloon-size': `${balloon.size}px`,
                '--balloon-knot': balloon.color.shade,
              }}
            >
              <span
                className="birthday-balloon__orb"
                style={{
                  background: `radial-gradient(circle at 31% 22%, rgba(255,255,255,.86) 0 3%, rgba(255,255,255,.23) 15%, transparent 34%), linear-gradient(145deg, ${balloon.color.main}, ${balloon.color.shade})`,
                }}
              >
                <span className="birthday-balloon__shine" />
                {isBursting && popParticles.map(([x, y], index) => (
                  <motion.i
                    // The particle is decorative; the button's accessible label provides the action.
                    aria-hidden="true"
                    className="birthday-balloon__spark"
                    key={`${balloon.id}-spark-${index}`}
                    initial={{ opacity: 1, scale: 0.3, x: 0, y: 0 }}
                    animate={{ opacity: 0, scale: 1, x, y }}
                    transition={{ duration: 0.28, delay: index * 0.008, ease: 'easeOut' }}
                  />
                ))}
              </span>
              <span className="birthday-balloon__knot" aria-hidden="true" />
              <span className="birthday-balloon__string" aria-hidden="true" />
            </motion.button>
          )
        })}
      </AnimatePresence>

      <AnimatePresence>
        {notice && (
          <motion.div
            key={notice.id}
            className="birthday-balloon__notice"
            role="status"
            initial={{ x: '-50%', y: 16, opacity: 0, scale: 0.94 }}
            animate={{ x: '-50%', y: 0, opacity: 1, scale: 1 }}
            exit={{ x: '-50%', y: 10, opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {notice.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
