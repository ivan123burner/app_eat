import { motion } from 'motion/react'

interface Props {
  current: number
  total: number
}

export default function Stepper({ current, total }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] font-bold tracking-wide text-ink-400 uppercase">
        <span>
          Шаг {current + 1} из {total}
        </span>
        <span>Что поесть?</span>
      </div>
      <div className="mt-2 flex gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream-200">
            <motion.div
              className="h-full rounded-full bg-brand-500"
              initial={false}
              animate={{ width: i < current ? '100%' : i === current ? '55%' : '0%' }}
              transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
