import { useEffect, useState } from 'react'

/* ══════════════════════════════════════════════
   Фото блюд.
   - Если задан VITE_UNSPLASH_ACCESS_TOKEN — запрашиваем фото
     по search_query через Unsplash API (кэшируем в памяти).
   - Иначе (или при ошибке) — эмодзи + градиент-плейсхолдер:
     приложение полностью работает офлайн.
   ══════════════════════════════════════════════ */

const token = import.meta.env.VITE_UNSPLASH_ACCESS_TOKEN as string | undefined

/** module-level кэш: query -> url|null (null = фолбэк) */
const cache = new Map<string, string | null>()

async function fetchUnsplashImage(query: string): Promise<string | null> {
  if (cache.has(query)) return cache.get(query)!
  try {
    const url =
      'https://api.unsplash.com/search/photos?per_page=1&content_filter=high&orientation=landscape&query=' +
      encodeURIComponent(query)
    const res = await fetch(url, { headers: { Authorization: `Client-ID ${token}` } })
    if (!res.ok) throw new Error(String(res.status))
    const data = await res.json()
    const photoUrl: string | undefined = data.results?.[0]?.urls?.small
    cache.set(query, photoUrl ?? null)
    return photoUrl ?? null
  } catch {
    cache.set(query, null)
    return null
  }
}

export interface DishImageResult {
  src: string | null
  loading: boolean
}

export function useDishImage(query: string): DishImageResult {
  const [src, setSrc] = useState<string | null>(() => cache.get(query) ?? null)
  const [loading, setLoading] = useState(!token || !cache.has(query))

  useEffect(() => {
    let cancelled = false
    if (!token) {
      setLoading(false)
      return
    }
    const cached = cache.get(query)
    if (cached !== undefined) {
      setLoading(false)
      return
    }
    setLoading(true)
    void fetchUnsplashImage(query).then((url) => {
      if (!cancelled) {
        setSrc(url)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [query])

  return { src, loading }
}

/* ─── Фолбэк: эмодзи и градиент по названию/запросу ─── */

const EMOJI_MAP: [RegExp, string][] = [
  [/салат|salad|бowl|боул|зелень|avocado|авокадо/, '🥗'],
  [/суп|soup|том-ям|tom ?yum|лапша|noodle|рамен|ramen/, '🍲'],
  [/паст|pasta|макарон|спагетти|carbonara|карбонар/, '🍝'],
  [/стейк|steak|мяс|beef|говядин|бургер|burger/, '🥩'],
  [/куриц|chicken|курин|пилл|филе/, '🍗'],
  [/рыб|лосос|salmon|fish|кревет|shrimp|тунец|seafood/, '🐟'],
  [/яйц|egg|яичн|омлет|omlet|сырник|pancake|блин/, '🥚'],
  [/творог|сырник|cheese|сыр|parmesan|фета|feta|йогурт|yogurt/, '🧀'],
  [/десерт|dessert|зефир|маршмеллоу|marshmallow|конфет|cake|торт|пирож|выпеч/, '🍰'],
  [/печень|cookie|батончик|bar|шарик|ball|energy|энергет|конфет/, '🍪'],
  [/шоколад|chocolate|какао|cocoa|десерт/, '🍫'],
  [/орех|nut|фисташ|pistachio|миндал|almond|бадам/, '🥜'],
  [/кофе|coffee|латте|латт|капучино|cappuccino/, '☕'],
  [/смузи|smoothie|фрукт|fruit|ягод|berry|яблоко|banana|банан/, '🥤'],
  [/рис|rice|каша|овсян|oatmeal|grain|киноа|quinoa/, '🍚'],
  [/пицц|pizza|тaco|буррит|wrap|шаурм|shawarma/, '🌯'],
  [/картоф|potato|фри|fries|жарен/, '🍟'],
  [/овощ|vegetable|томат|помидор|огурец|перец/, '🍅'],
]

const GRADIENTS = [
  'from-orange-300 via-rose-300 to-amber-200',
  'from-lime-300 via-emerald-300 to-teal-200',
  'from-amber-300 via-orange-400 to-rose-300',
  'from-sky-300 via-indigo-300 to-violet-300',
  'from-fuchsia-300 via-pink-300 to-rose-300',
  'from-yellow-200 via-lime-300 to-green-300',
]

function hashCode(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function fallbackEmoji(title: string, query: string): string {
  const haystack = (title + ' ' + query).toLowerCase()
  for (const [re, emoji] of EMOJI_MAP) if (re.test(haystack)) return emoji
  return '🍽️'
}

export function fallbackGradient(seed: string): string {
  return GRADIENTS[hashCode(seed) % GRADIENTS.length]
}

/** Ссылка на поиск фото вручную (открывается из карточки) */
export function unsplashSearchUrl(query: string): string {
  return `https://unsplash.com/s/photos/${encodeURIComponent(query)}`
}
