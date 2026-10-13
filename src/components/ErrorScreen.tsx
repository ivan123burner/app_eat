import { motion } from 'motion/react'
import { RefreshCw, RotateCcw, TriangleAlert } from 'lucide-react'

interface Props {
  message: string
  canRetry: boolean
  onRetry: () => void
  onRestart: () => void
}

export default function ErrorScreen({ message, canRetry, onRetry, onRestart }: Props) {
  return (
    <motion.div
      className="flex min-h-dvh flex-col items-center justify-center px-8 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="grid size-24 place-items-center rounded-full bg-brand-500/10">
        <TriangleAlert className="size-10 text-brand-500" />
      </div>
      <h1 className="mt-6 text-xl font-extrabold">Не получилось собрать подборку</h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed break-words text-ink-500">{message}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {canRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-2xl bg-brand-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600"
          >
            <RefreshCw className="size-4" /> Попробовать ещё раз
          </button>
        )}
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-2xl border-2 border-cream-200 bg-white px-5 py-3 text-sm font-bold transition-colors hover:border-brand-300"
        >
          <RotateCcw className="size-4" /> Изменить ответы
        </button>
      </div>
    </motion.div>
  )
}
