"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { heroChapters } from "@/content/site-content";
import { siteFacts } from "@/content/site-facts";
import { media } from "@/content/media";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function ScrollVideoHero() {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const targetTime = useRef(0);
  const renderedTime = useRef(0);
  const duration = useRef<number>(media.hero.duration);
  const rafId = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const chapter = heroChapters[activeIndex];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mediaQuery.matches);
    sync();
    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const isMobile = window.matchMedia("(max-width: 720px)").matches;
    video.src = isMobile ? media.hero.mobile : media.hero.desktop;
    video.load();

    let disposed = false;
    let scrollTrigger: { kill: () => void } | undefined;

    const tick = () => {
      const delta = targetTime.current - renderedTime.current;
      renderedTime.current += delta * (Math.abs(delta) > 3 ? 0.32 : 0.12);
      if (video.readyState >= 1 && Math.abs(video.currentTime - renderedTime.current) > 1 / 30) {
        try {
          video.currentTime = clamp(renderedTime.current, 0, Math.max(0, duration.current - 0.04));
        } catch {
          // The poster remains readable if a browser rejects an early seek.
        }
      }
      rafId.current = window.requestAnimationFrame(tick);
    };
    rafId.current = window.requestAnimationFrame(tick);

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, triggerModule]) => {
      if (disposed) return;
      const { gsap } = gsapModule;
      const { ScrollTrigger } = triggerModule;
      gsap.registerPlugin(ScrollTrigger);
      scrollTrigger = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const progress = clamp(self.progress, 0, 1);
          targetTime.current = progress * duration.current;
          if (progressRef.current) progressRef.current.style.transform = `scaleY(${progress})`;
          const next = heroChapters.findIndex((item) => progress >= item.start && progress <= item.end);
          if (next >= 0) setActiveIndex((current) => (current === next ? current : next));
        },
      });
      ScrollTrigger.refresh();
      container.dataset.scrollReady = "true";
    });

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
      disposed = true;
      scrollTrigger?.kill();
      delete container.dataset.scrollReady;
      window.cancelAnimationFrame(rafId.current);
      window.removeEventListener("pointerdown", primeVideo);
      video.removeAttribute("src");
      video.load();
    };
  }, [reducedMotion]);

  if (reducedMotion) return <ReducedMotionHero />;

  const onMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    duration.current = Number.isFinite(video.duration) ? video.duration : media.hero.duration;
    setReady(true);
  };

  const trackedClick = (event: string) => trackEvent(event as AnalyticsEvent, { chapter: chapter.id });

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
          style={{ objectPosition: chapter.focalPoint }}
          onLoadedMetadata={onMetadata}
          onLoadedData={() => setReady(true)}
          onError={() => setVideoError(true)}
        />
        <picture className={`hero-poster ${ready && !videoError ? "is-hidden" : ""}`}>
          <source media="(max-width: 720px)" srcSet={media.hero.posterMobile} />
          <img src={media.hero.posterDesktop} alt="Слои крафт-бумаги для производства HPL" />
        </picture>
        <div className="hero-scrim" aria-hidden="true" />
        {!ready && !videoError ? <div className="hero-loading" aria-live="polite">Загружаем историю материала</div> : null}

        <div className={`hero-copy hero-copy-${chapter.alignment} ${chapter.theme === "light" ? "on-light" : ""}`}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={chapter.id}
              className={`hero-chapter ${activeIndex === heroChapters.length - 1 ? "glass-strong hero-final-panel" : ""}`}
              initial={{ opacity: 0, filter: "blur(10px)", y: 22 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              exit={{ opacity: 0, filter: "blur(8px)", y: -18 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="hero-eyebrow">{chapter.eyebrow}</p>
              <h1>{chapter.title}</h1>
              <p className="hero-body">{chapter.body}</p>
              <div className="hero-ctas">
                <a className="button button-primary" href={chapter.primaryCta.href} onClick={() => trackedClick(chapter.primaryCta.event)}>{chapter.primaryCta.label}<Arrow /></a>
                {chapter.secondaryCta ? <a className="button button-ghost" href={chapter.secondaryCta.href} onClick={() => trackedClick(chapter.secondaryCta!.event)}>{chapter.secondaryCta.label}</a> : null}
              </div>
              {activeIndex === 0 ? (
                <div className="hero-facts" aria-label="Ключевые показатели">
                  <span>{siteFacts.thickness.label}</span>
                  <span>{siteFacts.capacity.label}</span>
                  <span>{siteFacts.decorCount.label}</span>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>

        <aside className="hero-progress glass-subtle" aria-label={`Глава ${activeIndex + 1} из ${heroChapters.length}`}>
          <span className="chapter-current">{String(activeIndex + 1).padStart(2, "0")}</span>
          <span className="chapter-total">/ {String(heroChapters.length).padStart(2, "0")}</span>
          <span className="progress-track"><span ref={progressRef} /></span>
        </aside>
        {activeIndex === 0 ? <p className="scroll-hint">Прокрутите, чтобы пройти путь материала <span aria-hidden="true">↓</span></p> : null}
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
