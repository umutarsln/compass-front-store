import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CategoryProducts } from "@/components/category-products"
import { getCategories, getProducts } from "@/services"
import { transformProductList } from "@/lib/product-transformer"
import { normalizeSlug } from "@/lib/slug-utils"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  
  try {
    const categories = await getCategories()
    const category = findCategoryBySlug(categories, slug)
    
    if (!category) return {}

    return {
      title: `${category.name} | Shawk`,
      description: category.description || `${category.name} kategorisindeki ürünlerimizi keşfedin.`,
    }
  } catch (error) {
    console.error('Error fetching categories for metadata:', error)
    return {}
  }
}

// Kategorileri recursive olarak arayan helper fonksiyon
// Önce tam eşleşme, sonra normalize edilmiş slug karşılaştırması yapar
function findCategoryBySlug(categories: Awaited<ReturnType<typeof getCategories>>, slug: string): Awaited<ReturnType<typeof getCategories>>[0] | null {
  const normalizedSlug = normalizeSlug(slug)
  
  for (const category of categories) {
    // Önce tam eşleşme dene
    if (category.slug === slug) {
      return category
    }
    
    // Normalize edilmiş slug'ları karşılaştır
    if (normalizeSlug(category.slug) === normalizedSlug) {
      return category
    }
    
    // Recursive olarak children'ları ara
    if (category.children && category.children.length > 0) {
      const found = findCategoryBySlug(category.children, slug)
      if (found) return found
    }
  }
  return null
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params

  try {
    // Backend'den kategorileri çek
    const categories = await getCategories()
    const category = findCategoryBySlug(categories, slug)

    if (!category) {
      notFound()
    }

    // Kategori ID'si ile backend'den ürünleri çek
    const productsResponse = await getProducts({
      categoryId: category.id,
      limit: 100, // Maksimum limit
    })

    // Backend verisini frontend formatına dönüştür
    const transformedProducts = transformProductList(productsResponse.products)

    // CategoryProducts component'ine uygun format
    const categoryData = {
      id: category.id,
      slug: category.slug,
      name: category.name,
      description: category.description || '',
      image: category.image?.s3Url || '/placeholders/placeholder.svg',
    }

    return (
      <>
        <Header />
        <main className="pt-26 md:pt-[108px]">
          <CategoryProducts category={categoryData} products={transformedProducts} />
        </main>
        <Footer />
      </>
    )
  } catch (error) {
    console.error('Error fetching category data:', error)
    notFound()
  }
}
