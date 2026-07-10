# MASTER PROMPT ДЛЯ CODEX: CINEMATIC HPL LANDING LEMARK

> Этот файл является главным техническим заданием. Выполняй его как автономный senior product designer + арт-директор + frontend-инженер + motion designer + media-pipeline engineer. Не ограничивайся макетом: итогом должен быть работающий, протестированный landing в текущем репозитории с готовыми изображениями и видео.

---

## 0. Главная задача

Собери полноценный премиальный landing для **LEMARK — производителя HPL-пластика полного цикла**.

Новый landing должен:

1. По глубине структуры, коммерческой наполненности и количеству смысловых блоков соответствовать текущему сайту `https://lemarkllc.ru/`.
2. Не копировать его визуально. Нужен новый кинематографический digital-first дизайн уровня международного промышленного бренда.
3. Использовать главный storytelling-приём: **длинный sticky HERO с видео на фоне, синхронизированным со скроллом**. При прокрутке видео проигрывается вперёд/назад, а контент сменяется по главам.
4. Показывать HPL не как абстрактный «лист пластика», а как материал, проходящий путь:
   - сырьё и крафт-бумага;
   - смолы и импрегнация;
   - сборка пакета;
   - прессование;
   - готовая плита и фактура;
   - мебель и интерьер;
   - фасады и городская среда;
   - чистые помещения;
   - транспорт;
   - готовый проект клиента.
5. Использовать доступный **Higgsfield CLI / MCP** для генерации изображений и видео. Не ограничиваться placeholder-картинками.
6. Содержать реальные русскоязычные тексты, CTA, формы, SEO-метаданные, адаптивность и accessibility.
7. Быть готовым к демонстрации и дальнейшему production-внедрению, а не выглядеть как сырой AI-прототип.

---

## 1. Режим работы и автономность

Работай последовательно, но не останавливайся после плана.

### Обязательный порядок

1. Проанализируй репозиторий.
2. Зафиксируй текущий стек, структуру, роутинг, стили, компоненты, существующие формы и API.
3. Создай краткий внутренний план в `docs/implementation-plan.md`.
4. Создай content map в `docs/content-map.md`.
5. Создай visual bible и storyboard в `docs/visual-bible.md` и `docs/storyboard.md`.
6. Проведи discovery Higgsfield CLI/MCP.
7. Сгенерируй и обработай медиа.
8. Собери landing.
9. Прогони тесты, линтер, сборку и визуальную проверку.
10. Исправь найденные проблемы.
11. Обнови README с инструкцией запуска и описанием медиапайплайна.

### Не делай

- Не задавай вопросы, ответы на которые можно получить из репозитория, текущего сайта или `--help` используемых инструментов.
- Не останавливайся на wireframe.
- Не оставляй lorem ipsum.
- Не используй случайные изображения с Unsplash/Pexels вместо предметной генерации.
- Не подменяй нужный результат одной статичной картинкой в HERO.
- Не делай типичный SaaS-шаблон с одинаковыми карточками, синим градиентом и бесконечными pill-кнопками.
- Не выдумывай технические характеристики, сертификаты, клиентов и завершённые объекты.
- Не удаляй действующие страницы, SEO URL, формы и интеграции без необходимости.
- Не меняй стек целиком, если проект уже существует и его можно развивать в текущей архитектуре.

### Когда допустима остановка

Только если отсутствует критический секрет, авторизация или разрешение на платную генерацию. Даже в этом случае:

- закончи кодовую часть;
- создай media placeholders правильных размеров;
- сохрани все финальные prompts;
- создай manifest и команды, которые останется запустить после авторизации;
- явно опиши блокер в `docs/BLOCKERS.md`.

---

## 2. Аудит проекта и выбор стека

### 2.1. Сначала определи существующую архитектуру

Проверь:

- `package.json`, lock-файлы, версии Node;
- наличие Next.js, Vite, Astro, React, Vue, Nuxt, MODX-шаблонов или обычной HTML/CSS/JS-сборки;
- текущие CSS-фреймворки;
- формы, webhook/API endpoints;
- аналитические скрипты;
- cookie banner;
- sitemap, robots, canonical;
- текущие assets и логотипы;
- маршруты страниц;
- существующие компоненты header/footer/modal/form;
- environment variables;
- CI/CD.

### 2.2. Правило интеграции

- Если проект уже на React/Next/Vite — работай внутри него.
- Если проект на MODX/PHP — собери landing в рамках существующего шаблона, чанков и asset pipeline. Не тащи Next.js только ради одной страницы.
- Если репозиторий пустой — используй production-ready fallback:
  - Next.js App Router;
  - TypeScript strict;
  - Tailwind CSS;
  - Framer Motion для появления и смены текста;
  - GSAP + ScrollTrigger для sticky scroll timeline и video scrub;
  - React Hook Form + Zod для формы;
  - Playwright для визуального smoke test;
  - ESLint + Prettier.

### 2.3. Не привязывайся к CDN-only прототипу

Референс HERO мог быть собран на React CDN, но production landing должен использовать текущий build pipeline проекта. CDN-only React допустим только если весь текущий проект намеренно построен так.

---

## 3. Источники контента и существующие URL

Перед реализацией открой и изучи текущий сайт. Используй его как источник структуры и фактов, но перепиши тексты чище, короче и современнее.

### Основные страницы

- `https://lemarkllc.ru/`
- `https://lemarkllc.ru/produkcziya/`
- `https://lemarkllc.ru/katalog-dekorov-hpl/`
- `https://lemarkllc.ru/tisnenie/`
- `https://lemarkllc.ru/o-kompanii/`
- `https://lemarkllc.ru/contacts/`
- `https://lemarkllc.ru/primenenie-hpl/hpl-dlya-stroitelstva/`
- `https://lemarkllc.ru/primenenie-hpl/hpl-dlya-stroitelstva/hpl-paneli-dlya-vnutrennej-otdelki/`
- `https://lemarkllc.ru/primenenie-hpl/hpl-dlya-stroitelstva/fasadnye-hpl-paneli-dlya-naruzhnoj-otdelki/`
- `https://lemarkllc.ru/primenenie-hpl/mebelnyj-plastik-hpl/`
- `https://lemarkllc.ru/primenenie-hpl/hpl-plastik-dlya-transporta/`
- `https://lemarkllc.ru/primenenie-hpl/hpl-plastik-dlya-chistyh-pomeschenij/`
- `https://lemarkllc.ru/primenenie-hpl/czifrovoj-dekor/`
- `https://lemarkllc.ru/primenenie-hpl/hpl-dlya-malyix-arxitekturnyix-form/`
- `https://lemarkllc.ru/poleznaya-informacziya/`
- `https://lemarkllc.ru/poleznaya-informacziya/kak-sformirovat-zakaz/`

### Важное правило фактов

На текущем сайте встречаются значения, которые могут различаться между страницами. Поэтому:

1. Создай `src/content/site-facts.*` или аналогичный единый конфиг.
2. Создай `docs/facts-to-verify.md` с таблицей:
   - факт;
   - значение;
   - URL-источник;
   - где используется;
   - требуется ли подтверждение.
3. Для спорных формулировок используй консервативную версию.

### Допустимый набор фактов для первого рабочего варианта

