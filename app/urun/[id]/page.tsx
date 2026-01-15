import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductDetail } from "@/components/product-detail"
import { SimilarProducts } from "@/components/similar-products"
import { products, getProductById, getProductsByCategory } from "@/lib/products"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }))
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params
  const product = getProductById(id)
  if (!product) return {}

  return {
    title: `${product.name} | Shawk`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = getProductById(id)

  if (!product) {
    notFound()
  }

  const similarProducts = getProductsByCategory(product.categorySlug).filter((p) => p.id !== product.id)

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
}
