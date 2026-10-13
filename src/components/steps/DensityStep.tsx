import OptionCard from '../OptionCard'
import { DENSITY_OPTIONS } from '../../data/quizConfig'
import type { Density } from '../../types'

interface Props {
  value: Density | null
  onChange: (v: Density) => void
}

export default function DensityStep({ value, onChange }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {DENSITY_OPTIONS.map((opt) => (
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
