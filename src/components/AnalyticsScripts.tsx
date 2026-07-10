"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";

const consentKey = "lemark-cookie-consent";

function subscribeConsent(callback: () => void) {
  window.addEventListener("lemark:consent", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("lemark:consent", callback);
    window.removeEventListener("storage", callback);
  };
}

function getConsentSnapshot() {
  return window.localStorage.getItem(consentKey) ?? "pending";
}

const getServerConsentSnapshot = () => "pending";

export function AnalyticsScripts() {
  const consent = useSyncExternalStore(subscribeConsent, getConsentSnapshot, getServerConsentSnapshot);
  if (consent !== "accepted") return null;

  const gaId = process.env.NEXT_PUBLIC_GA_ID ?? "G-T00WQ7W67S";
  const ymId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID ?? "68572018";
  const calltouchId = process.env.NEXT_PUBLIC_CALLTOUCH_ID;
  const bitrixTrackerUrl = process.env.NEXT_PUBLIC_BITRIX_TRACKER_URL;

  return (
    <>
      {gaId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments)};
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${gaId}', { anonymize_ip: true });
          `}</Script>
        </>
      ) : null}
      {ymId ? (
        <Script id="ym-init" strategy="afterInteractive">{`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0];k.async=1;k.src=r;a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');
          ym(${Number(ymId)}, 'init', { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:false });
        `}</Script>
      ) : null}
      {calltouchId ? <Script src={`https://mod.calltouch.ru/init-min.js?id=${calltouchId}`} strategy="lazyOnload" /> : null}
      {bitrixTrackerUrl ? <Script src={bitrixTrackerUrl} strategy="lazyOnload" /> : null}
    </>
  );
}

export function CookieNotice() {
  const consent = useSyncExternalStore(subscribeConsent, getConsentSnapshot, getServerConsentSnapshot);
  if (consent !== "pending") return null;

  const decide = (value: "accepted" | "declined") => {
    window.localStorage.setItem(consentKey, value);
    window.dispatchEvent(new Event("lemark:consent"));
  };

  return (
    <aside className="cookie-notice glass-strong" aria-label="Настройки cookie">
      <p>
        Мы используем аналитические cookie только с вашего согласия. Необходимые функции сайта работают без них.
      </p>
      <div>
        <button type="button" className="button button-primary" onClick={() => decide("accepted")}>Принять</button>
        <button type="button" className="button button-ghost" onClick={() => decide("declined")}>Отклонить</button>
      </div>
    </aside>
  );
}
