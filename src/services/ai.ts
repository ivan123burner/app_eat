import { buildPrompt } from '../lib/prompt'
import { MOCK_DISHES } from '../data/mockDishes'
import { dishListSchema, type Dish, type QuizAnswers } from '../types'

/* ══════════════════════════════════════════════
   Сервис генерации подборки.
   Провайдер выбирается в .env: VITE_AI_PROVIDER
     mock     — встроенная демо-подборка (по умолчанию, без сети)
     openai   — OpenAI Chat Completions (нужен VITE_OPENAI_API_KEY)
     anthropic— Anthropic Messages (нужен VITE_ANTHROPIC_API_KEY)
     proxy    — свой backend: POST VITE_PROXY_URL
   ══════════════════════════════════════════════ */

type Provider = 'mock' | 'openai' | 'anthropic' | 'proxy'

const provider = (import.meta.env.VITE_AI_PROVIDER ?? 'mock') as Provider
const proxyUrl = import.meta.env.VITE_PROXY_URL ?? '/api/generate'

export class MissingKeyError extends Error {
  constructor(providerName: string) {
    super(
      `Не задан API-ключ для провайдера «${providerName}». ` +
        `Заполните .env (см. .env.example) или переключите VITE_AI_PROVIDER на "mock".`,
    )
    this.name = 'MissingKeyError'
  }
}

export async function generateDishes(answers: QuizAnswers): Promise<Dish[]> {
  switch (provider) {
    case 'mock': {
      // Имитация задержки LLM, чтобы показать анимацию загрузки
      await new Promise((r) => setTimeout(r, 1800))
      return shuffle([...MOCK_DISHES]).slice(0, 10)
    }
    case 'openai': {
      const { system, user } = buildPrompt(answers)
      const content = await callOpenAI(system, user)
      return parseDishesContent(content)
    }
    case 'anthropic': {
      const { system, user } = buildPrompt(answers)
      const content = await callAnthropic(system, user)
      return parseDishesContent(content)
    }
    case 'proxy': {
      const { system, user } = buildPrompt(answers)
      const res = await fetch(proxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, system, user }),
      })
      if (!res.ok) throw new Error(`Прокси ответил ${res.status}: ${await res.text()}`)
      const data: unknown = await res.json()
      // Прокси может вернуть и { dishes }, и { content: "..." } со строкой JSON
      if (data && typeof data === 'object' && 'dishes' in data) return validateDishes(data)
      if (data && typeof data === 'object' && 'content' in data && typeof data.content === 'string') {
        return parseDishesContent(data.content)
      }
      throw new Error('Неожиданный формат ответа от прокси')
    }
    default:
      throw new Error(`Неизвестный провайдер: ${provider}`)
  }
}

/* ─── HTTP-клиенты LLM ─────────────────────────── */

async function callOpenAI(system: string, user: string): Promise<string> {
  const key = import.meta.env.VITE_OPENAI_API_KEY
  if (!key) throw new MissingKeyError('OpenAI')

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: import.meta.env.VITE_OPENAI_MODEL ?? 'gpt-4o-mini',
      temperature: 0.85,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })
  if (!res.ok) throw new Error(`OpenAI API ${res.status}: ${await res.text()}`)
  const data = await res.json()
  return data.choices?.[0]?.message?.content as string
}

async function callAnthropic(system: string, user: string): Promise<string> {
  const key = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!key) throw new MissingKeyError('Anthropic')

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: import.meta.env.VITE_ANTHROPIC_MODEL ?? 'claude-sonnet-4-5',
      max_tokens: 8000,
      temperature: 0.85,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  })
  if (!res.ok) throw new Error(`Anthropic API ${res.status}: ${await res.text()}`)
  const data = await res.json()
  return data.content?.[0]?.text as string
}

/* ─── Парсинг и валидация JSON от модели ──────── */

/**
 * Достаёт JSON из ответа модели: убирает ```json-обёртки,
 * находит первый сбалансированный {...} — LLM часто добавляет «воду».
 */
export function extractJson(text: string): unknown {
  let cleaned = text.trim()
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '')

  const start = cleaned.indexOf('{')
  if (start === -1) throw new Error('В ответе модели нет JSON')

  let depth = 0
  let inString = false
  let escaped = false
  for (let i = start; i < cleaned.length; i++) {
    const ch = cleaned[i]
    if (inString) {
      if (escaped) escaped = false
      else if (ch === '\\') escaped = true
      else if (ch === '"') inString = false
      continue
    }
    if (ch === '"') inString = true
    else if (ch === '{') depth++
    else if (ch === '}') {
      depth--
      if (depth === 0) {
        return JSON.parse(cleaned.slice(start, i + 1))
      }
    }
  }
  throw new Error('Незавершённый JSON в ответе модели')
}

export function validateDishes(data: unknown): Dish[] {
  const parsed = dishListSchema.safeParse(data)
  if (!parsed.success) {
    const issues = parsed.error.issues
      .slice(0, 3)
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join('; ')
    throw new Error(`Модель вернула некорректную структуру: ${issues}`)
  }
  return parsed.data.dishes
}

export function parseDishesContent(content: string): Dish[] {
  return validateDishes(extractJson(content))
}

/* ─── Утилиты ──────────────────────────────────── */

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
