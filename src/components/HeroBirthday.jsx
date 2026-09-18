import { motion } from 'framer-motion'
import { Sparkles, Wind } from 'lucide-react'
import BirthdayCake3D from './BirthdayCake3D'

const letters = 'HAPPY BIRTHDAY'.split('')

export default function HeroBirthday({ name, blown, onBlow }) {
  return (
    <section className="hero-section section-shell" id="celebrate">
      <div className="hero-copy">
        <motion.div
          className="eyebrow"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Sparkles size={15} /> the day the stars shine brighter
        </motion.div>
        <h2 className="hero-title" aria-label="Happy Birthday">
          <span className="hero-title-icon">🎂</span>
          {letters.map((letter, index) => (
            <motion.span
              key={`${letter}-${index}`}
              initial={{ opacity: 0, y: 24, rotateX: -65 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + index * 0.045, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={letter === ' ' ? 'letter-space' : ''}
            >{letter === ' ' ? '\u00A0' : letter}</motion.span>
          ))}
          <span className="hero-title-icon">🎂</span>
        </h2>
        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.65, duration: 0.7 }}
        >
          Chúc mừng sinh nhật <span className="name-gradient">{name}</span>
        </motion.p>
        <motion.p
          className="hero-lead"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.82, duration: 0.8 }}
        >Một ngày dành riêng cho niềm vui, những điều dịu dàng và phép màu đang chờ phía trước.</motion.p>
      </div>

      <motion.div
        className="cake-stage"
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="cake-halo" />
        <BirthdayCake3D blown={blown} />
        <div className="cake-stage-caption">Kéo để xoay chiếc bánh ✦</div>
      </motion.div>

      <motion.div
        className="hero-actions"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.75, duration: 0.6 }}
      >
        <button type="button" className={`blow-button ${blown ? 'is-blown' : ''}`} onClick={onBlow} disabled={blown}>
          <Wind size={19} />
          <span>{blown ? 'Điều ước đã bay xa' : 'Thổi nến'}</span>
          {!blown && <i />}
        </button>
        <span className="interaction-note">Khép mắt lại, ước một điều thật đẹp...</span>
      </motion.div>
    </section>
  )
}
