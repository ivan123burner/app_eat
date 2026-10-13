import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Plus, Search, X } from 'lucide-react'
import {
  INGREDIENT_CATEGORIES,
  searchIngredients,
  type IngredientItem,
} from '../data/ingredientsDatabase'
import { cn } from '../lib/cn'

interface Props {
  /** Выбранный главный акцент (продукт/блюдо) или null */
  value: string | null
  onChange: (v: string | null) => void
}

/**
 * Поиск с автокомплитом по локальному справочнику (оффлайн, мгновенно).
 * Тап по подсказке → чип «Акцент» с возможностью сброса.
 * Свободный ввод + Enter → свой вариант. Без выбора квиз работает как раньше.
 */
export default function IngredientSearch({ value, onChange }: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const trimmed = query.trim()
  const suggestions = useMemo(
    () => (trimmed.length >= 1 ? searchIngredients(trimmed, 8) : []),
    [trimmed],
  )
  const hasExact = suggestions.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())
  const showDropdown = open && trimmed.length >= 1

  const select = (name: string) => {
    onChange(name)
    setQuery('')
    setOpen(false)
    inputRef.current?.blur()
  }

  const clearQuery = () => {
    setQuery('')
    inputRef.current?.focus()
  }

  const removeAccent = () => {
    onChange(null)
    setQuery('')
  }

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && trimmed) {
      e.preventDefault()
      // Enter = выбрать первый вариант или сохранить свободный ввод
      select(suggestions[0]?.name ?? trimmed)
    } else if (e.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div className="relative">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <label htmlFor="hero-ingredient" className="font-bold">
          Что хочется больше всего?
        </label>
        <span className="text-xs font-semibold text-ink-400">необязательно</span>
      </div>
      <p className="mb-3 text-sm text-ink-500">
        Продукт или блюдо — построю акцент подборки вокруг него.
      </p>

      <div
        className={cn(
          'flex items-center gap-2.5 rounded-2xl border-2 bg-white px-4 transition-colors',
          focused ? 'border-brand-400' : 'border-cream-200',
          value && 'border-herb-500',
        )}
      >
        <Search className={cn('size-4.5 shrink-0', value ? 'text-herb-500' : 'text-ink-400')} />
        <input
          id="hero-ingredient"
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => {
            setFocused(true)
            setOpen(true)
          }}
          onBlur={() => {
            setFocused(false)
            // небольшая задержка, чтобы успел сработать тап по подсказке
            window.setTimeout(() => setOpen(false), 120)
          }}
          onKeyDown={onInputKeyDown}
          placeholder="Начни вводить продукт или блюдо (например, курица, рис, авокадо)…"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          inputMode="search"
          enterKeyHint="search"
          aria-label="Поиск продукта или блюда"
          aria-expanded={showDropdown}
          aria-controls="ingredient-suggestions"
          className="min-w-0 flex-1 bg-transparent py-3.5 text-[15px] outline-none placeholder:text-ink-400"
        />
        {query && (
          <button
            type="button"
            onClick={clearQuery}
            aria-label="Очистить ввод"
            className="grid size-6 shrink-0 place-items-center rounded-full bg-cream-100 text-ink-500 transition-colors hover:bg-cream-200"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* Выпадающие подсказки */}
      <AnimatePresence>
        {showDropdown && (
          <motion.ul
            id="ingredient-suggestions"
            role="listbox"
            initial={{ opacity: 0, y: -8, scaleY: 0.96 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.96 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            style={{ transformOrigin: 'top' }}
            className="absolute inset-x-0 z-30 mt-2 max-h-64 overflow-y-auto overscroll-contain rounded-2xl border border-cream-200 bg-white shadow-xl shadow-ink-900/10"
          >
            {suggestions.map((s: IngredientItem) => (
              <li key={`${s.category}-${s.name}`}>
                <button
                  type="button"
                  // не даём полю потерять фокус (и «схлопнуть» список) до клика
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => select(s.name)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-cream-50 active:bg-cream-100"
                >
                  <span className="text-lg leading-none">{INGREDIENT_CATEGORIES[s.category].emoji}</span>
                  <span className="flex-1 truncate font-semibold">{s.name}</span>
                  <span className="shrink-0 text-xs text-ink-400">
                    {INGREDIENT_CATEGORIES[s.category].label}
                  </span>
                </button>
              </li>
            ))}

            {/* Свой вариант, если точного совпадения нет */}
            {!hasExact && (
              <li className="border-t border-cream-100">
                <button
                  type="button"
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => select(trimmed)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-brand-700 transition-colors hover:bg-brand-500/5 active:bg-brand-500/10"
                >
                  <Plus className="size-4.5 shrink-0" />
                  <span className="flex-1 truncate font-semibold">Добавить «{trimmed}» как свой вариант</span>
                </button>
              </li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>

      {/* Выбранный акцент — чип со сбросом */}
      <AnimatePresence>
        {value && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="mt-3 inline-flex max-w-full items-center gap-2 rounded-full border-2 border-herb-500 bg-herb-500/10 py-2 pr-2 pl-4 font-bold text-herb-600"
          >
            <Check className="size-4 shrink-0" />
            <span className="truncate">Акцент: {value}</span>
            <button
              type="button"
              onClick={removeAccent}
              aria-label="Убрать акцент"
              className="grid size-6 shrink-0 place-items-center rounded-full bg-herb-500/20 transition-colors hover:bg-herb-500/30"
            >
              <X className="size-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
