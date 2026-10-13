import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, RotateCcw, Sparkles } from 'lucide-react'
import DishCard from './DishCard'
import DishModal from './DishModal'
import {
  DENSITY_LABEL,
  DIET_LABEL,
  FORMAT_LABEL,
  MEAL_TYPE_LABEL,
  VOLUME_STOPS,
} from '../data/quizConfig'
import type { Dish, QuizAnswers } from '../types'

interface Props {
  dishes: Dish[]
  answers: QuizAnswers
  onRestart: () => void
}

export default function Results({ dishes, answers, onRestart }: Props) {
  const [selected, setSelected] = useState<Dish | null>(null)

  const chips: string[] = []
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
            onClick={onRestart}
            className="inline-flex items-center gap-1 rounded-full border-2 border-cream-200 bg-white px-3 py-1.5 text-sm font-bold transition-colors hover:border-brand-300"
          >
            <ChevronLeft className="size-4" /> Заново
          </button>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-600">
            <Sparkles className="size-3.5" /> подбор ИИ
          </span>
        </div>

        <h1 className="mt-4 text-[26px] leading-tight font-extrabold">Твоя подборка 🍽️</h1>
        <p className="mt-1 text-[15px] text-ink-500">
          {dishes.length} блюд подобраны под твои ответы:
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
        <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-5 lg:grid-cols-3">
          {dishes.map((dish, i) => (
            <DishCard
              key={`${dish.title}-${i}`}
              dish={dish}
              index={i}
              onClick={() => setSelected(dish)}
            />
          ))}
        </div>
        <p className="text-center text-xs font-medium text-ink-400 sm:hidden">
          ← свайпни, чтобы увидеть остальные →
        </p>
      </section>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-2xl border-2 border-cream-200 bg-white px-5 py-3 text-sm font-bold transition-colors hover:border-brand-300"
        >
          <RotateCcw className="size-4" /> Пройти квиз заново
        </button>
      </div>

      <AnimatePresence>
        {selected && <DishModal dish={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </motion.div>
  )
}
