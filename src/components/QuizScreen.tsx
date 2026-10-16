import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, Menu } from 'lucide-react'
import Stepper from './Stepper'
import DensityStep from './steps/DensityStep'
import NutrientsStep from './steps/NutrientsStep'
import VolumeStep from './steps/VolumeStep'
import MealTypeStep from './steps/MealTypeStep'
import FormatStep from './steps/FormatStep'
import ExtrasStep from './steps/ExtrasStep'
import { cn } from '../lib/cn'
import { EMPTY_ANSWERS, type Nutrient, type QuizAnswers } from '../types'

interface Props {
  onStart: (answers: QuizAnswers) => void
  onOpenMenu: () => void
}

const STEP_TITLES = [
  'Насколько плотно хочется поесть?',
  'На что делаем упор в тарелке?',
  'Объём против калорийности',
  'Какой это приём пищи?',
  'Кто сегодня у плиты?',
  'Есть ли нюансы?',
]

const STEP_SUBTITLES = [
  'От этого зависит размер порции и «вес» блюда.',
  'Можно выбрать несколько доминант — или честный баланс.',
  'Фирменная настройка квиза: жадничаем объёмом или энергией?',
  'Подстроим рецепты, порции и время готовки.',
  'Быстро сам, долго сам — или вообще без плиты?',
  'Продукты из холодильника и диеты. Шаг можно пропустить.',
]

export default function QuizScreen({ onStart, onOpenMenu }: Props) {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [answers, setAnswers] = useState<QuizAnswers>(EMPTY_ANSWERS)
  const advanceTimer = useRef<number | null>(null)

  // Не даём «залипнуть» таймеру авто-перехода при быстрых тапах и размонтировании
  useEffect(
    () => () => {
      if (advanceTimer.current !== null) window.clearTimeout(advanceTimer.current)
    },
    [],
  )

  const patch = (p: Partial<QuizAnswers>) => setAnswers((prev) => ({ ...prev, ...p }))

  const go = (delta: number) => {
    if (advanceTimer.current !== null) {
      window.clearTimeout(advanceTimer.current)
      advanceTimer.current = null
    }
    const next = step + delta
    if (next < 0 || next > STEP_TITLES.length - 1) return
    setDir(delta)
    setStep(next)
  }

  /** Выбор «один вариант»: показываем подсветку, затем уходим дальше */
  const autoPick = (p: Partial<QuizAnswers>) => {
    patch(p)
    if (advanceTimer.current === null) {
      advanceTimer.current = window.setTimeout(() => {
        advanceTimer.current = null
        go(1)
      }, 280)
    }
  }

  const toggleNutrient = (n: Nutrient) =>
    setAnswers((prev) => {
      if (n === 'balance') {
        return { ...prev, nutrients: prev.nutrients.includes('balance') ? [] : ['balance'] }
      }
      const rest = prev.nutrients.filter((x) => x !== 'balance')
      return {
        ...prev,
        nutrients: rest.includes(n) ? rest.filter((x) => x !== n) : [...rest, n],
      }
    })

  const toggleDiet = (d: (typeof answers.diets)[number]) =>
    setAnswers((prev) => ({
      ...prev,
      diets: prev.diets.includes(d) ? prev.diets.filter((x) => x !== d) : [...prev.diets, d],
    }))

  const slideVariants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 64 : -64 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -64 : 64 }),
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return <DensityStep value={answers.density} onChange={(v) => autoPick({ density: v })} />
      case 1:
        return (
          <NutrientsStep
            value={answers.nutrients}
            onToggle={toggleNutrient}
            onNext={() => go(1)}
          />
        )
      case 2:
        return (
          <VolumeStep
            value={answers.volume}
            onChange={(v) => autoPick({ volume: v })}
            heroIngredient={answers.heroIngredient}
            onHeroIngredientChange={(v) => patch({ heroIngredient: v })}
          />
        )
      case 3:
        return <MealTypeStep value={answers.mealType} onChange={(v) => autoPick({ mealType: v })} />
      case 4:
        return (
          <FormatStep
            value={answers.cookingFormat}
            onChange={(v) => autoPick({ cookingFormat: v })}
          />
        )
      case 5:
        return (
          <ExtrasStep
            text={answers.ingredientsText}
            diets={answers.diets}
            onTextChange={(v) => patch({ ingredientsText: v })}
            onToggleDiet={toggleDiet}
            onNext={() => onStart(answers)}
          />
        )
      default:
        return null
    }
  }

  return (
    <motion.div
      className="flex min-h-dvh flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25 }}
    >
      <header className="px-5 pt-safe pb-2">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Открыть меню"
            className="grid size-10 place-items-center rounded-xl border-2 border-cream-200 bg-white transition-colors hover:border-brand-300"
          >
            <Menu className="size-5" />
          </button>
          <span className="text-sm font-extrabold text-ink-400">🍳 Что поесть?</span>
        </div>
        <Stepper current={step} total={STEP_TITLES.length} />
      </header>

      <main className="flex-1 overflow-y-auto px-5 py-4">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-[26px] leading-tight font-extrabold">{STEP_TITLES[step]}</h1>
            <p className="mt-1.5 text-[15px] text-ink-500">{STEP_SUBTITLES[step]}</p>
            <div className="mt-6">{renderStep()}</div>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="sticky bottom-0 border-t border-cream-200 bg-cream-50/90 px-5 py-3 pb-safe backdrop-blur-md">
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={step === 0}
            className={cn(
              'inline-flex h-12 items-center gap-1.5 rounded-2xl border-2 px-6 text-[15px] font-bold transition-colors',
              step === 0
                ? 'border-cream-200 text-cream-200'
                : 'border-cream-200 bg-white text-ink-700 hover:border-brand-300',
            )}
          >
            <ChevronLeft className="size-5" /> На шаг назад
          </button>
        </div>
      </footer>
    </motion.div>
  )
}