- HPL производится из слоёв крафт-бумаги, пропитанных термореактивными смолами и спрессованных под высоким давлением и температурой.
- Производство полного цикла на одной площадке.
- Толщина: **0,6–25 мм**.
- Стандартные форматы: **3050×1300, 3050×1315 и 3050×1600 мм**.
- Производственная мощность: **до 500 000 м² в месяц**.
- Средний срок изготовления: **около 10 дней**, типовой ориентир по сайту — **до 14 дней**.
- Более **250 декоров**.
- Используй формулировку **«15 вариантов тиснения»** только через единый конфиг, чтобы значение можно было легко поменять.
- Более **3000 комбинаций поверхности** допустимо использовать как обобщённый показатель, если это подтверждается текущими материалами сайта.
- Минимальный заказ: от одного листа — использовать только после проверки на текущей FAQ/коммерческой странице.

Не используй цифры в JSX напрямую: только через content/facts config.

---

## 4. Целевая аудитория и бизнес-задача

Landing не должен быть рассчитан на частного покупателя «одной столешницы». Основная аудитория B2B:

- производители мебели;
- мебельные фабрики;
- архитекторы и проектировщики;
- строительные и фасадные компании;
- производители сантехнических перегородок;
- компании по оснащению чистых помещений;
- лаборатории и медицинские подрядчики;
- вагоностроительные и транспортные предприятия;
- производители МАФ и детских площадок;
- дизайнеры общественных интерьеров;
- дилеры и переработчики материалов.

### Главные conversion goals

1. Получить расчёт стоимости и сроков.
2. Заказать физические образцы.
3. Скачать/запросить сертификаты.
4. Перейти в каталог декоров.
5. Получить консультацию технолога/менеджера.
6. Отправить ТЗ или файл проекта.

### Основной message

**LEMARK производит HPL полного цикла и помогает подобрать материал под конкретную техническую, архитектурную или производственную задачу.**

---

## 5. Арт-дирекшн

### 5.1. Характер

Нужен визуальный язык:

- industrial editorial;
- cinematic manufacturing;
- tactile materials;
- precise engineering;
- premium, но не люксовая «ювелирка»;
- технологично, но не стерильный SaaS;
- уверенно, масштабно, предметно.

### 5.2. Цвет

Сначала извлеки реальные brand colors из логотипа и текущих assets.

Если точная палитра не найдена, используй временную fallback-палитру:

- Graphite: `#090A0A`;
- Carbon: `#111313`;
- Porcelain: `#F2F0EA`;
- Warm white: `#FAF9F6`;
- Steel: `#9EA5A8`;
- Soft line: `rgba(255,255,255,.14)`;
- Accent: только цвет, извлечённый из логотипа; не придумывай кислотный цвет без основания.

Сайт может чередовать тёмные кинематографические секции и светлые редакционные блоки.

### 5.3. Типографика

Используй шрифты с полноценной кириллицей.

Рекомендуемый fallback:

- Body/UI: `Manrope` или текущий корпоративный grotesk;
- Display/accent: `Cormorant Garamond` italic либо другой кириллический editorial serif;
- Technical labels/numbers: тот же grotesk, uppercase, tracking.

Не делай весь сайт курсивным. Serif используется только в крупных акцентных словах, цифрах и коротких фразах.

### 5.4. Layout

- desktop grid: 12 колонок;
- max content width: 1440–1520 px;
- крупные поля;
- асимметричная editorial-композиция;
- местами full-bleed media;
- карточки не должны выглядеть одинаковой сеткой на всех секциях;
- радиусы умеренные: 16–28 px, а не pill для каждого контейнера;
- glassmorphism только поверх видео и только там, где он улучшает читаемость.

### 5.5. Liquid glass

Сделай две утилиты:

- `glass-subtle` — навигация, небольшие badges, chapter indicator;
- `glass-strong` — основная CTA-панель и sticky control.

Характер:

- почти прозрачный фон;
- локальный backdrop blur;
- тонкая внутренняя световая кромка;
- без ярких rainbow-gradient;
- текст всегда остаётся контрастным.

Не покрывай стеклом весь сайт.

---

## 6. Информационная архитектура landing

Landing должен быть длинным и содержательно полноценным. Минимальный набор секций ниже обязателен.

---

# SECTION 01 — HEADER

## Desktop

Sticky/fixed header поверх HERO.

Слева:

- логотип LEMARK из репозитория;
- не рисовать логотип текстом, если есть официальный SVG/PNG.

По центру или справа:

- Продукция;
- Декоры;
- Применение;
- Производство;
- О компании;
- Полезная информация;
- Контакты.

CTA:

- `Рассчитать проект`.

Secondary action:

- телефон `+7 495 221-63-36`;
- либо иконка связи с раскрывающейся панелью.

## Mobile

- логотип;
- CTA-иконка/кнопка;
- burger;
- полноэкранное меню;
- видимые телефон и e-mail;
- быстрые кнопки `Рассчитать`, `Образцы`, `Каталог`.

## Поведение

- на верхнем кадре header прозрачный;
- после выхода из HERO получает компактный фон;
- hide on scroll down / show on scroll up допустим, но CTA не должна исчезать надолго;
- активный раздел отмечается ненавязчиво.

---

# SECTION 02 — CINEMATIC SCROLL HERO

## 2.1. Общая механика

Высота scroll-container на desktop: ориентировочно `500vh–650vh`.

Внутри:

- sticky viewport `100svh`;
- full-bleed video/canvas;
- контентные chapter overlays;
- chapter progress;
- основные CTA;
- scroll hint в начале;
- финальный переход в обычный поток страницы.

Видео не должно просто loop-иться. Его время привязано к scroll progress.

### Таймлайн

| Scroll progress | Video scene | Content chapter |
|---|---|---|
| 0–14% | Макро слоёв бумаги, смолы, структуры | Производство HPL полного цикла |
| 14–30% | Декоративный слой, тиснение, свет по поверхности | Декор и фактура |
| 30–46% | Плита превращается в мебель/интерьер | Мебель и интерьеры |
| 46–62% | Архитектурный фасад и городская среда | Строительство и фасады |
| 62–78% | Чистое помещение, лаборатория | Гигиена и химическая стойкость |
| 78–90% | Интерьер транспорта | Транспорт и высокая нагрузка |
| 90–100% | Готовый HPL-лист в hero product shot | Подбор под проект + CTA |

Контент меняется через blur + opacity + небольшой y-shift. Не делай резкие слайды.

## 2.2. Тексты HERO по главам

### Chapter 1

Eyebrow:

`LEMARK / HPL ПОЛНОГО ЦИКЛА`

H1:

`Производим HPL, который работает на ваш проект`

Description:

`От синтеза смол и пропитки бумаги до прессования и контроля готового листа — все ключевые этапы производства находятся на одной площадке.`

Primary CTA:

`Рассчитать проект`

Secondary CTA:

`Смотреть каталог`

Micro facts:

- `0,6–25 мм`;
- `до 500 000 м²/месяц`;
- `средний срок — 10 дней`.

### Chapter 2

Eyebrow:

`ДЕКОР И ТИСНЕНИЕ`

Heading:

`Поверхность задаёт характер материала`

Description:

`Более 250 декоров, выразительные древесные, каменные, однотонные и дизайнерские решения, а также разные варианты тиснения для точного попадания в концепцию.`

CTA:

`Перейти в каталог декоров`

### Chapter 3

Eyebrow:

`МЕБЕЛЬ И ИНТЕРЬЕРЫ`

Heading:

`Тонкие линии. Высокая прочность. Ежедневная эксплуатация.`

