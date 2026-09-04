"use client";

import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { heroChapters } from "@/content/site-content";
import { siteFacts } from "@/content/site-facts";
import { media } from "@/content/media";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const chapterNavLabels = ["Завод Lemark", "Декоры и тиснения", "Строительство", "Чистые помещения", "Транспорт"] as const;

if (typeof window !== "undefined") gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ScrollVideoHero() {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const transitionRef = useRef<HTMLSpanElement>(null);
  const targetTime = useRef(0);
  const renderedTime = useRef(0);
  const duration = useRef<number>(media.hero.duration);
  const rafId = useRef(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [visualIndex, setVisualIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const chapter = heroChapters[activeIndex ?? visualIndex];
  const visualChapter = heroChapters[visualIndex];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mediaQuery.matches);
    sync();
    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  useGSAP(() => {
    if (reducedMotion) return;
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const isMobile = window.matchMedia("(max-width: 720px)").matches;
    video.src = isMobile ? media.hero.mobile : media.hero.desktop;
    video.load();

    let lastFrame = performance.now();

    const tick = (now: number) => {
      const elapsed = Math.min((now - lastFrame) / 1000, 0.08);
      lastFrame = now;
      const delta = targetTime.current - renderedTime.current;
      const damping = Math.abs(delta) > duration.current * 0.18 ? 0.34 : 1 - Math.exp(-elapsed * 13);
      renderedTime.current += delta * damping;
      const renderedProgress = clamp(renderedTime.current / duration.current, 0, 1);
      container.dataset.renderedProgress = renderedProgress.toFixed(4);
      if (video.readyState >= 1 && Math.abs(video.currentTime - renderedTime.current) > 1 / 30) {
        try {
          video.currentTime = clamp(renderedTime.current, 0, Math.max(0, duration.current - 0.04));
        } catch {
          // The poster remains readable if a browser rejects an early seek.
        }
      }
      if (progressRef.current) progressRef.current.style.transform = `scaleY(${renderedProgress})`;

      const next = heroChapters.findIndex((item, index) => {
        const quietTail = index === heroChapters.length - 1 ? 0 : 0.03;
        return renderedProgress >= item.start && renderedProgress <= item.end - quietTail;
      });
      if (next >= 0) {
        setVisualIndex((current) => (current === next ? current : next));
        setActiveIndex((current) => (current === next ? current : next));
      } else {
        setActiveIndex((current) => (current === null ? current : null));
      }

      if (transitionRef.current) {
        const boundary = heroChapters.slice(0, -1).find((item) => renderedProgress > item.end - 0.03 && renderedProgress < item.end);
        if (boundary) {
          const phase = (renderedProgress - (boundary.end - 0.03)) / 0.03;
          transitionRef.current.style.opacity = String(Math.sin(Math.PI * phase) * 0.72);
          transitionRef.current.style.transform = `translate3d(${-120 + phase * 240}vw,0,0) skewX(-7deg)`;
        } else {
          transitionRef.current.style.opacity = "0";
        }
      }
      rafId.current = window.requestAnimationFrame(tick);
    };
    rafId.current = window.requestAnimationFrame(tick);

    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        targetTime.current = clamp(self.progress, 0, 1) * duration.current;
      },
    });
    ScrollTrigger.refresh();
    container.dataset.scrollReady = "true";

    const primeVideo = async () => {
      try {
        await video.play();
        video.pause();
      } catch {
        // Seeking still works in browsers that do not need priming.
      }
      window.removeEventListener("pointerdown", primeVideo);
    };
    window.addEventListener("pointerdown", primeVideo, { once: true });

    return () => {
      scrollTrigger.kill();
      delete container.dataset.scrollReady;
      delete container.dataset.renderedProgress;
      window.cancelAnimationFrame(rafId.current);
      window.removeEventListener("pointerdown", primeVideo);
      video.removeAttribute("src");
      video.load();
    };
  }, { scope: containerRef, dependencies: [reducedMotion], revertOnUpdate: true });

  if (reducedMotion) return <ReducedMotionHero />;

  const onMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    duration.current = Number.isFinite(video.duration) ? video.duration : media.hero.duration;
    setReady(true);
  };

  const trackedClick = (event: string) => trackEvent(event as AnalyticsEvent, { chapter: visualChapter.id });
  const jumpToChapter = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const range = container.offsetHeight - window.innerHeight;
    window.scrollTo({ top: container.offsetTop + range * (heroChapters[index].start + 0.012), behavior: "smooth" });
  };

  return (
    <section className="scroll-hero" ref={containerRef} aria-label="Путь HPL от материала до проекта" data-testid="scroll-hero">
      <div className="hero-sticky">
        <video
          ref={videoRef}
          className="hero-video"
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          style={{ objectPosition: visualChapter.focalPoint }}
          onLoadedMetadata={onMetadata}
          onLoadedData={() => setReady(true)}
          onError={() => setVideoError(true)}
        />
        <picture className={`hero-poster ${ready && !videoError ? "is-hidden" : ""}`}>
          <source media="(max-width: 720px)" srcSet={media.hero.posterMobile} />
          <img src={media.hero.posterDesktop} alt="Производственная линия HPL Lemark" />
        </picture>
        <div className="hero-scrim" aria-hidden="true" />
        <span ref={transitionRef} className="hero-transition-plane" aria-hidden="true" />
        {!ready && !videoError ? <div className="hero-loading" aria-live="polite">Загружаем историю материала</div> : null}

        <div className={`hero-copy hero-copy-${chapter.alignment} ${chapter.theme === "light" ? "on-light" : ""}`}>
          <motion.div
            key={chapter.id}
            className={`hero-chapter ${visualIndex === heroChapters.length - 1 ? "glass-strong hero-final-panel" : ""}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: activeIndex === null ? 0 : 1 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            style={{ pointerEvents: activeIndex === null ? "none" : "auto" }}
          >
            <p className="hero-eyebrow">{chapter.eyebrow}</p>
            <h1>{chapter.title}</h1>
            <p className="hero-body">{chapter.body}</p>
            <div className="hero-ctas">
              <a className="button button-primary" href={chapter.primaryCta.href} onClick={() => trackedClick(chapter.primaryCta.event)}>{chapter.primaryCta.label}<Arrow /></a>
              {chapter.secondaryCta ? <a className="button button-ghost" href={chapter.secondaryCta.href} onClick={() => trackedClick(chapter.secondaryCta!.event)}>{chapter.secondaryCta.label}</a> : null}
            </div>
            {visualIndex === 0 ? (
              <div className="hero-facts" aria-label="Ключевые показатели">
                <span>{siteFacts.thickness.label}</span>
                <span>{siteFacts.capacity.label}</span>
                <span>{siteFacts.decorCount.label}</span>
              </div>
            ) : null}
          </motion.div>
        </div>

        <aside className="hero-progress glass-subtle" aria-label={`Глава ${visualIndex + 1} из ${heroChapters.length}`}>
          <span className="progress-track"><span ref={progressRef} /></span>
          <div className="chapter-nav">
            {heroChapters.map((item, index) => (
              <button type="button" key={item.id} aria-current={visualIndex === index ? "step" : undefined} onClick={() => jumpToChapter(index)}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <small>{chapterNavLabels[index]}</small>
              </button>
            ))}
          </div>
        </aside>
        {visualIndex === 0 ? <p className="scroll-hint">Прокрутите, чтобы пройти путь материала <span aria-hidden="true">↓</span></p> : null}
      </div>
    </section>
  );
}

function ReducedMotionHero() {
  return (
    <section className="reduced-hero" aria-label="Путь HPL от материала до проекта">
      <div className="reduced-hero-cover">
        <Image src={media.hero.posterDesktop} alt="Слои материала HPL" fill priority sizes="100vw" />
        <div className="hero-scrim" />
        <div className="reduced-hero-intro">
          <p className="hero-eyebrow">{heroChapters[0].eyebrow}</p>
          <h1>{heroChapters[0].title}</h1>
          <p>{heroChapters[0].body}</p>
          <a className="button button-primary" href="#lead-form">Рассчитать проект</a>
        </div>
      </div>
      <div className="reduced-chapters">
        {heroChapters.slice(1).map((item, index) => (
          <article key={item.id}>
            <span>{String(index + 2).padStart(2, "0")}</span>
            <div><p>{item.eyebrow}</p><h2>{item.title}</h2><p>{item.body}</p><a href={item.primaryCta.href}>{item.primaryCta.label} <span aria-hidden="true">→</span></a></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Arrow() {
  return <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M3 10h13M11 4l6 6-6 6" /></svg>;
}
