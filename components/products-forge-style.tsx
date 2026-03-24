"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Filter } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import type { FrontendProduct } from "@/lib/product-transformer"
import type { Category } from "@/services/categories"

/** Kategori ağacını düz liste yapar (pill'lerde göstermek için) */
function flattenCategories(cats: Category[]): { slug: string; name: string }[] {
  return cats.flatMap((c) => [
    { slug: c.slug, name: c.name },
    ...flattenCategories(c.children || []),
  ])
}

interface ProductsForgeStyleProps {
  initialProducts: FrontendProduct[]
  categories: Category[]
  initialCategorySlugs: string[]
}

/**
 * Forge Products sayfası gibi görünüm: başlık, kategori pill'leri, ürün sayısı, grid.
 * Kategori tıklanınca /urunler veya /urunler?categorySlugs=slug ile sayfa yenilenir.
 */
export function ProductsForgeStyle({
  initialProducts,
  categories,
  initialCategorySlugs,
}: ProductsForgeStyleProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const flatCategories = flattenCategories(categories)
  const activeSlug = initialCategorySlugs[0] ?? null

  const handleCategoryClick = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (slug) {
      params.set("categorySlugs", slug)
    } else {
      params.delete("categorySlugs")
    }
    params.delete("page")
    const query = params.toString()
    router.push(query ? `/urunler?${query}` : "/urunler")
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Ürünlerimiz
          </h1>
          <p className="text-muted-foreground mt-2">
            Endüstriyel baskı teknolojilerinde geniş ürün yelpazemizi keşfedin.
          </p>
        </div>

        {/* Kategori pill'leri - Forge Products gibi */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <Filter className="h-4 w-4 text-muted-foreground mr-1 shrink-0" />
          <button
            onClick={() => handleCategoryClick(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              !activeSlug
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Tümü
          </button>
          {flatCategories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeSlug === cat.slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          {initialProducts.length} ürün bulundu
        </p>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {initialProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