Description:

`HPL подходит для мебели, столешниц, шкафчиков, перегородок, стеновых панелей и торгового оборудования — там, где внешний вид должен сохраняться годами.`

CTA:

`HPL для мебели`

### Chapter 4

Eyebrow:

`СТРОИТЕЛЬСТВО И ФАСАДЫ`

Heading:

`Материал для архитектуры без компромиссов`

Description:

`Фасадные и интерьерные панели выдерживают влагу, перепады температуры, ультрафиолет и интенсивные механические нагрузки.`

CTA:

`Решения для строительства`

### Chapter 5

Eyebrow:

`ЧИСТЫЕ ПОМЕЩЕНИЯ`

Heading:

`Поверхность, которую легко поддерживать чистой`

Description:

`Непористая структура, стойкость к регулярной санитарной обработке и специальные лабораторные и биоцидные исполнения для объектов с повышенными требованиями.`

CTA:

`HPL для чистых помещений`

### Chapter 6

Eyebrow:

`ТРАНСПОРТ`

Heading:

`Готов к высокой нагрузке и постоянному движению`

Description:

`HPL применяется в интерьерах железнодорожного, автомобильного и водного транспорта, где важны износостойкость, пожарная безопасность и долговечность.`

CTA:

`HPL для транспорта`

### Chapter 7

Eyebrow:

`ВАША ЗАДАЧА — НАШ МАТЕРИАЛ`

Heading:

`Подберём тип, толщину, формат и поверхность HPL`

Description:

`Прикрепите техническое задание, чертёж или спецификацию. Менеджер подготовит расчёт и предложит подходящее решение.`

Primary CTA:

`Получить расчёт`

Secondary CTA:

`Заказать образцы`

## 2.3. Visual controls

- Вертикальный или горизонтальный chapter indicator `01 / 07`.
- Тонкий progress line.
- Подпись `Прокрутите, чтобы пройти путь материала` только на первом экране.
- После первой прокрутки hint исчезает.
- На final chapter появляется компактная glass CTA-panel.

---

# SECTION 03 — QUICK PROOF BAR

Сразу после HERO нужен короткий светлый или тёмный proof strip.

Показатели:

1. `Полный цикл` — все ключевые этапы на одной площадке.
2. `0,6–25 мм` — широкий диапазон толщин.
3. `250+ декоров` — решения для разных задач.
4. `500 000 м²/месяц` — производственная мощность.
5. `Россия и СНГ` — география поставок.

Сделай его не как пять одинаковых карточек, а как крупную типографическую ленту с разделителями.

---

# SECTION 04 — РЕШЕНИЯ ПО НАПРАВЛЕНИЯМ

Заголовок:

`Один материал. Разные отрасли.`

Подзаголовок:

`Подбираем исполнение HPL под требования конкретного объекта: от визуальной задачи до пожарной, химической и климатической стойкости.`

Нужно 6 направлений.

## 1. Мебельное производство

Text:

`Фасады, столешницы, шкафчики, торговое оборудование, сантехнические перегородки и другие изделия с высокой ежедневной нагрузкой.`

Tags:

`износостойкость` · `влагостойкость` · `декоративность`

Link:

`/primenenie-hpl/mebelnyj-plastik-hpl/`

## 2. Строительство и интерьеры

Text:

`Стеновые панели, облицовка общественных пространств, коридоров, холлов, образовательных и коммерческих объектов.`

Tags:

`монтаж` · `ударопрочность` · `лёгкий уход`

Link:

`/primenenie-hpl/hpl-dlya-stroitelstva/`

## 3. Фасады

Text:

`Навесные фасадные системы и наружные элементы, рассчитанные на перепады температуры, влагу и ультрафиолет.`

Tags:

`климатическая стойкость` · `UV` · `архитектура`

Link:

`/primenenie-hpl/hpl-dlya-stroitelstva/fasadnye-hpl-paneli-dlya-naruzhnoj-otdelki/`

## 4. Чистые помещения

Text:

`Медицинские, лабораторные и санитарные пространства, где важны гигиеничность, непористая поверхность и стойкость к обработке.`

Tags:

`биоцидный` · `лабораторный` · `гигиена`

Link:

`/primenenie-hpl/hpl-plastik-dlya-chistyh-pomeschenij/`

## 5. Транспорт

Text:

`Внутренняя отделка вагонов, автобусов, судов и спецтехники — для объектов с постоянным пассажирским потоком.`

Tags:

`FR` · `износостойкость` · `малый уход`

Link:

`/primenenie-hpl/hpl-plastik-dlya-transporta/`

## 6. МАФ и городская среда

Text:

`Уличная мебель, игровые элементы и архитектурные конструкции, которые должны сохранять внешний вид в сложных погодных условиях.`

Tags:

`−50…+60 °C` · `вандалостойкость` · `цвет`

Link:

`/primenenie-hpl/hpl-dlya-malyix-arxitekturnyix-form/`

### Layout

- desktop: асимметричная mosaic/grid;
- одна большая карточка + несколько средних;
- media внутри карточек должны быть разными по композиции;
- hover: медленный camera push / parallax, без 3D-карусели;
- mobile: вертикальный список с качественными изображениями и сохранёнными CTA.

---

# SECTION 05 — ЧТО ТАКОЕ HPL / СТРОЕНИЕ МАТЕРИАЛА

Заголовок:

`Слоистая структура. Монолитный результат.`

Intro:

`HPL — декоративный бумажно-слоистый пластик высокого давления. Слои бумаги пропитываются термореактивными смолами и соединяются под воздействием высокой температуры и давления.`

Нужна интерактивная exploded-view схема листа.

Слои:

1. **Оверлей**
   - `Защитная меламиновая плёнка принимает основную нагрузку и помогает сохранять внешний вид поверхности.`
2. **Декоративный слой**
   - `Определяет цвет, рисунок и визуальный характер HPL.`
3. **Андерлей**
   - `Поддерживает точную цветопередачу и отделяет декоративный слой от основы.`
4. **Основной слой**
   - `Крафт-бумага, пропитанная смолами. Количество слоёв формирует толщину и прочность материала.`

Interaction:

- при скролле или hover слои немного расходятся;
- активный слой подсвечивается;
- текст меняется без прыжка layout;
- на mobile — вертикальная схема с tap-аккордеоном;
- не использовать тяжёлую WebGL-сцену, если CSS/Canvas решает задачу быстрее.

---

# SECTION 06 — ВИДЫ HPL

Заголовок:

`Исполнение под конкретные требования`

Нужны 7 product types.

## Standard ST

`Тонкий облицовочный HPL для ровных поверхностей, мебельных плит, стеновых панелей и интерьерных элементов.`

## Compact

`Самонесущий материал для столешниц, перегородок, мебели, кабин и конструкций, где важны жёсткость и открытый торец.`

## Postforming PF

`Тонкий HPL для облицовки поверхностей с плавным радиусом и создания цельной кромки.`

## Flame-retardant FR

`Трудногорючее исполнение для объектов с повышенными требованиями к пожарной безопасности.`

## Facade EG

`Наружное исполнение для фасадов и архитектурных элементов, рассчитанное на климатическую нагрузку и ультрафиолет.`

## Laboratory LG

`Поверхность с повышенной стойкостью к химическим веществам и растворителям для лабораторий и специальных помещений.`

## Biocidal CR

`Исполнение для медицинских, санитарных и чистых помещений с повышенными требованиями к гигиене.`

