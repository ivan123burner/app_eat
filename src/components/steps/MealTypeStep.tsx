import OptionCard from '../OptionCard'
import { MEAL_TYPE_OPTIONS } from '../../data/quizConfig'
import type { MealType } from '../../types'

interface Props {
  value: MealType | null
  onChange: (v: MealType) => void
}

export default function MealTypeStep({ value, onChange }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {MEAL_TYPE_OPTIONS.map((opt) => (
        <OptionCard
          key={opt.value}
          icon={opt.icon}
          emoji={opt.emoji}
          label={opt.label}
          hint={opt.hint}
          selected={value === opt.value}
          onClick={() => onChange(opt.value)}
        />
      ))}
    </div>
  )
}
