# 🍳 Что поесть? — умный подбор блюд

PWA-квиз из 6 вопросов: на основе ответов ИИ собирает подборку из 10 блюд — с рецептом,
БЖУ, историей происхождения и любопытным фактом.

## Стек

| Слой | Технология | Зачем |
|---|---|---|
| UI | **React 19 + TypeScript** | типобезопасность ответов LLM через Zod |
| Сборка | **Vite 6** | мгновальный dev-сервер, быстрый билд |
| Стили | **Tailwind CSS 4** | mobile-first utility-first, дизайн-токены в CSS |
| Анимации | **Motion (Framer Motion 12)** | переходы между шагами, модалка-шит, бары БЖУ |
| Иконки | **Lucide React** | лёгкие SVG-иконки |
| Валидация JSON LLM | **Zod** | жёсткая схема `dishSchema` — битый ответ модели не сломает UI |
| PWA | **vite-plugin-pwa** | манифест + service worker, установка на «Домой» (iOS/Android) |

## Запуск

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production-сборка в dist/
npm run preview    # превью dist
npm run icons      # перегенерировать PWA-иконки (PowerShell)
```

## Подключение реального ИИ

По умолчанию работает **mock-режим** (встроенная подборка из 10 блюд, без сети).
Скопируйте `.env.example` → `.env` и выберите провайдера:

```bash
VITE_AI_PROVIDER=openai      # или anthropic | proxy | mock
VITE_OPENAI_API_KEY=sk-...
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_PROXY_URL=/api/generate # свой backend (рекомендуется для продакшена)
VITE_UNSPLASH_ACCESS_TOKEN=  # фото блюд вместо эмодзи-плейсхолдера
```

> ⚠️ Ключ в браузере виден пользователю. Для продакшена используйте `proxy`:
> ваш бэкенд принимает `{ answers, system, user }`, вызывает LLM с серверным
> ключом и возвращает `{ dishes: [...] }`.

### Контракт ответа (JSON)

```jsonc
{
  "dishes": [
    {
      "title": "Боул с киноа, лососем и авокадо",
      "short_description": "Тёплый боул с хрустящей киноа...",
      "volume_category": "large_volume",       // или "compact_portion"
      "bzhu": { "calories": 480, "proteins": 32, "fats": 18, "carbohydrates": 42, "fiber": 9 },
      "history": "Киноа пришла из Анд...",
      "fun_fact": "Лосось розовый не от природы...",
      "recipe_summary": "1. Свари киноа 15 минут...",
      "search_query": "quinoa salmon avocado bowl",  // для поиска фото
      "cooking_time_minutes": 20                        // опционально
    }
  ]
}
```

Схема дублируется в `src/types/index.ts` (Zod) и в промте (`src/lib/prompt.ts`),
ответ модели парсится с защитой от markdown-обёрток и «воды».

## Структура проекта

```
src/
├── App.tsx                 # роутинг экранов: quiz → loading → results / error
├── components/
│   ├── QuizScreen.tsx      # оркестратор 6 шагов, навигация, состояние ответов
│   ├── Stepper.tsx         # прогресс-бар шагов
│   ├── OptionCard.tsx      # карточка выбора (иконка + эмодзи + подсветка)
│   ├── steps/              # шаги квиза: Density, Nutrients, Volume, MealType, Format, Extras
│   ├── LoadingScreen.tsx   # анимация «ИИ готовит подборку»
│   ├── Results.tsx         # свайп-карусель (моб.) / сетка (десктоп) + чипсы ответов
│   ├── DishCard.tsx        # карточка блюда: фото, бейджи, БЖУ
│   ├── DishImage.tsx       # фото Unsplash или эмодзи-градиент-фолбэк
│   ├── DishModal.tsx       # детали: БЖУ-бары, рецепт, история, факт
│   └── ErrorScreen.tsx     # ошибки API + повтор
├── data/
│   ├── quizConfig.ts       # опции и лейблы шагов (единый источник и для UI, и для промта)
│   └── mockDishes.ts       # демо-подборка (mock-режим)
├── lib/
│   ├── prompt.ts           # ★ генерация system/user промта из ответов квиза
│   └── cn.ts               # хелпер классов
├── services/
│   ├── ai.ts               # провайдеры LLM + парсинг/валидация JSON
│   └── images.ts           # Unsplash API + эмодзи-фолбэк, useDishImage
└── types/index.ts          # QuizAnswers + Zod-схемы dishSchema / dishListSchema
```

## Логика квиза

1. **Плотность** — лёгкий перекус / плотный приём пищи.
2. **Нутриенты** — мультивыбор белки/углеводы/жиры/клетчатка; «Баланс» взаимоисключающий.
3. **Объём vs калорийности** 🎛 — слайдер: от «тарелка салата минимум калорий» до
   «горсть орехов максимум энергии».
4. **Тип приёма пищи** — завтрак / обед / ужин / перекус / десерт.
5. **Формат** — быстро сам / долго сам / заказать (в промте меняет тип recipe_summary).
6. **Нюансы** — продукты из холодильника + диеты/аллергии (можно пропустить).

Ответы превращаются в промт функцией `buildPrompt()`; модель обязана вернуть
ровно 10 блюд в строгой JSON-схеме, которую проверяет Zod перед показом UI.