### UI

- На desktop: horizontal pinning или large tabbed showcase.
- На смене типа меняется product visual и набор свойств.
- Не прятать весь контент за hover.
- Обязательно добавить CTA `Помочь с выбором исполнения`.

---

# SECTION 07 — СВОЙСТВА И ПРЕИМУЩЕСТВА

Заголовок:

`Рассчитан на интенсивную эксплуатацию`

Преимущества:

1. **Высокая износостойкость**
   - `Поверхность сохраняет внешний вид при постоянной механической нагрузке.`
2. **Влагостойкость**
   - `Непористая структура не впитывает воду и подходит для влажных зон.`
3. **Прочность**
   - `Материал устойчив к ударам, царапинам и сколам в реальных условиях эксплуатации.`
4. **Простой уход**
   - `Поверхность легко очищается и не требует сложного обслуживания.`
5. **Стойкость к химии**
   - `Специальные исполнения подходят для регулярной санитарной и лабораторной обработки.`
6. **Климатическая устойчивость**
   - `Фасадные решения рассчитаны на перепады температуры, влагу и солнечное излучение.`
7. **Долговечный декор**
   - `Цвет, рисунок и фактура помогают создавать выразительные решения без отказа от практичности.`

### Visual idea

Используй серию macro experiments:

- капли воды;
- направленный свет по тиснению;
- контролируемый удар/нагрузка без разрушения;
- санитарная очистка;
- температурная среда;
- UV/sunlight;
- крупный торец compact.

Это может быть горизонтальная галерея с одной large media stage, а не семь мелких иконок.

---

# SECTION 08 — ДЕКОРЫ И ТИСНЕНИЯ

Заголовок:

`Цвет виден. Фактура ощущается.`

Text:

`Каталог Lemark объединяет однотонные, древесные, каменные, фантазийные и металлизированные декоры. Тиснение добавляет поверхности глубину и помогает точнее передать характер натурального материала.`

Категории:

- Однотонные;
- Древесные;
- Каменные;
- Фантазийные;
- Металлизированные.

CTA:

- `Открыть каталог`;
- `Заказать образцы`;
- `Посмотреть тиснения`.

### Реализация

- Если в репозитории/на сайте доступны реальные изображения декоров — используй их приоритетно.
- Не генерируй вымышленные артикулы.
- Собери 8–12 реальных swatches.
- Декор должен выглядеть как физический образец с масштабом, бликом и тиснением, а не как плоский CSS background.
- На hover/tap показывай название и артикул, если данные достоверны.
- Добавь фильтрацию только если она реально работает.

---

# SECTION 09 — ЦИФРОВОЙ ДЕКОР

Заголовок:

`Свой рисунок — на поверхности HPL`

Text:

`Цифровой декор позволяет перенести фирменную графику, навигацию, паттерн, фотографию или авторский рисунок на поверхность долговечного HPL-пластика.`

Use cases:

- брендирование интерьера;
- навигация;
- детские и образовательные пространства;
- транспорт;
- торговые и общественные объекты;
- индивидуальные архитектурные решения.

CTA:

- `Узнать требования к макету`;
- `Обсудить цифровой декор`.

Visual:

- split-screen before/after;
- белая HPL-панель превращается в фирменный рисунок;
- без псевдо-типографики AI внутри изображения;
- весь реальный текст накладывай HTML-слоем.

---

# SECTION 10 — ПОЛНЫЙ ЦИКЛ ПРОИЗВОДСТВА

Заголовок:

`Контроль качества начинается до прессования`

Intro:

`Полный цикл позволяет контролировать сырьё, рецептуру, пропитку, сборку, прессование и финальную обработку на одной производственной площадке.`

Этапы:

1. **Приёмка сырья**
   - `Проверяем материалы до запуска в производство.`
2. **Синтез смол**
   - `Производим смолы на автоматизированном оборудовании и контролируем рецептуру.`
3. **Импрегнация**
   - `Пропитываем декоративную и крафт-бумагу подготовленными смолами.`
4. **Сборка пакетов**
   - `Формируем последовательность слоёв под нужный тип и толщину HPL.`
5. **Прессование**
   - `Высокая температура и давление превращают пакет в плотный монолитный материал.`
6. **Финишная обработка**
   - `Обрезаем формат, обрабатываем поверхность и при необходимости наносим защитную плёнку.`
7. **Упаковка и хранение**
   - `Готовим продукцию к безопасной отгрузке и хранению.`

### Motion

- desktop: sticky horizontal process line или вертикальная cinematic timeline;
- media меняется по этапам;
- каждый этап должен иметь реальный или сгенерированный industrial visual;
- избегай fake machinery с нелогичной геометрией;
- если есть реальные фото завода, используй их как references для Higgsfield, а не заменяй завод вымышленным объектом.

---

# SECTION 11 — О КОМПАНИИ / ЦИФРЫ

Заголовок:

`Производственная база для проектов любого масштаба`

Copy:

`LEMARK — российский производитель декоративных бумажно-слоистых пластиков. Производство полного цикла помогает сохранять предсказуемость характеристик, сроков и коммерческих условий.`

Stats:

- `до 500 000 м²` — производственная мощность в месяц;
- `0,6–25 мм` — диапазон толщин;
- `250+` — декоров;
- `10 дней` — средний срок изготовления;
- `Россия и СНГ` — география поставок.

CTA:

`Подробнее о производстве`

Важно: все цифры брать из `site-facts`.

---

# SECTION 12 — ПОЧЕМУ ВЫБИРАЮТ LEMARK

Сохрани смысл семи причин с текущего сайта, но подай компактнее.

1. Лидер отрасли и надёжный партнёр.
2. Собственное производство полного цикла.
3. Поставки по России и в другие страны.
4. Большой выбор декоров и поверхностей.
5. Сертифицированная продукция.
6. Гибкие коммерческие условия.
7. Предсказуемые сроки производства.

Layout:

- не семь одинаковых icon cards;
- использовать editorial number system `01–07`;
- одна причина раскрывается крупно, остальные служат навигацией;
- media stage меняется при скролле или click;
- на mobile — accordion с видимыми заголовками.

---

# SECTION 13 — ПРОЕКТЫ / ДОВЕРИЕ

Заголовок:

`Материал, который становится частью объекта`

### Если в текущем проекте есть реальные кейсы

Покажи 3–6 кейсов:

- название объекта;
- отрасль;
- применённое решение;
- декор/тип HPL, если данные достоверны;
- 2–4 фотографии;
- ссылка на кейс.

### Если кейсы неструктурированы

- Не выдумывай объекты.
- Используй блок `Сферы применения` с реальными фотографиями.
- Логотипы клиентов показывай только из существующих assets.
- Не подписывай неизвестный логотип предположительным названием.

CTA:

`Посмотреть проекты`

---

# SECTION 14 — FAQ

Используй accordion с доступной клавиатурной навигацией.

## Что такое HPL?

`HPL — декоративный бумажно-слоистый пластик высокого давления. Материал получают из слоёв бумаги, пропитанных смолами и спрессованных при высокой температуре и давлении.`

## Чем Compact отличается от тонкого HPL?

`Compact — самонесущий материал большей толщины, который может использоваться без плитной основы. Тонкий HPL обычно применяется как облицовочный слой.`

## Какие толщины доступны?

`Производственные возможности позволяют выпускать HPL толщиной от 0,6 до 25 мм. Конкретный вариант подбирается по назначению изделия.`

