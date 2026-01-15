import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CategoryProducts } from "@/components/category-products"
import { categories, getProductsByCategory } from "@/lib/products"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }))
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = categories.find((c) => c.slug === slug)
  if (!category) return {}

  return {
    title: `${category.name} | Shawk`,
    description: category.description,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = categories.find((c) => c.slug === slug)

  if (!category) {
    notFound()
  }

  const categoryProducts = getProductsByCategory(slug)

  return (
    <>
      <Header />
      <main className="pt-26 md:pt-[108px]">
        <CategoryProducts category={category} products={categoryProducts} />
      </main>
      <Footer />
    </>
  )
}
