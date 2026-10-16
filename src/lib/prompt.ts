import {
  DENSITY_LABEL,
  DIET_LABEL,
  FORMAT_LABEL,
  MEAL_TYPE_LABEL,
  NUTRIENT_LABEL,
  VOLUME_PROMPT_TEXT,
} from '../data/quizConfig'
import { DISHES_JSON_EXAMPLE, type QuizAnswers } from '../types'

export interface BuiltPrompt {
  system: string
  user: string
}

/** Контракт ответа модели — вставляется в промт как пример */
export const RESPONSE_EXAMPLE_JSON = JSON.stringify(DISHES_JSON_EXAMPLE, null, 2)

/** Перевод ответов квиза в человекочитаемый текст для модели */
export function describeAnswers(a: QuizAnswers): string {
  const lines: string[] = []
  lines.push(`1. Плотность пищи: ${a.density ? DENSITY_LABEL[a.density] : 'не указана'}`)
  const nutrients = a.nutrients.map((n) => NUTRIENT_LABEL[n]).join(', ')
  lines.push(`2. Приоритет по нутриентам: ${nutrients || 'без предпочтения'}`)

  lines.push(`3. Объём против калорийности: ${VOLUME_PROMPT_TEXT[a.volume] ?? VOLUME_PROMPT_TEXT[2]}`)

  const hero = a.heroIngredient?.trim()
  if (hero) {
    lines.push(`3а. ГЛАВНЫЙ АКЦЕНТ: блюда с ингредиентом или блюдом «${hero}» — обязательное ядро подборки`)
  }

  lines.push(`4. Тип приёма пищи: ${a.mealType ? MEAL_TYPE_LABEL[a.mealType] : 'не указан'}`)

  lines.push(`5. Формат приготовления: ${a.cookingFormat ? FORMAT_LABEL[a.cookingFormat] : 'любой'}`)

  if (a.diets.length > 0) {
    lines.push(`6. Диеты и аллергии: ${a.diets.map((d) => DIET_LABEL[d]).join('; ')}`)
  }

  const fridge = a.ingredientsText.trim()
  if (fridge) {
    lines.push(`7. Есть под рукой / пожелания: «${fridge}»`)
  }

  return lines.join('\n')
}

export function buildSystemPrompt(): string {
  return `Ты — шеф-повар с 20-летним стажем, нутрициолог и знаток кулинарной истории.
По ответам пользователя из квиза составь персональную подборку блюд.

ЖЁСТКИЕ ТРЕБОВАНИЯ К ФОРМАТУ ОТВЕТА:
- Отвечай ТОЛЬКО валидным JSON вида {"dishes": [...]} — без markdown-обёрток (\`\`\`), без пояснений до/после.
- Ровно 10 объектов в массиве dishes.
- Все текстовые поля — на русском языке, живым аппетитным языком, без канцелярита.

СХЕМА КАЖДОГО ОБЪЕКТА:
- title: название блюда.
- short_description: 1-2 аппетитных предложения.
- volume_category: "large_volume" — большое физическое объёмное блюдо при умеренной калорийности (салаты, супы, боулы, овощи, каши); "compact_portion" — маленький физический объём с высокой калорийной/энергетической плотностью (орехи, зефир, батончики, сыры, десерты).
- bzhu: реалистичные значения на одну порцию: calories (ккал), proteins (г), fats (г), carbohydrates (г), fiber (г — если уместно).
- history: увлекательная история происхождения или создания блюда, 2-4 предложения (легенда, изобретение, культура).
- fun_fact: один необычный факт о блюде или его ингредиентах.
- recipe_summary: краткий пошаговый рецепт (если пользователь готовит сам) ИЛИ рекомендации, что выбирать в доставке/меню (если формат — заказать).
- search_query: короткий поисковый запрос ДЛЯ ФОТО на английском (например "grilled salmon salad bowl").
- cooking_time_minutes (необязательно): время приготовления, минут.

УЧЁТ ОТВЕТОВ:
- Если в ответах указана «ЦЕЛЬ ПОЛЬЗОВАТЕЛЯ» — это приоритетный вектор: калорийность, соотношение БЖУ и характер блюд должны соответствовать цели.
- Доминанты по нутриентам должны читаться в ratio БЖУ (например, упор на белки → белок заметно превышает углеводы).
- Шкала объёма: при смещении к большому объёму минимум 7 из 10 блюд — large_volume; при смещении к компактному — наоборот.
- Если указан «ГЛАВНЫЙ АКЦЕНТ» (конкретный ингредиент или блюдо) — минимум 5 из 10 блюд содержат этот ингредиент или построены вокруг этого блюда; остальные блюда гармонично дополняют акцент, а не дублируют друг друга.
- Формат "быстро сам" → только рецепты до 20 минут; "долго сам" → можно сложные блюда; "заказать" → в recipe_summary давай советы по выбору в доставке/ресторане (на что смотреть, как просить, с чем сочетать).
- Диеты/аллергии — жёсткое ограничение: ни одно блюдо не должен содержать запрещённое.
- Продукты из холодильника — по возможности включи их в подборку.
- Следи, чтобы подборка была разнообразной: разные кухни, разные основные ингредиенты, не более 2 блюд одного типа.
- Не выдумывай заведения и доставки по именам — давай универсальные рекомендации.

ПРИМЕР ОЖИДАЕМОГО JSON:
${RESPONSE_EXAMPLE_JSON}`
}

export interface PromptOptions {
  /** Глобальная цель пользователя (похудение, набор массы…) */
  goalPromptText?: string
  goalLabel?: string
  /** Блюда, которые уже показывали — не повторять */
  excludeTitles?: string[]
}

export function buildUserPrompt(a: QuizAnswers, options: PromptOptions = {}): string {
  const hero = a.heroIngredient?.trim()
  const hasExtras =
    a.diets.length > 0 || a.ingredientsText.trim().length > 0 || Boolean(hero) || Boolean(options.goalPromptText)
  const extra = hasExtras
    ? [
        options.goalPromptText
          ? `ЦЕЛЬ ПОЛЬЗОВАТЕЛЯ (${options.goalLabel}): ${options.goalPromptText}. Учитывай её при выборе блюд, их калорийности и БЖУ.`
          : '',
        a.diets.length > 0
          ? `Жёсткие ограничения: ${a.diets.map((d) => DIET_LABEL[d]).join(', ')}.`
          : '',
        hero
          ? `ГЛАВНЫЙ АКЦЕНТ: «${hero}» — минимум 5 из 10 блюд должны содержать этот ингредиент или быть построены вокруг этого блюда.`
          : '',
        a.ingredientsText.trim()
          ? `Есть продукты/пожелания: «${a.ingredientsText.trim()}».`
          : '',
        options.excludeTitles && options.excludeTitles.length > 0
          ? `НЕ ПОВТОРЯЙ блюда, которые уже были: ${options.excludeTitles.map((t) => `«${t}»`).join(', ')}.`
          : '',
      ]
        .filter(Boolean)
        .join('\n')
    : 'Ограничений по диете нет.'

  return `Составь подборку из 10 блюд по моим ответам из квиза.

МОИ ОТВЕТЫ:
${describeAnswers(a)}

${extra}

Верни только JSON {"dishes": [...]} с ровно 10 блюдами.`
}

/** Полный набор промтов для отправки в LLM */
export function buildPrompt(a: QuizAnswers, options: PromptOptions = {}): BuiltPrompt {
  return { system: buildSystemPrompt(), user: buildUserPrompt(a, options) }
}
