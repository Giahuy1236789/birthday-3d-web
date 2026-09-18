import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Gift, Sparkles } from 'lucide-react'

export default function GiftBox3D({ name, onOpen }) {
  const [state, setState] = useState('idle')
  const timers = useRef([])

  const delay = (callback, duration) => {
    const id = window.setTimeout(callback, duration)
    timers.current.push(id)
  }

  const openGift = () => {
    if (state !== 'idle') return
    setState('shaking')
    delay(() => setState('opening'), 520)
    delay(() => {
      setState('opened')
      onOpen?.()
    }, 1140)
  }

  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), [])

  return (
    <section className="gift-section section-shell" id="gift">
      <motion.div
        className="gift-intro"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <span className="heading-kicker"><Sparkles size={14} /> one more thing</span>
        <h2>🎁 Còn một món quà nữa...</h2>
        <p>Đôi khi, điều đẹp nhất lại nằm trong những bất ngờ nhỏ.</p>
      </motion.div>
      <div className={`gift-wrap ${state}`}>
        <button className="gift-box" type="button" onClick={openGift} disabled={state !== 'idle'} aria-label="Mở hộp quà">
          <span className="gift-glow" />
          <span className="gift-lid"><i /><b /></span>
          <span className="gift-body"><i /><b /></span>
          <span className="gift-bow bow-left" />
          <span className="gift-bow bow-right" />
          <span className="gift-knot" />
          {state === 'opened' && <span className="gift-hearts">♥ ♥ ✦ ♥ ✦ ♥</span>}
        </button>
        {state === 'idle' && <button className="gift-hint" type="button" onClick={openGift}><Gift size={16} /> chạm để mở</button>}
      </div>
      {state === 'opened' && (
        <motion.div className="gift-reveal" initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6 }}>
          <span>✦ a wish just for you ✦</span>
          <h3>🎉 HAPPY BIRTHDAY <em>{name}</em> 🎉</h3>
          <p>Chúc mọi điều tốt đẹp nhất sẽ luôn đến với bạn ❤️</p>
        </motion.div>
      )}
    </section>
  )
}
