import { useEffect } from 'react'
import { motion } from 'motion/react'
import { BookOpen, ChefHat, Clock, Image as ImageIcon, Sparkles, X } from 'lucide-react'
import DishImage from './DishImage'
import { unsplashSearchUrl } from '../services/images'
import { cn } from '../lib/cn'
import type { Dish } from '../types'

interface Props {
  dish: Dish
  onClose: () => void
}

function MacroBar({
  label,
  grams,
  total,
  barClass,
}: {
  label: string
  grams: number
  total: number
  barClass: string
}) {
  const pct = total > 0 ? Math.round((grams / total) * 100) : 0
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="font-semibold">{label}</span>
        <span className="text-ink-500">
          {grams} г · {pct}%
        </span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-cream-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          className={cn('h-full rounded-full', barClass)}
        />
      </div>
    </div>
  )
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof ChefHat
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-4 rounded-2xl border border-cream-200 bg-white p-4">
      <h3 className="flex items-center gap-2 font-extrabold">
        <Icon className="size-4.5 text-brand-500" />
        {title}
      </h3>
      <div className="mt-2 text-[15px] leading-relaxed whitespace-pre-line text-ink-700">
        {children}
      </div>
    </section>
  )
}

export default function DishModal({ dish, onClose }: Props) {
  // Закрытие по Escape + блокировка скролла фона
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  const { calories, proteins, fats, carbohydrates, fiber } = dish.bzhu
  const macroTotal = proteins + fats + carbohydrates
  const isLarge = dish.volume_category === 'large_volume'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <motion.div
        className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={dish.title}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        className="relative max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-cream-50 sm:max-w-xl sm:rounded-3xl"
      >
        <div className="relative">
          <DishImage title={dish.title} query={dish.search_query} className="h-52 sm:rounded-t-3xl" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="absolute top-4 right-4 grid size-9 place-items-center rounded-full bg-white/90 backdrop-blur-sm transition hover:bg-white"
          >
            <X className="size-5" />
          </button>
          <span className="absolute bottom-3 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold backdrop-blur-sm">
            {isLarge ? '🥗 Большая порция' : '⚡ Компактная зарядка'}
          </span>
        </div>

        <div className="p-5 pb-10">
          <h2 className="text-2xl leading-tight font-extrabold">{dish.title}</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-700">{dish.short_description}</p>

          {dish.cooking_time_minutes && (
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-cream-100 px-3 py-1 text-xs font-bold text-ink-700">
              <Clock className="size-3.5" /> ~{dish.cooking_time_minutes} мин
            </span>
          )}

          {/* БЖУ */}
          <div className="mt-4 rounded-2xl border border-cream-200 bg-white p-4">
            <div className="flex items-baseline justify-between">
              <h3 className="font-extrabold">БЖУ на порцию</h3>
              <span className="text-2xl font-extrabold text-brand-600">
                {calories}{' '}
                <span className="text-sm font-semibold text-ink-400">ккал</span>
              </span>
            </div>
            <div className="mt-3 space-y-3">
              <MacroBar label="Белки" grams={proteins} total={macroTotal} barClass="bg-brand-500" />
              <MacroBar label="Жиры" grams={fats} total={macroTotal} barClass="bg-herb-500" />
              <MacroBar
                label="Углеводы"
                grams={carbohydrates}
                total={macroTotal}
                barClass="bg-berry-500"
              />
            </div>
            {fiber !== undefined && (
              <p className="mt-3 text-xs font-semibold text-ink-500">🌾 Клетчатка: {fiber} г</p>
            )}
          </div>

          <Section icon={ChefHat} title={isLarge ? 'Как приготовить' : 'Как выбрать / приготовить'}>
            {dish.recipe_summary}
          </Section>

          <Section icon={BookOpen} title="История блюда">
            {dish.history}
          </Section>

          <div className="mt-4 rounded-2xl border border-berry-500/25 bg-berry-500/5 p-4">
            <h3 className="flex items-center gap-2 font-extrabold">
              <Sparkles className="size-4.5 text-berry-500" />
              Любопытный факт
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-700">{dish.fun_fact}</p>
          </div>

          {dish.tags && dish.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {dish.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-cream-100 px-2.5 py-1 text-[11px] font-semibold text-ink-500"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <a
            href={unsplashSearchUrl(dish.search_query)}
            target="_blank"
            rel="noreferrer"
            className="mt-5 flex items-center justify-center gap-2 rounded-2xl border-2 border-cream-200 bg-white py-3 text-sm font-bold transition-colors hover:border-brand-300"
          >
            <ImageIcon className="size-4.5 text-brand-500" />
            Найти фото: «{dish.search_query}»
          </a>
        </div>
      </motion.div>
    </div>
  )
}
