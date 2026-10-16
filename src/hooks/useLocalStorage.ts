import { useEffect, useState } from 'react'

/**
 * Хук состояния, персистентного в localStorage.
 * Значение переживает перезагрузку страницы (избранное, цель, дизлайки).
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* приватный режим браузера — молча продолжаем без персистентности */
    }
  }, [key, value])

  return [value, setValue] as const
}
