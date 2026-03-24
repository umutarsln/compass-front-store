import { Footer } from "@/components/footer"
import { IndexSections } from "@/components/home/index-sections"
import { getProducts } from "@/services/products"
import { transformProductListItem } from "@/lib/product-transformer"

/**
 * Ana sayfa - Forge Index UI
 * Ürünler API'den çekilir
 */
export default async function HomePage() {
  let featuredProducts: Awaited<ReturnType<typeof transformProductListItem>>[] = []
  try {
    const result = await getProducts({ limit: 6 })
    featuredProducts = result.products.map(transformProductListItem)
  } catch {
    // API hatası durumunda boş liste
  }

  return (
    <>
      <main>
        <IndexSections featuredProducts={featuredProducts} />
      </main>
      <Footer />
    </>
  )
}
