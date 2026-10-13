import OptionCard from '../OptionCard'
import { FORMAT_OPTIONS } from '../../data/quizConfig'
import type { CookingFormat } from '../../types'

interface Props {
  value: CookingFormat | null
  onChange: (v: CookingFormat) => void
}

export default function FormatStep({ value, onChange }: Props) {
  return (
    <div className="grid gap-3">
      {FORMAT_OPTIONS.map((opt) => (
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
