import { motion } from 'framer-motion'
import { Gift, Sparkles } from 'lucide-react'

export default function IntroScreen({ onOpen }) {
  const stars = Array.from({ length: 28 }, (_, index) => ({
    id: index,
    x: `${(index * 37 + 9) % 94}%`,
    y: `${(index * 23 + 8) % 82}%`,
    duration: `${2.4 + (index % 6) * 0.55}s`,
  }))

  return (
    <motion.section
      className="intro-screen"
      exit={{ opacity: 0, scale: 1.08, filter: 'blur(16px)' }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Mở lời chúc sinh nhật"
    >
      <div className="intro-aurora intro-aurora-one" />
      <div className="intro-aurora intro-aurora-two" />
      <div className="intro-stars" aria-hidden="true">
        {stars.map((star) => <i key={star.id} style={{ '--star-x': star.x, '--star-y': star.y, '--star-t': star.duration }} />)}
      </div>
      <motion.div
        className="intro-content"
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="eyebrow"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.55 }}
        >
          <Sparkles size={15} /> a tiny universe, made with love
        </motion.div>
        <h1>✨ Có một điều bất ngờ<br />dành cho bạn ✨</h1>
        <p>Chạm vào món quà để bước vào một đêm thật đặc biệt.</p>
        <motion.button
          className="primary-button intro-button"
          type="button"
          onClick={onOpen}
          whileHover={{ scale: 1.045 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="button-shimmer" />
          <Gift size={20} strokeWidth={1.8} />
          <span>Mở món quà</span>
          <span className="button-spark">✦</span>
        </motion.button>
      </motion.div>
      <div className="intro-bottom-note">made for one extraordinary soul</div>
    </motion.section>
  )
}