## Можно ли использовать HPL на фасаде?

`Для наружного применения используется фасадное исполнение, рассчитанное на влагу, ультрафиолет и перепады температуры.`

## Есть ли трудногорючий HPL?

`Да. Для объектов с повышенными требованиями к пожарной безопасности предусмотрено трудногорючее исполнение. Применение необходимо сверять с проектными требованиями и сертификатами.`

## Можно заказать свой рисунок?

`Да. Цифровой декор позволяет перенести индивидуальное изображение или фирменную графику на поверхность HPL при соблюдении технических требований к макету.`

## Как получить расчёт?

`Отправьте параметры, объём и при наличии прикрепите техническое задание. Менеджер уточнит детали и подготовит предложение.`

## Можно получить образцы?

`Да. Выберите интересующие декоры или опишите задачу — менеджер поможет сформировать набор образцов.`

---

# SECTION 15 — LEAD FORM / FINAL CTA

Заголовок:

`Расскажите о задаче — подберём HPL под проект`

Text:

`Укажите назначение, объём, толщину и желаемую поверхность. Можно приложить спецификацию, чертёж или техническое задание.`

Fields:

- Имя;
- Компания;
- Телефон;
- E-mail;
- Направление проекта;
- Ориентировочный объём;
- Комментарий;
- File upload;
- Consent checkbox;
- optional checkbox `Нужны физические образцы`.

Submit:

`Получить расчёт`

Secondary contacts:

- `+7 495 221-63-36`;
- `sales@lemarkllc.ru`;
- `пн–пт 09:00–18:00`;
- `141503, Московская область, г. Солнечногорск, Бутырский тупик, вл. 4, стр. 1`.

### Form behavior

- Найди и переиспользуй существующий endpoint/FetchIt/MODX processor/API.
- Если backend отсутствует, создай адаптер с env `LEAD_WEBHOOK_URL` и `LEAD_EMAIL_TO`.
- Не показывай успешную отправку, если запрос реально не прошёл.
- Добавь серверную и клиентскую валидацию.
- Добавь honeypot и rate limit, если стек позволяет.
- File upload должен иметь ограничения формата и размера.
- Все ошибки должны быть понятны пользователю.

---

# SECTION 16 — FOOTER

Состав:

- логотип;
- краткая формулировка `Производитель HPL-пластика полного цикла`;
- основные разделы;
- направления применения;
- полезная информация;
- контакты;
- социальные сети только реальные;
- политика конфиденциальности;
- реквизиты/копирайт;
- ссылка на карту;
- быстрый CTA `Рассчитать проект`.

Не оставлять шаблонный `© 2024` и битые placeholder links.

---

## 7. Техническая спецификация Scroll Video HERO

### 7.1. Основной принцип

Создай компонент уровня `ScrollVideoHero` / `ScrollVideoController`.

Video element:

- `muted`;
- `playsInline`;
- `preload="auto"` или стратегически `metadata` + preload after idle;
- без controls;
- без loop;
- audio track удалить на этапе кодирования;
- poster обязателен;
- desktop и mobile sources;
- MP4 H.264 обязательно;
- WebM желательно.

### 7.2. Scroll mapping

- Получай normalized progress `0..1` через ScrollTrigger либо эквивалент текущего стека.
- `targetTime = progress * duration`.
- Не присваивай `currentTime` на каждое микродвижение без сглаживания.
- Используй один `requestAnimationFrame` loop.
- Сглаживай текущее время к targetTime через lerp примерно `0.08–0.16`.
- Обновляй `video.currentTime`, если delta больше примерно `1/30 sec`.
- Clamp progress и time.
- При резком перемещении scrollbar разрешён быстрый catch-up.
- При reverse scroll видео должно идти назад.
- Не использовать CSS transition для времени видео.

Пример логики, адаптируй к проекту:

```ts
const state = {
  targetTime: 0,
  renderedTime: 0,
  duration: 0,
  rafId: 0,
};

function tick() {
  state.renderedTime += (state.targetTime - state.renderedTime) * 0.12;

  if (Math.abs(video.currentTime - state.renderedTime) > 1 / 30) {
    video.currentTime = clamp(state.renderedTime, 0, state.duration - 0.04);
  }

  state.rafId = requestAnimationFrame(tick);
}
```

### 7.3. Content chapters

- Chapters должны определяться массивом данных, а не hardcoded if-chain.
- У каждого chapter:
  - `id`;
  - `start`;
  - `end`;
  - `eyebrow`;
  - `title`;
  - `body`;
  - `primaryCta`;
  - `secondaryCta`;
  - `alignment`;
  - `theme`;
  - `focalPoint`.
- Активный chapter вычислять по progress.
- Смена контента: AnimatePresence/Framer Motion.
- Initial/exit:
  - opacity 0;
  - blur 8–12 px;
  - y 18–28 px;
- Enter:
  - opacity 1;
  - blur 0;
  - y 0;
- Duration: 0.45–0.7 sec.
- Уважать reduced motion.

### 7.4. Загрузка и readiness

- До `loadedmetadata` показывать poster + preloader без скачущего layout.
- После загрузки первого кадра мягко скрыть poster.
- Не блокировать всю страницу, если видео не загрузилось.
- На `error` показывать poster и обычные chapter transitions по scroll.
- Сохранять читаемость контента независимо от видео.

### 7.5. iOS/mobile

- Добавить muted playsInline priming: после первого user interaction кратко `play()` и сразу `pause()`, если это нужно браузеру.
- Если smooth seeking нестабилен:
  1. использовать mobile-версию меньшего разрешения;
  2. увеличить частоту keyframes;
  3. fallback на короткие chapter loops;
  4. крайний fallback — poster sequence / image sequence.
- Не загружать desktop 1920/4K master на телефон.
- На mobile scroll-container может быть короче: `350–450vh`.

### 7.6. Reduced motion

При `prefers-reduced-motion: reduce`:

- не scrub-ить видео;
- использовать статичный poster;
- показывать главы обычными контентными блоками;
- убрать parallax и blur-heavy transitions;
- сохранить все CTA и тексты.

---

## 8. Higgsfield CLI / MCP: обязательный production workflow

### 8.1. Discovery

Синтаксис CLI может меняться. Поэтому сначала:

1. Найди установленный бинарник/интеграцию.
2. Выполни только реально поддерживаемые команды помощи, например:
   - `higgsfield --help`;
   - `higgsfield help`;
   - список доступных MCP tools;
   - список моделей;
   - список истории generation.
3. Не выдумывай флаги и названия моделей.
4. Сохрани результат discovery в `docs/higgsfield-discovery.md`.
5. Если доступ идёт через MCP, используй tool schemas как source of truth.

### 8.2. Бюджет генераций

Работай экономно:

- сначала low/medium-res concept frames;
- максимум 2–3 варианта ключевого кадра;
- выбери визуальную систему;
- только после этого делай final image/video generations;
- не запускай десятки почти одинаковых video generations.

Рекомендуемый лимит первого прохода:

- 12–20 concept images;
- 8–12 selected stills;
- 7–10 video clips;
- 1 desktop master;
- 1 mobile master;
- 1–2 poster variants.

Если лимит/credits видны в интерфейсе, зафиксируй расход в `docs/media-generation-log.md`.

### 8.3. Структура assets

Создай:

```text
public/media/lemark/
  raw/
    images/
    videos/
  selected/
    images/
    videos/
  processed/
    desktop/
    mobile/
    posters/
    thumbnails/
  manifests/
    generations.json
    assets.json
```

Никогда не перезаписывай raw output.

### 8.4. Manifest

Для каждого asset сохраняй:

- `id`;
- `purpose`;
- `scene`;
- `prompt`;
- `negativePrompt`;
- `model`;
- `generationId`;
- `sourceFile`;
- `selectedFile`;
- `processedFiles`;
- `aspectRatio`;
- `duration`;
- `resolution`;
- `status`;
- `notes`;
- `createdAt`.

### 8.5. Visual bible для всех генераций

Во всех prompts сохраняй единый набор признаков:

- российское современное промышленное производство;
- премиальная документальная съёмка;
- graphite + warm neutral palette;
- физически правдоподобный HPL;
- честный масштаб оборудования и листов;
- controlled cinematic lighting;
- высокая детализация поверхности;
- камера движется плавно и осмысленно;
- минимальное количество людей;
- люди не являются главным объектом;
- PPE у сотрудников, если они в производственной зоне;
- без текста и логотипов внутри AI generation;
- без фантастических машин;
- без cyberpunk/neon sci-fi;
- без дешёвого «глянцевого пластика»;
- без ломанных панелей, лишних рук и искажённой архитектуры;
- единый color grade во всех сценах.

---

## 9. Storyboard HERO-video

Итоговый master: ориентировочно 26–34 секунды без звука.

Цель — не линейный рекламный ролик, а монтаж, хорошо читающийся при покадровом скраббинге вперёд и назад.

### Общие требования к clip motion

- slow dolly;
- macro push-in;
- lateral tracking;
- controlled orbit до 15–25 градусов;
- без резкой ручной камеры;
- без fast cuts внутри clips;
- без motion blur, который разрушает кадр при pause;
- первый и последний кадр каждой сцены должны быть usable stills;
- по возможности использовать first/last frame references для continuity.

---

### SCENE 01 — RAW LAYERS / 0–4 sec

Purpose:

Показать слои бумаги и рождение материала.

Image prompt:

```text
Ultra-detailed cinematic macro product film frame of layered kraft paper sheets used for high-pressure laminate manufacturing, precise stacked edges, subtle resin sheen between layers, warm graphite industrial background, controlled side light revealing fiber structure, premium documentary industrial photography, realistic material scale, 100mm macro lens, shallow but readable depth of field, physically accurate, no text, no logo, no people, 16:9
```

Video direction:

```text
Very slow macro dolly forward along the edge of layered kraft paper. Thin highlights travel across the resin-coated fibers. The stack remains geometrically stable. No sudden movement, no cutting, no text, no logo. End on a closer view that can transition into the decorative surface layer.
```

Negative:

```text
cartoon, sci-fi laboratory, neon cyberpunk, melted paper, liquid flooding, warped layers, impossible geometry, typography, logo, hands, faces, flicker, fast motion
```

---

### SCENE 02 — DECOR + EMBOSSING / 4–8 sec

Purpose:

Переход от структуры к визуальной поверхности.

Image prompt:

```text
Cinematic macro of a premium HPL laminate surface transitioning from raw decorative paper into a finished embossed panel, tactile wood-inspired texture, controlled raking light revealing micro-relief, graphite and warm neutral palette, photorealistic industrial material photography, clean composition, realistic laminate thickness, no text, no logo, 16:9
```

Video direction:

```text
The camera glides laterally over the HPL surface while raking light reveals the embossing. The visual smoothly evolves from printed decorative paper to a finished durable laminate surface. Keep the plane stable and physically believable. End with the camera nearly parallel to the surface for a match transition.
```

---

### SCENE 03 — PRESS / 8–12 sec

Purpose:

Показать промышленный масштаб и прессование.

Reference rule:

Если в репозитории есть реальные фотографии пресса Lemark — обязательно использовать их как image references.

Image prompt:

```text
Modern high-pressure laminate factory press, large industrial hot press with stacked laminate packs entering the machine, clean real manufacturing environment, steel and graphite palette, warm practical lights, premium documentary cinematography, physically accurate machinery, operators only in distant background wearing proper PPE, no branding, no text, 16:9
```

Video direction:

```text
Slow controlled tracking shot beside a large industrial HPL press as a laminate pack moves into position. Hydraulic components move minimally and realistically. Subtle steam or heat haze only if physically plausible. No sparks, no fantasy machinery, no dramatic explosions. End on the closed press surface or a dark geometric frame for transition.
```

---

### SCENE 04 — PRODUCT REVEAL / 12–16 sec

Purpose:

Готовый лист как инженерный продукт.

Image prompt:

```text
Hero product shot of a finished HPL compact laminate sheet standing vertically in a dark architectural studio, perfectly straight panel, visible dense black core edge, one refined neutral decorative face, raking light showing subtle embossing, restrained premium industrial advertising, graphite background, soft floor reflection, no text, no logo, 16:9
```

Video direction:

```text
Slow 20-degree orbit around the finished HPL panel. The light moves across the decorative face and briefly reveals the dense dark core edge. Keep the sheet perfectly flat and proportionally realistic. End with the panel filling the frame to create a surface-match transition.
```

---

### SCENE 05 — FURNITURE / 16–20 sec

Purpose:

Показать HPL в мебели и интерьере.

Image prompt:

```text
Contemporary premium public interior using HPL panels for built-in furniture, locker fronts, wall cladding and a thin compact laminate tabletop, refined Russian-European architecture, realistic construction details, black compact edges visible where appropriate, warm daylight, restrained materials, editorial architecture photography, no people in foreground, no text, no logos, 16:9
```

Video direction:

```text
Smooth lateral camera move through a contemporary interior, passing close to HPL furniture fronts and a thin compact tabletop. Keep geometry straight, doors aligned, realistic seams and black core edges. Light subtly changes across the surfaces. End facing a large vertical panel that fills the frame.
```

---

### SCENE 06 — FACADE + URBAN / 20–24 sec

Purpose:

Показать архитектурное применение.

Image prompt:

```text
Modern public building facade clad in large-format HPL panels, precise ventilated facade joints, sophisticated combination of warm wood decor and deep neutral panels, realistic urban landscaping, overcast cinematic daylight, premium architectural photography, physically accurate panel mounting and scale, no signage, no text, no logos, 16:9
```

Video direction:

```text
Slow upward and lateral architectural camera movement along a modern HPL ventilated facade. Panel joints remain precise and stable. Soft daylight travels across the surface. Transition toward an entrance or dark panel area that can match the next clean-room scene.
```

---

### SCENE 07 — CLEAN ROOM / 24–27 sec

Purpose:

Гигиеничность и специальные исполнения.

Image prompt:

```text
High-end clinical clean room and laboratory interior with seamless HPL wall panels, laboratory worktops and compact laminate cabinetry, realistic hygienic detailing, soft neutral white and graphite palette, controlled bright light, clean but not futuristic, physically accurate architecture, no medical branding, no text, no people in foreground, 16:9
```

Video direction:

```text
Slow stabilized push through a clean laboratory interior. Camera passes HPL wall panels and a chemical-resistant worktop. A soft highlight demonstrates the nonporous surface. No sci-fi holograms, no dramatic blue glow. End on a linear wall-panel rhythm for match cut.
```

---

### SCENE 08 — TRANSPORT / 27–30 sec

