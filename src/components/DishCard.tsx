import { motion } from 'motion/react'
import { Heart, ThumbsDown } from 'lucide-react'
import DishImage from './DishImage'
import { cn } from '../lib/cn'
import type { Dish } from '../types'

interface Props {
  dish: Dish
  index: number
  isFavorite: boolean
  onClick: () => void
  onToggleFavorite: () => void
  onDislike: () => void
}

export default function DishCard({
  dish,
  index,
  isFavorite,
  onClick,
  onToggleFavorite,
  onDislike,
}: Props) {
  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.22, delay: 0 } }}
      transition={{ delay: Math.min(index * 0.06, 0.5), duration: 0.35, ease: 'easeOut' }}
      whileTap={{ scale: 0.98 }}
      className="w-full min-w-[78%] shrink-0 cursor-pointer snap-center overflow-hidden rounded-3xl border border-cream-200 bg-white text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl sm:min-w-0"
    >
      <div className="relative">
        <DishImage title={dish.title} query={dish.search_query} className="h-44" />

        {/* ❤️ в избранное и 👎 скрыть */}
        <div className="absolute top-3 left-3 flex gap-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite()
            }}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? 'Убрать из избранного' : 'В избранное'}
            className={cn(
              'grid size-9 place-items-center rounded-full backdrop-blur-sm transition-colors',
              isFavorite
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                : 'bg-white/90 text-ink-700 hover:bg-white',
            )}
          >
            <Heart className={cn('size-4.5', isFavorite && 'fill-white')} />
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.stopPropagation()
              onDislike()
            }}
            aria-label="Не нравится, скрыть"
            className="grid size-9 place-items-center rounded-full bg-white/90 text-ink-700 backdrop-blur-sm transition-colors hover:bg-white"
          >
            <ThumbsDown className="size-4.5" />
          </motion.button>
        </div>

        <span className="absolute right-3 bottom-3 rounded-full bg-ink-900/75 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
          {dish.bzhu.calories} ккал
        </span>
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-ink-800 backdrop-blur-sm">
          {dish.volume_category === 'large_volume' ? '🥗 Большая порция' : '⚡ Компактная зарядка'}
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
    </motion.div>
  )
}
