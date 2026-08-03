"use client"

import dynamic from "next/dynamic"
import type { HeroCarouselSlide } from "@/lib/hero-slides-default"

/** İstemci tarafında yüklenen hero carousel; tek görsel kaynağı backend/API slaytlarıdır. */
const HeroBackgroundCarousel = dynamic(
  () =>
    import("@/components/home/hero-background-carousel").then(
      (mod) => mod.HeroBackgroundCarousel,
    ),
  { ssr: false },
)

interface HeroCarouselClientProps {
  slides: HeroCarouselSlide[]
}

/**
 * Hero arka plan carousel'ini istemcide lazy yükleyen sarmalayıcı.
 */
export function HeroCarouselClient({ slides }: HeroCarouselClientProps) {
  return <HeroBackgroundCarousel slides={slides} />
}
