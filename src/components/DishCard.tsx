import { motion } from 'motion/react'
import DishImage from './DishImage'
import type { Dish } from '../types'

interface Props {
  dish: Dish
  index: number
  onClick: () => void
}

export default function DishCard({ dish, index, onClick }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.06, 0.5), duration: 0.35, ease: 'easeOut' }}
      whileTap={{ scale: 0.98 }}
      className="w-full min-w-[78%] shrink-0 snap-center overflow-hidden rounded-3xl border border-cream-200 bg-white text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl sm:min-w-0"
    >
      <div className="relative">
        <DishImage title={dish.title} query={dish.search_query} className="h-44" />
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-ink-800 backdrop-blur-sm">
          {dish.volume_category === 'large_volume' ? '🥗 Большая порция' : '⚡ Компактная зарядка'}
        </span>
        <span className="absolute top-3 right-3 rounded-full bg-ink-900/75 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
          {dish.bzhu.calories} ккал
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-[17px] leading-tight font-extrabold">{dish.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-ink-500">
          {dish.short_description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-bold">
          <span className="rounded-lg bg-brand-500/10 px-2 py-1 text-brand-700">
            Б {dish.bzhu.proteins} г
          </span>
          <span className="rounded-lg bg-herb-500/10 px-2 py-1 text-herb-600">
            Ж {dish.bzhu.fats} г
          </span>
          <span className="rounded-lg bg-berry-500/10 px-2 py-1 text-berry-500">
            У {dish.bzhu.carbohydrates} г
          </span>
        </div>
      </div>
    </motion.button>
  )
}
