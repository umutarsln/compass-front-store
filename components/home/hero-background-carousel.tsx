"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { HeroCarouselSlide } from "@/lib/hero-slides-default"

export type { HeroCarouselSlide }

const AUTOPLAY_INTERVAL_MS = 6000

interface HeroBackgroundCarouselProps {
  slides?: HeroCarouselSlide[]
}

/**
 * Ana sayfa hero bölümü için tam ekran genişliğinde döngüsel görsel kaydırıcı (Embla).
 * Otomatik geçiş, ok düğmeleri ve nokta göstergeleri sunar.
 */
export function HeroBackgroundCarousel({ slides }: HeroBackgroundCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: (slides?.length ?? 0) > 1, duration: 22 })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [pauseAutoplay, setPauseAutoplay] = useState(false)
  const heroSlides = slides ?? []

  /** Embla seçim olayında aktif slayt indeksini günceller. */
  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("reInit", onSelect)
    emblaApi.on("select", onSelect)
    return () => {
      emblaApi.off("reInit", onSelect)
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, onSelect])

  useEffect(() => {
    if (!emblaApi || pauseAutoplay) return
    const id = window.setInterval(() => {
      emblaApi.scrollNext()
    }, AUTOPLAY_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [emblaApi, pauseAutoplay])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.reInit()
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi, heroSlides.length])

  return (
    <div
      className="absolute inset-0 z-[2] bg-white"
      onMouseEnter={() => setPauseAutoplay(true)}
      onMouseLeave={() => setPauseAutoplay(false)}
    >
      <div className="h-full w-full overflow-hidden bg-white" ref={emblaRef}>
        <div className="flex h-full">
          {heroSlides.map((slide, index) => (
            <div
              key={`${slide.src}-${index}`}
              className="relative h-full min-w-0 shrink-0 grow-0 basis-full bg-white"
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                className="object-contain object-center p-3 sm:p-4 md:object-contain md:object-right md:p-0 lg:pr-8 xl:pr-12"
                sizes="(max-width: 767px) 100vw, 55vw"
                quality={90}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 z-[20] flex items-center justify-between px-2 sm:px-4 pointer-events-none">
        <button
          type="button"
          onClick={() => emblaApi?.scrollPrev()}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 bg-white text-foreground shadow-sm transition hover:bg-muted sm:h-11 sm:w-11"
          aria-label="Önceki görsel"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => emblaApi?.scrollNext()}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 bg-white text-foreground shadow-sm transition hover:bg-muted sm:h-11 sm:w-11"
          aria-label="Sonraki görsel"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
        </button>
      </div>

      <div
        className="pointer-events-none absolute bottom-6 left-1/2 z-[20] flex -translate-x-1/2 gap-2 sm:bottom-10"
        role="group"
        aria-label="Hero görselleri"
      >
        {heroSlides.map((slide, index) => (
          <button
            key={`${slide.src}-${index}`}
            type="button"
            onClick={() => emblaApi?.scrollTo(index)}
            className={cn(
              "pointer-events-auto h-2 rounded-full transition-all duration-300",
              index === selectedIndex
                ? "w-8 bg-primary"
                : "w-2 bg-foreground/25 hover:bg-foreground/40",
            )}
            aria-label={`${index + 1}. slayt`}
            aria-current={index === selectedIndex ? "true" : undefined}
          />
        ))}
      </div>
    </div>
  )
}
