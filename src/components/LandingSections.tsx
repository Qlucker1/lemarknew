"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { applications, decors, faq, hplLayers, productTypes, productionSteps, properties, reasons } from "@/content/site-content";
import { siteFacts } from "@/content/site-facts";
import { trackEvent } from "@/lib/analytics";

export function LandingSections() {
  return (
    <>
      <ProofBar />
      <Applications />
      <Layers />
      <ProductTypes />
      <Properties />
      <DecorGallery />
      <DigitalDecor />
      <Production />
      <Company />
      <Reasons />
      <Projects />
      <Faq />
    </>
  );
}

function SectionIntro({ index, title, body, light = false }: { index: string; title: string; body?: string; light?: boolean }) {
  return (
    <div className={`section-intro ${light ? "on-dark" : ""}`}>
      <span className="section-index">{index}</span>
      <div><h2>{title}</h2>{body ? <p>{body}</p> : null}</div>
    </div>
  );
}

function ProofBar() {
  const items = [
    ["Полный цикл", "Ключевые этапы на одной площадке"],
    [siteFacts.thickness.label, "Диапазон толщин"],
    [siteFacts.decorCount.label, "Решения для разных задач"],
    [siteFacts.capacity.label, "Производственная мощность"],
    [siteFacts.geography, "География поставок"],
  ];
  return <section className="proof-bar" aria-label="Ключевые преимущества">{items.map(([title, label]) => <div key={title}><strong>{title}</strong><span>{label}</span></div>)}</section>;
}

function Applications() {
  return (
    <section className="section applications-section" id="applications" data-testid="applications">
      <SectionIntro index="03" title="Один материал. Разные отрасли." body="Подбираем исполнение HPL под требования конкретного объекта: от визуальной задачи до пожарной, химической и климатической стойкости." />
      <div className="application-mosaic">
        {applications.map((item, index) => (
          <a className={`application-card application-card-${index + 1}`} href={item.href} key={item.title} onClick={() => trackEvent("application_open", { application: item.title })}>
            <Image src={item.image} alt={item.title} fill sizes={index === 0 ? "(min-width: 900px) 58vw, 100vw" : "(min-width: 900px) 35vw, 100vw"} />
            <div className="application-overlay"><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.body}</p><ul>{item.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul><b>Открыть направление <i aria-hidden="true">↗</i></b></div>
          </a>
        ))}
      </div>
    </section>
  );
}

