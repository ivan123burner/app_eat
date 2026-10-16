import { z } from 'zod'

/* ══════════════════════════════════════════════
   Ответы квиза
   ══════════════════════════════════════════════ */

export type Density = 'light' | 'heavy'
export type Nutrient = 'protein' | 'carbs' | 'fats' | 'fiber' | 'balance'
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert'
export type CookingFormat = 'quick_cook' | 'slow_cook' | 'order_out'
export type DietFlag =
  | 'vegetarian'
  | 'vegan'
  | 'lactose_free'
  | 'gluten_free'
  | 'nut_free'
  | 'low_carb'

export interface QuizAnswers {
  density: Density | null
  /** Мультивыбор приоритетов; 'balance' — взаимоисключающий с остальными */
  nutrients: Nutrient[]
  /**
   * Фирменная фишка: шкала «объём против калорийности».
   * 0 — огромная тарелка при минимуме калорий (салаты, супы),
   * 4 — минимальный объём при максимуме энергии (орехи, зефир, батончики).
   */
  volume: number
  mealType: MealType | null
  cookingFormat: CookingFormat | null
  /** Главный акцент из поиска на шаге объёма (продукт или блюдо) */
  heroIngredient: string | null
  /** Свободный текст: что есть в холодильнике */
  ingredientsText: string
  diets: DietFlag[]
}

export const EMPTY_ANSWERS: QuizAnswers = {
  density: null,
  nutrients: [],
  volume: 2,
  mealType: null,
  cookingFormat: null,
  heroIngredient: null,
  ingredientsText: '',
  diets: [],
}

/* ══════════════════════════════════════════════
   JSON-схема, которую обязана вернуть LLM (Zod)
   ══════════════════════════════════════════════ */

export const bzhuSchema = z.object({
  /** ккал на порцию */
  calories: z.number().nonnegative(),
  /** белки, г */
  proteins: z.number().nonnegative(),
  /** жиры, г */
  fats: z.number().nonnegative(),
  /** углеводы, г */
  carbohydrates: z.number().nonnegative(),
  /** клетчатка, г (необязательно) */
  fiber: z.number().nonnegative().optional(),
})

export const dishSchema = z.object({
  title: z.string().min(1),
  short_description: z.string().min(1),
  volume_category: z.enum(['large_volume', 'compact_portion']),
  bzhu: bzhuSchema,
  history: z.string().min(1),
  fun_fact: z.string().min(1),
  recipe_summary: z.string().min(1),
  search_query: z.string().min(1),
  /** необязательные расширения — принимаем, но не требуем */
  cooking_time_minutes: z.number().positive().optional(),
  tags: z.array(z.string()).optional(),
})

export const dishListSchema = z.object({
  dishes: z.array(dishSchema).min(1).max(12),
})

export type Bzhu = z.infer<typeof bzhuSchema>
export type Dish = z.infer<typeof dishSchema>

/**
 * Блюдо с внутренним уникальным id для React-ключей.
 * uid стабилен: удаление/добавление одной карточки не пересоздаёт остальные.
 */
export type DishWithMeta = Dish & { uid: string }

/* ══════════════════════════════════════════════
   Пример того, что ожидаем от API (для документации/прокси)
   ══════════════════════════════════════════════ */

export const DISHES_JSON_EXAMPLE = {
  dishes: [
    {
      title: 'Боул с киноа, лососем и авокадо',
      short_description:
        'Тёплый боул с хрустящей киноа, слоёным лососем и сливочным авокадо — сытно, но невесомо.',
      volume_category: 'large_volume',
      bzhu: { calories: 480, proteins: 32, fats: 18, carbohydrates: 42, fiber: 9 },
      history:
        'Киноа пришла из Анд, где её называли «матерью всех зерен», а современный grain bowl...',
      fun_fact: 'Лосось набирает розовый цвет от астаксантина — каротиноида из рачков.',
      recipe_summary: '1. Киноа 15 мин... 2. Лосось на гриле...',
      search_query: 'quinoa salmon avocado bowl',
      cooking_time_minutes: 20,
      tags: ['high_protein', 'pescatarian'],
    },
  ],
} as const
