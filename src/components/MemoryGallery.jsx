import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Expand, X } from 'lucide-react'

export default function MemoryGallery({ memories, captions }) {
  const [activeIndex, setActiveIndex] = useState(null)
  const close = () => setActiveIndex(null)
  const move = (direction) => setActiveIndex((index) => (index + direction + memories.length) % memories.length)

  useEffect(() => {
    const onKey = (event) => {
      if (activeIndex === null) return
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowRight') move(1)
      if (event.key === 'ArrowLeft') move(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeIndex, memories.length])

  return (
    <section className="gallery-section section-shell" id="memories">
      <motion.div
        className="section-heading gallery-heading"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
      >
        <span className="heading-kicker">✦ little pieces of happiness</span>
        <h2>📸 Những khoảnh khắc đẹp</h2>
        <p>Giữ lại những điều khiến trái tim mình mỉm cười.</p>
      </motion.div>
      <div className="memory-grid">
        {memories.map((memory, index) => (
          <motion.button
            className={`memory-card memory-${index + 1}`}
            key={memory}
            type="button"
            aria-label={`Xem ảnh: ${captions[index]}`}
            onClick={() => setActiveIndex(index)}
            initial={{ opacity: 0, y: 34, rotate: index % 2 ? 2.5 : -2.5 }}
            whileInView={{ opacity: 1, y: 0, rotate: index % 2 ? 2.5 : -2.5 }}
            whileHover={{ y: -12, rotate: 0, scale: 1.025 }}
            viewport={{ once: true, amount: 0.16 }}
            transition={{ delay: (index % 3) * 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="memory-tape" />
            <img src={memory} alt={captions[index]} loading="lazy" onError={(event) => { event.currentTarget.style.opacity = 0 }} />
            <span className="memory-overlay"><Expand size={19} /> chạm để xem</span>
            <span className="memory-caption">{captions[index]}</span>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Xem ảnh kỷ niệm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <button type="button" className="lightbox-close" onClick={close} aria-label="Đóng ảnh"><X /></button>
            <button type="button" className="lightbox-arrow prev" onClick={(event) => { event.stopPropagation(); move(-1) }} aria-label="Ảnh trước"><ArrowLeft /></button>
            <motion.figure
              className="lightbox-figure"
              key={memories[activeIndex]}
              initial={{ opacity: 0, scale: 0.9, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(event) => event.stopPropagation()}
            >
              <img src={memories[activeIndex]} alt={captions[activeIndex]} />
              <figcaption><span>{String(activeIndex + 1).padStart(2, '0')}</span>{captions[activeIndex]}</figcaption>
            </motion.figure>
            <button type="button" className="lightbox-arrow next" onClick={(event) => { event.stopPropagation(); move(1) }} aria-label="Ảnh tiếp theo"><ArrowRight /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
