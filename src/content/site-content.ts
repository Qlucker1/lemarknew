import { siteFacts } from "./site-facts";

const site = siteFacts.siteUrl;

export const navigation = [
  { label: "Продукция", href: `${site}/produkcziya/` },
  { label: "Декоры", href: `${site}/katalog-dekorov-hpl/` },
  { label: "Применение", href: "#applications" },
  { label: "Производство", href: "#production" },
  { label: "О компании", href: `${site}/o-kompanii/` },
  { label: "Полезная информация", href: `${site}/poleznaya-informacziya/` },
  { label: "Контакты", href: "#contact" },
] as const;

export type HeroChapter = {
  id: string;
  start: number;
  end: number;
  eyebrow: string;
  title: string;
  body: string;
  primaryCta: { label: string; href: string; event: string };
  secondaryCta?: { label: string; href: string; event: string };
  alignment: "left" | "right";
  theme: "dark" | "light";
  focalPoint: string;
};

export const heroChapters: HeroChapter[] = [
  {
    id: "full-cycle",
    start: 0,
    end: 0.14,
    eyebrow: "LEMARK / HPL ПОЛНОГО ЦИКЛА",
    title: "Производим HPL, который работает на ваш проект",
    body: "От синтеза смол и пропитки бумаги до прессования и контроля готового листа — все ключевые этапы производства находятся на одной площадке.",
    primaryCta: { label: "Рассчитать проект", href: "#lead-form", event: "hero_calculate_click" },
    secondaryCta: { label: "Смотреть каталог", href: `${site}/katalog-dekorov-hpl/`, event: "hero_catalog_click" },
    alignment: "left",
    theme: "dark",
    focalPoint: "62% 50%",
  },
  {
    id: "decor",
    start: 0.14,
    end: 0.3,
    eyebrow: "ДЕКОР И ТИСНЕНИЕ",
    title: "Поверхность задаёт характер материала",
    body: "Более 250 декоров: древесные, каменные, однотонные и дизайнерские решения — с фактурой, подобранной под задачу проекта.",
    primaryCta: { label: "Перейти в каталог декоров", href: `${site}/katalog-dekorov-hpl/`, event: "hero_catalog_click" },
    alignment: "right",
    theme: "dark",
    focalPoint: "42% 50%",
  },
  {
    id: "furniture",
    start: 0.3,
    end: 0.46,
    eyebrow: "МЕБЕЛЬ И ИНТЕРЬЕРЫ",
    title: "Тонкие линии. Высокая прочность. Ежедневная эксплуатация.",
    body: "HPL подходит для мебели, столешниц, шкафчиков, перегородок, стеновых панелей и торгового оборудования.",
    primaryCta: { label: "HPL для мебели", href: `${site}/primenenie-hpl/mebelnyj-plastik-hpl/`, event: "application_open" },
    alignment: "left",
    theme: "dark",
    focalPoint: "56% 50%",
  },
  {
    id: "facade",
    start: 0.46,
    end: 0.62,
    eyebrow: "СТРОИТЕЛЬСТВО И ФАСАДЫ",
    title: "Материал для архитектуры без компромиссов",
    body: "Фасадные и интерьерные панели рассчитаны на влагу, перепады температуры, ультрафиолет и интенсивные механические нагрузки.",
    primaryCta: { label: "Решения для строительства", href: `${site}/primenenie-hpl/hpl-dlya-stroitelstva/`, event: "application_open" },
    alignment: "right",
    theme: "dark",
    focalPoint: "48% 44%",
  },
  {
    id: "clean-room",
    start: 0.62,
    end: 0.78,
    eyebrow: "ЧИСТЫЕ ПОМЕЩЕНИЯ",
    title: "Поверхность, которую легко поддерживать чистой",
    body: "Непористая структура и специальные лабораторные и биоцидные исполнения помогают решать задачи объектов с повышенными санитарными требованиями.",
    primaryCta: { label: "HPL для чистых помещений", href: `${site}/primenenie-hpl/hpl-plastik-dlya-chistyh-pomeschenij/`, event: "application_open" },
    alignment: "left",
    theme: "light",
    focalPoint: "58% 50%",
  },
  {
    id: "transport",
    start: 0.78,
    end: 0.9,
    eyebrow: "ТРАНСПОРТ",
    title: "Готов к высокой нагрузке и постоянному движению",
    body: "HPL применяется в интерьерах железнодорожного, автомобильного и водного транспорта, где важны износостойкость и долговечность.",
    primaryCta: { label: "HPL для транспорта", href: `${site}/primenenie-hpl/hpl-plastik-dlya-transporta/`, event: "application_open" },
    alignment: "right",
    theme: "dark",
    focalPoint: "50% 50%",
  },
  {
    id: "project",
    start: 0.9,
    end: 1,
    eyebrow: "ВАША ЗАДАЧА — НАШ МАТЕРИАЛ",
    title: "Подберём тип, толщину, формат и поверхность HPL",
    body: "Прикрепите техническое задание, чертёж или спецификацию. Менеджер подготовит расчёт и предложит подходящее решение.",
    primaryCta: { label: "Получить расчёт", href: "#lead-form", event: "hero_calculate_click" },
    secondaryCta: { label: "Заказать образцы", href: "#lead-form", event: "hero_samples_click" },
    alignment: "left",
    theme: "dark",
    focalPoint: "72% 50%",
  },
];

