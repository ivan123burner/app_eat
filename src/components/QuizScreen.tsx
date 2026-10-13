import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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

export default function QuizScreen({ onStart }: Props) {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [answers, setAnswers] = useState<QuizAnswers>(EMPTY_ANSWERS)

  const patch = (p: Partial<QuizAnswers>) => setAnswers((prev) => ({ ...prev, ...p }))

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

  const canNext = useMemo(() => {
    switch (step) {
      case 0:
        return answers.density !== null
      case 1:
        return answers.nutrients.length > 0
      case 2:
        return true
      case 3:
        return answers.mealType !== null
      case 4:
        return answers.cookingFormat !== null
      default:
        return true
    }
  }, [step, answers])

  const go = (delta: number) => {
    const next = step + delta
    if (next < 0 || next > STEP_TITLES.length - 1) return
    setDir(delta)
    setStep(next)
  }

  const handleNext = () => {
    if (step === STEP_TITLES.length - 1) onStart(answers)
    else go(1)
  }

  const slideVariants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 64 : -64 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -64 : 64 }),
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return <DensityStep value={answers.density} onChange={(v) => patch({ density: v })} />
      case 1:
        return <NutrientsStep value={answers.nutrients} onToggle={toggleNutrient} />
      case 2:
        return (
          <VolumeStep
            value={answers.volume}
            onChange={(v) => patch({ volume: v })}
            heroIngredient={answers.heroIngredient}
            onHeroIngredientChange={(v) => patch({ heroIngredient: v })}
          />
        )
      case 3:
        return <MealTypeStep value={answers.mealType} onChange={(v) => patch({ mealType: v })} />
      case 4:
        return (
          <FormatStep value={answers.cookingFormat} onChange={(v) => patch({ cookingFormat: v })} />
        )
      case 5:
        return (
          <ExtrasStep
            text={answers.ingredientsText}
            diets={answers.diets}
            onTextChange={(v) => patch({ ingredientsText: v })}
            onToggleDiet={toggleDiet}
          />
        )
      default:
        return null
    }
  }

  const isLast = step === STEP_TITLES.length - 1

  return (
    <motion.div
      className="flex min-h-dvh flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25 }}
    >
      <header className="px-5 pt-safe pb-2">
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
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={step === 0}
            aria-label="Предыдущий шаг"
            className={cn(
              'grid size-12 shrink-0 place-items-center rounded-2xl border-2 transition-colors',
              step === 0
                ? 'border-cream-200 text-cream-200'
                : 'border-cream-200 bg-white text-ink-700 hover:border-brand-300',
            )}
          >
            <ChevronLeft className="size-5" />
          </button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            disabled={!canNext}
            className={cn(
              'flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl text-[15px] font-bold transition-colors',
              canNext
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600'
                : 'cursor-not-allowed bg-cream-200 text-ink-400',
            )}
          >
            {isLast ? '✨ Подобрать блюда' : 'Далее'}
            {!isLast && <ChevronRight className="size-5" />}
          </motion.button>
        </div>
      </footer>
    </motion.div>
  )
}
