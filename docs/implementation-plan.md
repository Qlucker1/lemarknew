# План реализации

## Исходное состояние

Репозиторий был пустым: кроме `lemark_codex_master_prompt.md` отсутствовали приложение, package manager metadata, assets, формы, API, SEO и CI. Поэтому выбран fallback из ТЗ: Next.js App Router, strict TypeScript, Tailwind CSS, Motion, GSAP ScrollTrigger, React Hook Form + Zod, Playwright.

## Этапы

1. Снять структуру, тексты, факты, URL, формы и аналитику `lemarkllc.ru`.
2. Зафиксировать проверенные факты в `src/content/site-facts.ts`, противоречия — в `docs/facts-to-verify.md`.
3. Создать content map, visual bible, storyboard и asset manifests.
4. Сохранить официальный логотип, реальные swatches и фотографии производства как reference-only inputs.
5. Выполнить Higgsfield discovery, сгенерировать selected stills и 4-секундные single-shot clips без текста/логотипов.
6. Нормализовать и собрать 24 fps master; выпустить desktop/mobile H.264 с GOP 12, poster WebP/JPEG.
7. Реализовать 16 секций landing, 7-главный scroll-scrub HERO, reduced-motion, mobile menu, accessible FAQ и lead form.
8. Подключить server adapter формы, analytics events и env-driven существующие IDs.
9. Прогнать lint, typecheck, production build, Playwright, media probe и ручной Browser QA на основных viewport.

## Неподвижные ограничения

- Публичные ссылки ведут на существующие SEO URL `https://lemarkllc.ru/...`.
- Форма не показывает success без подтверждённого 2xx от webhook.
- PII не отправляется в analytics.
- Все числа берутся только из единого facts config.
