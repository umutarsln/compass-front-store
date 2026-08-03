import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroCarouselClient } from "@/components/home/hero-carousel-client"
import { resolveHeroSlides, type HeroCarouselSlide } from "@/lib/hero-slides-default"

interface HeroSectionProps {
  heroSlides?: HeroCarouselSlide[]
}

/**
 * Ana sayfa hero bölümü — metin ve LCP görseli sunucuda render edilir; carousel istemcide yüklenir.
 */
export function HeroSection({ heroSlides }: HeroSectionProps) {
  const slides = resolveHeroSlides(heroSlides)
  const firstSlide = slides[0]

  return (
    <section className="relative min-h-[68vh] sm:min-h-[78vh] md:min-h-[min(72vh,640px)] lg:min-h-[min(78vh,720px)] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="relative h-full w-full">
          <Image
            src={firstSlide.src}
            alt={firstSlide.alt}
            fill
            priority
            sizes="(max-width: 767px) 100vw, 55vw"
            className="object-contain object-center p-3 sm:p-4 md:object-contain md:object-right md:p-0 lg:pr-8 xl:pr-12"
            quality={75}
          />
        </div>
        <HeroCarouselClient slides={slides} />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-foreground/90 via-foreground/65 to-foreground/20 md:bg-gradient-to-r md:from-foreground/95 md:via-foreground/70 md:to-transparent" />
      </div>
      <div className="container relative z-10 py-14 sm:py-16 md:py-20">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4" aria-hidden />
            Endüstriyel Baskı Çözümleri
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-background leading-tight mb-6">
            Baskı Teknolojisinde <span className="text-gradient">Güvenilir</span> Çözüm Ortağınız
          </h1>
          <p className="text-lg text-background/80 mb-8 leading-relaxed">
            Dünya markası baskı, kesim ve laminasyon makineleri ile işletmenizi bir adım öne taşıyın. Kurulum,
            eğitim ve 7/24 teknik destek hizmetleriyle yanınızdayız.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/urunler">
              <Button size="lg" className="text-base">
                Ürünleri Keşfet <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
              </Button>
            </Link>
            <Link href="/teklif-al">
              <Button
                variant="outline"
                size="lg"
                className="text-base border-background bg-background text-foreground hover:bg-background/90"
              >
                Ücretsiz Teklif Alın
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
