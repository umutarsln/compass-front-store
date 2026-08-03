/** Hero carousel slayt tipi */
export interface HeroCarouselSlide {
  src: string
  alt: string
}

/**
 * Varsayılan ana sayfa hero slaytları; `/public/hero` altındaki optimize görseller kullanılır.
 */
export const DEFAULT_HERO_PRODUCT_SLIDES: HeroCarouselSlide[] = [
  {
    src: "/hero/heromobil-görsel.webp",
    alt: "Endüstriyel baskı makineleri — Compass Reklam",
  },
  {
    src: "/hero/hero-section-image-pc.webp",
    alt: "Dijital baskı ve kesim çözümleri",
  },
  {
    src: "/hero/hero-section-image.webp",
    alt: "Compass Reklam baskı teknolojileri",
  },
]

/**
 * API veya varsayılan slayt listesinden kullanılacak hero görsellerini döndürür.
 */
export function resolveHeroSlides(slides?: HeroCarouselSlide[]): HeroCarouselSlide[] {
  return slides?.length ? slides : DEFAULT_HERO_PRODUCT_SLIDES
}

/**
 * Harici (S3/API) hero URL'si olup olmadığını kontrol eder.
 */
export function isRemoteHeroImage(src: string): boolean {
  return src.startsWith("http://") || src.startsWith("https://")
}
