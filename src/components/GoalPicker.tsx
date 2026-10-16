import { motion } from 'motion/react'
import { X } from 'lucide-react'
import OptionCard from './OptionCard'
import { GOALS } from '../data/goals'

interface Props {
  mode: 'gate' | 'edit'
  initialGoalId?: string | null
  onSelect: (goalId: string) => void
  onSkip?: () => void
  onClose?: () => void
}

/**
 * Выбор цели: при первом входе (mode='gate') или из меню (mode='edit').
 * Тап по цели сразу сохраняет её и закрывает экран.
 */
export default function GoalPicker({ mode, initialGoalId, onSelect, onSkip, onClose }: Props) {
  const isEdit = mode === 'edit'

  return (
    <motion.div
      className="fixed inset-0 z-60 overflow-y-auto bg-cream-50 px-5 pt-safe pb-10"
      initial={{ opacity: 0, y: isEdit ? 24 : 0, scale: isEdit ? 0.98 : 1 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <div className="mx-auto max-w-lg">
        <div className="flex items-start justify-between">
          <span className="text-4xl">{isEdit ? '🎯' : '🍳'}</span>
          {isEdit && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть"
              className="grid size-10 place-items-center rounded-xl border-2 border-cream-200 bg-white transition-colors hover:border-brand-300"
            >
              <X className="size-5" />
            </button>
          )}
        </div>

        <h1 className="mt-4 text-[26px] leading-tight font-extrabold">
          {isEdit ? 'Изменить цель' : 'Привет! Какая у тебя цель?'}
        </h1>
        <p className="mt-2 text-[15px] text-ink-500">
          {isEdit
            ? 'Новая цель будет учитываться в следующих подборках.'
            : 'От неё зависят калорийность, БЖУ и характер блюд в подборках. Позже можно поменять в меню.'}
        </p>

        <div className="mt-6 grid gap-3">
          {GOALS.map((goal) => (
            <OptionCard
              key={goal.id}
              icon={goal.icon}
              emoji={goal.emoji}
              label={goal.label}
              hint={goal.hint}
              selected={initialGoalId === goal.id}
              onClick={() => onSelect(goal.id)}
            />
          ))}
        </div>

        {!isEdit && onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="mt-6 w-full text-center text-sm font-semibold text-ink-400 underline underline-offset-4"
          >
            Определюсь позже
          </button>
        )}
      </div>
    </motion.div>
  )
}
