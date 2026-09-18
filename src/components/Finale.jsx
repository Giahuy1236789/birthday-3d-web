import { motion } from 'framer-motion'
import { RotateCcw, Sparkles } from 'lucide-react'

export default function Finale({ name, onReplay }) {
  const stars = Array.from({ length: 38 }, (_, index) => ({
    id: index,
    x: `${(index * 31 + 5) % 96}%`,
    y: `${(index * 19 + 7) % 88}%`,
    duration: `${2 + (index % 7) * 0.43}s`,
  }))

  return (
    <section className="finale-section" id="finale">
      <div className="finale-stars" aria-hidden="true">{stars.map((star) => <i key={star.id} style={{ '--star-x': star.x, '--star-y': star.y, '--star-t': star.duration }} />)}</div>
      <div className="finale-firework finale-firework-one" aria-hidden="true" />
      <div className="finale-firework finale-firework-two" aria-hidden="true" />
      <motion.div
        className="finale-content"
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="finale-kicker"><Sparkles size={16} /> this is your moment <Sparkles size={16} /></span>
        <h2>Happy Birthday</h2>
        <h3>{name} <span>❤️</span></h3>
        <p>May your wishes come true <i>✦</i></p>
        <button className="replay-button" type="button" onClick={onReplay}><RotateCcw size={18} /> Xem lại từ đầu</button>
      </motion.div>
    </section>
  )
}
