export const siteFacts = {
  brand: "LEMARK",
  legalName: "ООО «ЛЕМАРК»",
  description: "Российский производитель декоративных бумажно-слоистых пластиков полного цикла.",
  thickness: { min: 0.6, max: 25, label: "0,6–25 мм" },
  formats: ["3050×1300 мм", "3050×1600 мм"],
  capacity: { value: 500_000, label: "до 500 000 м²/месяц" },
  decorCount: { value: 250, label: "250+ декоров" },
  surfaceCombinations: { value: 3_000, label: "3000+ комбинаций поверхности" },
  averageLeadTime: { value: 10, label: "средний срок — 10 дней", needsVerification: true },
  typicalLeadTime: { label: "14–28 календарных дней", needsVerification: true },
  embossingOptions: { value: 11, label: "11 вариантов поверхности", needsVerification: true },
  geography: "Россия и СНГ",
  phoneDisplay: "+7 495 221-63-36",
  phoneHref: "tel:+74952216336",
  email: "sales@lemarkllc.ru",
  hours: "пн–пт 09:00–18:00",
  address: "141503, Московская область, г. Солнечногорск, Бутырский тупик, вл. 4, стр. 1",
  siteUrl: "https://lemarkllc.ru",
  privacyUrl: "https://lemarkllc.ru/politika-konfidenczialnosti/",
} as const;

export type SiteFacts = typeof siteFacts;
