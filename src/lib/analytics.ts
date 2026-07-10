export type AnalyticsEvent =
  | "hero_calculate_click"
  | "hero_catalog_click"
  | "hero_samples_click"
  | "application_open"
  | "decor_catalog_click"
  | "sample_request_open"
  | "certificate_request_open"
  | "lead_form_start"
  | "lead_file_attached"
  | "lead_submit_success"
  | "lead_submit_error"
  | "phone_click"
  | "email_click";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    ym?: (...args: unknown[]) => void;
  }
}

export function trackEvent(event: AnalyticsEvent, context: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...context });

  const metrikaId = Number(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID);
  if (metrikaId && window.ym) window.ym(metrikaId, "reachGoal", event);
  if (window.gtag) window.gtag("event", event, context);
}
