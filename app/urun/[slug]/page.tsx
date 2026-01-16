import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductDetail } from "@/components/product-detail"
import { SimilarProducts } from "@/components/similar-products"
import { getProductDetail } from "@/services/products"
import { getProducts } from "@/services/products"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  try {
    const product = await getProductDetail(slug)
    if (!product) return {}

    return {
      title: `${product.name} | Shawk`,
      description: product.seoDescription || product.description,
    }
  } catch {
    return {}
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params


  try {
    const product = await getProductDetail(slug)

    if (!product) {
      notFound()
    }

    // Benzer ürünleri getir (aynı kategoriden)
    const categorySlug = product.categories[0]?.slug
    const similarProducts = categorySlug
      ? (await getProducts({ categorySlugs: categorySlug, limit: 4 })).products
        .filter((p) => p.productId !== product.productId)
        .slice(0, 4)
      : []

    return (
      <>
        <Header />
        <main className="pt-26 md:pt-[108px]">
          <ProductDetail product={product} />
          {similarProducts.length > 0 && <SimilarProducts products={similarProducts} />}
        </main>
        <Footer />
      </>
    )
  } catch (error) {
    console.error('Error fetching product:', error)
    notFound()
  }
}
