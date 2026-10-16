import { useCallback, useRef, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import QuizScreen from './components/QuizScreen'
import LoadingScreen from './components/LoadingScreen'
import Results from './components/Results'
import ErrorScreen from './components/ErrorScreen'
import GoalPicker from './components/GoalPicker'
import SideMenu from './components/SideMenu'
import DishModal from './components/DishModal'
import { generateDishes } from './services/ai'
import { findGoal } from './data/goals'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { Dish, DishWithMeta, QuizAnswers } from './types'

type Screen =
  | { name: 'quiz' }
  | { name: 'loading' }
  | { name: 'results'; answers: QuizAnswers }
  | { name: 'error'; message: string; answers: QuizAnswers | null }

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'quiz' })
  const [dishes, setDishes] = useState<DishWithMeta[]>([])
  const [loadingMore, setLoadingMore] = useState(false)

  /** Счётчик uid — каждая карточка получает стабильный ключ навсегда */
  const uidSeq = useRef(0)
  const tagDishes = (list: Dish[]): DishWithMeta[] =>
    list.map((d) => ({ ...d, uid: `d${++uidSeq.current}` }))

  /* Персистентное состояние (localStorage) */
  const [goalId, setGoalId] = useLocalStorage<string | null>('chto-poeat:goal', null)
  const [favorites, setFavorites] = useLocalStorage<Dish[]>('chto-poeat:favorites', [])
  const [dislikedTitles, setDislikedTitles] = useLocalStorage<string[]>(
    'chto-poeat:disliked',
    [],
  )
  const [favoriteIngredients, setFavoriteIngredients] = useLocalStorage<string[]>(
    'chto-poeat:favorite-ingredients',
    [],
  )

  /* UI-состояние */
  const [menuOpen, setMenuOpen] = useState(false)
  const [goalPickerOpen, setGoalPickerOpen] = useState(false)
  const [menuDish, setMenuDish] = useState<Dish | null>(null)

  const goal = findGoal(goalId)

  /* ─── Генерация подборки ─── */

  const startGeneration = useCallback(
    async (answers: QuizAnswers) => {
      // Любимый акцент из поиска запоминаем в меню
      const hero = answers.heroIngredient?.trim()
      if (hero) {
        setFavoriteIngredients((prev) => (prev.includes(hero) ? prev : [...prev, hero]))
      }

      setScreen({ name: 'loading' })
      try {
        const fresh = await generateDishes(answers, {
          goalPromptText: goal?.promptText,
          goalLabel: goal?.label,
        })
        setDishes(tagDishes(fresh))
        setScreen({ name: 'results', answers })
      } catch (e) {
        setScreen({
          name: 'error',
          message: e instanceof Error ? e.message : 'Неизвестная ошибка',
          answers,
        })
      }
    },
    [goal, setFavoriteIngredients],
  )

  const handleMore = useCallback(async () => {
    if (screen.name !== 'results' || loadingMore) return
    setLoadingMore(true)
    try {
      const more = await generateDishes(screen.answers, {
        goalPromptText: goal?.promptText,
        goalLabel: goal?.label,
        excludeTitles: dishes.map((d) => d.title),
      })
      setDishes((prev) => [...prev, ...tagDishes(more)])
    } catch {
      /* тихо: пользователь может нажать ещё раз */
    } finally {
      setLoadingMore(false)
    }
  }, [screen, loadingMore, dishes, goal])

  const restart = useCallback(() => {
    setDishes([])
    setScreen({ name: 'quiz' })
  }, [])

  /* ─── Избранное / дизлайки ─── */

  const toggleFavorite = useCallback(
    (dish: Dish) => {
      setFavorites((prev) =>
        prev.some((f) => f.title === dish.title)
          ? prev.filter((f) => f.title !== dish.title)
          : [...prev, dish],
      )
    },
    [setFavorites],
  )

  const dislike = useCallback(
    (dish: Dish) => {
      setDislikedTitles((prev) =>
        prev.includes(dish.title) ? prev : [...prev, dish.title],
      )
    },
    [setDislikedTitles],
  )

  /* ─── Цель ─── */

  const selectGoal = useCallback(
    (id: string) => {
      setGoalId(id)
      setGoalPickerOpen(false)
    },
    [setGoalId],
  )

  /* ─── Рендер ─── */

  return (
    <div className="mx-auto max-w-3xl">
      {/* Гейт: цель при первом входе */}
      {!goalId && (
        <GoalPicker mode="gate" onSelect={selectGoal} onSkip={() => setGoalId('')} />
      )}

      <AnimatePresence mode="wait">
        {screen.name === 'quiz' && (
          <QuizScreen key="quiz" onStart={startGeneration} onOpenMenu={() => setMenuOpen(true)} />
        )}
        {screen.name === 'loading' && <LoadingScreen key="loading" />}
        {screen.name === 'results' && (
          <Results
            key="results"
            dishes={dishes}
            answers={screen.answers}
            goalLabel={goal?.label ?? null}
            goalEmoji={goal?.emoji ?? null}
            favorites={favorites}
            dislikedTitles={dislikedTitles}
            loadingMore={loadingMore}
            onRestart={restart}
            onMore={handleMore}
            onOpenMenu={() => setMenuOpen(true)}
            onToggleFavorite={toggleFavorite}
            onDislike={dislike}
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

      {/* Бургер-меню */}
      <SideMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        goalLabel={goal?.label ?? null}
        goalEmoji={goal?.emoji ?? null}
        onChangeGoal={() => {
          setMenuOpen(false)
          setGoalPickerOpen(true)
        }}
        favorites={favorites}
        favoriteIngredients={favoriteIngredients}
        onOpenDish={(dish) => {
          setMenuOpen(false)
          setMenuDish(dish)
        }}
        onRemoveIngredient={(name) =>
          setFavoriteIngredients((prev) => prev.filter((x) => x !== name))
        }
      />

      {/* Модалка блюда, открытая из меню */}
      <AnimatePresence>
        {menuDish && <DishModal dish={menuDish} onClose={() => setMenuDish(null)} />}
      </AnimatePresence>

      {/* Редактирование цели из меню */}
      <AnimatePresence>
        {goalPickerOpen && (
          <GoalPicker
            mode="edit"
            initialGoalId={goalId}
            onSelect={selectGoal}
            onClose={() => setGoalPickerOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
