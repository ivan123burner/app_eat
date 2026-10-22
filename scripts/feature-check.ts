/* Временный смоук-тест логики поиска и промта (проверяется в Node через esbuild) */
import { searchIngredients } from '../src/data/ingredientsDatabase'
import { buildPrompt } from '../src/lib/prompt'
import { EMPTY_ANSWERS, type QuizAnswers } from '../src/types'

console.log('═══ Поиск по справочнику ═══')
for (const q of ['ку', 'авок', 'СЫР', 'боу', 'рыб', 'zzz']) {
  const res = searchIngredients(q, 6)
  console.log(`"${q}" -> ${res.map((r) => `${r.name} [${r.category}]`).join(', ') || '(ничего)'}`)
}

console.log('\n═══ Промт с акцентом ═══')
const answers: QuizAnswers = {
  ...EMPTY_ANSWERS,
  density: 'heavy',
  nutrients: ['protein'],
  volume: 3,
  mealType: 'lunch',
  cookingFormat: 'quick_cook',
  heroIngredient: 'куриное филе',
  ingredientsText: 'есть майонез',
  diets: ['lactose_free'],
}

const { system, user } = buildPrompt(answers)
const checks: [string, boolean][] = [
  ['system: правило про ГЛАВНЫЙ АКЦЕНТ', system.includes('ГЛАВНЫЙ АКЦЕНТ')],
  ['user: акцент «куриное филе»', user.includes('ГЛАВНЫЙ АКЦЕНТ: «куриное филе»')],
  ['user: строка 3а в ответах', user.includes('3а. ГЛАВНЫЙ АКЦЕНТ')],
  ['user: продукты из холодильника', user.includes('есть майонез')],
  ['user: диета без лактозы', user.includes('без лактозы')],
  ['user: формат «быстро сам»', user.includes('до 20 минут')],
]
for (const [name, ok] of checks) console.log(`${ok ? '✅' : '❌'} ${name}`)

console.log('\n═══ Промт БЕЗ акцента (стандартный сценарий) ═══')
const plain = buildPrompt({ ...EMPTY_ANSWERS, density: 'light', nutrients: ['balance'], mealType: 'snack', cookingFormat: 'order_out' })
console.log('✅ user без акцента (стандартный сценарий):', !plain.user.includes('ГЛАВНЫЙ АКЦЕНТ'))
console.log('\n═══ Промт с целью и исключением повторов ═══')
const withGoal = buildPrompt(
  { ...EMPTY_ANSWERS, density: 'light', nutrients: ['fiber'], mealType: 'lunch', cookingFormat: 'quick_cook' },
  {
    goalPromptText: 'снижение веса: дефицит калорий',
    goalLabel: 'Похудение',
    excludeTitles: ['Цезарь с гриль-курицей и хрустящими крутонами', 'Паста качо-э-пепе'],
  },
)
const goalChecks: [string, boolean][] = [
  ['user: цель «Похудение»', withGoal.user.includes('ЦЕЛЬ ПОЛЬЗОВАТЕЛЯ (Похудение)')],
  ['user: дефицит калорий', withGoal.user.includes('дефицит калорий')],
  ['user: не повторять блюда', withGoal.user.includes('НЕ ПОВТОРЯЙ') && withGoal.user.includes('качо-э-пепе')],
  ['system: правило про цель', system.includes('ЦЕЛЬ ПОЛЬЗОВАТЕЛЯ')],
]
for (const [name, ok] of goalChecks) console.log(`${ok ? '✅' : '❌'} ${name}`)

console.log('\n═══ Страна и простые доступные рецепты ═══')
const withCountry = buildPrompt({ ...EMPTY_ANSWERS, density: 'normal' }, { country: 'Казахстан' })
const countryChecks: [string, boolean][] = [
  ['user: «СТРАНА ПОЛЬЗОВАТЕЛЯ: Казахстан»', withCountry.user.includes('СТРАНА ПОЛЬЗОВАТЕЛЯ: Казахстан')],
  ['user: доступные продукты/супермаркеты', withCountry.user.includes('супермаркеты')],
  ['system: блок «ПРОСТОТА И ДОСТУПНОСТЬ»', withCountry.system.includes('ПРОСТОТА И ДОСТУПНОСТЬ')],
  ['system: без экзотики и дорогих ингредиентов', withCountry.system.includes('экзотических ингредиентов')],
  ['system: 5-8 простых ингредиентов', withCountry.system.includes('5-8 простых ингредиентов')],
]
for (const [name, ok] of countryChecks) console.log(`${ok ? '✅' : '❌'} ${name}`)

console.log('\n═══ Готово ═══')
