"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/content/site-content";
import { siteFacts } from "@/content/site-facts";
import { trackEvent } from "@/lib/analytics";

export function Header() {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const root = menuRef.current;
    const focusable = () => Array.from(root?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, [open]);

  return (
    <header className={`site-header ${compact ? "is-compact" : ""}`} data-testid="site-header">
      <a className="brand-link" href="#main" aria-label="LEMARK — на главную">
        <Image src="/brand/lemark-white.svg" alt="LEMARK" width={170} height={50} priority />
      </a>
      <nav className="desktop-nav" aria-label="Основная навигация">
        {navigation.slice(0, 6).map((item) => <a key={item.label} href={item.href}>{item.label}</a>)}
      </nav>
      <div className="header-actions">
        <a className="header-phone" href={siteFacts.phoneHref} onClick={() => trackEvent("phone_click", { placement: "header" })}>{siteFacts.phoneDisplay}</a>
        <a className="button button-primary header-cta" href="#lead-form">Рассчитать проект</a>
        <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label="Открыть меню" onClick={() => setOpen(true)}>
          <span /><span /><span />
        </button>
      </div>

      {open ? (
        <div className="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Навигация" ref={menuRef}>
          <div className="mobile-menu-head">
            <Image src="/brand/lemark-black.svg" alt="LEMARK" width={170} height={50} />
            <button ref={closeRef} className="menu-close" type="button" aria-label="Закрыть меню" onClick={() => setOpen(false)}>×</button>
          </div>
          <nav aria-label="Мобильная навигация">
            {navigation.map((item, index) => <a key={item.label} href={item.href} onClick={() => setOpen(false)}><span>{String(index + 1).padStart(2, "0")}</span>{item.label}</a>)}
          </nav>
          <div className="mobile-menu-actions">
            <a href="#lead-form" onClick={() => setOpen(false)}>Рассчитать</a>
            <a href="#lead-form" onClick={() => setOpen(false)}>Образцы</a>
            <a href={`${siteFacts.siteUrl}/katalog-dekorov-hpl/`}>Каталог</a>
          </div>
          <div className="mobile-menu-contacts">
            <a href={siteFacts.phoneHref}>{siteFacts.phoneDisplay}</a>
            <a href={`mailto:${siteFacts.email}`}>{siteFacts.email}</a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
