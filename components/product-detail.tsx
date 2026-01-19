"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Truck, Shield, Clock, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import type { ProductDetail as ProductDetailType } from "@/services/products"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface ProductDetailProps {
  product: ProductDetailType
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { addToCart } = useCart()
  const router = useRouter()

  // Görselleri hazırla
  const images = useMemo(() => {
    const imageList: string[] = []
    if (product.gallery.mainImage?.s3Url) {
      imageList.push(product.gallery.mainImage.s3Url)
    }
    if (product.gallery.thumbnailImage?.s3Url && product.gallery.thumbnailImage.s3Url !== product.gallery.mainImage?.s3Url) {
      imageList.push(product.gallery.thumbnailImage.s3Url)
    }
    product.gallery.detailImages.forEach((img) => {
      if (img.s3Url && !imageList.includes(img.s3Url)) {
        imageList.push(img.s3Url)
      }
    })
    return imageList.length > 0 ? imageList : ["/placeholders/placeholder.svg"]
  }, [product.gallery])

  // Varyasyon seçimi için state (varyasyonlu ürünler için)
  const [selectedVariantValues, setSelectedVariantValues] = useState<Record<string, string>>({})

  // selectedCombination varsa, selectedVariantValues'i otomatik set et
  useEffect(() => {
    if (product.type === 'VARIANT' && product.selectedCombination) {
      const initialValues: Record<string, string> = {}
      product.selectedCombination.variantValues.forEach((vv: any) => {
        const option = product.variantOptions?.find(opt =>
          opt.values.some(val => val.id === vv.id)
        )
        if (option) {
          initialValues[option.id] = vv.id
        }
      })
      setSelectedVariantValues(initialValues)
    }
  }, [product])

  // Geçerli kombinasyonları filtrele (isActive: true ve isDisabled: false)
  const validCombinations = useMemo(() => {
    if (product.type === 'SIMPLE' || !product.variantCombinations) return []
    return product.variantCombinations.filter(
      (combination) => combination.isActive && !combination.isDisabled
    )
  }, [product])

  // Bir varyasyon değerinin seçilebilir olup olmadığını kontrol et
  const isVariantValueSelectable = useCallback(
    (optionId: string, valueId: string): boolean => {
      if (product.type === 'SIMPLE' || !validCombinations.length) return false

      // Bu değeri içeren geçerli kombinasyonları bul
      const combinationsWithThisValue = validCombinations.filter((combination) =>
        combination.variantValues.some((vv: any) => vv.id === valueId)
      )

      if (combinationsWithThisValue.length === 0) return false

      // Eğer başka seçili değerler varsa, bu değerle birlikte geçerli bir kombinasyon oluşturabilir miyiz?
      const otherSelectedValues = { ...selectedVariantValues }
      delete otherSelectedValues[optionId] // Mevcut seçili değeri kaldır

      // Diğer seçili değerlerle uyumlu kombinasyonları bul
      const compatibleCombinations = combinationsWithThisValue.filter((combination) => {
        const combinationValueIds = combination.variantValues.map((vv: any) => vv.id)
        const otherSelectedIds = Object.values(otherSelectedValues)

        // Eğer başka seçili değer yoksa, bu kombinasyon geçerli
        if (otherSelectedIds.length === 0) return true

        // Diğer seçili değerlerin hepsi bu kombinasyonda olmalı
        return otherSelectedIds.every((id) => combinationValueIds.includes(id))
      })

      return compatibleCombinations.length > 0
    },
    [product, validCombinations, selectedVariantValues]
  )

  // Seçili kombinasyonu bul
  const currentCombination = useMemo(() => {
    if (product.type === 'SIMPLE') return null

    if (product.selectedCombination) {
      // Seçili kombinasyon geçerli mi kontrol et
      if (product.selectedCombination.isActive && !product.selectedCombination.isDisabled) {
        return product.selectedCombination
      }
    }

    // Seçili varyasyon değerlerine göre geçerli kombinasyon bul
    if (validCombinations.length > 0 && Object.keys(selectedVariantValues).length > 0) {
      const found = validCombinations.find((combination) => {
        const combinationValueIds = combination.variantValues.map((vv: any) => vv.id).sort()
        const selectedValueIds = Object.values(selectedVariantValues).sort()
        return combinationValueIds.length === selectedValueIds.length &&
          combinationValueIds.every((id, index) => id === selectedValueIds[index])
      })
      return found || null
    }

    return null
  }, [product, selectedVariantValues, validCombinations])

  // Fiyat hesapla
  const displayPrice = useMemo(() => {
    if (product.type === 'SIMPLE') {
      return product.price
    } else {
      // Varyasyonlu ürün için seçili kombinasyonun fiyatını kullan
      if (currentCombination) {
        return currentCombination.price
      }
      // Seçili kombinasyon yoksa en düşük fiyatlı kombinasyonu bul
      if (product.variantCombinations && product.variantCombinations.length > 0) {
        const prices = product.variantCombinations
          .filter(c => c.isActive && !c.isDisabled)
          .map(c => c.price)
        return prices.length > 0 ? Math.min(...prices) : product.basePrice
      }
      return product.basePrice
    }
  }, [product, currentCombination])

  // Kategori bilgisi
  const category = product.categories[0]
  const categoryName = category?.name || 'Genel'
  const categorySlug = category?.slug || ''

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleAddToCart = () => {
    setIsAddingToCart(true)

    // Sepete ekleme mantığı
    let color = ''
    let size = ''

    // Varyasyonlu ürünler için seçili kombinasyonun varyasyon değerlerini al
    if (product.type === 'VARIANT' && currentCombination) {
      currentCombination.variantValues.forEach((vv: any) => {
        const option = product.variantOptions?.find(opt =>
          opt.values.some(val => val.id === vv.id)
        )
        if (option) {
          if (option.type === 'COLOR') {
            color = vv.value || ''
          } else if (option.type === 'SIZE' || option.name.toLowerCase().includes('boyut')) {
            size = vv.value || ''
          }
        }
      })
    }

    const cartItem = {
      id: product.type === 'SIMPLE' ? product.productId : (currentCombination?.id || product.productId),
      name: product.name,
      price: displayPrice,
      image: images[0],
      color: color || 'N/A',
      size: size || 'N/A',
      productId: product.productId,
      variantId: product.type === 'VARIANT' ? (currentCombination?.id || null) : null,
    }

    addToCart(cartItem)

    setTimeout(() => {
      setIsAddingToCart(false)
    }, 500)
  }

  // Varyasyon değeri seçildiğinde
  const handleVariantValueSelect = (optionId: string, valueId: string) => {
    // Seçilebilir mi kontrol et
    if (!isVariantValueSelectable(optionId, valueId)) {
      return
    }

    const newSelectedValues = {
      ...selectedVariantValues,
      [optionId]: valueId
    }
    setSelectedVariantValues(newSelectedValues)

    // Yeni kombinasyonu bul (sadece geçerli kombinasyonlar arasından)
    if (product.type === 'VARIANT' && validCombinations.length > 0) {
      const newCombination = validCombinations.find((combination) => {
        const combinationValueIds = combination.variantValues.map((vv: any) => vv.id).sort()
        const selectedValueIds = Object.values(newSelectedValues).sort()
        return combinationValueIds.length === selectedValueIds.length &&
          combinationValueIds.every((id, index) => id === selectedValueIds[index])
      })

      // Yeni kombinasyon bulunduysa ve slug'ı varsa, o slug'a yönlendir
      if (newCombination && newCombination.slug) {
        router.push(`/urun/${newCombination.slug}`)
      }
    }
  }

  return (
    <section className="py-12 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                Anasayfa
              </Link>
            </li>
            {categorySlug && (
              <>
            <li>/</li>
            <li>
                  <Link href={`/urunler?categorySlugs=${categorySlug}`} className="hover:text-foreground transition-colors">
                    {categoryName}
              </Link>
            </li>
              </>
            )}
            <li>/</li>
            <li className="text-foreground">{product.name}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <div className="relative aspect-4/5 bg-secondary overflow-hidden rounded-lg">
              <Image
                src={images[selectedImage] || "/placeholders/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors rounded-full"
                    aria-label="Önceki resim"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors rounded-full"
                    aria-label="Sonraki resim"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto">
                {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 overflow-hidden rounded-lg shrink-0 ${selectedImage === index ? "ring-2 ring-foreground" : ""
                  }`}
                >
                  <Image
                    src={image || "/placeholders/placeholder.svg"}
                    alt={`${product.name} - Görsel ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
            )}
          </div>

          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wider">{categoryName}</p>
            <h1 className="mt-2 font-serif text-3xl sm:text-4xl text-foreground">{product.name}</h1>

            {/* Fiyat ve İndirim */}
            <div className="mt-4 flex items-baseline gap-2">
              {product.isOnSale && product.discountedPrice && product.basePrice > product.discountedPrice ? (
                <>
                  <span className="text-2xl font-bold text-foreground">
                    {displayPrice.toLocaleString("tr-TR")} ₺
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    {product.basePrice.toLocaleString("tr-TR")} ₺
                  </span>
                  <Badge className="bg-red-500 text-white">
                    %{Math.round(((product.basePrice - product.discountedPrice) / product.basePrice) * 100)} İNDİRİM
                  </Badge>
                </>
              ) : (
                <span className="text-2xl font-bold text-foreground">
                  {displayPrice.toLocaleString("tr-TR")} ₺
                </span>
              )}
            </div>

            <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Varyasyon Seçenekleri (Varyasyonlu Ürünler için) */}
            {product.type === 'VARIANT' && product.variantOptions && product.variantOptions.length > 0 && (
            <div className="mt-8 space-y-6">
                {product.variantOptions.map((option) => (
                  <div key={option.id}>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      {option.name} {option.isRequired && <span className="text-red-500">*</span>}
                    </label>
                <div className="flex flex-wrap gap-2">
                      {option.values
                        .filter(value => value.isActive)
                        .map((value) => {
                          const isSelected = selectedVariantValues[option.id] === value.id
                          const isSelectable = isVariantValueSelectable(option.id, value.id)
                          const isDisabled = !isSelectable

                          return (
                    <button
                              key={value.id}
                              onClick={() => {
                                if (!isDisabled) {
                                  handleVariantValueSelect(option.id, value.id)
                                }
                              }}
                              disabled={isDisabled}
                              className={`px-4 py-2 text-sm border transition-colors rounded-lg relative ${isDisabled
                                ? "opacity-40 cursor-not-allowed border-muted/50 bg-muted/20"
                                : isSelected
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground"
                      }`}
                              title={isDisabled ? "Bu seçenek mevcut değil" : undefined}
                            >
                              <span className={`relative ${isDisabled ? "line-through decoration-2" : ""}`}>
                                {option.type === 'COLOR' && value.colorCode ? (
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-5 h-5 rounded-full border border-border"
                                      style={{ backgroundColor: value.colorCode }}
                                    />
                                    <span>{value.value}</span>
                                  </div>
                                ) : (
                                  value.value
                                )}
                              </span>
                              {value.priceDelta !== 0 && (
                                <span className={`ml-2 text-xs ${isDisabled ? "line-through decoration-2" : ""}`}>
                                  {value.priceDelta > 0 ? '+' : ''}{value.priceDelta.toLocaleString("tr-TR")} ₺
                                </span>
                              )}
                    </button>
                          )
                        })}
                </div>
              </div>
                  ))}
                </div>
            )}

            {/* Stok Durumu */}
            {product.type === 'SIMPLE' && product.stock && product.stock.usableQuantity > 0 && (
              <div className="mt-6">
                <p className="text-sm text-muted-foreground">Stokta var ({product.stock.usableQuantity} adet)</p>
                    </div>
                  )}

            {product.type === 'VARIANT' && currentCombination && currentCombination.stock && currentCombination.stock.usableQuantity > 0 && (
              <div className="mt-6">
                <p className="text-sm text-muted-foreground">Stokta var ({currentCombination.stock.usableQuantity} adet)</p>
              </div>
            )}

            <div className="mt-8 flex gap-4">
              {(() => {
                // Stok durumunu kontrol et
                const isOutOfStock =
                  (product.type === 'SIMPLE' && product.stock?.usableQuantity === 0) ||
                  (product.type === 'VARIANT' && currentCombination?.stock?.usableQuantity === 0) ||
                  (product.type === 'VARIANT' && !currentCombination)

                if (isOutOfStock) {
                  return (
                    <button
                      disabled
                      className="flex-1 py-4 bg-muted text-muted-foreground font-medium text-sm uppercase tracking-wider cursor-not-allowed flex items-center justify-center gap-2 rounded-lg"
                    >
                      Stokta Yok
                    </button>
                  )
                }

                return (
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                    className="flex-1 py-4 bg-primary text-primary-foreground font-medium text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-lg"
              >
                {isAddingToCart ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Ekleniyor...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    Sepete Ekle
                  </>
                )}
              </button>
                )
              })()}
              <Link
                href="/sepet"
                className="px-6 py-4 border-2 border-foreground text-foreground font-medium text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors flex items-center justify-center rounded-lg"
              >
                Sepete Git
              </Link>
            </div>

            <div className="mt-8 flex justify-center">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-foreground">Teslimat</p>
                    <p className="text-xs text-muted-foreground">3-5 iş günü</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-foreground">Güvenli</p>
                    <p className="text-xs text-muted-foreground">SSL Ödeme</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-foreground">Özel Üretim</p>
                    <p className="text-xs text-muted-foreground">Sizin için</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ürün Açıklama Tab Bölümü */}
        <div
          className="mt-16 lg:mt-20"
        >
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full lg:w-fit mb-0 h-auto bg-transparent border-b border-border rounded-none p-0">
              <TabsTrigger 
                value="description" 
                className="px-6 py-3 text-base font-medium data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:bg-transparent rounded-none"
              >
                Ürün Açıklaması
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-0">
              <div className="bg-secondary/30 border-x border-b border-border p-6 lg:p-8 -mt-px">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-4">Ürün Hakkında</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
