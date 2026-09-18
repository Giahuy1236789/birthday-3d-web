import { useEffect, useRef, useState } from 'react'

const desktopPointerQuery = [
  '(hover: hover)',
  '(pointer: fine)',
  '(min-width: 768px)',
  '(prefers-reduced-motion: no-preference)',
].join(' and ')

const interactiveSelector = [
  'a',
  'button',
  'input',
  'select',
  'textarea',
  'summary',
  '[role="button"]',
  '[data-cursor-grow]',
].join(',')

/**
 * An intentionally small custom desktop cursor. It is not mounted for touch,
 * keyboard-only, narrow, or reduced-motion experiences.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const trailRefs = useRef([])
  const visibleRef = useRef(false)
  const hoveredRef = useRef(false)
  const pressedRef = useRef(false)

  useEffect(() => {
    const media = window.matchMedia(desktopPointerQuery)
    const updateCapability = () => setEnabled(media.matches)
    updateCapability()

    if (media.addEventListener) media.addEventListener('change', updateCapability)
    else media.addListener(updateCapability)

    return () => {
      if (media.removeEventListener) media.removeEventListener('change', updateCapability)
      else media.removeListener(updateCapability)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return undefined

    document.documentElement.classList.add('birthday-custom-cursor-enabled')

    const target = { x: -100, y: -100 }
    const ring = { x: -100, y: -100 }
    const trails = Array.from({ length: 5 }, () => ({ x: -100, y: -100 }))
    let animationFrame = 0
    let pressTimer = 0

    const updateVisible = (nextVisible) => {
      if (visibleRef.current === nextVisible) return
      visibleRef.current = nextVisible
      setVisible(nextVisible)
    }

    const updateHover = (nextHovered) => {
      if (hoveredRef.current === nextHovered) return
      hoveredRef.current = nextHovered
      setHovered(nextHovered)
    }

    const updatePressed = (nextPressed) => {
      pressedRef.current = nextPressed
      setPressed(nextPressed)
    }

    const place = (element, point, scale = 1) => {
      if (!element) return
      element.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate3d(-50%, -50%, 0) scale(${scale})`
    }

    const animate = () => {
      ring.x += (target.x - ring.x) * 0.2
      ring.y += (target.y - ring.y) * 0.2
      place(ringRef.current, ring, pressedRef.current ? 0.72 : hoveredRef.current ? 1.58 : 1)

      trails[0].x += (target.x - trails[0].x) * 0.44
      trails[0].y += (target.y - trails[0].y) * 0.44
      for (let index = 1; index < trails.length; index += 1) {
        trails[index].x += (trails[index - 1].x - trails[index].x) * 0.36
        trails[index].y += (trails[index - 1].y - trails[index].y) * 0.36
      }
      trails.forEach((trail, index) => place(trailRefs.current[index], trail, 1 - index * 0.09))

      animationFrame = window.requestAnimationFrame(animate)
    }

    const onMove = (event) => {
      target.x = event.clientX
      target.y = event.clientY
      place(dotRef.current, target, pressedRef.current ? 0.72 : 1)
      updateVisible(true)
    }

    const onOver = (event) => {
      const element = event.target instanceof Element ? event.target : null
      updateHover(Boolean(element?.closest(interactiveSelector)))
    }

    const onDown = () => {
      window.clearTimeout(pressTimer)
      updatePressed(true)
      pressTimer = window.setTimeout(() => updatePressed(false), 170)
    }

    const onUp = () => updatePressed(false)
    const onLeave = (event) => {
      if (!event.relatedTarget) updateVisible(false)
    }
    const onBlur = () => updateVisible(false)

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('mousedown', onDown, { passive: true })
    document.addEventListener('mouseup', onUp, { passive: true })
    document.addEventListener('mouseout', onLeave, { passive: true })
    window.addEventListener('blur', onBlur)
    animate()

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.clearTimeout(pressTimer)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseout', onLeave)
      window.removeEventListener('blur', onBlur)
      document.documentElement.classList.remove('birthday-custom-cursor-enabled')
      visibleRef.current = false
      hoveredRef.current = false
      pressedRef.current = false
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      className={`birthday-custom-cursor${visible ? ' birthday-custom-cursor--visible' : ''}${hovered ? ' birthday-custom-cursor--hovered' : ''}${pressed ? ' birthday-custom-cursor--pressed' : ''}`}
      aria-hidden="true"
    >
      <style>{`
        .birthday-custom-cursor-enabled,
        .birthday-custom-cursor-enabled * { cursor: none !important; }
        .birthday-custom-cursor {
          position: fixed;
          inset: 0;
          z-index: 10000;
          pointer-events: none;
          opacity: 0;
          transition: opacity .18s ease;
        }
        .birthday-custom-cursor--visible { opacity: 1; }
        .birthday-custom-cursor__dot,
        .birthday-custom-cursor__ring,
        .birthday-custom-cursor__trail {
          position: fixed;
          top: 0;
          left: 0;
          will-change: transform;
          border-radius: 999px;
        }
        .birthday-custom-cursor__dot {
          width: 8px;
          height: 8px;
          background: #fff7da;
          box-shadow: 0 0 12px 3px rgba(255, 199, 227, .96), 0 0 27px 7px rgba(176, 157, 255, .34);
        }
        .birthday-custom-cursor__ring {
          width: 31px;
          height: 31px;
          border: 1px solid rgba(255, 228, 248, .88);
          background: radial-gradient(circle, rgba(255,255,255,.13), transparent 66%);
          box-shadow: 0 0 18px rgba(198, 163, 255, .4), inset 0 0 9px rgba(255, 202, 229, .2);
        }
        .birthday-custom-cursor__trail {
          width: 5px;
          height: 5px;
          background: rgba(255, 221, 244, .72);
          box-shadow: 0 0 10px rgba(197, 169, 255, .75);
        }
        .birthday-custom-cursor__trail:nth-of-type(4) { opacity: .72; }
        .birthday-custom-cursor__trail:nth-of-type(5) { opacity: .5; }
        .birthday-custom-cursor__trail:nth-of-type(6) { opacity: .32; }
        .birthday-custom-cursor__trail:nth-of-type(7) { opacity: .16; }
        .birthday-custom-cursor--hovered .birthday-custom-cursor__ring {
          border-color: rgba(255, 245, 198, .98);
          box-shadow: 0 0 24px 5px rgba(255, 187, 220, .5), inset 0 0 12px rgba(255, 247, 207, .28);
        }
        .birthday-custom-cursor--pressed .birthday-custom-cursor__dot { background: #ffc6e2; }
        @media (hover: none), (pointer: coarse), (max-width: 767px), (prefers-reduced-motion: reduce) {
          .birthday-custom-cursor { display: none; }
        }
      `}</style>
      <span ref={dotRef} className="birthday-custom-cursor__dot" />
      <span ref={ringRef} className="birthday-custom-cursor__ring" />
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          ref={(element) => { trailRefs.current[index] = element }}
          className="birthday-custom-cursor__trail"
        />
      ))}
    </div>
  )
}
