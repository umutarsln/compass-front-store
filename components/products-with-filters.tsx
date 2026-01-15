"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Search, X, Filter, ChevronDown } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import type { FrontendProduct } from "@/lib/product-transformer"
import type { Category } from "@/services/categories"
import type { Tag } from "@/services/tags"
import type { OrderBy } from "@/services/products"
import { getProducts } from "@/services"
import { transformProductList } from "@/lib/product-transformer"

interface ProductsWithFiltersProps {
  initialProducts: FrontendProduct[]
  initialPagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  categories: Category[]
  tags: Tag[]
  initialFilters: {
    search: string
    categoryId: string
    tagIds: string[]
    minPrice?: number
    maxPrice?: number
    orderBy: OrderBy
    page: number
    limit: number
  }
}

export function ProductsWithFilters({
  initialProducts,
  initialPagination,
  categories,
  tags,
  initialFilters,
}: ProductsWithFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState(initialProducts)
  const [pagination, setPagination] = useState(initialPagination)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState(initialFilters)

  // URL'den filtreleri güncelle
  const updateURL = useCallback(
    (newFilters: Partial<typeof filters>) => {
      const params = new URLSearchParams(searchParams.toString())

      // Filtreleri güncelle
      const updatedFilters = { ...filters, ...newFilters }

      // URL parametrelerini güncelle
      if (updatedFilters.search) {
        params.set("search", updatedFilters.search)
      } else {
        params.delete("search")
      }

      if (updatedFilters.categoryId) {
        params.set("categoryId", updatedFilters.categoryId)
      } else {
        params.delete("categoryId")
      }

      if (updatedFilters.tagIds.length > 0) {
        params.set("tagIds", updatedFilters.tagIds.join(","))
      } else {
        params.delete("tagIds")
      }

      if (updatedFilters.minPrice) {
        params.set("minPrice", updatedFilters.minPrice.toString())
      } else {
        params.delete("minPrice")
      }

      if (updatedFilters.maxPrice) {
        params.set("maxPrice", updatedFilters.maxPrice.toString())
      } else {
        params.delete("maxPrice")
      }

      if (updatedFilters.orderBy) {
        params.set("orderBy", updatedFilters.orderBy)
      }

      if (updatedFilters.page > 1) {
        params.set("page", updatedFilters.page.toString())
      } else {
        params.delete("page")
      }

      if (updatedFilters.limit !== 20) {
        params.set("limit", updatedFilters.limit.toString())
      } else {
        params.delete("limit")
      }

      router.push(`/urunler?${params.toString()}`)
    },
    [filters, router, searchParams]
  )

  // Backend'den ürünleri çek
  const fetchProducts = useCallback(
    async (newFilters: typeof filters) => {
      setLoading(true)
      try {
        const response = await getProducts({
          search: newFilters.search || undefined,
          categoryId: newFilters.categoryId || undefined,
          tagIds: newFilters.tagIds.length > 0 ? newFilters.tagIds.join(",") : undefined,
          minPrice: newFilters.minPrice,
          maxPrice: newFilters.maxPrice,
          orderBy: newFilters.orderBy,
          page: newFilters.page,
          limit: newFilters.limit,
        })

        setProducts(transformProductList(response.products))
        setPagination({
          total: response.total,
          page: response.page,
          limit: response.limit,
          totalPages: response.totalPages,
        })
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // Filtre değiştiğinde
  const handleFilterChange = useCallback(
    (newFilters: Partial<typeof filters>) => {
      const updatedFilters = { ...filters, ...newFilters, page: 1 } // Sayfa sıfırla
      setFilters(updatedFilters)
      updateURL(updatedFilters)
      fetchProducts(updatedFilters)
    },
    [filters, updateURL, fetchProducts]
  )

  // Sayfa değiştiğinde
  const handlePageChange = useCallback(
    (newPage: number) => {
      const updatedFilters = { ...filters, page: newPage }
      setFilters(updatedFilters)
      updateURL(updatedFilters)
      fetchProducts(updatedFilters)
      window.scrollTo({ top: 0, behavior: "smooth" })
    },
    [filters, updateURL, fetchProducts]
  )

  // Filtreleri temizle
  const clearFilters = useCallback(() => {
    const clearedFilters = {
      search: "",
      categoryId: "",
      tagIds: [],
      minPrice: undefined,
      maxPrice: undefined,
      orderBy: "created_at_desc" as OrderBy,
      page: 1,
      limit: 20,
    }
    setFilters(clearedFilters)
    updateURL(clearedFilters)
    fetchProducts(clearedFilters)
  }, [updateURL, fetchProducts])

  // Kategorileri düzleştir (recursive yapıyı)
  const flattenCategories = (cats: Category[]): Category[] => {
    const result: Category[] = []
    for (const cat of cats) {
      result.push(cat)
      if (cat.children && cat.children.length > 0) {
        result.push(...flattenCategories(cat.children))
      }
    }
    return result
  }

  const flatCategories = flattenCategories(categories)

  // Fiyat aralığını hesapla (ürünlerden)
  const priceRange = products.length > 0
    ? [
        Math.min(...products.map((p) => p.price)),
        Math.max(...products.map((p) => p.price)),
      ]
    : [0, 1000]

  const FiltersSidebar = () => (
    <aside className="hidden lg:block w-64 flex-shrink-0">
      <div className="sticky top-24 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground">Filtreler</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs"
          >
            Temizle
          </Button>
        </div>

        {/* Arama */}
        <div>
          <Label htmlFor="search" className="text-sm font-medium mb-2 block">
            Arama
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Ürün ara..."
              value={filters.search}
              onChange={(e) =>
                handleFilterChange({ search: e.target.value })
              }
              className="pl-9"
            />
          </div>
        </div>

        {/* Kategoriler */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Kategoriler</Label>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {flatCategories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={filters.categoryId === category.id}
                  onCheckedChange={(checked) =>
                    handleFilterChange({
                      categoryId: checked ? category.id : "",
                    })
                  }
                />
                <Label
                  htmlFor={`category-${category.id}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Tag'ler */}
        {tags.length > 0 && (
          <div>
            <Label className="text-sm font-medium mb-3 block">Etiketler</Label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {tags.map((tag) => (
                <div key={tag.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag.id}`}
                    checked={filters.tagIds.includes(tag.id)}
                    onCheckedChange={(checked) => {
                      const newTagIds = checked
                        ? [...filters.tagIds, tag.id]
                        : filters.tagIds.filter((id) => id !== tag.id)
                      handleFilterChange({ tagIds: newTagIds })
                    }}
                  />
                  <Label
                    htmlFor={`tag-${tag.id}`}
                    className="text-sm cursor-pointer flex-1 flex items-center gap-2"
                  >
                    <span
                      className="size-3 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fiyat Aralığı */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Fiyat Aralığı
          </Label>
          <div className="space-y-4">
            <Slider
              min={0}
              max={priceRange[1] || 1000}
              value={[
                filters.minPrice || 0,
                filters.maxPrice || priceRange[1] || 1000,
              ]}
              onValueChange={([min, max]) =>
                handleFilterChange({
                  minPrice: min > 0 ? min : undefined,
                  maxPrice: max < (priceRange[1] || 1000) ? max : undefined,
                })
              }
              step={10}
              className="w-full"
            />
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ""}
                onChange={(e) =>
                  handleFilterChange({
                    minPrice: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                className="w-full"
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ""}
                onChange={(e) =>
                  handleFilterChange({
                    maxPrice: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  )

  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground">
            Tüm Ürünler
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Fotoğraflarınızdan benzersiz LED lambalara. Koleksiyonumuzu keşfedin.
          </p>
        </motion.div>

        {/* Mobile Filtreler Butonu */}
        <div className="lg:hidden mb-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <Filter className="mr-2 size-4" />
                Filtreler
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <FiltersSidebar />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filtreler */}
          <FiltersSidebar />

          {/* Ürünler */}
          <div className="flex-1">
            {/* Sıralama ve Limit */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {pagination.total} ürün bulundu
              </p>
              <div className="flex items-center gap-4">
                <Select
                  value={filters.orderBy}
                  onValueChange={(value) =>
                    handleFilterChange({ orderBy: value as OrderBy })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sırala" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at_desc">Yeni Eklenenler</SelectItem>
                    <SelectItem value="created_at_asc">Eski Eklenenler</SelectItem>
                    <SelectItem value="price_asc">Fiyat: Düşükten Yükseğe</SelectItem>
                    <SelectItem value="price_desc">Fiyat: Yüksekten Düşüğe</SelectItem>
                    <SelectItem value="name_asc">İsim: A-Z</SelectItem>
                    <SelectItem value="name_desc">İsim: Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Ürün Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[4/5] bg-secondary animate-pulse rounded"
                  />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      image={product.image}
                      category={product.category}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      Önceki
                    </Button>
                    {[...Array(pagination.totalPages)].map((_, i) => {
                      const page = i + 1
                      if (
                        page === 1 ||
                        page === pagination.totalPages ||
                        (page >= pagination.page - 1 && page <= pagination.page + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={pagination.page === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </Button>
                        )
                      } else if (
                        page === pagination.page - 2 ||
                        page === pagination.page + 2
                      ) {
                        return <span key={page} className="px-2">...</span>
                      }
                      return null
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      Sonraki
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground">
                  Aradığınız kriterlere uygun ürün bulunamadı.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Filtreleri Temizle
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
