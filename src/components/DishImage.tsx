import { useState } from 'react'
import { fallbackEmoji, fallbackGradient, useDishImage } from '../services/images'
import { cn } from '../lib/cn'

interface Props {
  title: string
  query: string
  className?: string
}

/** Фото блюда из Unsplash (если задан токен) или эмодзи-градиент-фолбэк */
export default function DishImage({ title, query, className }: Props) {
  const { src } = useDishImage(query)
  const [errored, setErrored] = useState(false)
  const showPhoto = Boolean(src) && !errored

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {showPhoto ? (
        <img
          src={src!}
          alt={title}
          loading="lazy"
          onError={() => setErrored(true)}
          className="size-full object-cover"
        />
      ) : (
        <div
          className={cn(
            'grid size-full place-items-center bg-gradient-to-br',
            fallbackGradient(title + query),
          )}
        >
          <span className="text-6xl drop-shadow-md">{fallbackEmoji(title, query)}</span>
        </div>
      )}
      {/* мягкая тень-градиент снизу для читаемости бейджей */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent" />
    </div>
  )
}
