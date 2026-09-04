# Visual bible

## Концепция

**Material in motion** — промышленный editorial, где каждый экран показывает HPL как физический материал и инженерный процесс. Темп спокойный, кадры пригодны для паузы и обратного скраббинга.

Reference concept: `docs/design-concepts/hero-concept.png`.

## Brand

- Официальные black/white SVG сохранены с текущего сайта.
- Accent: Lemark red `#E31E3A` (визуально подтверждён в текущем логотипе; финальное бренд-значение требует brand-book verification).
- Graphite `#090A0A`, carbon `#111313`, porcelain `#F2F0EA`, warm white `#FAF9F6`, steel `#9EA5A8`.
- Dark sections должны быть истинно тёмными; светлые — porcelain, без SaaS-blue.

## Typography

- Display: `Roboto Condensed`/system condensed fallback, 700, узкие строки, uppercase точечно.
- Editorial accent: `Cormorant Garamond`, только короткие фразы/цифры.
- UI/body: `Manrope`, полноценная кириллица.
- Header/controls: 12–14 px, не browser-default.

## Layout

- 12 колонок, max 1520 px, desktop gutters 32–48 px, mobile 18–22 px.
- HERO 100svh внутри 520vh desktop / 470vh mobile.
- Асимметрия: copy 5 колонок, visual 7 колонок; chapter rail справа.
- Следующие секции чередуют full-bleed stage, открытую editorial rail и mosaic. Не повторять одинаковую сетку.

## Material language

- Kraft fiber, resin sheen, dense black core, precise panel joints, raking light.
- Реалистичный масштаб листа и станков.
- Люди только как вторичный масштаб, в PPE.
- Без текста, логотипов, cyberpunk, neon sci-fi, фантастических машин.

## Motion

- Slow dolly, macro push, lateral tracking, controlled orbit до 20°.
- UI: спокойный opacity-переход 0.36 s, фиксированный верхний якорь текста, короткая пустая пауза между главами.
- Media: scroll управляет временем видео напрямую; seek-запросы сериализованы, а copy меняется только после показа декодированного кадра.
- Reduced motion: poster + обычные главы, без scrub/parallax/blur.

## Components

- `glass-subtle`: только header/chapter indicator, 12 px blur, 1 px inner white line.
- `glass-strong`: final HERO CTA, 18 px blur, небольшой прямоугольный radius 18 px.
- CTA: прямоугольная, red/porcelain, radius 4–8 px; pills только для достоверных material tags.

## Media treatment

- HERO background: без цветной overlay; локальный black edge scrim слева для контраста.
- Cards: image fills stable aspect ratios; text remains HTML.
- Posters: desktop 16:9, mobile 9:16, safe copy zone слева/снизу.
