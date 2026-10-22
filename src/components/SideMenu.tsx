import { AnimatePresence, motion } from 'motion/react'
import { Heart, Leaf, X } from 'lucide-react'
import { fallbackEmoji } from '../services/images'
import type { Dish } from '../types'

interface Props {
  open: boolean
  onClose: () => void
  goalLabel: string | null
  goalEmoji: string | null
  onChangeGoal: () => void
  country: string
  onCountryChange: (v: string) => void
  favorites: Dish[]
  favoriteIngredients: string[]
  onOpenDish: (dish: Dish) => void
  onRemoveIngredient: (name: string) => void
}

/**
 * Бургер-меню слева: цель, избранные блюда (❤️), любимые ингредиенты.
 * Всё хранится в localStorage и переживает перезагрузку.
 */
export default function SideMenu({
  open,
  onClose,
  goalLabel,
  goalEmoji,
  onChangeGoal,
  country,
  onCountryChange,
  favorites,
  favoriteIngredients,
  onOpenDish,
  onRemoveIngredient,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-label="Меню"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="absolute inset-y-0 left-0 flex w-80 max-w-[85%] flex-col rounded-r-3xl bg-cream-50 shadow-2xl"
          >
            {/* Шапка */}
            <div className="flex items-center justify-between px-5 pt-safe pb-3">
              <h2 className="text-lg font-extrabold">Меню</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Закрыть меню"
                className="grid size-9 place-items-center rounded-xl border-2 border-cream-200 bg-white transition-colors hover:border-brand-300"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-8">
              {/* Цель и страна */}
              <section className="rounded-2xl border border-cream-200 bg-white p-4">
                <p className="text-xs font-bold tracking-wide text-ink-400 uppercase">Моя цель</p>
                <p className="mt-2 font-extrabold">
                  {goalEmoji} {goalLabel ?? 'не выбрана'}
                </p>

                <label className="mt-3 block">
                  <span className="text-xs font-bold tracking-wide text-ink-400 uppercase">
                    Моя страна
                  </span>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => onCountryChange(e.target.value)}
                    placeholder="Например: Россия"
                    maxLength={60}
                    className="mt-1.5 w-full rounded-xl border-2 border-cream-200 bg-cream-50 px-3 py-2 text-sm font-semibold outline-none transition-colors focus:border-brand-400"
                  />
                  <span className="mt-1 block text-xs text-ink-400">
                    Подберём блюда из продуктов, доступных в твоей стране
                  </span>
                </label>

                <button
                  type="button"
                  onClick={onChangeGoal}
                  className="mt-3 w-full rounded-xl bg-cream-100 py-2 text-sm font-bold text-ink-700 transition-colors hover:bg-cream-200"
                >
                  Изменить цель
                </button>
              </section>

              {/* Избранные блюда */}
              <section className="mt-5">
                <h3 className="flex items-center gap-2 font-extrabold">
                  <Heart className="size-4.5 fill-red-500 text-red-500" />
                  Избранные блюда
                  <span className="text-sm font-semibold text-ink-400">({favorites.length})</span>
                </h3>
                {favorites.length === 0 ? (
                  <p className="mt-2 rounded-2xl bg-white p-3 text-sm text-ink-500">
                    Пока пусто — жми ❤️ на карточках блюд в подборке.
                  </p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {favorites.map((dish) => (
                      <li key={dish.title}>
                        <button
                          type="button"
                          onClick={() => onOpenDish(dish)}
                          className="flex w-full items-center gap-3 rounded-2xl border border-cream-200 bg-white p-3 text-left transition-colors hover:border-brand-300"
                        >
                          <span className="text-2xl">
                            {fallbackEmoji(dish.title, dish.search_query)}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-bold">{dish.title}</span>
                            <span className="text-xs text-ink-500">{dish.bzhu.calories} ккал</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Любимые ингредиенты */}
              <section className="mt-5">
                <h3 className="flex items-center gap-2 font-extrabold">
                  <Leaf className="size-4.5 text-herb-500" />
                  Любимые ингредиенты
                </h3>
                {favoriteIngredients.length === 0 ? (
                  <p className="mt-2 rounded-2xl bg-white p-3 text-sm text-ink-500">
                    Никогда не выбирал акцент в поиске — как выберешь, он появится здесь.
                  </p>
                ) : (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {favoriteIngredients.map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => onRemoveIngredient(name)}
                        title="Убрать из любимых"
                        className="inline-flex items-center gap-1.5 rounded-full border-2 border-herb-500/40 bg-herb-500/10 px-3 py-1.5 text-sm font-semibold text-herb-600 transition-colors hover:border-herb-500"
                      >
                        {name}
                        <X className="size-3.5" />
                      </button>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