export const applications = [
  { title: "Мебельное производство", body: "Фасады, столешницы, шкафчики, торговое оборудование и сантехнические перегородки.", tags: ["износостойкость", "влагостойкость", "декоративность"], href: `${site}/primenenie-hpl/mebelnyj-plastik-hpl/`, image: "/media/lemark/processed/thumbnails/scene-05-furniture.webp" },
  { title: "Строительство и интерьеры", body: "Стеновые панели и облицовка общественных, образовательных и коммерческих пространств.", tags: ["монтаж", "ударопрочность", "лёгкий уход"], href: `${site}/primenenie-hpl/hpl-dlya-stroitelstva/`, image: "/media/lemark/processed/thumbnails/scene-04-product.webp" },
  { title: "Фасады", body: "Навесные фасадные системы и наружные элементы, рассчитанные на климатическую нагрузку.", tags: ["климатическая стойкость", "UV", "архитектура"], href: `${site}/primenenie-hpl/hpl-dlya-stroitelstva/fasadnye-hpl-paneli-dlya-naruzhnoj-otdelki/`, image: "/media/lemark/processed/thumbnails/scene-06-facade.webp" },
  { title: "Чистые помещения", body: "Медицинские, лабораторные и санитарные пространства с повышенными требованиями к обработке.", tags: ["биоцидный", "лабораторный", "гигиена"], href: `${site}/primenenie-hpl/hpl-plastik-dlya-chistyh-pomeschenij/`, image: "/media/lemark/processed/thumbnails/scene-07-clean-room.webp" },
  { title: "Транспорт", body: "Внутренняя отделка вагонов, автобусов, судов и спецтехники для интенсивного пассажирского потока.", tags: ["FR", "износостойкость", "малый уход"], href: `${site}/primenenie-hpl/hpl-plastik-dlya-transporta/`, image: "/media/lemark/processed/thumbnails/scene-08-transport.webp" },
  { title: "МАФ и городская среда", body: "Уличная мебель, игровые элементы и архитектурные конструкции для сложных погодных условий.", tags: ["вандалостойкость", "цвет", "улица"], href: `${site}/primenenie-hpl/hpl-dlya-malyix-arxitekturnyix-form/`, image: "/media/lemark/processed/thumbnails/scene-06-facade.webp" },
] as const;

export const hplLayers = [
  { title: "Оверлей", body: "Защитная меламиновая плёнка принимает основную нагрузку и помогает сохранять внешний вид поверхности.", className: "layer-overlay" },
  { title: "Декоративный слой", body: "Определяет цвет, рисунок и визуальный характер HPL.", className: "layer-decor" },
  { title: "Андерлей", body: "Поддерживает точную цветопередачу и отделяет декоративный слой от основы.", className: "layer-underlay" },
  { title: "Основной слой", body: "Крафт-бумага, пропитанная смолами. Количество слоёв формирует толщину и прочность материала.", className: "layer-core" },
] as const;