Purpose:

Высокая эксплуатационная нагрузка.

Image prompt:

```text
Modern passenger rail interior using durable HPL wall panels, tables and partitions, precise real-world transportation design, subtle warm wood and neutral decor, clean high-traffic environment, cinematic practical lighting, no passengers in foreground, no signage, no text, no logos, photorealistic, 16:9
```

Video direction:

```text
Smooth forward camera movement through a modern passenger train interior. HPL panels, tables and partitions remain geometrically consistent. Subtle exterior light moves through windows. Avoid visible brand marks and unreadable signage. End on a close view of a finished panel.
```

---

### SCENE 09 — FINAL MATERIAL HERO / 30–34 sec

Purpose:

Финальный CTA-кадр.

Image prompt:

```text
Final premium hero composition of several HPL laminate panels arranged as a precise architectural sculpture, a restrained mix of wood, stone, solid color and dark compact-core edges, dramatic but clean studio lighting, graphite space, generous negative space for website text on the left, high-end industrial brand campaign, photorealistic, no text, no logo, 16:9
```

Video direction:

```text
Very slow pull-back revealing a sculptural arrangement of HPL panels. Lighting settles into a stable final frame with clear negative space for HTML copy and CTA. No sudden motion. End on a perfectly still product hero frame suitable as a poster.
```

---

## 10. Additional generated media for site sections

Помимо HERO master, сгенерируй и обработай:

### Application cards

1. Furniture / lockers / tabletop.
2. Interior wall cladding.
3. Ventilated facade.
4. Clean room / laboratory.
5. Passenger transport.
6. Urban furniture / MAF.

### Property macro set

1. Water droplets on HPL.
2. Raking light over embossing.
3. Compact black core edge.
4. Cleaning a nonporous surface.
5. Laboratory worktop.
6. Outdoor facade in cold/wet weather.

### Product types

- clean studio visuals for ST, Compact, PF, FR, EG, LG, CR;
- do not try to encode labels inside the image;
- labels are HTML.

### Posters

- desktop 16:9 or 21:9 depending layout;
- mobile 9:16 with safe negative space for text;
- AVIF/WebP versions;
- JPEG fallback.

---

## 11. Сборка видео через FFmpeg

### 11.1. Проверка

Перед запуском:

- проверить наличие `ffmpeg` и `ffprobe`;
- записать версии в `docs/media-pipeline.md`;
- проверить frame rate, duration, resolution каждого клипа;
- нормализовать все clips до единого FPS и color space.

### 11.2. Монтаж

Собери master из выбранных clips.

Требования:

- 24 fps;
- без аудио;
- единое разрешение;
- единый color grade;
- мягкие переходы 4–10 frames либо match cuts;
- не использовать длинные dissolve, которые превращают кадр в кашу при scrub;
- не использовать текст внутри видео;
- обрезать плохие стартовые/финальные frames;
- при необходимости применить лёгкую стабилизацию и deflicker;
- не делать чрезмерный sharpening.

Сохрани промежуточный mezzanine master, если размер позволяет:

- ProRes 422 LT / HQ или высококачественный DNxHR;
- затем web encodes.

### 11.3. Scrub-friendly encoding

Частые keyframes обязательны.

Пример H.264 desktop-команды, адаптируй после теста размера:

```bash
ffmpeg -i hero-master.mov \
  -vf "scale=1920:-2:flags=lanczos,fps=24,format=yuv420p" \
  -an \
  -c:v libx264 \
  -preset slow \
  -crf 21 \
  -profile:v high \
  -level 4.1 \
  -g 12 \
  -keyint_min 12 \
  -sc_threshold 0 \
  -movflags +faststart \
  hero-desktop.mp4
```

Mobile:

```bash
ffmpeg -i hero-master-mobile.mov \
  -vf "scale=720:-2:flags=lanczos,fps=24,format=yuv420p" \
  -an \
  -c:v libx264 \
  -preset slow \
  -crf 23 \
  -profile:v high \
  -g 12 \
  -keyint_min 12 \
  -sc_threshold 0 \
  -movflags +faststart \
  hero-mobile.mp4
```

WebM optional:

```bash
ffmpeg -i hero-master.mov \
  -vf "scale=1920:-2:flags=lanczos,fps=24" \
  -an \
  -c:v libvpx-vp9 \
  -crf 34 \
  -b:v 0 \
  -g 12 \
  -row-mt 1 \
  hero-desktop.webm
```

### 11.4. Size targets

Цель после реального теста качества:

- desktop MP4: желательно 12–24 MB;
- mobile MP4: желательно 5–10 MB;
- poster WebP/AVIF: до 300–500 KB;
- section images: adaptive sizes, без 4K на mobile.

Если master слишком тяжёлый:

- уменьшить duration;
- убрать дублирующиеся кадры;
- снизить resolution до 1600/1440 width;
- скорректировать CRF;
- не снижать keyframe frequency до уровня, который ломает scrub.

### 11.5. Автоматизация

Создай scripts, например:

- `scripts/media/probe.sh`;
- `scripts/media/normalize.sh`;
- `scripts/media/assemble-hero.sh`;
- `scripts/media/encode-web.sh`;
- `scripts/media/extract-posters.sh`;
- `scripts/media/generate-thumbnails.sh`.

Скрипты должны быть идемпотентны и не удалять raw files.

---

## 12. Компонентная архитектура

Адаптируй названия к стеку, но логически раздели:

```text
components/
  Header
  MobileMenu
  ScrollVideoHero
  HeroChapter
  HeroProgress
  ProofBar
  ApplicationMosaic
  HplLayerExplodedView
  ProductTypeShowcase
  PropertyMediaStage
  DecorGallery
  DigitalDecorSection
  ProductionTimeline
  CompanyStats
  ReasonsShowcase
  ProjectsSection
  FaqAccordion
  LeadForm
  Footer
  Modal
  FileUpload
  LazyMedia
  ReducedMotionFallback

content/
  navigation
  heroChapters
  applications
  productTypes
  properties
  productionSteps
  faq
  siteFacts

lib/
  scrollVideo
  media
  analytics
  forms
  validation
```

Правила:

- тексты и URL не размазывать по компонентам;
- данные хранить отдельно;
- TypeScript types обязательны, если проект на TS;
- image/video paths через manifest;
- все интерактивные компоненты keyboard accessible;
- все modal/dialog корректно управляют focus;
- изображения имеют осмысленный alt;
- decorative images получают пустой alt.

---

## 13. Motion system

### Разрешённые эффекты

- blur-in для крупных заголовков;
- opacity + y reveal;
- mask reveal;
- slow media scale 1.00 → 1.04;
- subtle parallax;
- sticky sections;
- number count-up только после входа в viewport;
- chapter crossfade;
- raking-light effect на фактурах;
- cursor-reactive highlight на desktop, если он не мешает.

### Запрещено

- бесконечный floating всех элементов;
- сильные 3D-наклоны карточек;
- spring-bounce на B2B-интерфейсе;
- резкие zoom transitions;
- scroll hijacking;
- отключение native scrollbar;
- тяжёлый canvas/WebGL без необходимости;
- анимация, блокирующая доступ к CTA.

### Performance

- анимировать transform/opacity;
- избегать layout thrashing;
- использовать `will-change` точечно;
- очистить RAF/listeners/ScrollTriggers при unmount;
- lazy initialize тяжёлые секции;
- не запускать animation loop вне viewport.

---

