import { motion } from 'motion/react'
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
  const stop = VOLUME_STOPS[value] ?? VOLUME_STOPS[2]

  return (
    <div>
      {/* Поиск с автокомплитом — над кнопками/слайдером выбора объёма */}
      <IngredientSearch value={heroIngredient} onChange={onHeroIngredientChange} />

      <div className="mt-5 rounded-3xl border border-cream-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="grid size-24 place-items-center overflow-hidden">
            {/* key пересоздаёт узел → анимация входа без «мигания» при тике слайдера */}
            <motion.span
              key={`emoji-${value}`}
              initial={{ scale: 0.6, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              className="text-6xl"
            >
              {stop.emoji}
            </motion.span>
          </div>
          <motion.p
            key={`label-${value}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="mt-2 font-bold"
          >
            {stop.label}
          </motion.p>
        </div>

        <input
          type="range"
          min={0}
          max={VOLUME_STOPS.length - 1}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label="Баланс объёма и калорийности"
          className="mt-6 w-full accent-brand-500"
        />

        <div className="mt-2 flex justify-between text-[11px] font-semibold text-ink-400">
          <span>🥗 больше объёма</span>
          <span>🥜 больше энергии</span>
        </div>
      </div>

      <p className="mt-4 rounded-2xl bg-cream-100 p-3 text-sm leading-relaxed text-ink-500">
        💡 Например, слева — <b className="text-ink-700">тарелка салата за 150 ккал</b>, справа —{' '}
        <b className="text-ink-700">горсть орехов за 500 ккал</b>. Где ты сегодня?
      </p>
    </div>
  )
}
