import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Loader, Menu, RotateCcw, Sparkles } from 'lucide-react'
import DishCard from './DishCard'
import DishModal from './DishModal'
import {
  DENSITY_LABEL,
  DIET_LABEL,
  FORMAT_LABEL,
  MEAL_TYPE_LABEL,
  VOLUME_STOPS,
} from '../data/quizConfig'
import type { Dish, DishWithMeta, QuizAnswers } from '../types'

interface Props {
  dishes: DishWithMeta[]
  answers: QuizAnswers
  goalLabel: string | null
  goalEmoji: string | null
  country: string
  favorites: Dish[]
  dislikedTitles: string[]
  loadingMore: boolean
  onRestart: () => void
  onMore: () => void
  onOpenMenu: () => void
  onToggleFavorite: (dish: Dish) => void
  onDislike: (dish: Dish) => void
}

export default function Results({
  dishes,
  answers,
  goalLabel,
  goalEmoji,
  country,
  favorites,
  dislikedTitles,
  loadingMore,
  onRestart,
  onMore,
  onOpenMenu,
  onToggleFavorite,
  onDislike,
}: Props) {
  const [selected, setSelected] = useState<Dish | null>(null)

  const visible = dishes.filter((d) => !dislikedTitles.includes(d.title))
  const favoriteTitles = new Set(favorites.map((f) => f.title))

  const chips: string[] = []
  if (goalLabel) chips.push(`${goalEmoji} ${goalLabel}`)
  if (country) chips.push(`🌍 ${country}`)
  if (answers.heroIngredient) chips.push(`✨ акцент: ${answers.heroIngredient}`)
  if (answers.mealType) chips.push(MEAL_TYPE_LABEL[answers.mealType])
  if (answers.density) chips.push(DENSITY_LABEL[answers.density])
  chips.push(VOLUME_STOPS[answers.volume]?.short ?? 'баланс')
  if (answers.cookingFormat) chips.push(FORMAT_LABEL[answers.cookingFormat])
  if (answers.diets.length > 0) chips.push(...answers.diets.map((d) => DIET_LABEL[d]))

  return (
    <motion.div
      className="min-h-dvh pb-12"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <header className="px-5 pt-safe">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Открыть меню"
            className="grid size-10 place-items-center rounded-xl border-2 border-cream-200 bg-white transition-colors hover:border-brand-300"
          >
            <Menu className="size-5" />
          </button>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-600">
            <Sparkles className="size-3.5" /> подбор ИИ
          </span>
        </div>

        <h1 className="mt-4 text-[26px] leading-tight font-extrabold">Твоя подборка 🍽️</h1>
        <p className="mt-1 text-[15px] text-ink-500">
          {visible.length} блюд подобраны под твои ответы:
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full bg-cream-100 px-3 py-1 text-xs font-semibold text-ink-700"
            >
              {chip}
            </span>
          ))}
        </div>
      </header>

      <section className="mt-6">
        {visible.length === 0 ? (
          <div className="px-5 text-center">
            <p className="text-5xl">🙈</p>
            <p className="mt-3 font-bold">Ты пропускал(а) все подряд!</p>
            <p className="mt-1 text-sm text-ink-500">
              Соберём свежую подборку — она будет другой.
            </p>
            <button
              type="button"
              onClick={onRestart}
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-brand-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600"
            >
              <RotateCcw className="size-4" /> Собрать заново
            </button>
          </div>
        ) : (
          <>
            <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-5 lg:grid-cols-3">
              <AnimatePresence mode="popLayout" initial={false}>
                {visible.map((dish, i) => (
                  <DishCard
                    key={dish.uid}
                    dish={dish}
                    index={i}
                    isFavorite={favoriteTitles.has(dish.title)}
                    onClick={() => setSelected(dish)}
                    onToggleFavorite={() => onToggleFavorite(dish)}
                    onDislike={() => onDislike(dish)}
                  />
                ))}
              </AnimatePresence>
            </div>
            <p className="text-center text-xs font-medium text-ink-400 sm:hidden">
              ← свайпни, чтобы увидеть остальные →
            </p>
          </>
        )}
      </section>

      {visible.length > 0 && (
        <div className="mt-6 flex flex-col items-center gap-4 px-5">
          <button
            type="button"
            onClick={onMore}
            disabled={loadingMore}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-brand-500/40 bg-brand-500/10 px-6 text-[15px] font-bold text-brand-700 transition-colors hover:bg-brand-500/15 disabled:opacity-70 sm:w-auto"
          >
            {loadingMore ? (
              <>
                <Loader className="size-4.5 animate-spin" />
                Готовим ещё…
              </>
            ) : (
              <>
                <Sparkles className="size-4.5" /> Ещё 10 блюд
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-cream-200 bg-white px-5 py-3 text-sm font-bold transition-colors hover:border-brand-300"
          >
            <RotateCcw className="size-4" /> Пройти квиз заново
          </button>
        </div>
      )}

      <AnimatePresence>
        {selected && <DishModal dish={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </motion.div>
  )
}
