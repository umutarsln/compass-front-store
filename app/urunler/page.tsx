import { Footer } from "@/components/footer"
import { ProductsForgeStyle } from "@/components/products-forge-style"
import { getProducts, getCategories } from "@/services"
import { transformProductList } from "@/lib/product-transformer"
import type { FrontendProduct } from "@/lib/product-transformer"
import type { OrderBy } from "@/services/products"
import type { Category } from "@/services/categories"
import { getUsdTryRate } from "@/lib/exchange-rate"
import { getStaticFrontendProducts } from "@/lib/static-product-details"

/** API erişilemediğinde kullanılacak statik kategoriler */
const STATIC_CATEGORIES: Category[] = [
  { id: "static-1", name: "UV Baskı", slug: "uv-baski", children: [], parentId: null, parent: null, image: null, isActive: true, displayOrder: 0, createdAt: "", updatedAt: "" },
  { id: "static-2", name: "Plotter Folyo Kesici", slug: "plotter-folyo-kesici", children: [], parentId: null, parent: null, image: null, isActive: true, displayOrder: 1, createdAt: "", updatedAt: "" },
  { id: "static-3", name: "Etiket Kesim", slug: "etiket-kesim", children: [], parentId: null, parent: null, image: null, isActive: true, displayOrder: 2, createdAt: "", updatedAt: "" },
  { id: "static-4", name: "Dijital Baskı", slug: "dijital-baski", children: [], parentId: null, parent: null, image: null, isActive: true, displayOrder: 3, createdAt: "", updatedAt: "" },
]

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
  title: "Ürünlerimiz | Compass Reklam",
  description: "Endüstriyel baskı teknolojilerinde geniş ürün yelpazemizi keşfedin.",
}

/** Slug'a göre kategori adını döndürür (statik filtre için) */
function getCategoryNamesBySlugs(categories: Category[], slugs: string[]): Set<string> {
  const names = new Set<string>()
  for (const slug of slugs) {
    const cat = findCategoryBySlug(categories, slug)
    if (cat) names.add(cat.name)
  }
  return names
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams

  let categories: Category[]
  let transformedProducts: FrontendProduct[]
  let expandedCategorySlugs: string[]

  try {
    categories = await getCategories()
  } catch (err) {
    console.warn("Kategoriler API'den alınamadı, statik liste kullanılıyor.", err)
    categories = STATIC_CATEGORIES
  }

  const categorySlugsArray = params.categorySlugs ? params.categorySlugs.split(",") : []
  expandedCategorySlugs = expandCategorySlugs(categorySlugsArray, categories)
  const expandedCategorySlugsString =
    expandedCategorySlugs.length > 0 ? expandedCategorySlugs.join(",") : undefined

  try {
    const productsResponse = await getProducts({
      search: params.search,
      categorySlugs: expandedCategorySlugsString,
      tagSlugs: params.tagSlugs,
      orderBy: params.orderBy || "created_at_desc",
      page: params.page ? Number(params.page) : 1,
      limit: params.limit ? Number(params.limit) : 20,
    })
    transformedProducts = transformProductList(productsResponse.products)
  } catch (err) {
    console.warn("Ürünler API'den alınamadı, statik liste kullanılıyor.", err)
    const usdTryRate = await getUsdTryRate()
    const staticProducts = getStaticFrontendProducts(usdTryRate)
    if (expandedCategorySlugs.length > 0) {
      const allowedNames = getCategoryNamesBySlugs(categories, expandedCategorySlugs)
      transformedProducts = staticProducts.filter((p) => allowedNames.has(p.category))
    } else {
      transformedProducts = staticProducts
    }
  }

  return (
    <>
      <main>
        <ProductsForgeStyle
          initialProducts={transformedProducts}
          categories={categories}
          initialCategorySlugs={expandedCategorySlugs}
        />
      </main>
      <Footer />
    </>
  )
}