export const productTypes = [
  { code: "ST", title: "Standard", body: "Тонкий облицовочный HPL для ровных поверхностей, мебельных плит, стеновых панелей и интерьерных элементов.", image: "/media/lemark/processed/thumbnails/scene-02-decor.webp" },
  { code: "CP", title: "Compact", body: "Самонесущий материал для столешниц, перегородок, мебели и конструкций с открытым торцом.", image: "/media/lemark/processed/thumbnails/scene-04-product.webp" },
  { code: "PF", title: "Postforming", body: "Тонкий HPL для облицовки поверхностей с плавным радиусом и создания цельной кромки.", image: "/media/lemark/processed/thumbnails/scene-02-decor.webp" },
  { code: "FR", title: "Flame-retardant", body: "Трудногорючее исполнение для объектов с повышенными требованиями к пожарной безопасности.", image: "/media/lemark/processed/thumbnails/scene-03-press.webp" },
  { code: "EG", title: "Facade", body: "Наружное исполнение для фасадов и архитектурных элементов с климатической нагрузкой.", image: "/media/lemark/processed/thumbnails/scene-06-facade.webp" },
  { code: "LG", title: "Laboratory", body: "Поверхность с повышенной стойкостью к химическим веществам и растворителям.", image: "/media/lemark/processed/thumbnails/scene-07-clean-room.webp" },
  { code: "CR", title: "Biocidal", body: "Исполнение для медицинских, санитарных и чистых помещений с повышенными требованиями к гигиене.", image: "/media/lemark/processed/thumbnails/scene-07-clean-room.webp" },
] as const;

export const properties = [
  { title: "Высокая износостойкость", body: "Поверхность сохраняет внешний вид при постоянной механической нагрузке.", image: "/media/lemark/processed/thumbnails/scene-02-decor.webp" },
  { title: "Влагостойкость", body: "Непористая структура подходит для влажных зон и регулярной очистки.", image: "/media/lemark/processed/thumbnails/scene-07-clean-room.webp" },
  { title: "Прочность", body: "Материал рассчитан на удары, царапины и реальную ежедневную нагрузку.", image: "/media/lemark/processed/thumbnails/scene-04-product.webp" },
  { title: "Простой уход", body: "Поверхность легко очищается и не требует сложного обслуживания.", image: "/media/lemark/processed/thumbnails/scene-05-furniture.webp" },
  { title: "Стойкость к химии", body: "Специальные исполнения подходят для санитарной и лабораторной обработки.", image: "/media/lemark/processed/thumbnails/scene-07-clean-room.webp" },
  { title: "Климатическая устойчивость", body: "Фасадные решения рассчитаны на влагу, солнце и перепады температуры.", image: "/media/lemark/processed/thumbnails/scene-06-facade.webp" },
  { title: "Долговечный декор", body: "Цвет, рисунок и фактура сочетают выразительность с практичностью.", image: "/media/lemark/processed/thumbnails/scene-09-final-hero.webp" },
] as const;

