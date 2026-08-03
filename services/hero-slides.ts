import { api } from "./api"
import { filterHeroSlides, type HeroCarouselSlide } from "@/lib/hero-slides-default"

interface HeroSlideResponse {
  id: string
  imageUrl: string
  altText: string
  sortOrder: number
  isActive: boolean
}

/** API'den hero slaytlarını alır; yalnızca backend/admin kaynaklı geçerli görseller döner. */
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
    return filterHeroSlides(mapped)
  } catch (error) {
    console.warn("Hero görselleri API'den alınamadı.", error)
    return []
  }
}
