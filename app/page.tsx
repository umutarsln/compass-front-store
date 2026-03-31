import { Footer } from "@/components/footer"
import { IndexSections } from "@/components/home/index-sections"
import { getUsdTryRate } from "@/lib/exchange-rate"
import { getStaticFrontendProducts } from "@/lib/static-product-details"

/**
 * Ana sayfa - Forge Index UI
 * Geçici olarak statik ürün verilerini kullanır.
 */
export default async function HomePage() {
  const usdTryRate = await getUsdTryRate()
  const featuredProducts = getStaticFrontendProducts(usdTryRate).slice(0, 6)

  return (
    <>
      <main>
        <IndexSections featuredProducts={featuredProducts} />
      </main>
      <Footer />
    </>
  )
}
