"use client"

import { useState, useCallback, useMemo, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Award, Shield, Clock, ChevronLeft, ChevronRight, ShoppingCart, Timer, Truck, RefreshCw } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import type { ProductDetail as ProductDetailType } from "@/services/products"
import { trackEvent, flushAnalytics } from "@/lib/analytics"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PersonalizationFormRenderer } from "@/components/personalization/PersonalizationFormRenderer"
import { MarkdownContent } from "@/components/markdown-content"

interface ProductDetailProps {
  product: ProductDetailType
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { addToCart } = useCart()
  const router = useRouter()
  const openedAtRef = useRef<number>(Date.now())
  const personalizationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics][ProductDetail] PRODUCT_VIEW', { productId: product.productId, variantId: product.selectedCombination?.id ?? null })
    }
    trackEvent({
      type: 'PRODUCT_VIEW',
      productId: product.productId,
      variantId: product.selectedCombination?.id ?? null,
    })
  }, [product.productId, product.selectedCombination?.id])

  const TrustBadges = () => (
    <div className="grid grid-cols-3 gap-2 lg:gap-4">
      <div className="flex items-center gap-2 lg:gap-3">
        <div className="flex-shrink-0 w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Timer className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-xs lg:text-sm font-medium text-foreground truncate">Sınırlı Süreli Kampanya</p>
          <p className="text-[10px] lg:text-xs text-muted-foreground truncate">Özel fırsatlar</p>
        </div>
      </div>
      <div className="flex items-center gap-2 lg:gap-3">
        <div className="flex-shrink-0 w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Truck className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-xs lg:text-sm font-medium text-foreground truncate">Ücretsiz Kargo</p>
          <p className="text-[10px] lg:text-xs text-muted-foreground truncate">Tüm siparişlerde</p>
        </div>
      </div>
      <div className="flex items-center gap-2 lg:gap-3">
        <div className="flex-shrink-0 w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <RefreshCw className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-xs lg:text-sm font-medium text-foreground truncate">14 Gün İade Garantisi</p>
          <p className="text-[10px] lg:text-xs text-muted-foreground truncate">Koşulsuz iade</p>
        </div>
      </div>
    </div>
  )

  useEffect(() => {
    const sendTime = () => {
      const durationSeconds = Math.round((Date.now() - openedAtRef.current) / 1000)
      if (durationSeconds > 0) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[Analytics][ProductDetail] PRODUCT_TIME', { productId: product.productId, durationSeconds })
        }
        trackEvent({
          type: 'PRODUCT_TIME',
          productId: product.productId,
          variantId: product.selectedCombination?.id ?? null,
          durationSeconds,
        })
      }
      flushAnalytics()
    }
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') sendTime()
    }
    const onBeforeUnload = () => sendTime()
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('beforeunload', onBeforeUnload)
      sendTime()
    }
  }, [product.productId, product.selectedCombination?.id])

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
    if (product.type === 'SIMPLE' || !validCombinations.length) return null

    const selectedValueIds = Object.values(selectedVariantValues)
    if (selectedValueIds.length === 0) return null

    // Tüm seçili değerleri içeren kombinasyonu bul
    return validCombinations.find((combination) => {
      const combinationValueIds = combination.variantValues.map((vv: any) => vv.id)
      return (
        selectedValueIds.length === combinationValueIds.length &&
        selectedValueIds.every((id) => combinationValueIds.includes(id))
      )
    }) || null
  }, [validCombinations, selectedVariantValues])

  // Fiyat hesapla
  const displayPrice = useMemo(() => {
    if (product.type === 'SIMPLE') {
      return product.discountedPrice || product.basePrice
    } else {
      if (currentCombination) {
        return currentCombination.price
      }
      // Kombinasyon seçilmediyse en düşük fiyatı göster
      const prices = validCombinations.map((c) => c.price)
      return prices.length > 0 ? Math.min(...prices) : product.basePrice
    }
  }, [product, currentCombination, validCombinations])

  const handleAddToCart = async () => {
    setIsAddingToCart(true)

    try {
      // Kişiselleştirme formu varsa işle
      let personalizationData: {
        formValues: Record<string, any>
        fileIds: string[]
      } | undefined = undefined

      if (product.personalizationForm) {
        const formData = (window as any).__personalizationFormData

        if (!formData) {
          setIsAddingToCart(false)
          return
        }

        // 1. Form validasyonu
        if (formData.validate) {
          const isValid = await formData.validate()
          if (!isValid) {
            setIsAddingToCart(false)
            // Mobilde kişiselleştirme formuna scroll yap (header'ın altına)
            if (personalizationRef.current) {
              setTimeout(() => {
                const headerOffset = 120 // Topbar + Header yüksekliği
                const elementPosition = personalizationRef.current?.getBoundingClientRect().top || 0
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset

                window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth'
                })
              }, 100)
            }
            return
          }
        }

        // 2. ÖNCE Cart ID'yi kontrol et ve yoksa oluştur (dosyalar doğru klasöre kaydedilsin)
        const { getCartId, setCartId } = await import('@/lib/cart-storage')
        const { cartService } = await import('@/services/cart.service')

        let cartId = getCartId()
        console.log('[ProductDetail] Initial cart ID check', { cartId: cartId || 'not found' })

        // Cart ID yoksa, önce cart oluştur (dosyalar doğru klasöre kaydedilsin)
        if (!cartId) {
          console.log('[ProductDetail] Cart ID not found, creating new cart before file upload...')
          try {
            const newCart = await cartService.createGuestCart()
            cartId = newCart.id
            setCartId(cartId)
            console.log('[ProductDetail] New cart created', { cartId })
          } catch (error: any) {
            console.error('[ProductDetail] Failed to create cart before file upload', error)
            // Cart oluşturulamazsa devam et, dosyalar ana dizine kaydedilecek
          }
        }

        // 3. Dosyaları yükle (eğer varsa) - Cart ID artık mevcut
        let uploadedFileIds: string[] = []

        if (formData.selectedFiles && Object.keys(formData.selectedFiles).length > 0) {
          try {
            const selectedFilesObj = formData.selectedFiles as Record<string, File[]>
            console.log('[ProductDetail] Starting file upload process', {
              selectedFiles: Object.keys(selectedFilesObj),
              fileCounts: Object.entries(selectedFilesObj).map(([key, files]) => ({
                fieldKey: key,
                count: files.length,
                fileNames: files.map(f => f.name),
              })),
              cartId: cartId || 'not available',
            })

            const { uploadPersonalizationFiles, preparePersonalizationData } = await import('@/utils/personalization.helper')

            // Dosyaları yükle (cart ID ile) - ASYNC olarak sırayla bekle
            console.log('[ProductDetail] Calling uploadPersonalizationFiles', {
              selectedFiles: formData.selectedFiles,
              cartId: cartId || undefined,
            })
            uploadedFileIds = await uploadPersonalizationFiles(formData.selectedFiles, cartId || undefined)
            console.log('[ProductDetail] Files uploaded successfully', {
              uploadedFileIds,
              count: uploadedFileIds.length,
              cartId: cartId || 'not available',
            })

            // Form değerlerini hazırla (File objelerini file ID'lere çevir)
            const prepared = preparePersonalizationData(
              formData.formValues || {},
              formData.selectedFiles,
              uploadedFileIds
            )

            personalizationData = {
              formValues: prepared.formValues,
              fileIds: prepared.fileIds,
            }
          } catch (uploadError: any) {
            console.error('[ProductDetail] File upload failed:', uploadError)
            setIsAddingToCart(false)
            return
          }
        } else {
          // Dosya yoksa sadece form değerlerini kullan
          personalizationData = {
            formValues: formData.formValues || {},
            fileIds: formData.fileIds || [],
          }
        }
      }

      // 4. Sepete ekle (cart ID zaten mevcut veya oluşturuldu)
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

      // Personalization data'yı window'dan temizle (bir sonraki ekleme için)
      if (product.personalizationForm && (window as any).__personalizationFormData) {
        // Form state'ini koru ama file ID'leri güncelle
        ; (window as any).__personalizationFormData = {
          ...(window as any).__personalizationFormData,
          fileIds: personalizationData?.fileIds || [],
        }
      }

      await addToCart(cartItem, personalizationData, true)
    } catch (error: any) {
      console.error("[ProductDetail] Failed to add to cart:", error)
    } finally {
      setIsAddingToCart(false)
    }
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
  }

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="container mx-auto px-4 py-4 lg:py-8 pb-24 lg:pb-4">
      {/* Mobilde: Image en üstte */}
      <div className="lg:hidden space-y-3 mb-4">
        <div className="relative w-full bg-muted rounded-lg overflow-hidden" style={{ aspectRatio: '1' }}>
          <Image
            src={images[selectedImage]}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-colors"
                aria-label="Önceki resim"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-colors"
                aria-label="Sonraki resim"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
        {/* Nokta göstergeler */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 py-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`h-2 rounded-full transition-all ${
                  selectedImage === index 
                    ? 'bg-primary w-6' 
                    : 'bg-muted-foreground/30 w-2'
                }`}
                aria-label={`Resim ${index + 1}`}
              />
            ))}
          </div>
        )}
        {/* Title ve Subtitle */}
        <div>
          <h1 className="text-xl font-serif font-bold text-foreground leading-tight mb-1">{product.name}</h1>
          {product.subtitle && (
            <p className="text-xs text-muted-foreground">{product.subtitle}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
        {/* Desktop'ta: Görseller sol tarafta */}
        <div className="hidden lg:block lg:order-1 space-y-4">
          <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
            <Image
              src={images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  aria-label="Önceki resim"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  aria-label="Sonraki resim"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} - Resim ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop'ta: Sağ tarafta içerik */}
        <div className="lg:order-2 space-y-3 lg:space-y-6">
          {/* Desktop'ta: Title burada */}
          <div className="hidden lg:block">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground leading-tight mb-2">{product.name}</h1>
            {product.subtitle && (
              <p className="mt-2 text-sm text-muted-foreground">{product.subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-3 lg:gap-4">
            {(() => {
              // SIMPLE ürünler için
              if (product.type === 'SIMPLE') {
                if (product.discountedPrice) {
                  return (
                    <>
                      <span className="text-2xl lg:text-3xl font-bold text-foreground">
                        {product.discountedPrice.toLocaleString('tr-TR')} ₺
                      </span>
                      <span className="text-lg lg:text-xl text-muted-foreground line-through">
                        {product.basePrice.toLocaleString('tr-TR')} ₺
                      </span>
                    </>
                  )
                } else {
                  return (
                    <span className="text-2xl lg:text-3xl font-bold text-foreground">
                      {product.basePrice.toLocaleString('tr-TR')} ₺
                    </span>
                  )
                }
              }

              // VARIANT ürünler için
              if (product.type === 'VARIANT' && currentCombination) {
                if (currentCombination.discountedPrice) {
                  return (
                    <>
                      <span className="text-2xl lg:text-3xl font-bold text-foreground">
                        {currentCombination.discountedPrice.toLocaleString('tr-TR')} ₺
                      </span>
                      <span className="text-lg lg:text-xl text-muted-foreground line-through">
                        {currentCombination.basePrice.toLocaleString('tr-TR')} ₺
                      </span>
                    </>
                  )
                } else {
                  return (
                    <span className="text-2xl lg:text-3xl font-bold text-foreground">
                      {currentCombination.basePrice.toLocaleString('tr-TR')} ₺
                    </span>
                  )
                }
              }

              // Kombinasyon seçilmediyse
              return (
                <span className="text-2xl lg:text-3xl font-bold text-foreground">
                  {displayPrice.toLocaleString('tr-TR')} ₺
                </span>
              )
            })()}
          </div>

          {/* Varyasyon Seçimi */}
          {product.type === 'VARIANT' && product.variantOptions && (
            <div className="space-y-3 lg:space-y-4">
              {product.variantOptions.map((option) => (
                <div key={option.id}>
                  <label className="block text-xs lg:text-sm font-medium text-foreground mb-1.5 lg:mb-2">
                    {option.name}
                  </label>
                  <div className="flex flex-wrap gap-1.5 lg:gap-2">
                    {option.values.map((value) => {
                      const isSelected = selectedVariantValues[option.id] === value.id
                      const isSelectable = isVariantValueSelectable(option.id, value.id)
                      const isDisabled = !isSelectable

                      return (
                        <button
                          key={value.id}
                          onClick={() => handleVariantValueSelect(option.id, value.id)}
                          disabled={isDisabled}
                          className={`
                            px-3 py-1.5 lg:px-4 lg:py-2 text-xs lg:text-sm rounded-lg border-2 transition-all
                            ${isSelected
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border hover:border-primary/50'
                            }
                            ${isDisabled
                              ? 'opacity-50 cursor-not-allowed'
                              : 'cursor-pointer'
                            }
                          `}
                        >
                          {value.value}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Güvenilirlik İfadeleri - Mobilde görünür */}
          <div className="mt-4 lg:mt-6 pt-4 border-t border-border">
            <TrustBadges />
          </div>

          {/* Kişiselleştirme Formu */}
          {product.personalizationForm && (
            <div ref={personalizationRef} id="personalization-form" className="mt-3 lg:mt-6">
              <PersonalizationFormRenderer
                formData={product.personalizationForm}
                productId={product.productId}
                variantId={product.type === 'VARIANT' ? currentCombination?.id : undefined}
              />
            </div>
          )}

          {/* Desktop'ta: Sepete Ekle Butonu */}
          {(() => {
            const canAddToCart = product.type === 'SIMPLE' || currentCombination
            return (
              <div className="hidden lg:block">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || !canAddToCart}
                  className="w-full py-4 bg-primary text-primary-foreground font-medium text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-lg"
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
              </div>
            )
          })()}

          {/* Ürün Özellikleri - Desktop'ta */}
          <div className="hidden lg:grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Kaliteli Ürün</p>
                <p className="text-xs text-muted-foreground">Ahşap Plaka</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Güvenli Ödeme</p>
                <p className="text-xs text-muted-foreground">SSL ile korumalı</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Hızlı Teslimat</p>
                <p className="text-xs text-muted-foreground">1-2 Hafta</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ürün Açıklaması - Mobilde en altta */}
      {product.description && (
        <div className="mt-6 lg:mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList>
              <TabsTrigger value="description">Açıklama</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-0">
              <div className="bg-secondary/30 border-x border-b border-border p-6 lg:p-8 -mt-px">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-serif font-medium text-foreground mb-4">Ürün Hakkında</h3>
                    <MarkdownContent content={product.description} />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Mobilde: Sticky Sepete Ekle Butonu ve Ürün Özellikleri */}
      {(() => {
        const canAddToCart = product.type === 'SIMPLE' || currentCombination
        return (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1.5 flex-1">
                  <Award className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">Kaliteli Ürün</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-1">
                  <Shield className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">Güvenli Ödeme</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-1">
                  <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">Hızlı Teslimat</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || !canAddToCart}
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
                <a
                  href={`https://wa.me/905519770858?text=${encodeURIComponent("Merhaba, ürünleriniz hakkında bilgi almak istiyorum.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 w-[56px] h-[56px] bg-[#25D366] text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
                  aria-label="WhatsApp ile iletişime geç"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
