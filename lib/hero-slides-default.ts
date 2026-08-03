/** Hero carousel slayt tipi */
export interface HeroCarouselSlide {
  src: string
  alt: string
}

/**
 * Şablondan kalan veya admin'e yanlış yüklenmiş hero görsellerini tespit eder.
 */
export function isDeprecatedHeroImage(src: string): boolean {
  const normalized = decodeURIComponent(src).toLowerCase()
  return (
    normalized.includes("/hero/") ||
    normalized.includes("heromobil") ||
    normalized.includes("hero-section-image") ||
    normalized.includes("herosection-mobil")
  )
}

/**
 * Backend `/hero-slides` yanıtından geçerli slaytları döndürür; alakasız görseller elenir.
 * Statik fallback yok — hero yalnızca admin/backend kaynaklıdır.
 */
export function filterHeroSlides(slides: HeroCarouselSlide[]): HeroCarouselSlide[] {
  return slides.filter((slide) => slide.src && !isDeprecatedHeroImage(slide.src))
}

/**
 * Harici (S3/API) hero URL'si olup olmadığını kontrol eder.
 */
export function isRemoteHeroImage(src: string): boolean {
  return src.startsWith("http://") || src.startsWith("https://")
}
