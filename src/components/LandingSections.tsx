"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { applications, decors, faq, productTypes, productionSteps, properties, reasons } from "@/content/site-content";
import { siteFacts } from "@/content/site-facts";
import { trackEvent } from "@/lib/analytics";

const chapterLinks = [
  { label: "01", href: "#production", title: "От слоя к листу" },
  { label: "02", href: "#applications", title: "Материал в архитектуре" },
  { label: "03", href: "#decors", title: "Декор как инструмент" },
  { label: "04", href: "#contact", title: "Обсудить задачу" },
] as const;

export function LandingSections() {
  return (
    <div className="editorial-landing">
      <aside className="editorial-spine" aria-label="Разделы страницы">
        <nav>{chapterLinks.map((item) => <a href={item.href} key={item.label} title={item.title}>{item.label}<span /></a>)}</nav>
      </aside>
      <ProofBar />
      <ProductionAtlas />
      <ApplicationAtlas />
      <DecorAtlas />
      <SpecificationAtlas />
      <WhyLemark />
      <Faq />
    </div>
  );
}

function ProofBar() {
  const items = [
    ["Полный цикл", "Ключевые этапы на одной площадке"],
    [siteFacts.thickness.label, "Диапазон толщин"],
    [siteFacts.decorCount.label, "Декоры для разных задач"],
    [siteFacts.capacity.label, "Производственная мощность"],
    [siteFacts.geography, "География поставок"],
  ];

  return (
    <section className="proof-bar editorial-proof" aria-label="Ключевые преимущества">
      {items.map(([title, label]) => <div key={title}><strong>{title}</strong><span>{label}</span></div>)}
    </section>
  );
}

function ProductionAtlas() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      } else {
        video.pause();
        setPlaying(false);
      }
    }, { threshold: 0.35 });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    else { video.pause(); setPlaying(false); }
  };

  return (
    <section className="atlas-section atlas-production" id="production" data-testid="production">
      <div className="atlas-heading">
        <span className="atlas-number">01</span>
        <div>
          <h2>От слоя<br />к листу</h2>
          <p>HPL начинается с бумаги и смол. Каждый этап — от пропитки до прессования и финишной обработки — контролируется на одной площадке.</p>
          <a className="atlas-link" href={`${siteFacts.siteUrl}/o-kompanii/`}>Подробнее о производстве <span aria-hidden="true">→</span></a>
        </div>
      </div>

      <figure className="process-window">
        <video ref={videoRef} muted loop playsInline preload="none" poster="/media/lemark/processed/sections/production-window.webp" aria-label="Производственная линия HPL">
          <source src="/media/lemark/processed/sections/production-window.mp4" type="video/mp4" />
        </video>
        <button type="button" onClick={toggleVideo} aria-label={playing ? "Поставить видео на паузу" : "Воспроизвести видео"}>{playing ? "Пауза" : "Смотреть процесс"}</button>
        <figcaption><span>{String(active + 1).padStart(2, "0")} / 07</span><strong>{productionSteps[active].title}</strong><p>{productionSteps[active].body}</p></figcaption>
      </figure>

      <ol className="process-ledger" aria-label="Этапы производства">
        {productionSteps.map((step, index) => (
          <li key={step.title}><button type="button" aria-pressed={active === index} onClick={() => setActive(index)}><span>{String(index + 1).padStart(2, "0")}</span>{step.title}</button></li>
        ))}
      </ol>
    </section>
  );
}

function ApplicationAtlas() {
  const primary = applications.slice(0, 4);
  return (
    <section className="atlas-section atlas-applications" id="applications" data-testid="applications">
      <div className="application-title-row">
        <div><span className="atlas-number">02</span><h2>Материал<br />в архитектуре</h2></div>
        <p>HPL работает там, где важны надёжность, визуальная цельность и долговечность. Подбираем исполнение под требования конкретного объекта.</p>
      </div>
      <div className="application-strip">
        {primary.map((item, index) => (
          <a className="application-card" href={item.href} key={item.title} onClick={() => trackEvent("application_open", { application: item.title })}>
            <Image src={item.image} alt={item.title} fill sizes="(min-width: 900px) 25vw, 82vw" />
            <div><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.body}</p></div>
          </a>
        ))}
      </div>
      <div className="application-extra">
        {applications.slice(4).map((item, index) => <a href={item.href} key={item.title}><span>0{index + 5}</span><strong>{item.title}</strong><small>{item.tags.join(" · ")}</small><b aria-hidden="true">→</b></a>)}
      </div>
    </section>
  );
}

