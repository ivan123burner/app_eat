import { ChevronRight } from 'lucide-react'
import OptionCard from '../OptionCard'
import { NUTRIENT_OPTIONS } from '../../data/quizConfig'
import { cn } from '../../lib/cn'
import type { Nutrient } from '../../types'

interface Props {
  value: Nutrient[]
  onToggle: (v: Nutrient) => void
  onNext: () => void
}

export default function NutrientsStep({ value, onToggle, onNext }: Props) {
  return (
    <div>
      <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-cream-100 px-3 py-1 text-xs font-semibold text-ink-500">
        <span>🎛</span> Можно выбрать несколько — «Баланс» отменяет доминанты
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {NUTRIENT_OPTIONS.map((opt, i) => (
          <div key={opt.value} className={i === NUTRIENT_OPTIONS.length - 1 ? 'sm:col-span-2' : undefined}>
            <OptionCard
              icon={opt.icon}
              emoji={opt.emoji}
              label={opt.label}
              hint={opt.hint}
              selected={value.includes(opt.value)}
              onClick={() => onToggle(opt.value)}
              emphasize={opt.value === 'balance'}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={value.length === 0}
        className={cn(
          'mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-[15px] font-bold transition-colors',
          value.length > 0
            ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600'
            : 'cursor-not-allowed bg-cream-200 text-ink-400',
        )}
      >
        Дальше
        <ChevronRight className="size-5" />
      </button>
    </div>
  )
}