## 14. SEO

Landing должен сохранить коммерческий и поисковый смысл текущего сайта.

### Meta

Title:

`Производитель HPL-пластика полного цикла — Lemark`

Description:

`Производство HPL-пластика толщиной от 0,6 до 25 мм для мебели, фасадов, интерьеров, транспорта и чистых помещений. Более 250 декоров, подбор решения и расчёт проекта.`

### Обязательное

- один H1;
- корректная иерархия H2/H3;
- canonical;
- Open Graph;
- Twitter card;
- favicon и manifest;
- `lang="ru"`;
- Organization schema;
- Product/Offer schema только без выдуманной цены;
- FAQPage schema по реально видимому FAQ;
- LocalBusiness/Organization address and contacts;
- sitemap/robots не ломать;
- внутренние ссылки на существующие SEO-страницы;
- не скрывать SEO-текст огромной простынёй внизу;
- не дублировать текущий устаревший SEO-текст дословно.

### Structured data

Используй факты из единого config. Не добавляй:

- фальшивый рейтинг;
- отзывы без источника;
- фиктивные цены;
- логотипы клиентов как endorsements без подтверждения.

---

## 15. Analytics и события

Сохрани текущую аналитику, если она уже подключена.

Добавь dataLayer/events для:

- `hero_calculate_click`;
- `hero_catalog_click`;
- `hero_samples_click`;
- `application_open`;
- `decor_catalog_click`;
- `sample_request_open`;
- `certificate_request_open`;
- `lead_form_start`;
- `lead_file_attached`;
- `lead_submit_success`;
- `lead_submit_error`;
- `phone_click`;
- `email_click`.

Не отправлять персональные данные в analytics payload.

---

## 16. Accessibility

Минимум WCAG 2.1 AA по ключевым сценариям.

- контраст текста поверх каждого video frame проверять;
- добавить локальные gradient scrims только там, где это необходимо;
- focus-visible;
- skip link;
- keyboard navigation;
- aria-expanded для accordions/menu;
- focus trap в modal;
- ESC закрывает modal;
- form errors связаны через `aria-describedby`;
- touch targets минимум 44×44;
- reduced motion fallback;
- video декоративное и не должно требовать captions, так как без звука и смысл продублирован текстом;
- не блокировать zoom на mobile.

---

## 17. Performance budget

Цель для production preview:

- LCP desktop < 2.5–3.0 s при нормальной сети;
- CLS < 0.1;
- INP < 200 ms;
- Lighthouse Performance ориентир 80+ для media-heavy landing;
- Accessibility 95+;
- SEO 95+;
- Best Practices 90+.

### Практические меры

- poster загружается раньше видео;
- preload только критического source;
- desktop video не скачивается на mobile;
- section media lazy-loaded;
- AVIF/WebP;
- font subsets и `font-display: swap`;
- defer non-critical scripts;
- критический CSS не раздут;
- формы и modal не грузят тяжёлые библиотеки до необходимости;
- не использовать 4K видео на web просто потому, что source 4K.

---

## 18. Responsive behavior

Проверить минимум:

- 360×800;
- 390×844;
- 430×932;
- 768×1024;
- 1024×768;
- 1280×800;
- 1440×900;
- 1920×1080.

### Mobile principles

- HERO text не перекрывает ключевые объекты;
- отдельный mobile crop/video;
- headings не имеют одиночных висячих слов;
- CTA доступны большим пальцем;
- mosaic превращается в последовательные media cards;
- horizontal scroll используется только там, где очевиден и доступен;
- липкие секции не создают trapped scroll;
- file upload работает с mobile browser.

---

## 19. QA и тестирование

### 19.1. Functional

Проверить:

- все nav links;
- CTA;
- modal open/close;
- form validation;
- file attach/remove;
- submit success/error;
- телефон и e-mail;
- accordions;
- chapter change;
- video scrub forward/reverse;
- fallback при video error;
- reduced motion;
- mobile menu;
- anchors;
- no console errors.

### 19.2. Visual

Сделай Playwright screenshots на ключевых viewport.

Проверь:

- первый HERO frame;
- 3–4 промежуточных chapter states;
- final HERO frame;
- application mosaic;
- HPL layers;
- product types;
- production timeline;
- form;
- mobile menu.

Сохрани screenshots в `artifacts/screenshots/`.

### 19.3. Build

Обязательно прогнать доступные команды:

- install;
- lint;
- typecheck;
- unit tests;
- production build;
- Playwright smoke;
- Lighthouse, если доступен.

Исправить ошибки, а не только перечислить их.

### 19.4. Media QA

Через `ffprobe` проверить:

- codec;
- pix_fmt;
- duration;
- fps;
- resolution;
- audio absence;
- faststart;
- keyframe interval.

Проверить, что видео:

- не мигает при смене frame;
- seek работает назад;
- не показывает black frame в начале;
- poster соответствует первому кадру;
- не скачивает desktop source на mobile.

---

## 20. Definition of Done

Работа считается завершённой только если:

- [ ] Landing полностью собран в репозитории.
- [ ] Содержит все основные секции из ТЗ.
- [ ] Нет lorem ipsum и placeholder copy.
- [ ] HERO действительно scrub-ится по scroll.
- [ ] Контент HERO меняется по 7 главам.
- [ ] Есть desktop/mobile video sources или корректный documented fallback.
- [ ] Медиа созданы через Higgsfield либо подготовлен полностью воспроизводимый generation package.
- [ ] Есть storyboard, visual bible, prompt log и manifest.
- [ ] Видео собрано и оптимизировано через FFmpeg.
- [ ] Есть poster/fallback.
- [ ] Формы работают с реальным endpoint либо честно показывают отсутствие backend.
- [ ] Существующие ссылки и SEO routes не сломаны.
- [ ] Build проходит.
- [ ] Линтер и typecheck проходят.
- [ ] Основные viewport проверены скриншотами.
- [ ] Нет критических console errors.
- [ ] Reduced motion поддерживается.
- [ ] README содержит запуск, env, media pipeline и known limitations.

---

## 21. Финальный отчёт Codex

После выполнения выдай краткий, но конкретный отчёт:

1. Что было найдено в исходном проекте.
2. Какой стек использован и почему.
3. Какие страницы/файлы изменены.
4. Какие изображения и видео сгенерированы.
5. Какие Higgsfield models/tools фактически использованы.
6. Как собран HERO-video.
7. Размеры desktop/mobile assets.
8. Как работает форма.
9. Результат build/lint/typecheck/tests.
10. Где лежат screenshots.
11. Какие факты требуют финального подтверждения маркетингом.
12. Какие env variables нужно добавить перед production.

Не пиши «готово», если не проверил production build.

---

## 22. Критерий качества дизайна

Перед завершением ответь себе на вопросы:

- Понятно ли за первые 5 секунд, что Lemark производит HPL?
- HERO рассказывает историю материала или просто показывает красивый абстрактный ролик?
- Показаны ли реальные отрасли применения?
- Видна ли фактура и физика HPL?
- Есть ли достаточная коммерческая информация для B2B-клиента?
- CTA повторяются в логичных местах, но не превращают страницу в рекламный баннер?
- Видео не мешает читать?
- Страница остаётся полезной без видео?
- Все заявления проверяемы?
- Landing выглядит как сайт производителя, а не генеративного дизайн-агентства?

Если хотя бы на два вопроса ответ «нет» — доработай до финального отчёта.
