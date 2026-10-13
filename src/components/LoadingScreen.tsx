import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const MESSAGES = [
  'Разбираю твои ответы…',
  'Сверяю БЖУ и калорийность…',
  'Заглядываю в кулинарные архивы…',
  'Придумываю вкусный лор…',
  'Почти готово!',
]

const ORBIT = ['🥕', '🧀', '🍅', '🌿', '🦐']

export default function LoadingScreen() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % MESSAGES.length), 2300)
    return () => clearInterval(id)
  }, [])

  return (
    <motion.div
      className="flex min-h-dvh flex-col items-center justify-center px-8 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25 }}
    >
      <div className="relative grid size-44 place-items-center">
        <motion.div
          className="absolute size-32 rounded-full bg-brand-500/15"
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.25, 0.8] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        {ORBIT.map((emoji, i) => {
          const angle = (i * 2 * Math.PI) / ORBIT.length - Math.PI / 2
          return (
            <span
              key={emoji}
              className="absolute"
              style={{
                transform: `translate(${Math.round(Math.cos(angle) * 78)}px, ${Math.round(Math.sin(angle) * 78)}px)`,
              }}
            >
              <motion.span
                className="block text-2xl"
                animate={{ y: [-5, 5, -5], opacity: [0.55, 1, 0.55] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.25,
                  ease: 'easeInOut',
                }}
              >
                {emoji}
              </motion.span>
            </span>
          )
        })}
        <motion.span
          className="text-7xl"
          animate={{ rotate: [-8, 8, -8] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          🍳
        </motion.span>
      </div>

      <div className="mt-8 h-7 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.h1
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="text-xl font-extrabold"
          >
            {MESSAGES[idx]}
          </motion.h1>
        </AnimatePresence>
      </div>
      <p className="mt-2 text-sm text-ink-500">Обычно занимает 5–15 секунд</p>

      <div className="mt-8 h-1.5 w-48 overflow-hidden rounded-full bg-cream-200">
        <motion.div
          className="h-full rounded-full bg-brand-500"
          initial={{ width: '5%' }}
          animate={{ width: '95%' }}
          transition={{ duration: 11, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  )
}
