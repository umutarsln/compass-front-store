import Link from "next/link"
import { ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroCarouselClient } from "@/components/home/hero-carousel-client"
import type { HeroCarouselSlide } from "@/lib/hero-slides-default"

interface HeroSectionProps {
  heroSlides?: HeroCarouselSlide[]
}

/**
 * Ana sayfa hero — görseller yalnızca backend `/hero-slides` API'sinden gelir.
 */
export function HeroSection({ heroSlides = [] }: HeroSectionProps) {
  return (
    <section className="relative min-h-[68vh] sm:min-h-[78vh] md:min-h-[min(72vh,640px)] lg:min-h-[min(78vh,720px)] flex items-center overflow-hidden bg-white">
      <div className="absolute inset-0">
        {heroSlides.length > 0 ? <HeroCarouselClient slides={heroSlides} /> : null}
        {/* Gradient yalnızca sol metin alanında; sağdaki ürün görselini soluklaştırmaz */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-[3] hidden md:block w-[48%] bg-gradient-to-r from-white from-70% to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-2/5 md:hidden bg-gradient-to-t from-white via-white/50 to-transparent" />
      </div>
      <div className="container relative z-10 py-14 sm:py-16 md:py-20 pointer-events-none">
        <div className="max-w-2xl pointer-events-auto">
          <span className="inline-flex items-center gap-2 bg-primary/15 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4" aria-hidden />
            Endüstriyel Baskı Çözümleri
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            Baskı Teknolojisinde <span className="text-gradient">Güvenilir</span> Çözüm Ortağınız
          </h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
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
                className="text-base border-foreground/25 text-foreground hover:bg-foreground hover:text-background"
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
