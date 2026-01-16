import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductsWithFilters } from "@/components/products-with-filters"
import { getProducts, getCategories, getTags } from "@/services"
import { transformProductList } from "@/lib/product-transformer"
import type { OrderBy } from "@/services/products"

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

    // Backend'den ürünleri filtre parametreleriyle çek
    const productsResponse = await getProducts({
      search: params.search,
      categorySlugs: params.categorySlugs,
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
              categorySlugs: params.categorySlugs ? params.categorySlugs.split(',') : [],
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
