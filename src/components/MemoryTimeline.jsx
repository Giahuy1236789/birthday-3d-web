import { motion } from 'framer-motion'

export default function MemoryTimeline({ items }) {
  return (
    <section className="timeline-section section-shell" id="timeline">
      <motion.div
        className="section-heading centered-heading"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
      >
        <span className="heading-kicker">a soft little story</span>
        <h2>💖 Một vài kỷ niệm</h2>
      </motion.div>
      <div className="timeline-list">
        <div className="timeline-line" />
        {items.map((item, index) => (
          <motion.article
            key={item.title}
            className={`timeline-item ${index % 2 ? 'timeline-right' : 'timeline-left'}`}
            initial={{ opacity: 0, x: index % 2 ? 44 : -44, y: 16, filter: 'blur(7px)' }}
            whileInView={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.28 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="timeline-dot">{item.icon}</div>
            <div className="timeline-card glass-card">
              <span className="timeline-number">0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