export const decors = [
  { name: "Шалфей Clean Touch", article: "6001", category: "Однотонные", image: "/decors/6001-shalfei.jpg" },
  { name: "Терракот Clean Touch", article: "6006", category: "Однотонные", image: "/decors/6006-terrakot.jpg" },
  { name: "Асфальт Clean Touch", article: "6007", category: "Однотонные", image: "/decors/6007-asfalt.jpg" },
  { name: "Штрихлак светлый", article: null, category: "Древесные", image: "/decors/shtrihlak-svetlyi.jpg" },
  { name: "Клён Ванкувер", article: "0602", category: "Древесные", image: "/decors/0602-klen-vankuver.jpg" },
  { name: "Дуб Венге", article: "0603", category: "Древесные", image: "/decors/0603-dub-venge.jpg" },
  { name: "Вяз карамельный", article: "0607", category: "Древесные", image: "/decors/0607-vyaz-karamel.jpg" },
  { name: "Гранит Сардинский", article: "0401", category: "Каменные", image: "/decors/0401-granit-sardinia.jpg" },
  { name: "Эвора серая", article: "0402", category: "Каменные", image: "/decors/0402-evora-seraya.jpg" },
  { name: "Эвора бежевая", article: "0403", category: "Каменные", image: "/decors/0403-evora-bezhevaya.jpg" },
  { name: "Звёздная ночь", article: "0205", category: "Фантазийные", image: "/decors/0205-zvezdnaya-noch.jpg" },
  { name: "Полярное сияние", article: "0804", category: "Фантазийные", image: "/decors/0804-polyarnoe-siyanie.jpg" },
] as const;

export const productionSteps = [
  { title: "Приёмка сырья", body: "Проверяем материалы до запуска в производство." },
  { title: "Синтез смол", body: "Производим смолы на автоматизированном оборудовании и контролируем рецептуру." },
  { title: "Импрегнация", body: "Пропитываем декоративную и крафт-бумагу подготовленными смолами." },
  { title: "Сборка пакетов", body: "Формируем последовательность слоёв под нужный тип и толщину HPL." },
  { title: "Прессование", body: "Температура и давление превращают пакет в плотный монолитный материал." },
  { title: "Финишная обработка", body: "Обрезаем формат, обрабатываем поверхность и наносим защитную плёнку." },
  { title: "Упаковка и хранение", body: "Готовим продукцию к безопасной отгрузке и хранению." },
] as const;

export const reasons = [
  { title: "Надёжный отраслевой партнёр", body: "Опыт производства HPL и предметный диалог с B2B-заказчиками." },
  { title: "Полный цикл", body: "Ключевые производственные этапы находятся на одной площадке." },
  { title: "География поставок", body: "Работа с проектами в России и странах СНГ." },
  { title: "Выбор декоров", body: "Однотонные, древесные, каменные и дизайнерские решения." },
  { title: "Документы", body: "Сертификаты запрашиваются под конкретное исполнение и проектные требования." },
  { title: "Коммерческие условия", body: "Подбор исполнения, объёма и графика под задачу проекта." },
  { title: "Предсказуемая коммуникация", body: "Параметры производства и поставки фиксируются в предложении." },
] as const;

export const faq = [
  { q: "Что такое HPL?", a: "HPL — декоративный бумажно-слоистый пластик высокого давления. Материал получают из слоёв бумаги, пропитанных смолами и спрессованных при высокой температуре и давлении." },
  { q: "Чем Compact отличается от тонкого HPL?", a: "Compact — самонесущий материал большей толщины, который может использоваться без плитной основы. Тонкий HPL обычно применяется как облицовочный слой." },
  { q: "Какие толщины доступны?", a: `Производственные возможности позволяют выпускать HPL толщиной ${siteFacts.thickness.label}. Конкретный вариант подбирается по назначению изделия.` },
  { q: "Можно ли использовать HPL на фасаде?", a: "Для наружного применения используется фасадное исполнение, рассчитанное на влагу, ультрафиолет и перепады температуры." },
  { q: "Есть ли трудногорючий HPL?", a: "Да. Для объектов с повышенными требованиями к пожарной безопасности предусмотрено трудногорючее исполнение. Применение необходимо сверять с проектными требованиями и сертификатами." },
  { q: "Можно заказать свой рисунок?", a: "Да. Цифровой декор позволяет перенести индивидуальное изображение или фирменную графику на поверхность HPL при соблюдении требований к макету." },
  { q: "Как получить расчёт?", a: "Отправьте параметры, объём и при наличии прикрепите техническое задание. Менеджер уточнит детали и подготовит предложение." },
  { q: "Можно получить образцы?", a: "Да. Выберите интересующие декоры или опишите задачу — менеджер поможет сформировать набор образцов." },
] as const;
