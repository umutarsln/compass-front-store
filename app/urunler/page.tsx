import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductsWithFilters } from "@/components/products-with-filters"
import { getProducts, getCategories, getTags } from "@/services"
import { transformProductList } from "@/lib/product-transformer"
import type { OrderBy } from "@/services/products"
import type { Category } from "@/services/categories"

// Kategoriyi slug'a göre bul (recursive)
function findCategoryBySlug(categories: Category[], slug: string): Category | null {
  for (const category of categories) {
    if (category.slug === slug) {
      return category
    }
    if (category.children && category.children.length > 0) {
      const found = findCategoryBySlug(category.children, slug)
      if (found) return found
    }
  }
  return null
}

// Bir kategorinin tüm çocuklarının slug'larını topla (recursive)
function getAllChildrenSlugs(category: Category): string[] {
  const slugs: string[] = []
  if (category.children && category.children.length > 0) {
    for (const child of category.children) {
      slugs.push(child.slug)
      slugs.push(...getAllChildrenSlugs(child))
    }
  }
  return slugs
}

// categorySlugs'ı genişlet: parent kategori varsa ve çocukları yoksa, çocuklarını da ekle
function expandCategorySlugs(categorySlugs: string[], categories: Category[]): string[] {
  const expandedSlugs = new Set<string>(categorySlugs)

  for (const slug of categorySlugs) {
    const category = findCategoryBySlug(categories, slug)
    if (category && category.children && category.children.length > 0) {
      // Bu bir parent kategori
      const childrenSlugs = getAllChildrenSlugs(category)
      // Çocuklarının hiçbiri categorySlugs içinde var mı kontrol et
      const hasAnyChild = childrenSlugs.some(childSlug => categorySlugs.includes(childSlug))

      // Eğer hiçbir çocuk seçili değilse, tüm çocukları ekle
      if (!hasAnyChild) {
        childrenSlugs.forEach(childSlug => expandedSlugs.add(childSlug))
      }
    }
  }

  return Array.from(expandedSlugs)
}

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string
    categorySlugs?: string
    tagSlugs?: string
    minPrice?: string
    maxPrice?: string
    orderBy?: OrderBy
    page?: string
    limit?: string
  }>
}

export const metadata = {
  title: "Tüm Ürünler | Shawk",
  description: "Kişiselleştirilmiş 3D LED lambalarımızın tamamını keşfedin.",
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  console.log("ALO");

  try {
    // Backend'den kategorileri ve tag'leri paralel olarak çek
    const [categories, tags] = await Promise.all([
      getCategories(),
      getTags(),
    ])

    // categorySlugs'ı parse et
    const categorySlugsArray = params.categorySlugs ? params.categorySlugs.split(',') : []

    // Parent kategori varsa ve çocukları yoksa, çocuklarını da ekle
    const expandedCategorySlugs = expandCategorySlugs(categorySlugsArray, categories)
    const expandedCategorySlugsString = expandedCategorySlugs.length > 0
      ? expandedCategorySlugs.join(',')
      : undefined

    // Backend'den ürünleri filtre parametreleriyle çek
    const productsResponse = await getProducts({
      search: params.search,
      categorySlugs: expandedCategorySlugsString,
      tagSlugs: params.tagSlugs,
      // minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      // maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
      orderBy: params.orderBy || 'created_at_desc',
      page: params.page ? Number(params.page) : 1,
      limit: params.limit ? Number(params.limit) : 20,
    })

    // Backend verisini frontend formatına dönüştür
    const transformedProducts = transformProductList(productsResponse.products)

    return (
      <>
        <Header />
        <main className="pt-26 md:pt-[108px]">
          <ProductsWithFilters
            initialProducts={transformedProducts}
            initialPagination={{
              total: productsResponse.total,
              page: productsResponse.page,
              limit: productsResponse.limit,
              totalPages: productsResponse.totalPages,
            }}
            categories={categories}
            tags={tags}
            initialFilters={{
              search: params.search || '',
              categorySlugs: expandedCategorySlugs, // Genişletilmiş kategori slug'ları
              tagSlugs: params.tagSlugs ? params.tagSlugs.split(',') : [],
              minPrice: params.minPrice ? Number(params.minPrice) : undefined,
              maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
              orderBy: params.orderBy || 'created_at_desc',
              page: params.page ? Number(params.page) : 1,
              limit: params.limit ? Number(params.limit) : 20,
            }}
          />
        </main>
        <Footer />
      </>
    )
  } catch (error) {
    console.error('Error fetching products:', error)
    return (
      <>
        <Header />
        <main className="pt-26 md:pt-[108px]">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground mb-4">
                Ürünler Yüklenirken Hata Oluştu
              </h1>
              <p className="text-muted-foreground">
                Lütfen daha sonra tekrar deneyin.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }
}
