"use client"

import { useState, useCallback, useMemo, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Award, Shield, Clock, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"
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
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sol Taraf - Görseller */}
        <div className="space-y-4">
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
          {/* Mobil Ürünler Butonu */}
          <Link
            href="/urunler"
            className="lg:hidden w-full py-4 border-2 border-foreground text-foreground font-medium text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors flex items-center justify-center rounded-lg mt-4"
          >
            Ürünleri Keşfet
          </Link>
        </div>

        {/* Sağ Taraf - Ürün Bilgileri */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground leading-tight mb-2">{product.name}</h1>
            {product.subtitle && (
              <p className="mt-2 text-sm text-muted-foreground">{product.subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            {(() => {
              // SIMPLE ürünler için
              if (product.type === 'SIMPLE') {
                if (product.discountedPrice) {
                  return (
                    <>
                      <span className="text-3xl font-bold text-foreground">
                        {product.discountedPrice.toLocaleString('tr-TR')} ₺
                      </span>
                      <span className="text-xl text-muted-foreground line-through">
                        {product.basePrice.toLocaleString('tr-TR')} ₺
                      </span>
                    </>
                  )
                } else {
                  return (
                    <span className="text-3xl font-bold text-foreground">
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
                      <span className="text-3xl font-bold text-foreground">
                        {currentCombination.discountedPrice.toLocaleString('tr-TR')} ₺
                      </span>
                      <span className="text-xl text-muted-foreground line-through">
                        {currentCombination.basePrice.toLocaleString('tr-TR')} ₺
                      </span>
                    </>
                  )
                } else {
                  return (
                    <span className="text-3xl font-bold text-foreground">
                      {currentCombination.basePrice.toLocaleString('tr-TR')} ₺
                    </span>
                  )
                }
              }

              // Kombinasyon seçilmediyse
              return (
                <span className="text-3xl font-bold text-foreground">
                  {displayPrice.toLocaleString('tr-TR')} ₺
                </span>
              )
            })()}
          </div>

          {/* Varyasyon Seçimi */}
          {product.type === 'VARIANT' && product.variantOptions && (
            <div className="space-y-4">
              {product.variantOptions.map((option) => (
                <div key={option.id}>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {option.name}
                  </label>
                  <div className="flex flex-wrap gap-2">
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
                            px-4 py-2 rounded-lg border-2 transition-all
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

          {/* Kişiselleştirme Formu */}
          {product.personalizationForm && (
            <div className="mt-6">
              <PersonalizationFormRenderer
                formData={product.personalizationForm}
                productId={product.productId}
                variantId={product.type === 'VARIANT' ? currentCombination?.id : undefined}
              />
            </div>
          )}

          {/* Sepete Ekle Butonu */}
          <div className="flex gap-4">
            {(() => {
              const canAddToCart = product.type === 'SIMPLE' || currentCombination
              return (
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
              )
            })()}
            <Link
              href="/sepet"
              className="px-6 py-4 border-2 border-foreground text-foreground font-medium text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors flex items-center justify-center rounded-lg"
            >
              Sepete Git
            </Link>
          </div>

          {/* Ürün Özellikleri */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
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

      {/* Ürün Açıklaması */}
      {product.description && (
        <div className="mt-12">
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
    </div>
  )
}
