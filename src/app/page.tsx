import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LandingSections } from "@/components/LandingSections";
import { LeadForm } from "@/components/LeadForm";
import { ScrollVideoHero } from "@/components/ScrollVideoHero";
import { faq } from "@/content/site-content";
import { siteFacts } from "@/content/site-facts";

export default function Home() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteFacts.brand,
      legalName: siteFacts.legalName,
      url: siteFacts.siteUrl,
      logo: `${siteFacts.siteUrl}/brand/lemark-black.svg`,
      email: siteFacts.email,
      telephone: siteFacts.phoneDisplay,
      address: { "@type": "PostalAddress", streetAddress: "Бутырский тупик, вл. 4, стр. 1", addressLocality: "Солнечногорск", addressRegion: "Московская область", postalCode: "141503", addressCountry: "RU" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
    },
  ];

  return (
    <>
      <Header />
      <main id="main">
        <ScrollVideoHero />
        <LandingSections />
        <LeadForm />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    </>
  );
}
