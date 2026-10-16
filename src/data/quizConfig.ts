import type { LucideIcon } from 'lucide-react'
import {
  Ban,
  Beef,
  Cookie,
  Droplet,
  Feather,
  Flame,
  Hourglass,
  Leaf,
  Milk,
  Salad,
  Scale,
  ShoppingBag,
  Soup,
  Sprout,
  Sun,
  Moon,
  Timer,
  UtensilsCrossed,
  Wheat,
  WheatOff,
  Zap,
} from 'lucide-react'
import type { CookingFormat, Density, DietFlag, MealType, Nutrient } from '../types'

/* ══════════════════════════════════════════════
   Единый источник правды для опций квиза:
   используется и в UI, и в генерации промта
   ══════════════════════════════════════════════ */

export interface OptionDef<T extends string> {
  value: T
  label: string
  hint: string
  emoji: string
  icon: LucideIcon
}

/* 1. Плотность пищи */
export const DENSITY_OPTIONS: OptionDef<Density>[] = [
  {
    value: 'light',
    label: 'Лёгкий перекус',
    hint: 'Несколько укусов — и чувствую себя отлично',
    emoji: '🪶',
    icon: Feather,
  },
  {
    value: 'heavy',
    label: 'Плотный приём пищи',
    hint: 'Хочется настоящую полноценную порцию',
    emoji: '🍲',
    icon: UtensilsCrossed,
  },
]

/* 2. Приоритет по нутриентам (мультивыбор, «Баланс» — особый) */
export const NUTRIENT_OPTIONS: OptionDef<Nutrient>[] = [
  {
    value: 'protein',
    label: 'Белки',
    hint: 'Мясо, рыба, творог, бобовые',
    emoji: '💪',
    icon: Beef,
  },
  {
    value: 'carbs',
    label: 'Углеводы',
    hint: 'Крупы, паста, хлеб, макароны',
    emoji: '🌾',
    icon: Wheat,
  },
  {
    value: 'fats',
    label: 'Жиры',
    hint: 'Сыры, орехи, авокадо, масло',
    emoji: '🫒',
    icon: Droplet,
  },
  {
    value: 'fiber',
    label: 'Клетчатка',
    hint: 'Овощи, зелень, цельнозерновое',
    emoji: '🥬',
    icon: Leaf,
  },
  {
    value: 'balance',
    label: 'Баланс БЖУ',
    hint: 'Рацион без перекосов — на всё вкус',
    emoji: '⚖️',
    icon: Scale,
  },
]

/* 3. Объём против калорийности (фирменная фишка) */
export const VOLUME_STOPS: {
  emoji: string
  label: string
  short: string
  hint: string
  icon: LucideIcon
}[] = [
  {
    emoji: '🥗',
    label: 'Огромная тарелка — минимум калорий',
    short: 'Максимум объёма',
    hint: 'Салаты, супы, овощи: много еды — мало калорий',
    icon: Salad,
  },
  {
    emoji: '🍲',
    label: 'Скорее большой объём',
    short: 'Большой объём',
    hint: 'Плотная, но не тяжёлая тарелка',
    icon: Soup,
  },
  {
    emoji: '🍽️',
    label: 'Золотая середина',
    short: 'Баланс',
    hint: 'Обычная порция и обычная калорийность',
    icon: UtensilsCrossed,
  },
  {
    emoji: '🍫',
    label: 'Скорее компактно',
    short: 'Компактно',
    hint: 'Несколько кусочков, но по-настоящему сытно',
    icon: Cookie,
  },
  {
    emoji: '🥜',
    label: 'Малый размер — максимум энергии',
    short: 'Максимальная плотность',
    hint: 'Орехи, зефир, батончики: мало места — много энергии',
    icon: Flame,
  },
]

/* 4. Тип приёма пищи */
export const MEAL_TYPE_OPTIONS: OptionDef<MealType>[] = [
  { value: 'breakfast', label: 'Завтрак', hint: 'Бодрое начало дня', emoji: '🌅', icon: Sun },
  { value: 'lunch', label: 'Обед', hint: 'Сытная середина дня', emoji: '🍜', icon: Soup },
  { value: 'dinner', label: 'Ужин', hint: 'Спокойное завершение дня', emoji: '🌙', icon: Moon },
  {
    value: 'snack',
    label: 'Быстрый перекус',
    hint: 'Подзарядиться на ходу',
    emoji: '⚡',
    icon: Zap,
  },
  { value: 'dessert', label: 'Десерт', hint: 'Просто хочется сладкого', emoji: '🍪', icon: Cookie },
]

