/* ══════════════════════════════════════════════
   Локальный справочник продуктов и блюд.
   Работает полностью офлайн — фильтрация мгновенная,
   без запросов к ИИ/серверу.
   ══════════════════════════════════════════════ */

export type IngredientCategory = 'vegetables' | 'fruits' | 'proteins' | 'grains' | 'dishes'

export const INGREDIENT_CATEGORIES: Record<IngredientCategory, { label: string; emoji: string }> = {
  vegetables: { label: 'Овощи и зелень', emoji: '🥦' },
  fruits: { label: 'Фрукты и ягоды', emoji: '🍓' },
  proteins: { label: 'Белки, мясо и рыба', emoji: '🥩' },
  grains: { label: 'Крупы и зерновые', emoji: '🌾' },
  dishes: { label: 'Готовые блюда', emoji: '🍽️' },
}

export interface IngredientItem {
  name: string
  category: IngredientCategory
}

const item = (name: string, category: IngredientCategory): IngredientItem => ({ name, category })

export const INGREDIENTS_DATABASE: IngredientItem[] = [
  /* ── Овощи и зелень ── */
  item('помидор', 'vegetables'),
  item('помидоры черри', 'vegetables'),
  item('огурец', 'vegetables'),
  item('брокколи', 'vegetables'),
  item('шпинат', 'vegetables'),
  item('картофель', 'vegetables'),
  item('кабачок', 'vegetables'),
  item('авокадо', 'vegetables'),
  item('лук', 'vegetables'),
  item('зелёный лук', 'vegetables'),
  item('чеснок', 'vegetables'),
  item('морковь', 'vegetables'),
  item('свёкла', 'vegetables'),
  item('перец болгарский', 'vegetables'),
  item('грибы', 'vegetables'),
  item('шампиньоны', 'vegetables'),
  item('руккола', 'vegetables'),
  item('салат айсберг', 'vegetables'),
  item('капуста', 'vegetables'),
  item('брокколи замороженные', 'vegetables'),
  item('створковая фасоль', 'vegetables'),
  item('баклажан', 'vegetables'),
  item('цукини', 'vegetables'),
  item('кукуруза', 'vegetables'),
  item('редис', 'vegetables'),
  item('петрушка', 'vegetables'),
  item('укроп', 'vegetables'),
  item('базилик', 'vegetables'),
  item('кинза', 'vegetables'),
  item('спаржа', 'vegetables'),
  item('горошек зелёный', 'vegetables'),

  /* ── Фрукты и ягоды ── */
  item('яблоко', 'fruits'),
  item('банан', 'fruits'),
  item('клубника', 'fruits'),
  item('черника', 'fruits'),
  item('голубика', 'fruits'),
  item('апельсин', 'fruits'),
  item('мандарин', 'fruits'),
  item('грейпфрут', 'fruits'),
  item('лимон', 'fruits'),
  item('груша', 'fruits'),
  item('виноград', 'fruits'),
  item('киви', 'fruits'),
  item('персик', 'fruits'),
  item('абрикос', 'fruits'),
  item('вишня', 'fruits'),
  item('малина', 'fruits'),
  item('арбуз', 'fruits'),
  item('дыня', 'fruits'),
  item('ананас', 'fruits'),
  item('манго', 'fruits'),
  item('изюм', 'fruits'),
  item('финики', 'fruits'),
  item('кокос', 'fruits'),

  /* ── Белки, мясо и рыба ── */
  item('мясо', 'proteins'),
  item('рыба', 'proteins'),
  item('куриное филе', 'proteins'),
  item('курица', 'proteins'),
  item('куриные бёдра', 'proteins'),
  item('индейка', 'proteins'),
  item('говядина', 'proteins'),
  item('стейк', 'proteins'),
  item('свинина', 'proteins'),
  item('баранина', 'proteins'),
  item('лосось', 'proteins'),
  item('форель', 'proteins'),
  item('сёмга слабосолёная', 'proteins'),
  item('тунец', 'proteins'),
  item('треска', 'proteins'),
  item('минтай', 'proteins'),
  item('креветки', 'proteins'),
  item('кальмар', 'proteins'),
  item('мидии', 'proteins'),
  item('икра слабосолёная', 'proteins'),
  item('яйца', 'proteins'),
  item('творог', 'proteins'),
  item('греческий йогурт', 'proteins'),
  item('йогурт', 'proteins'),
  item('сыр', 'proteins'),
  item('моцарелла', 'proteins'),
  item('пармезан', 'proteins'),
  item('фета', 'proteins'),
  item('брынза', 'proteins'),
  item('молоко', 'proteins'),
  item('сметана', 'proteins'),
  item('сливки', 'proteins'),
  item('тофу', 'proteins'),
  item('нут', 'proteins'),
  item('чечевица', 'proteins'),
  item('фасоль', 'proteins'),
  item('арахис', 'proteins'),
  item('миндаль', 'proteins'),
  item('фисташки', 'proteins'),
  item('грецкий орех', 'proteins'),
  item('кешью', 'proteins'),
  item('семечки подсолнечника', 'proteins'),
  item('протеиновый порошок', 'proteins'),

  /* ── Крупы и зерновые ── */
  item('рис', 'grains'),
  item('бурый рис', 'grains'),
  item('овсянка', 'grains'),
  item('овсяные хлопья', 'grains'),
  item('гречка', 'grains'),
  item('макароны', 'grains'),
  item('паста', 'grains'),
  item('спагетти', 'grains'),
  item('булгур', 'grains'),
  item('киноа', 'grains'),
  item('перловка', 'grains'),
  item('пшено', 'grains'),
  item('кускус', 'grains'),
  item('полба', 'grains'),
  item('чиа', 'grains'),
  item('льняное семя', 'grains'),
  item('хлеб', 'grains'),
  item('батон', 'grains'),
  item('тост', 'grains'),
  item('лаваш', 'grains'),
  item('тортилья', 'grains'),
  item('блин', 'grains'),
  item('оладья', 'grains'),

  /* ── Готовые блюда и базовые категории ── */
  item('салат', 'dishes'),
  item('суп', 'dishes'),
  item('борщ', 'dishes'),
  item('окрошка', 'dishes'),
  item('солянка', 'dishes'),
  item('том-ям', 'dishes'),
  item('рамен', 'dishes'),
  item('боул', 'dishes'),
  item('вок', 'dishes'),
  item('карри', 'dishes'),
  item('плов', 'dishes'),
  item('рагу', 'dishes'),
  item('паста карбонара', 'dishes'),
  item('лазанья', 'dishes'),
  item('ризотто', 'dishes'),
  item('пицца', 'dishes'),
  item('роллы', 'dishes'),
  item('суши', 'dishes'),
  item('бургер', 'dishes'),
  item('шаурма', 'dishes'),
  item('тако', 'dishes'),
  item('хачапури', 'dishes'),
  item('хинкали', 'dishes'),
  item('манты', 'dishes'),
  item('сырники', 'dishes'),
  item('панкейки', 'dishes'),
  item('запеканка', 'dishes'),
  item('котлеты', 'dishes'),
  item('тефтели', 'dishes'),
  item('драники', 'dishes'),
  item('банош', 'dishes'),
  item('каша', 'dishes'),
  item('гренки', 'dishes'),
  item('тост с авокадо', 'dishes'),
  item('смузи', 'dishes'),
  item('батончик', 'dishes'),
  item('десерт', 'dishes'),
  item('сырник', 'dishes'),
]

/** Нормализация: «ё» → «е», нижний регистр, обрезка пробелов */
const normalize = (s: string): string => s.toLowerCase().replace(/ё/g, 'е').trim()

/**
 * Мгновенный поиск по справочнику (без сети).
 * Порядок: точное совпадение → начало строки → начало слова → вхождение.
 */
export function searchIngredients(query: string, limit = 8): IngredientItem[] {
  const q = normalize(query)
  if (!q) return []

  const scored: { item: IngredientItem; score: number }[] = []
  for (const entry of INGREDIENTS_DATABASE) {
    const name = normalize(entry.name)
    let score = -1
    if (name === q) score = 0
    else if (name.startsWith(q)) score = 1
    else if (name.includes(' ' + q)) score = 2
    else if (name.includes(q)) score = 3

    if (score >= 0) scored.push({ item: entry, score })
  }

  scored.sort(
    (a, b) => a.score - b.score || a.item.name.localeCompare(b.item.name, 'ru'),
  )
  return scored.slice(0, limit).map((s) => s.item)
}
