import { useCallback, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import QuizScreen from './components/QuizScreen'
import LoadingScreen from './components/LoadingScreen'
import Results from './components/Results'
import ErrorScreen from './components/ErrorScreen'
import { generateDishes } from './services/ai'
import type { Dish, QuizAnswers } from './types'

type Screen =
  | { name: 'quiz' }
  | { name: 'loading' }
  | { name: 'results'; dishes: Dish[]; answers: QuizAnswers }
  | { name: 'error'; message: string; answers: QuizAnswers | null }

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'quiz' })

  const startGeneration = useCallback(async (answers: QuizAnswers) => {
    setScreen({ name: 'loading' })
    try {
      const dishes = await generateDishes(answers)
      setScreen({ name: 'results', dishes, answers })
    } catch (e) {
      setScreen({
        name: 'error',
        message: e instanceof Error ? e.message : 'Неизвестная ошибка',
        answers,
      })
    }
  }, [])

  const restart = useCallback(() => setScreen({ name: 'quiz' }), [])

  return (
    <div className="mx-auto max-w-3xl">
      <AnimatePresence mode="wait">
        {screen.name === 'quiz' && <QuizScreen key="quiz" onStart={startGeneration} />}
        {screen.name === 'loading' && <LoadingScreen key="loading" />}
        {screen.name === 'results' && (
          <Results
            key="results"
            dishes={screen.dishes}
            answers={screen.answers}
            onRestart={restart}
          />
        )}
        {screen.name === 'error' && (
          <ErrorScreen
            key="error"
            message={screen.message}
            canRetry={screen.answers !== null}
            onRetry={() => screen.answers && startGeneration(screen.answers)}
            onRestart={restart}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
