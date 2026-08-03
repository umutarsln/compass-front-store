/** Hero carousel slayt tipi */
export interface HeroCarouselSlide {
  src: string
  alt: string
}

/**
 * API erişilemediğinde veya geçerli slayt dönmediğinde kullanılan ürün görselleri (yalnızca fallback).
 */
export const FALLBACK_HERO_SLIDES: HeroCarouselSlide[] = [
  {
    src: "/urunler/folyokesim/epson-i3200-baski-kafali-sublimasyon-dijital-baski-makinesi/epson-i3200-baski-kafali-sublimasyon-dijital-baski-makinesi-01-67ff2857.webp",
    alt: "Epson i3200 eco solvent dijital baskı makinesi",
  },
  {
    src: "/urunler/folyokesim/175-cm-ppf-folyo-kesim-makinesi-plotter/175-cm-ppf-folyo-kesim-makinesi-plotter-01-48d0a713.webp",
    alt: "175 cm PPF ve folyo kesim plotter",
  },
  {
    src: "/urunler/folyokesim/dijital-baski-makinesi-180-cm-genislik-yuksek-hiz-endustriyel-kalite/dijital-baski-makinesi-180-cm-genislik-yuksek-hiz-endustriyel-kalite-01-756efd81.webp",
    alt: "My Color 180 cm dijital baskı makinesi",
  },
]

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
 */
export function filterHeroSlides(slides: HeroCarouselSlide[]): HeroCarouselSlide[] {
  return slides.filter((slide) => slide.src && !isDeprecatedHeroImage(slide.src))
}

/**
 * API yanıtı boş kaldığında ürün fallback slaytlarını döndürür.
 */
export function resolveHeroSlidesFromApi(slides: HeroCarouselSlide[]): HeroCarouselSlide[] {
  const filtered = filterHeroSlides(slides)
  return filtered.length > 0 ? filtered : FALLBACK_HERO_SLIDES
}

/**
 * Harici (S3/API) hero URL'si olup olmadığını kontrol eder.
 */
export function isRemoteHeroImage(src: string): boolean {
  return src.startsWith("http://") || src.startsWith("https://")
}
