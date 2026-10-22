import { useEffect, useState } from 'react'

/* ══════════════════════════════════════════════
   Фото блюд — цепочка источников:
   1. TheMealDB (https://www.themealdb.com) — бесплатно, без ключа,
      поиск по английскому search_query блюда.
   2. Unsplash — если задан VITE_UNSPLASH_ACCESS_TOKEN.
   3. Фолбэк: эмодзи + градиент — приложение работает офлайн.
   Результат кэшируется в памяти на время сессии.
   ══════════════════════════════════════════════ */

const token = import.meta.env.VITE_UNSPLASH_ACCESS_TOKEN as string | undefined

/** module-level кэш: "img:"+query -> url|null (null = фолбэк) */
const cache = new Map<string, string | null>()

/**
 * TheMealDB: search.php?s=... ищет по названиям блюд (англ.).
 * Если точный запрос не совпал — пробуем первые 2 слова, затем первое,
 * чтобы увеличить шанс найти подходящее фото.
 */
async function fetchMealDbImage(query: string): Promise<string | null> {
  const words = query.trim().split(/\s+/).filter(Boolean)
  const attempts = [...new Set([query.trim(), words.slice(0, 2).join(' '), words[0] ?? ''])].filter(
    Boolean,
  )
  for (const q of attempts) {
    try {
      const res = await fetch(
        'https://www.themealdb.com/api/json/v1/1/search.php?s=' + encodeURIComponent(q),
      )
      if (!res.ok) continue
      const data = await res.json()
      const thumb: string | undefined = data.meals?.[0]?.strMealThumb
      if (thumb) return thumb
    } catch {
      return null // сеть/CORS недоступны — дальше не пробуем
    }
  }
  return null
}

async function fetchUnsplashImage(query: string): Promise<string | null> {
  try {
    const url =
      'https://api.unsplash.com/search/photos?per_page=1&content_filter=high&orientation=landscape&query=' +
      encodeURIComponent(query)
    const res = await fetch(url, { headers: { Authorization: `Client-ID ${token}` } })
    if (!res.ok) throw new Error(String(res.status))
    const data = await res.json()
    return data.results?.[0]?.urls?.small ?? null
  } catch {
    return null
  }
}

/** Единая цепочка: TheMealDB → Unsplash (если токен) → null (эмодзи) */
async function resolveImage(query: string): Promise<string | null> {
  const key = `img:${query}`
  if (cache.has(key)) return cache.get(key)!
  let url = await fetchMealDbImage(query)
  if (!url && token) url = await fetchUnsplashImage(query)
  cache.set(key, url)
  return url
}

export interface DishImageResult {
  src: string | null
  loading: boolean
}

export function useDishImage(query: string): DishImageResult {
  const key = `img:${query}`
  const [src, setSrc] = useState<string | null>(() => cache.get(key) ?? null)
  const [loading, setLoading] = useState(() => !cache.has(key))

  useEffect(() => {
    let cancelled = false
    const cached = cache.get(key)
    if (cached !== undefined) {
      setSrc(cached)
      setLoading(false)
      return
    }
    setLoading(true)
    void resolveImage(query).then((url) => {
      if (!cancelled) {
        setSrc(url)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  return { src, loading }
}

/* ─── Фолбэк: эмодзи и градиент по названию/запросу ─── */

const EMOJI_MAP: [RegExp, string][] = [
  [/салат|salad|bowl|боул|зелень|avocado|авокадо/, '🥗'],
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
