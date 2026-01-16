"use client"

import { useState, useCallback, useMemo } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Search, Filter, ChevronRight, ChevronDown } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
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
    categorySlugs: string[]
    tagSlugs: string[]
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

  // Arama için local state (yönlendirme yapmadan önce)
  const [localSearch, setLocalSearch] = useState(initialFilters.search)

  // Fiyat aralığı için constant değerler
  const PRICE_MIN = 0
  const PRICE_MAX = 5000

  // Fiyat aralığı için local state (yönlendirme yapmadan önce)
  // String olarak tutuyoruz ki input focus kaybetmesin
  const [localMinPrice, setLocalMinPrice] = useState<string>(
    initialFilters.minPrice?.toString() || ""
  )
  const [localMaxPrice, setLocalMaxPrice] = useState<string>(
    initialFilters.maxPrice?.toString() || ""
  )

  // Mobil için local state'ler (kategori ve tag seçimleri için)
  const isMobile = useIsMobile()
  const [localCategorySlugs, setLocalCategorySlugs] = useState<string[]>(initialFilters.categorySlugs)
  const [localTagSlugs, setLocalTagSlugs] = useState<string[]>(initialFilters.tagSlugs)
  const [isSheetOpen, setIsSheetOpen] = useState(false)


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

      if (updatedFilters.categorySlugs.length > 0) {
        params.set("categorySlugs", updatedFilters.categorySlugs.join(","))
      } else {
        params.delete("categorySlugs")
      }

      if (updatedFilters.tagSlugs.length > 0) {
        params.set("tagSlugs", updatedFilters.tagSlugs.join(","))
      } else {
        params.delete("tagSlugs")
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
          categorySlugs: newFilters.categorySlugs.length > 0 ? newFilters.categorySlugs.join(",") : undefined,
          tagSlugs: newFilters.tagSlugs.length > 0 ? newFilters.tagSlugs.join(",") : undefined,
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
      categorySlugs: [],
      tagSlugs: [],
      minPrice: undefined,
      maxPrice: undefined,
      orderBy: "created_at_desc" as OrderBy,
      page: 1,
      limit: 20,
    }
    setFilters(clearedFilters)
    setLocalSearch("")
    setLocalMinPrice("")
    setLocalMaxPrice("")
    setLocalCategorySlugs([])
    setLocalTagSlugs([])
    updateURL(clearedFilters)
    fetchProducts(clearedFilters)
  }, [updateURL, fetchProducts]);

  const handleMinPriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMinPrice(e.target.value)
  }, []);

  const handleMaxPriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMaxPrice(e.target.value);
  }, []);

  // Tüm children slug'larını recursive olarak topla
  const getAllChildrenSlugs = (category: Category): string[] => {
    const slugs = [category.slug]
    if (category.children && category.children.length > 0) {
      category.children.forEach((child) => {
        slugs.push(...getAllChildrenSlugs(child))
      })
    }
    return slugs
  }

  // Tüm parent slug'larını recursive olarak topla
  const getAllParentSlugs = (category: Category, allCategories: Category[]): string[] => {
    const slugs: string[] = []
    if (category.parentId) {
      const parent = findCategoryById(category.parentId, allCategories)
      if (parent) {
        slugs.push(parent.slug)
        slugs.push(...getAllParentSlugs(parent, allCategories))
      }
    }
    return slugs
  }

  // ID'ye göre kategori bul
  const findCategoryById = (id: string, cats: Category[]): Category | null => {
    for (const cat of cats) {
      if (cat.id === id) return cat
      if (cat.children && cat.children.length > 0) {
        const found = findCategoryById(id, cat.children)
        if (found) return found
      }
    }
    return null
  }

  // Kategori seçildiğinde tüm children'ları da seç
  const handleCategoryToggle = (category: Category, checked: boolean) => {
    const childrenSlugs = getAllChildrenSlugs(category)
    const currentCategorySlugs = isMobile ? localCategorySlugs : filters.categorySlugs
    let newCategorySlugs: string[]

    if (checked) {
      // Seçildiğinde: kendisi + tüm children'ları ekle
      newCategorySlugs = [...new Set([...currentCategorySlugs, ...childrenSlugs])]
    } else {
      // Seçimi kaldırıldığında: kendisi + tüm children'ları kaldır
      newCategorySlugs = currentCategorySlugs.filter(
        (slug) => !childrenSlugs.includes(slug)
      )
    }

    // Mobilde local state'i güncelle, masaüstünde direkt filtrele
    if (isMobile) {
      setLocalCategorySlugs(newCategorySlugs)
    } else {
      handleFilterChange({ categorySlugs: newCategorySlugs })
    }
  }

  // Kategorinin seçili olup olmadığını kontrol et
  // Parent'ın checked olması için TÜM children'ları seçili olmalı
  const isCategorySelected = useCallback((category: Category): boolean => {
    // Mobilde local state'i kullan, masaüstünde filters'ı kullan
    const categorySlugs = isMobile ? localCategorySlugs : filters.categorySlugs

    // Eğer children yoksa, sadece kendisinin seçili olup olmadığını kontrol et
    if (!category.children || category.children.length === 0) {
      return categorySlugs.includes(category.slug)
    }

    // Parent için: TÜM children'ları seçili olmalı
    const childrenSlugs = getAllChildrenSlugs(category).filter(
      (slug) => slug !== category.slug
    )

    // Eğer hiçbir child yoksa, parent checked olamaz
    if (childrenSlugs.length === 0) {
      return false
    }

    // TÜM children'lar seçili mi kontrol et
    const allChildrenSelected = childrenSlugs.every((slug) =>
      categorySlugs.includes(slug)
    )

    // Parent checked olabilmesi için TÜM children'ları seçili olmalı
    return allChildrenSelected
  }, [isMobile, localCategorySlugs, filters.categorySlugs])

  // Kategorinin indeterminate durumunu kontrol et (bazı children'lar seçili ama hepsi değil)
  const isCategoryIndeterminate = useCallback((category: Category): boolean => {
    if (!category.children || category.children.length === 0) return false

    const categorySlugs = isMobile ? localCategorySlugs : filters.categorySlugs

    // Kendisi seçiliyse indeterminate değil, tamamen seçili
    if (categorySlugs.includes(category.slug)) {
      return false
    }

    const childrenSlugs = getAllChildrenSlugs(category).filter(
      (slug) => slug !== category.slug
    )
    const selectedChildren = childrenSlugs.filter((slug) =>
      categorySlugs.includes(slug)
    )

    // Bazı children seçili ama hepsi değilse indeterminate
    return selectedChildren.length > 0 && selectedChildren.length < childrenSlugs.length
  }, [isMobile, localCategorySlugs, filters.categorySlugs])

  // Kategorinin herhangi bir child'ının seçili olup olmadığını kontrol et
  const hasAnyChildSelected = useCallback((category: Category): boolean => {
    if (!category.children || category.children.length === 0) return false

    const categorySlugs = isMobile ? localCategorySlugs : filters.categorySlugs
    const childrenSlugs = getAllChildrenSlugs(category).filter(
      (slug) => slug !== category.slug
    )
    return childrenSlugs.some((slug) => categorySlugs.includes(slug))
  }, [isMobile, localCategorySlugs, filters.categorySlugs])

  // Renk parlaklığını hesapla (0-255 arası)
  const getLuminance = (hex: string): number => {
    // Hex rengini RGB'ye çevir
    const rgb = hex.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
    if (!rgb) return 128 // Varsayılan orta değer

    const r = parseInt(rgb[1], 16)
    const g = parseInt(rgb[2], 16)
    const b = parseInt(rgb[3], 16)

    // Relative luminance hesaplama (WCAG standardı)
    const [rs, gs, bs] = [r, g, b].map((val) => {
      val = val / 255
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
    })

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  // Renk parlaklığına göre metin rengini belirle
  const getTextColor = (backgroundColor: string): string => {
    const luminance = getLuminance(backgroundColor)
    // Eğer renk açıksa (luminance > 0.5), koyu metin kullan
    // Eğer renk koyuysa (luminance <= 0.5), beyaz metin kullan
    return luminance > 0.5 ? "text-foreground" : "text-white"
  }

  // Hiyerarşik kategori render fonksiyonu - useCallback ile memoize et
  const renderCategory = useCallback((category: Category, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0
    const isSelected = isCategorySelected(category)
    const isIndeterminate = isCategoryIndeterminate(category)
    const shouldBeOpen = hasAnyChildSelected(category)
    const indent = level * 20

    // Typography seviyesine göre font boyutu ve ağırlığı
    const getTypographyClass = (level: number) => {
      if (level === 0) {
        return "font-semibold text-base text-foreground"
      } else if (level === 1) {
        return "font-medium text-sm text-foreground/90"
      } else {
        return "font-normal text-sm text-muted-foreground"
      }
    }

    return (
      <div key={category.id} className="space-y-1">
        <div
          className="flex items-center space-x-2 group rounded-md px-2 py-1.5"
          style={{ paddingLeft: `${indent}px` }}
        >
          {hasChildren ? (
            <Collapsible className="w-full" defaultOpen={shouldBeOpen} suppressHydrationWarning>
              <div className="flex items-center space-x-2 flex-1">
                <CollapsibleTrigger asChild>
                  <button className="flex items-center justify-center w-5 h-5 hover:bg-muted rounded transition-colors flex-shrink-0" suppressHydrationWarning>
                    <ChevronRight className="size-3.5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
                  </button>
                </CollapsibleTrigger>
                <Checkbox
                  id={`category-${category.id}`}
                  checked={isSelected}
                  onCheckedChange={(checked) =>
                    handleCategoryToggle(category, checked === true)
                  }
                  className={
                    isIndeterminate
                      ? "data-[state=checked]:bg-muted data-[state=checked]:border-muted opacity-75 flex-shrink-0"
                      : "flex-shrink-0"
                  }
                />
                <Label
                  htmlFor={`category-${category.id}`}
                  className={`cursor-pointer flex-1 ${getTypographyClass(level)}`}
                >
                  {category.name}
                </Label>
              </div>
              <CollapsibleContent className="mt-1">
                <div className="space-y-0.5 border-l-2 border-muted/30 ml-2.5 pl-3">
                  {category.children?.map((child) => renderCategory(child, level + 1))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <>
              <div className="w-5 flex-shrink-0" /> {/* Spacer for alignment */}
              <Checkbox
                id={`category-${category.id}`}
                checked={isSelected}
                onCheckedChange={(checked) =>
                  handleCategoryToggle(category, checked === true)
                }
                className="flex-shrink-0"
              />
              <Label
                htmlFor={`category-${category.id}`}
                className={`cursor-pointer flex-1 ${getTypographyClass(level)}`}
              >
                {category.name}
              </Label>
            </>
          )}
        </div>
      </div>
    )
  }, [filters.categorySlugs, handleCategoryToggle, isCategorySelected, isCategoryIndeterminate, hasAnyChildSelected])


  // FiltersSidebar'ı memoize et - sadece bağımlılıklar değiştiğinde yeniden render et
  const FiltersSidebar = useMemo(() => (
    <aside className="w-full lg:w-64 flex-shrink-0 z-900">
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
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleFilterChange({ search: localSearch })
                }
              }}
              className="pl-9"
            />
          </div>
        </div>

        {/* Kategoriler */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Kategoriler</Label>
          <div className="space-y-1">
            {categories.map((category) => renderCategory(category, 0))}
          </div>
        </div>

        {/* Tag'ler */}
        {tags.length > 0 && (
          <div>
            <Label className="text-sm font-medium mb-3 block">Etiketler</Label>
            <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
              {tags.map((tag) => {
                // Mobilde local state'i kullan, masaüstünde filters'ı kullan
                const tagSlugs = isMobile ? localTagSlugs : filters.tagSlugs
                const isSelected = tagSlugs.includes(tag.slug)
                const textColorClass = isSelected ? getTextColor(tag.color) : ""
                const dotColor = isSelected
                  ? (getLuminance(tag.color) > 0.5 ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.3)")
                  : tag.color

                return (
                  <Badge
                    key={tag.id}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer transition-all hover:scale-105 hover:shadow-sm ${isSelected ? textColorClass : ""
                      }`}
                    style={{
                      backgroundColor: isSelected ? tag.color : undefined,
                      borderColor: isSelected ? tag.color : tag.color,
                      borderWidth: isSelected ? undefined : "1px",
                    }}
                    onClick={() => {
                      const newTagSlugs = isSelected
                        ? tagSlugs.filter((slug) => slug !== tag.slug)
                        : [...tagSlugs, tag.slug]

                      // Mobilde local state'i güncelle, masaüstünde direkt filtrele
                      if (isMobile) {
                        setLocalTagSlugs(newTagSlugs)
                      } else {
                        handleFilterChange({ tagSlugs: newTagSlugs })
                      }
                    }}
                  >
                    <span
                      className="size-2 rounded-full mr-1.5 flex-shrink-0"
                      style={{
                        backgroundColor: dotColor
                      }}
                    />
                    <span className="font-medium">{tag.name}</span>
                  </Badge>
                )
              })}
            </div>
          </div>
        )}

        {/* Fiyat Aralığı */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Fiyat Aralığı
          </Label>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min Fiyat"
                value={localMinPrice}
                onChange={(e) => handleMinPriceChange(e)}
                className="w-full"
              />
              <Input
                type="number"
                placeholder="Max Fiyat"
                value={localMaxPrice}
                onChange={(e) => handleMaxPriceChange(e)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Filtrele Butonu */}
        <Button
          onClick={() => {
            if (isMobile) {
              // Mobilde tüm filtreleri uygula ve drawer'ı kapat
              handleFilterChange({
                search: localSearch,
                categorySlugs: localCategorySlugs,
                tagSlugs: localTagSlugs,
                minPrice: localMinPrice ? Number(localMinPrice) : undefined,
                maxPrice: localMaxPrice ? Number(localMaxPrice) : undefined,
              })
              setIsSheetOpen(false)
            } else {
              // Masaüstünde sadece arama ve fiyat filtrelerini uygula
              handleFilterChange({
                search: localSearch,
                minPrice: localMinPrice ? Number(localMinPrice) : undefined,
                maxPrice: localMaxPrice ? Number(localMaxPrice) : undefined,
              })
            }
          }}
          className="w-full"
        >
          Filtrele
        </Button>
      </div>
    </aside>
  ), [
    clearFilters,
    localSearch,
    handleFilterChange,
    categories,
    renderCategory,
    tags,
    filters.tagSlugs,
    localMinPrice,
    localMaxPrice,
    handleMinPriceChange,
    handleMaxPriceChange,
    isMobile,
    localCategorySlugs,
    localTagSlugs,
    setIsSheetOpen,
  ])

  return (
    <section className="pb-24 pt-12 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Başlık */}

        {/* Mobile Filtreler Butonu */}
        <div className="lg:hidden sticky top-[108px] z-50 bg-background border-b border-border mb-6 -mx-6 px-6 py-4" suppressHydrationWarning>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <Filter className="mr-2 size-4" />
                Filtreler
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-full w-full max-w-full rounded-t-2xl p-0">
              <SheetTitle className="sr-only">Filtreler</SheetTitle>
              <div className="h-full overflow-y-auto p-6">
                {FiltersSidebar}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filtreler */}
          <div className="hidden lg:block">
            {FiltersSidebar}
          </div>

          {/* Ürünler */}
          <div className="flex-1">
            {/* Sıralama ve Limit */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {pagination.total} ürün bulundu
              </p>
              <div className="flex items-center gap-4" suppressHydrationWarning>
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
                      {...product}
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

