import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope, Roboto_Condensed } from "next/font/google";
import { AnalyticsScripts, CookieNotice } from "@/components/AnalyticsScripts";
import { siteFacts } from "@/content/site-facts";
import "./globals.css";

const manrope = Manrope({ subsets: ["cyrillic", "latin"], variable: "--font-sans", display: "swap" });
const condensed = Roboto_Condensed({ subsets: ["cyrillic", "latin"], variable: "--font-display", display: "swap" });
const serif = Cormorant_Garamond({ subsets: ["cyrillic", "latin"], variable: "--font-serif", weight: ["500", "600"], style: ["normal", "italic"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteFacts.siteUrl),
  title: "Производитель HPL-пластика полного цикла — Lemark",
  description: `Производство HPL-пластика толщиной ${siteFacts.thickness.label} для мебели, фасадов, интерьеров, транспорта и чистых помещений. ${siteFacts.decorCount.label}, подбор решения и расчёт проекта.`,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: "LEMARK",
    title: "Производитель HPL-пластика полного цикла — Lemark",
    description: "HPL для мебели, архитектуры, транспорта и чистых помещений — от производства до подбора под проект.",
    images: [{ url: "/media/lemark/processed/posters/hero-desktop.jpg", width: 1280, height: 720, alt: "HPL полного цикла Lemark" }],
  },
  twitter: { card: "summary_large_image", title: "LEMARK — HPL полного цикла", images: ["/media/lemark/processed/posters/hero-desktop.jpg"] },
  icons: { icon: "/favicon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#090A0A",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${manrope.variable} ${condensed.variable} ${serif.variable}`}>
      <body>
        <a className="skip-link" href="#main">Перейти к содержимому</a>
        {children}
        <CookieNotice />
        <AnalyticsScripts />
      </body>
    </html>
  );
}
