import OptionCard from '../OptionCard'
import IngredientSearch from '../IngredientSearch'
import { VOLUME_STOPS } from '../../data/quizConfig'

interface Props {
  value: number
  onChange: (v: number) => void
  heroIngredient: string | null
  onHeroIngredientChange: (v: string | null) => void
}

export default function VolumeStep({
  value,
  onChange,
  heroIngredient,
  onHeroIngredientChange,
}: Props) {
  return (
    <div>
      {/* Поиск с автокомплитом — над выбором объёма */}
      <IngredientSearch value={heroIngredient} onChange={onHeroIngredientChange} />

      <p className="mt-5 mb-3 text-sm font-semibold text-ink-500">
        А теперь баланс объёма и калорийности:
      </p>
      <div className="grid gap-3">
        {VOLUME_STOPS.map((stop, i) => (
          <OptionCard
            key={i}
            icon={stop.icon}
            emoji={stop.emoji}
            label={stop.label}
            hint={stop.hint}
            selected={value === i}
            onClick={() => onChange(i)}
          />
        ))}
      </div>
    </div>
  )
}