function DecorAtlas() {
  const categories = ["Все", ...Array.from(new Set(decors.map((item) => item.category)))];
  const [category, setCategory] = useState("Все");
  const visible = useMemo(() => category === "Все" ? decors : decors.filter((item) => item.category === category), [category]);
  const featured = visible.slice(0, 6);

  return (
    <section className="atlas-section atlas-decors" id="decors">
      <div className="decor-title-row">
        <div><span className="atlas-number">03</span><h2>Декор как<br />инструмент</h2></div>
        <p>Цвет, рисунок и структура формируют характер пространства. Смотрите поверхность крупно и выбирайте по задаче проекта.</p>
      </div>

      <div className="decor-fan" aria-live="polite">
        {featured.map((decor, index) => (
          <figure key={decor.name} style={{ "--decor-index": index } as React.CSSProperties}>
            <Image src={decor.image} alt={`Декор HPL ${decor.name}`} fill sizes="(min-width: 900px) 22vw, 52vw" />
            <figcaption><span>{decor.category}</span><strong>{decor.name}</strong><small>{decor.article ? `LM ${decor.article}` : "Артикул уточняется"}</small></figcaption>
          </figure>
        ))}
      </div>

      <div className="decor-controls" role="group" aria-label="Фильтр декоров">
        {categories.map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
      </div>
      <div className="decor-swatch-rail">
        {visible.map((decor) => <button type="button" key={decor.name} title={decor.name} aria-label={decor.name}><Image src={decor.image} alt="" fill sizes="56px" /></button>)}
        <a href={`${siteFacts.siteUrl}/katalog-dekorov-hpl/`} onClick={() => trackEvent("decor_catalog_click")}>Все декоры <span aria-hidden="true">→</span></a>
      </div>
    </section>
  );
}

function SpecificationAtlas() {
  const [active, setActive] = useState(0);
  const item = productTypes[active];
  return (
    <section className="atlas-section specification-atlas" id="products">
      <div className="spec-intro"><span>Типы материала</span><h2>Исполнение под конкретную задачу</h2><p>От тонкого облицовочного HPL до самонесущего Compact и специальных исполнений для фасадов, лабораторий и объектов с особыми требованиями.</p></div>
      <div className="product-tabs spec-tabs" role="tablist" aria-label="Виды HPL">
        {productTypes.map((type, index) => <button role="tab" type="button" aria-selected={active === index} key={type.code} onClick={() => setActive(index)}><span>{type.code}</span>{type.title}</button>)}
      </div>
      <div className="product-copy spec-product-copy" aria-live="polite">
        <span className="product-code">{item.code}</span><h3>{item.title}</h3><p>{item.body}</p><a href="#lead-form">Подобрать исполнение <span aria-hidden="true">→</span></a>
      </div>
      <div className="property-ledger">
        {properties.map((property, index) => <div key={property.title}><span>{String(index + 1).padStart(2, "0")}</span><strong>{property.title}</strong><p>{property.body}</p></div>)}
      </div>
    </section>
  );
}

function WhyLemark() {
  return (
    <section className="atlas-section why-atlas">
      <div className="why-title"><span>LEMARK</span><h2>Производство<br />без чёрного ящика</h2><p>{siteFacts.description}</p></div>
      <div className="reason-ledger">
        {reasons.map((reason, index) => <article key={reason.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{reason.title}</h3><p>{reason.body}</p></article>)}
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="atlas-section faq-section" id="faq">
      <div className="faq-heading"><span>Вопросы о материале</span><h2>Коротко о главном</h2></div>
      <div className="faq-list">
        {faq.map((item, index) => (
          <article key={item.q}>
            <h3><button type="button" aria-expanded={open === index} onClick={() => setOpen(open === index ? null : index)}><span>{String(index + 1).padStart(2, "0")}</span>{item.q}<i aria-hidden="true">{open === index ? "−" : "+"}</i></button></h3>
            {open === index ? <div><p>{item.a}</p></div> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
