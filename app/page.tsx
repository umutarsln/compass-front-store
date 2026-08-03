import dynamic from "next/dynamic"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { getUsdTryRate } from "@/lib/exchange-rate"
import { getStaticFrontendProducts } from "@/lib/static-product-details"
import { getHeroSlides } from "@/services/hero-slides"
import { buildHomeStructuredData } from "@/lib/structured-data"

/** Framer Motion içeren alt bölümler hero sonrası lazy yüklenir. */
const IndexSections = dynamic(
  () => import("@/components/home/index-sections").then((mod) => mod.IndexSections),
  {
    loading: () => (
      <div aria-hidden className="min-h-[50vh] animate-pulse bg-muted/30" />
    ),
  },
)

const FEATURED_PRODUCT_LIMIT = 6
const FEATURED_PRODUCTS_PER_CATEGORY_LIMIT = 3
const FEATURED_CATEGORY_ORDER = ["Plotter Folyo Kesici", "Dijital Baskı", "Etiket Kesim", "Fiber Markalama"] as const

/**
 * Ana sayfadaki öne çıkan ürünleri kategori sırasına göre gruplar.
 */
function getOrderedFeaturedProducts(usdTryRate: number) {
  const products = getStaticFrontendProducts(usdTryRate)
  const orderedProducts = FEATURED_CATEGORY_ORDER.flatMap((category) =>
    products.filter((product) => product.category === category).slice(0, FEATURED_PRODUCTS_PER_CATEGORY_LIMIT),
  )
  const orderedProductIds = new Set(orderedProducts.map((product) => product.id))
  const remainingProducts = products.filter((product) => !orderedProductIds.has(product.id))

  return [...orderedProducts, ...remainingProducts].slice(0, FEATURED_PRODUCT_LIMIT)
}

/**
 * Ana sayfa - Forge Index UI
 * Geçici olarak statik ürün verilerini kullanır.
 */
export default async function HomePage() {
  const [usdTryRate, heroSlides] = await Promise.all([getUsdTryRate(), getHeroSlides()])
  const featuredProducts = getOrderedFeaturedProducts(usdTryRate)
  const structuredData = buildHomeStructuredData()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main>
        <HeroSection heroSlides={heroSlides} />
        <IndexSections featuredProducts={featuredProducts} />
      </main>
      <Footer />
    </>
  )
}
