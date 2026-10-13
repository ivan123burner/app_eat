import { motion } from 'motion/react'
import { CheckCircle2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../lib/cn'

interface Props {
  icon: LucideIcon
  emoji: string
  label: string
  hint: string
  selected: boolean
  onClick: () => void
  /** Подсветка как «особого» варианта (например, «Баланс БЖУ») */
  emphasize?: boolean
}

export default function OptionCard({
  icon: Icon,
  emoji,
  label,
  hint,
  selected,
  onClick,
  emphasize,
}: Props) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'relative flex w-full items-start gap-3 rounded-2xl border-2 bg-white p-4 text-left transition-colors',
        selected
          ? 'border-brand-500'
          : emphasize
            ? 'border-brand-200 hover:border-brand-300'
            : 'border-cream-200 hover:border-brand-300',
      )}
    >
      {selected && (
        <span className="pointer-events-none absolute inset-0 rounded-2xl bg-brand-500/10" />
      )}
      <span className="relative grid size-11 shrink-0 place-items-center rounded-xl bg-cream-100 text-xl">
        <Icon className="size-5 text-brand-600" />
        <span className="absolute -right-1.5 -top-1.5 text-sm">{emoji}</span>
      </span>
      <span className="relative flex-1">
        <span className="block font-bold leading-tight">{label}</span>
        <span className="mt-0.5 block text-sm leading-snug text-ink-500">{hint}</span>
      </span>
      <CheckCircle2
        className={cn(
          'relative mt-0.5 size-5 shrink-0 transition-opacity',
          selected ? 'text-brand-500 opacity-100' : 'opacity-0',
        )}
      />
    </motion.button>
  )
}
