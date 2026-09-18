import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Heart, Sparkles, X } from 'lucide-react'
import { birthdayData } from './data/birthdayData'
import AmbientScene from './components/AmbientScene'
import IntroScreen from './components/IntroScreen'
import HeroBirthday from './components/HeroBirthday'
import Balloons from './components/Balloons'
import BirthdayMessage from './components/BirthdayMessage'
import MemoryGallery from './components/MemoryGallery'
import MemoryTimeline from './components/MemoryTimeline'
import GiftBox3D from './components/GiftBox3D'
import Fireworks from './components/Fireworks'
import MusicPlayer from './components/MusicPlayer'
import CustomCursor from './components/CustomCursor'
import Finale from './components/Finale'

const burst = (options = {}) => {
  confetti({
    particleCount: 95,
    spread: 82,
    startVelocity: 36,
    origin: { y: 0.58 },
    colors: ['#ffd6ec', '#cbb7ff', '#ffe09a', '#9de7ff', '#ffffff'],
    ...options,
  })
}

function WishOverlay({ stage, name }) {
  return (
    <AnimatePresence>
      {stage && (
        <motion.div className="wish-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="wish-overlay-card"
            initial={{ opacity: 0, scale: 0.86, y: 22 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', damping: 18, stiffness: 180 }}
          >
            <span className="wish-spark">✦</span>
            {stage === 'wish' ? (
              <><h2>🎉 Điều ước của bạn đang trên đường trở thành hiện thực!</h2><p>Cứ tin vào những điều kỳ diệu nhé.</p></>
            ) : (
              <><h2>Happy Birthday <em>{name}</em> ❤️</h2><p>Ước gì cũng được, miễn là bạn thật hạnh phúc.</p></>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function SecretHeart({ onUnlock }) {
  const [clicks, setClicks] = useState(0)
  const [unlocked, setUnlocked] = useState(false)

  const clickHeart = () => {
    const next = clicks + 1
    setClicks(next)
    if (next >= 5) {
      setUnlocked(true)
      setClicks(0)
      onUnlock()
      window.setTimeout(() => setUnlocked(false), 4200)
    }
  }

  return (
    <>
      <button className={`secret-heart ${unlocked ? 'unlocked' : ''}`} onClick={clickHeart} type="button" aria-label="Một bí mật nhỏ">
        <Heart size={18} fill="currentColor" />
        <span className="secret-count">{clicks ? `${clicks}/5` : ''}</span>
      </button>
      <AnimatePresence>
        {unlocked && (
          <motion.div className="secret-message" initial={{ opacity: 0, x: 18, y: 8 }} animate={{ opacity: 1, x: 0, y: 0 }} exit={{ opacity: 0, x: 18 }}>
            <button type="button" onClick={() => setUnlocked(false)} aria-label="Đóng"><X size={15} /></button>
            <strong>Bạn vừa mở khóa một bí mật ❤️</strong>
            <span>Chúc bạn luôn được yêu thương thật nhiều!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function HeartRain({ active }) {
  if (!active) return null
  return <div className="heart-rain" aria-hidden="true">{Array.from({ length: 34 }, (_, index) => <i key={index}>♥</i>)}</div>
}

export default function App() {
  const [opened, setOpened] = useState(false)
  const [candlesBlown, setCandlesBlown] = useState(false)
  const [fireworks, setFireworks] = useState(false)
  const [wishStage, setWishStage] = useState(null)
  const [toast, setToast] = useState(null)
  const [heartRain, setHeartRain] = useState(false)
  const timers = useRef([])

  const addTimer = (callback, ms) => {
    const id = window.setTimeout(callback, ms)
    timers.current.push(id)
    return id
  }

  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), [])

  const openExperience = () => {
    setOpened(true)
    burst({ particleCount: 125, spread: 105, startVelocity: 42, origin: { y: 0.52 } })
    addTimer(() => burst({ particleCount: 45, spread: 72, startVelocity: 25, origin: { x: 0.2, y: 0.7 } }), 360)
  }

  const blowCandles = () => {
    if (candlesBlown) return
    setCandlesBlown(true)
    setFireworks(true)
    setWishStage('wish')
    burst({ particleCount: 180, spread: 155, startVelocity: 52, origin: { y: 0.64 } })
    addTimer(() => setWishStage('birthday'), 1150)
    addTimer(() => setWishStage(null), 4400)
    addTimer(() => setFireworks(false), 5000)
  }

  const showBalloonWish = (wish) => {
    setToast(wish)
    burst({ particleCount: 22, spread: 46, startVelocity: 18, origin: { y: 0.68 } })
    addTimer(() => setToast(null), 2700)
  }

  const openGift = () => {
    setFireworks(true)
    burst({ particleCount: 150, spread: 125, startVelocity: 39, origin: { y: 0.64 } })
    addTimer(() => setFireworks(false), 3600)
  }

  const unlockSecret = () => {
    setHeartRain(true)
    burst({ particleCount: 150, spread: 180, startVelocity: 44, colors: ['#ff8fc9', '#ffcae3', '#ffffff', '#ffd37c'], origin: { y: 0.66 } })
    addTimer(() => setHeartRain(false), 4800)
  }

  const replay = () => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
    setCandlesBlown(false)
    setFireworks(false)
    setWishStage(null)
    setToast(null)
    setHeartRain(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    addTimer(() => setOpened(false), 650)
  }

  return (
    <div className={`app ${opened ? 'experience-open' : 'intro-active'} ${candlesBlown ? 'candles-blown' : ''}`}>
      <AmbientScene dimmed={candlesBlown} />
      <CustomCursor />
      {opened && <Balloons messages={birthdayData.balloonMessages} onWish={showBalloonWish} />}
      <AnimatePresence>{!opened && <IntroScreen onOpen={openExperience} />}</AnimatePresence>

      <AnimatePresence>
        {opened && (
          <motion.main className="birthday-main" initial={{ opacity: 0, scale: 1.025 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            <HeroBirthday name={birthdayData.name} blown={candlesBlown} onBlow={blowCandles} />
            <BirthdayMessage message={birthdayData.message} />
            <MemoryGallery memories={birthdayData.memories} captions={birthdayData.memoryCaptions} />
            <MemoryTimeline items={birthdayData.timeline} />
            <GiftBox3D name={birthdayData.name} onOpen={openGift} />
            <Finale name={birthdayData.name} onReplay={replay} />
          </motion.main>
        )}
      </AnimatePresence>

      <MusicPlayer music={birthdayData.music} shouldPlay={opened} />
      <Fireworks active={fireworks} />
      <WishOverlay stage={wishStage} name={birthdayData.name} />
      <HeartRain active={heartRain} />
      <SecretHeart onUnlock={unlockSecret} />
      <AnimatePresence>{toast && <motion.div className="wish-toast" initial={{ opacity: 0, y: 16, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }}><Sparkles size={17} />{toast}</motion.div>}</AnimatePresence>
    </div>
  )
}
