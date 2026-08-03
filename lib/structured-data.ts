/** Site kök URL'sini env veya varsayılan production adresinden döndürür. */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (url) return url.replace(/\/+$/, "")
  return "https://www.compassreklam.com"
}

/**
 * Ana sayfa için Organization + WebSite JSON-LD üretir.
 */
export function buildHomeStructuredData() {
  const siteUrl = getSiteUrl()

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Compass Reklam",
        url: siteUrl,
        logo: `${siteUrl}/compass-reklam-logo.png`,
        description:
          "Endüstriyel baskı teknolojilerinde Türkiye'nin lider çözüm ortağı. UV baskı, DTF, lazer kesim ve plotter makineleri.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Antalya",
          addressCountry: "TR",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+90-553-467-86-07",
          contactType: "customer service",
          areaServed: "TR",
          availableLanguage: ["Turkish"],
        },
        sameAs: [],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Compass Reklam",
        description: "Endüstriyel baskı makineleri ve teknik servis — Compass Reklam",
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: "tr-TR",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/urunler?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  }
}
