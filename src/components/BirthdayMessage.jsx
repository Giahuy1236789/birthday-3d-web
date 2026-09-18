import { useEffect, useMemo, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Heart, MailOpen, Sparkles } from 'lucide-react'
import { useRef } from 'react'

function TypewriterText({ text }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })
  const [visibleCount, setVisibleCount] = useState(0)
  const content = useMemo(() => text.trim(), [text])

  useEffect(() => {
    if (!inView) return undefined
    setVisibleCount(0)
    const timer = window.setInterval(() => {
      setVisibleCount((current) => {
        if (current >= content.length) {
          window.clearInterval(timer)
          return current
        }
        return current + 2
      })
    }, 16)
    return () => window.clearInterval(timer)
  }, [content, inView])

  return <p ref={ref} className="typed-message">{content.slice(0, visibleCount)}<span className="typing-caret" /></p>
}

export default function BirthdayMessage({ message }) {
  return (
    <section className="message-section section-shell" id="message">
      <motion.div
        className="section-heading centered-heading"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
      >
        <span className="heading-kicker"><Sparkles size={14} /> a note from the heart</span>
        <h2>💌 Một chút lời chúc dành cho bạn</h2>
      </motion.div>
      <motion.article
        className="message-card glass-card"
        initial={{ opacity: 0, scale: 0.94, y: 30, filter: 'blur(10px)' }}
        whileInView={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.16 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="message-card-top"><MailOpen size={20} /><span>Gửi đến một người rất đặc biệt</span><Heart size={18} fill="currentColor" /></div>
        <TypewriterText text={message} />
        <div className="message-card-sign">with all the brightest wishes <span>✦</span></div>
      </motion.article>
    </section>
  )
}