function Layers() {
  const [active, setActive] = useState(0);
  return (
    <section className="section layers-section" id="material">
      <SectionIntro index="04" title="Слоистая структура. Монолитный результат." body="HPL — декоративный бумажно-слоистый пластик высокого давления. Слои бумаги пропитываются термореактивными смолами и соединяются под воздействием температуры и давления." light />
      <div className="layers-layout">
        <div className="exploded-view" aria-label="Строение HPL">
          {hplLayers.map((layer, index) => (
            <button key={layer.title} type="button" className={`material-layer ${layer.className} ${active === index ? "is-active" : ""}`} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)} aria-pressed={active === index}>
              <span>{String(index + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
        <div className="layer-copy" aria-live="polite"><span>{String(active + 1).padStart(2, "0")} / 04</span><h3>{hplLayers[active].title}</h3><p>{hplLayers[active].body}</p><div className="layer-selector">{hplLayers.map((layer, index) => <button type="button" key={layer.title} aria-label={layer.title} aria-pressed={active === index} onClick={() => setActive(index)} />)}</div></div>
      </div>
    </section>
  );
}

function ProductTypes() {
  const [active, setActive] = useState(0);
  const item = productTypes[active];
  return (
    <section className="section product-types" id="products">
      <SectionIntro index="05" title="Исполнение под конкретные требования" body="От тонкого облицовочного HPL до самонесущего Compact и специальных исполнений для фасадов, лабораторий и объектов с особыми требованиями." />
      <div className="product-showcase">
        <div className="product-media"><Image src={item.image} alt={`${item.title} HPL`} fill sizes="(min-width: 900px) 60vw, 100vw" /></div>
        <div className="product-copy"><span className="product-code">{item.code}</span><h3>{item.title}</h3><p>{item.body}</p><a className="button button-dark" href="#lead-form">Помочь с выбором исполнения</a></div>
      </div>
      <div className="product-tabs" role="tablist" aria-label="Виды HPL">{productTypes.map((type, index) => <button role="tab" type="button" aria-selected={active === index} key={type.code} onClick={() => setActive(index)}><span>{type.code}</span>{type.title}</button>)}</div>
    </section>
  );
}

function Properties() {
  const [active, setActive] = useState(0);
  const item = properties[active];
  return (
    <section className="section properties-section">
      <SectionIntro index="06" title="Рассчитан на интенсивную эксплуатацию" body="Свойства материала раскрываются не в абстрактных иконках, а в реальных сценариях: вода, свет, нагрузка, уход, химия и климат." light />
      <div className="property-stage">
        <div className="property-image"><Image key={item.image} src={item.image} alt={item.title} fill sizes="(min-width: 900px) 68vw, 100vw" /></div>
        <div className="property-copy glass-strong"><span>{String(active + 1).padStart(2, "0")} / 07</span><h3>{item.title}</h3><p>{item.body}</p></div>
      </div>
      <div className="property-rail">{properties.map((property, index) => <button type="button" className={active === index ? "is-active" : ""} key={property.title} onClick={() => setActive(index)}><span>{String(index + 1).padStart(2, "0")}</span>{property.title}</button>)}</div>
    </section>
  );
}

function DecorGallery() {
  const categories = ["Все", ...Array.from(new Set(decors.map((item) => item.category)))];
  const [category, setCategory] = useState("Все");
  const visible = useMemo(() => category === "Все" ? decors : decors.filter((item) => item.category === category), [category]);
  return (
    <section className="section decor-section" id="decors">
      <SectionIntro index="07" title="Цвет виден. Фактура ощущается." body="Реальные декоры Lemark: однотонные, древесные, каменные и фантазийные поверхности. Названия и артикулы взяты из действующего каталога." />
      <div className="decor-filters" role="group" aria-label="Фильтр декоров">{categories.map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
      <div className="decor-grid" aria-live="polite">{visible.map((decor) => <figure key={decor.name}><div><Image src={decor.image} alt={`Декор HPL ${decor.name}`} fill sizes="(min-width: 900px) 22vw, 46vw" /></div><figcaption><span>{decor.category}</span><strong>{decor.name}</strong>{decor.article ? <small>LM {decor.article}</small> : <small>Артикул уточняется</small>}</figcaption></figure>)}</div>
      <div className="section-actions"><a className="button button-dark" href={`${siteFacts.siteUrl}/katalog-dekorov-hpl/`} onClick={() => trackEvent("decor_catalog_click")}>Открыть каталог</a><a className="button button-line" href="#lead-form" onClick={() => trackEvent("sample_request_open")}>Заказать образцы</a><a className="text-link" href={`${siteFacts.siteUrl}/tisnenie/`}>Посмотреть тиснения ↗</a></div>
    </section>
  );
}

function DigitalDecor() {
  return (
    <section className="digital-decor">
      <div className="digital-before"><Image src="/media/lemark/processed/thumbnails/scene-04-product.webp" alt="Светлая HPL-панель до нанесения цифрового декора" fill sizes="50vw" /><span>Основа</span></div>
      <div className="digital-after"><Image src="/decors/0804-polyarnoe-siyanie.jpg" alt="HPL-панель с индивидуальным рисунком" fill sizes="50vw" /><span>Цифровой декор</span></div>
      <div className="digital-copy glass-strong"><span>08</span><h2>Свой рисунок — на поверхности HPL</h2><p>Фирменная графика, навигация, паттерн, фотография или авторский рисунок — на поверхности долговечного HPL-пластика.</p><div><a className="button button-primary" href={`${siteFacts.siteUrl}/primenenie-hpl/czifrovoj-dekor/`}>Требования к макету</a><a className="button button-ghost" href="#lead-form">Обсудить декор</a></div></div>
    </section>
  );
}

function Production() {
  const [active, setActive] = useState(0);
  const factoryImage = `/media/lemark/raw/images/references/factory-${String((active % 7) + 1).padStart(2, "0")}.webp`;
  return (
    <section className="section production-section" id="production" data-testid="production">
      <SectionIntro index="09" title="Контроль качества начинается до прессования" body="Полный цикл позволяет контролировать сырьё, рецептуру, пропитку, сборку, прессование и финальную обработку на одной площадке." light />
      <div className="production-stage"><div className="production-media"><Image src={factoryImage} key={factoryImage} alt={`Производственный этап: ${productionSteps[active].title}`} fill sizes="(min-width: 900px) 58vw, 100vw" /></div><div className="production-copy"><span>{String(active + 1).padStart(2, "0")} / 07</span><h3>{productionSteps[active].title}</h3><p>{productionSteps[active].body}</p></div></div>
      <ol className="production-timeline">{productionSteps.map((step, index) => <li key={step.title}><button type="button" className={active === index ? "is-active" : ""} onClick={() => setActive(index)}><span>{String(index + 1).padStart(2, "0")}</span>{step.title}</button></li>)}</ol>
    </section>
  );
}

function Company() {
  const stats = [[siteFacts.capacity.label, "мощность"], [siteFacts.thickness.label, "диапазон"], [siteFacts.decorCount.label, "ассортимент"], [siteFacts.surfaceCombinations.label, "поверхности"], [siteFacts.geography, "поставки"]];
  return (
    <section className="company-section"><div className="company-copy"><span>10 / LEMARK</span><h2>Производственная база для проектов любого масштаба</h2><p>{siteFacts.description} Полный цикл помогает сохранять предсказуемость характеристик, сроков и коммерческих условий.</p><div><a className="button button-primary" href={`${siteFacts.siteUrl}/o-kompanii/`}>Подробнее о производстве</a><a className="text-link text-link-light" href="#lead-form" onClick={() => trackEvent("certificate_request_open")}>Запросить сертификаты ↗</a></div></div><div className="company-stats">{stats.map(([value, label]) => <div key={value}><strong>{value}</strong><span>{label}</span></div>)}</div></section>
  );
}

function Reasons() {
  const [active, setActive] = useState(0);
  return (
    <section className="section reasons-section"><SectionIntro index="11" title="Семь причин работать с Lemark" body="Сохранили смысл действующей страницы, но убрали неподтверждённые endorsements и абсолютные рекламные формулировки." />
      <div className="reasons-layout"><div className="reason-stage"><span>{String(active + 1).padStart(2, "0")}</span><h3>{reasons[active].title}</h3><p>{reasons[active].body}</p></div><div className="reason-list">{reasons.map((reason, index) => <button type="button" key={reason.title} aria-pressed={active === index} onClick={() => setActive(index)}><span>{String(index + 1).padStart(2, "0")}</span>{reason.title}</button>)}</div></div>
    </section>
  );
}

function Projects() {
  const scopes = [
    { title: "Общественный интерьер", body: "Мебель, стеновые панели и поверхности для интенсивной эксплуатации.", image: "/media/lemark/processed/thumbnails/scene-05-furniture.webp" },
    { title: "Архитектурный фасад", body: "Точные стыки, климатическая нагрузка и выразительная крупная плоскость.", image: "/media/lemark/processed/thumbnails/scene-06-facade.webp" },
    { title: "Транспортная среда", body: "Панели, столы и перегородки для постоянного пассажирского потока.", image: "/media/lemark/processed/thumbnails/scene-08-transport.webp" },
  ];
  return <section className="section projects-section"><SectionIntro index="12" title="Материал, который становится частью объекта" body="Не называем вымышленные объекты: показываем подтверждённые сферы применения HPL и типовые проектные задачи." light /><div className="project-rail">{scopes.map((scope, index) => <article key={scope.title}><div><Image src={scope.image} alt={scope.title} fill sizes="(min-width: 900px) 33vw, 100vw" /></div><span>0{index + 1}</span><h3>{scope.title}</h3><p>{scope.body}</p></article>)}</div><a className="button button-primary" href={`${siteFacts.siteUrl}/poleznaya-informacziya/proektyi/`}>Посмотреть проекты</a></section>;
}

function Faq() {
  const [open, setOpen] = useState(0);
  return <section className="section faq-section" id="faq" data-testid="faq"><SectionIntro index="13" title="Вопросы о материале и заказе" /><div className="faq-list">{faq.map((item, index) => <article key={item.q}><h3><button type="button" aria-expanded={open === index} aria-controls={`faq-${index}`} onClick={() => setOpen(open === index ? -1 : index)}><span>{String(index + 1).padStart(2, "0")}</span>{item.q}<i aria-hidden="true">{open === index ? "−" : "+"}</i></button></h3><div id={`faq-${index}`} hidden={open !== index}><p>{item.a}</p></div></article>)}</div></section>;
}
