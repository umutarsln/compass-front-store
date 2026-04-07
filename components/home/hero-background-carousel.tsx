"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Ana sayfa hero slaytları; yollar `lib/static-product-details.ts` içindeki ürün `imagePaths`
 * ile aynı katalog görsellerinden seçilir (1–2: mevcut ürünler, 3: My Color 180 cm).
 */
const HERO_PRODUCT_SLIDES = [
  {
    src: "/urunler/folyokesim/epson-i3200-baski-kafali-sublimasyon-dijital-baski-makinesi/epson-i3200-baski-kafali-sublimasyon-dijital-baski-makinesi-01-67ff2857.png",
    alt: "Epson i3200 eco solvent dijital baskı makinesi",
  },
  {
    src: "/urunler/folyokesim/175-cm-ppf-folyo-kesim-makinesi-plotter/175-cm-ppf-folyo-kesim-makinesi-plotter-01-48d0a713.png",
    alt: "175 cm PPF ve folyo kesim plotter",
  },
  {
    src: "/urunler/folyokesim/dijital-baski-makinesi-180-cm-genislik-yuksek-hiz-endustriyel-kalite/dijital-baski-makinesi-180-cm-genislik-yuksek-hiz-endustriyel-kalite-01-756efd81.png",
    alt: "My Color 180 cm dijital baskı makinesi",
  },
] as const

const AUTOPLAY_INTERVAL_MS = 6000

/**
 * Ana sayfa hero bölümü için tam ekran genişliğinde döngüsel görsel kaydırıcı (Embla).
 * Otomatik geçiş, ok düğmeleri ve nokta göstergeleri sunar.
 */
export function HeroBackgroundCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 22 })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [pauseAutoplay, setPauseAutoplay] = useState(false)

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

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPauseAutoplay(true)}
      onMouseLeave={() => setPauseAutoplay(false)}
    >
      <div className="h-full w-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {HERO_PRODUCT_SLIDES.map((slide, index) => (
            <div
              key={slide.src}
              className="relative h-full min-w-0 shrink-0 grow-0 basis-full"
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover object-center"
                sizes="100vw"
                priority={index === 0}
                quality={85}
              />
            </div>
          ))}
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-between px-2 sm:px-4"
        aria-hidden
      >
        <button
          type="button"
          onClick={() => emblaApi?.scrollPrev()}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-background/30 bg-background/20 text-background backdrop-blur-sm transition hover:bg-background/35 sm:h-11 sm:w-11"
          aria-label="Önceki görsel"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        <button
          type="button"
          onClick={() => emblaApi?.scrollNext()}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-background/30 bg-background/20 text-background backdrop-blur-sm transition hover:bg-background/35 sm:h-11 sm:w-11"
          aria-label="Sonraki görsel"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>

      <div
        className="pointer-events-none absolute bottom-6 left-1/2 z-[2] flex -translate-x-1/2 gap-2 sm:bottom-10"
        role="group"
        aria-label="Hero görselleri"
      >
        {HERO_PRODUCT_SLIDES.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => emblaApi?.scrollTo(index)}
            className={cn(
              "pointer-events-auto h-2 rounded-full transition-all duration-300",
              index === selectedIndex
                ? "w-8 bg-primary"
                : "w-2 bg-background/50 hover:bg-background/70",
            )}
            aria-label={`${index + 1}. slayt`}
            aria-current={index === selectedIndex ? "true" : undefined}
          />
        ))}
      </div>
    </div>
  )
}
