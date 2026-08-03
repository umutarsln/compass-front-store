import { api } from "./api"
import { resolveHeroSlidesFromApi, type HeroCarouselSlide } from "@/lib/hero-slides-default"

interface HeroSlideResponse {
  id: string
  imageUrl: string
  altText: string
  sortOrder: number
  isActive: boolean
}

/** API'den hero slaytlarını alır; backend yoksa ürün fallback görselleri kullanılır. */
export async function getHeroSlides(): Promise<HeroCarouselSlide[]> {
  try {
    const slides = await api.get<HeroSlideResponse[]>("/hero-slides")
    const mapped = slides
      .filter((slide) => slide.isActive && slide.imageUrl)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((slide) => ({
        src: slide.imageUrl,
        alt: slide.altText || "Ana sayfa hero görseli",
      }))
    return resolveHeroSlidesFromApi(mapped)
  } catch (error) {
    const isConnectionError =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "ECONNREFUSED"

    if (isConnectionError) {
      console.warn("Hero API'ye ulaşılamadı (backend kapalı olabilir), fallback görseller kullanılıyor.")
    } else {
      console.warn("Hero görselleri API'den alınamadı, fallback görseller kullanılıyor.", error)
    }
    return resolveHeroSlidesFromApi([])
  }
}
