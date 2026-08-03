import { api } from "./api"
import type { HeroCarouselSlide } from "@/lib/hero-slides-default"

interface HeroSlideResponse {
  id: string
  imageUrl: string
  altText: string
  sortOrder: number
  isActive: boolean
}

/** API'den hero slaytlarını alır ve carousel bileşeninin beklediği formata dönüştürür. */
export async function getHeroSlides(): Promise<HeroCarouselSlide[]> {
  try {
    const slides = await api.get<HeroSlideResponse[]>("/hero-slides")
    return slides
      .filter((slide) => slide.isActive && slide.imageUrl)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((slide) => ({
        src: slide.imageUrl,
        alt: slide.altText || "Ana sayfa hero görseli",
      }))
  } catch (error) {
    console.warn("Hero görselleri API'den alınamadı, varsayılan görseller kullanılacak.", error)
    return []
  }
}