/* 5. Формат приготовления / доступности */
export const FORMAT_OPTIONS: OptionDef<CookingFormat>[] = [
  {
    value: 'quick_cook',
    label: 'Приготовлю сам — до 20 минут',
    hint: 'Быстро, из простых продуктов',
    emoji: '⏱️',
    icon: Timer,
  },
  {
    value: 'slow_cook',
    label: 'Готов готовить долго',
    hint: 'Гастрономический процесс в удовольствие',
    emoji: '⏳',
    icon: Hourglass,
  },
  {
    value: 'order_out',
    label: 'Заказать / сходить в заведение',
    hint: 'Хочу результат без плиты',
    emoji: '🛵',
    icon: ShoppingBag,
  },
]

/* 6. Диеты и ограничения */
export const DIET_OPTIONS: OptionDef<DietFlag>[] = [
  { value: 'vegetarian', label: 'Вегетарианское', hint: 'Без мяса и рыбы', emoji: '🌱', icon: Salad },
  { value: 'vegan', label: 'Веганское', hint: 'Только растительное', emoji: '🌿', icon: Sprout },
  { value: 'lactose_free', label: 'Без лактозы', hint: 'Нет молочного', emoji: '🥛', icon: Milk },
  {
    value: 'gluten_free',
    label: 'Без глютена',
    hint: 'Нет пшеницы/гречки-контаминации',
    emoji: '🌾',
    icon: WheatOff,
  },
  { value: 'nut_free', label: 'Без орехов', hint: 'Нет орехов и арахиса', emoji: '🥜', icon: Ban },
  {
    value: 'low_carb',
    label: 'Мало углеводов',
    hint: 'Low-carb / кето-подобное',
    emoji: '🔥',
    icon: Flame,
  },
]

/* ─── Человекочитаемые лейблы (для промта и чипов в выдаче) ─── */

export const labelOf = <T extends string>(options: OptionDef<T>[], value: T): string =>
  options.find((o) => o.value === value)?.label ?? String(value)

export const DENSITY_LABEL: Record<Density, string> = {
  light: labelOf(DENSITY_OPTIONS, 'light'),
  heavy: labelOf(DENSITY_OPTIONS, 'heavy'),
}

export const NUTRIENT_LABEL: Record<Nutrient, string> = {
  protein: 'упор на белки',
  carbs: 'упор на углеводы',
  fats: 'упор на жиры',
  fiber: 'много клетчатки',
  balance: 'баланс БЖУ',
}

export const MEAL_TYPE_LABEL: Record<MealType, string> = {
  breakfast: 'завтрак',
  lunch: 'обед',
  dinner: 'ужин',
  snack: 'быстрый перекус',
  dessert: 'десерт',
}

export const FORMAT_LABEL: Record<CookingFormat, string> = {
  quick_cook: 'приготовить самому быстро (до 20 минут)',
  slow_cook: 'приготовить самому, можно долго',
  order_out: 'заказать готовую еду или сходить в заведение',
}

export const DIET_LABEL: Record<DietFlag, string> = {
  vegetarian: 'вегетарианское (без мяса и рыбы)',
  vegan: 'веганское (только растительное)',
  lactose_free: 'без лактозы (без молочного)',
  gluten_free: 'без глютена',
  nut_free: 'без орехов и арахиса',
  low_carb: 'мало углеводов (low-carb)',
}

/** Подробные формулировки шкалы объёма — для промта */
export const VOLUME_PROMPT_TEXT: string[] = [
  'максимально большой физический объём при минимальной калорийности (салаты, супы, овощи, боулы)',
  'скорее большой объём при умеренной калорийности',
  'золотая середина: обычный объём порции и обычная калорийность',
  'скорее компактная порция с высокой калорийной плотностью',
  'минимальный физический объём при максимальной калорийности и плотности нутриентов (орехи, зефир, батончики, сыры)',
]
