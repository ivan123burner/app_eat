import { motion } from 'motion/react'
import { DIET_OPTIONS } from '../../data/quizConfig'
import { cn } from '../../lib/cn'
import type { DietFlag } from '../../types'

interface Props {
  text: string
  diets: DietFlag[]
  onTextChange: (v: string) => void
  onToggleDiet: (v: DietFlag) => void
}

export default function ExtrasStep({ text, diets, onTextChange, onToggleDiet }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="fridge"
          className="flex items-baseline justify-between font-bold"
        >
          <span>🧊 Что есть в холодильнике?</span>
          <span className="text-xs font-semibold text-ink-400">необязательно</span>
        </label>
        <p className="mt-1 text-sm text-ink-500">
          Напиши продукты через запятую — постараюсь собрать блюда именно из них.
        </p>
        <textarea
          id="fridge"
          rows={3}
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="курица, рис, помидоры, немного шпината…"
          className="mt-3 w-full resize-none rounded-2xl border-2 border-cream-200 bg-white p-4 text-[15px] outline-none transition-colors placeholder:text-ink-400 focus:border-brand-400"
        />
      </div>

      <div>
        <p className="font-bold">
          🚫 <span className="align-middle">Диеты и аллергии</span>
        </p>
        <p className="mt-1 text-sm text-ink-500">Отмечай всё, что подходит — блюда будут без этого.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {DIET_OPTIONS.map((opt) => {
            const selected = diets.includes(opt.value)
            return (
              <motion.button
                key={opt.value}
                type="button"
                whileTap={{ scale: 0.94 }}
                onClick={() => onToggleDiet(opt.value)}
                aria-pressed={selected}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border-2 px-3.5 py-2 text-sm font-semibold transition-colors',
                  selected
                    ? 'border-herb-500 bg-herb-500/10 text-herb-600'
                    : 'border-cream-200 bg-white text-ink-700 hover:border-herb-500/50',
                )}
              >
                <span>{opt.emoji}</span>
                {opt.label}
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
