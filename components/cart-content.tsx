"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag, Edit, Tag, X, Check } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Spinner } from "@/components/ui/spinner"
import { Skeleton } from "@/components/ui/skeleton"
import { PersonalizationSummary } from "@/components/personalization/PersonalizationSummary"
import { PersonalizationFormRenderer } from "@/components/personalization/PersonalizationFormRenderer"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { getProductDetail } from "@/services/products"
import { uploadPersonalizationFiles, preparePersonalizationData } from "@/utils/personalization.helper"

export function CartContent() {
  const { items, isLoading, removeFromCart, updateQuantity, updatePersonalization, getTotalPrice, getTotalItems, isUpdatingItem, isRemovingItem } = useCart()
  const { isAuthenticated } = useAuth()
  const [editingItem, setEditingItem] = useState<{ productId: string; variantId: string | null; product: any } | null>(null)
  const [isLoadingProduct, setIsLoadingProduct] = useState(false)
  const [isSavingPersonalization, setIsSavingPersonalization] = useState(false)
  const [isCouponInputOpen, setIsCouponInputOpen] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [kvkkAccepted, setKvkkAccepted] = useState(false)
  const [mesafeliSatisAccepted, setMesafeliSatisAccepted] = useState(false)
  const [showValidationErrors, setShowValidationErrors] = useState(false)

  // Kupon kodları - Backend'den gelecek (şimdilik test için)
  const validCoupons: Record<string, { discount: number; type: 'percentage' | 'fixed' }> = {
    'KUPON10': { discount: 10, type: 'percentage' }
  }

  const handleApplyCoupon = () => {
    setCouponError(null)
    const upperCode = couponCode.toUpperCase().trim()

    if (!upperCode) {
      setCouponError("Lütfen bir kupon kodu girin")
      return
    }

    if (validCoupons[upperCode]) {
      setAppliedCoupon(upperCode)
      setCouponCode("")
      setIsCouponInputOpen(false)
      // Kupon bilgisini localStorage'a kaydet
      if (typeof window !== 'undefined') {
        localStorage.setItem('shawk_applied_coupon', JSON.stringify({
          code: upperCode,
          discount: validCoupons[upperCode].discount,
          type: validCoupons[upperCode].type
        }))
      }
    } else {
      setCouponError("Geçersiz kupon kodu")
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode("")
    setCouponError(null)
    // localStorage'dan kupon bilgisini kaldır
    if (typeof window !== 'undefined') {
      localStorage.removeItem('shawk_applied_coupon')
    }
  }

  // Sayfa yüklendiğinde localStorage'dan kupon bilgisini ve KVKK onayını oku
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCoupon = localStorage.getItem('shawk_applied_coupon')
      if (savedCoupon) {
        try {
          const couponData = JSON.parse(savedCoupon)
          if (validCoupons[couponData.code]) {
            setAppliedCoupon(couponData.code)
          }
        } catch (e) {
          // Geçersiz veri, temizle
          localStorage.removeItem('shawk_applied_coupon')
        }
      }

      // KVKK onayını kontrol et
      const savedKvkk = localStorage.getItem('shawk_kvkk_accepted')
      if (savedKvkk === 'true') {
        setKvkkAccepted(true)
      }

      // Mesafeli satış sözleşmesi onayını kontrol et
      const savedMesafeliSatis = localStorage.getItem('shawk_mesafeli_satis_accepted')
      if (savedMesafeliSatis === 'true') {
        setMesafeliSatisAccepted(true)
      }
    }
  }, [])

  const handleKvkkChange = (accepted: boolean) => {
    setKvkkAccepted(accepted)
    if (typeof window !== 'undefined') {
      if (accepted) {
        localStorage.setItem('shawk_kvkk_accepted', 'true')
      } else {
        localStorage.removeItem('shawk_kvkk_accepted')
      }
    }
    // Onaylandığında validation hatalarını gizle
    if (accepted && mesafeliSatisAccepted) {
      setShowValidationErrors(false)
    }
  }

  const handleMesafeliSatisChange = (accepted: boolean) => {
    setMesafeliSatisAccepted(accepted)
    if (typeof window !== 'undefined') {
      if (accepted) {
        localStorage.setItem('shawk_mesafeli_satis_accepted', 'true')
      } else {
        localStorage.removeItem('shawk_mesafeli_satis_accepted')
      }
    }
    // Onaylandığında validation hatalarını gizle
    if (accepted && kvkkAccepted) {
      setShowValidationErrors(false)
    }
  }

  const calculateDiscount = () => {
    if (!appliedCoupon || !validCoupons[appliedCoupon]) return 0

    const coupon = validCoupons[appliedCoupon]
    const subtotal = getTotalPrice()

    if (coupon.type === 'percentage') {
      return (subtotal * coupon.discount) / 100
    } else {
      return coupon.discount
    }
  }

  const getFinalTotal = () => {
    const subtotal = getTotalPrice()
    const discount = calculateDiscount()
    return Math.max(0, subtotal - discount)
  }

  // Loading state - show skeleton
  if (isLoading) {
    return (
      <section className="py-12 bg-background min-h-screen">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sepet Ürünleri Skeleton */}
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4 p-4 border border-border bg-background">
                  <Skeleton className="w-24 h-24 shrink-0" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-8 h-8" />
                        <Skeleton className="w-8 h-4" />
                        <Skeleton className="w-8 h-8" />
                      </div>
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="w-8 h-8" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Sipariş Özeti Skeleton */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6 border border-border bg-background">
                <Skeleton className="h-6 w-32 mb-6" />
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </div>
                </div>
                <Skeleton className="h-12 w-full mb-3" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Empty state - show empty message
  if (items.length === 0) {
    return (
      <section className="py-24 bg-background min-h-screen">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-4">Sepetiniz Boş</h1>
            <p className="text-muted-foreground mb-8">Sepetinize henüz ürün eklenmemiş.</p>
            <Link
              href="/urunler"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-medium text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors"
            >
              Alışverişe Başla
            </Link>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-8">Sepetim</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sepet Ürünleri */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 p-4 border border-border bg-background"
                >
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.image || "/placeholders/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{item.name}</h3>
                    {item.variantValues && item.variantValues.length > 0 ? (
                      <div className="text-sm text-muted-foreground mt-1 space-y-1">
                        {item.variantValues.map((vv) => (
                          <div key={vv.id} className="flex items-center gap-2">
                            <span className="font-medium">{vv.variantOption?.name || 'Seçenek'}:</span>
                            {vv.variantOption?.type === 'COLOR' && vv.colorCode ? (
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-4 h-4 rounded-full border border-border"
                                  style={{ backgroundColor: vv.colorCode }}
                                />
                                <span>{vv.value}</span>
                              </div>
                            ) : (
                              <span>{vv.value}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : null}
                    {/* Personalization Summary */}
                    {item.personalization && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-foreground">Kişiselleştirme</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              setIsLoadingProduct(true)
                              try {
                                // Get product detail to load personalization form
                                // Use product slug if available, otherwise fallback to productId
                                const productIdentifier = item.productSlug || item.productId || item.id
                                const product = await getProductDetail(productIdentifier)

                                setEditingItem({
                                  productId: product.productId,
                                  variantId: item.variantId || null,
                                  product,
                                })
                              } catch (error) {
                                console.error('Failed to load product:', error)
                              } finally {
                                setIsLoadingProduct(false)
                              }
                            }}
                            disabled={isLoadingProduct || isUpdatingItem(item.productId || item.id, item.variantId || null)}
                            className="h-7 text-xs"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Düzenle
                          </Button>
                        </div>
                        <PersonalizationSummary personalization={item.personalization} readOnly />
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId || item.id, item.variantId || null, item.quantity - 1)}
                          disabled={isUpdatingItem(item.productId || item.id, item.variantId || null) || isRemovingItem(item.productId || item.id, item.variantId || null)}
                          className="w-8 h-8 flex items-center justify-center border border-border hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isUpdatingItem(item.productId || item.id, item.variantId || null) ? (
                            <Spinner className="w-4 h-4" />
                          ) : (
                            <Minus className="w-4 h-4" />
                          )}
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId || item.id, item.variantId || null, item.quantity + 1)}
                          disabled={isUpdatingItem(item.productId || item.id, item.variantId || null) || isRemovingItem(item.productId || item.id, item.variantId || null)}
                          className="w-8 h-8 flex items-center justify-center border border-border hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isUpdatingItem(item.productId || item.id, item.variantId || null) ? (
                            <Spinner className="w-4 h-4" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                          {item.discountedPrice && item.basePrice && item.discountedPrice < item.basePrice ? (
                            <>
                              <p className="text-sm font-medium text-foreground">
                                {(item.discountedPrice * item.quantity).toLocaleString("tr-TR")} ₺
                              </p>
                              <p className="text-xs text-muted-foreground line-through">
                                {(item.basePrice * item.quantity).toLocaleString("tr-TR")} ₺
                              </p>
                            </>
                          ) : (
                            <p className="text-sm font-medium text-foreground">
                              {((item.basePrice || item.price) * item.quantity).toLocaleString("tr-TR")} ₺
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId || item.id, item.variantId || null)}
                          disabled={isRemovingItem(item.productId || item.id, item.variantId || null) || isUpdatingItem(item.productId || item.id, item.variantId || null)}
                          className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Ürünü kaldır"
                        >
                          {isRemovingItem(item.productId || item.id, item.variantId || null) ? (
                            <Spinner className="w-4 h-4" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Sipariş Özeti */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6 border border-border bg-background">
                <h2 className="font-serif text-xl text-foreground mb-6">Sipariş Özeti</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Toplam Ürün</span>
                    <span className="text-foreground">{getTotalItems()} adet</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ara Toplam</span>
                    <span className="text-foreground">{getTotalPrice().toLocaleString("tr-TR")} ₺</span>
                  </div>
                  {appliedCoupon && calculateDiscount() > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">İndirim ({appliedCoupon})</span>
                      <span className="text-green-600 font-medium">-{calculateDiscount().toLocaleString("tr-TR")} ₺</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Kargo</span>
                    <span className="text-foreground">Ücretsiz</span>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between">
                      <span className="font-medium text-foreground">Toplam</span>
                      <div className="flex flex-col items-end">
                        {appliedCoupon && calculateDiscount() > 0 && (
                          <span className="text-xs text-muted-foreground line-through mb-1">
                            {getTotalPrice().toLocaleString("tr-TR")} ₺
                          </span>
                        )}
                        <span className="font-medium text-foreground text-lg">
                          {getFinalTotal().toLocaleString("tr-TR")} ₺
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kupon Kodu */}
                {/* <div className="mb-4">
                  {!appliedCoupon ? (
                    <>
                      {!isCouponInputOpen ? (
                        <button
                          onClick={() => setIsCouponInputOpen(true)}
                          className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-foreground border border-border hover:bg-secondary transition-colors"
                        >
                          <Tag className="w-4 h-4" />
                          Kupon Kodu Kullan
                        </button>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-2"
                        >
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={couponCode}
                              onChange={(e) => {
                                setCouponCode(e.target.value)
                                setCouponError(null)
                              }}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleApplyCoupon()
                                }
                              }}
                              placeholder="Kupon kodunu girin"
                              className="flex-1 px-3 py-2 text-sm border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
                              autoFocus
                            />
                            <button
                              onClick={handleApplyCoupon}
                              className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                            >
                              Uygula
                            </button>
                            <button
                              onClick={() => {
                                setIsCouponInputOpen(false)
                                setCouponCode("")
                                setCouponError(null)
                              }}
                              className="px-3 py-2 border border-border hover:bg-secondary transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          {couponError && (
                            <p className="text-xs text-red-600">{couponError}</p>
                          )}
                        </motion.div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">{appliedCoupon}</span>
                        <span className="text-xs text-green-600">
                          %{validCoupons[appliedCoupon].discount} indirim uygulandı
                        </span>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-green-600 hover:text-green-800 transition-colors"
                        aria-label="Kuponu kaldır"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div> */}

                {/* KVKK Onayı */}
                <div className="mb-3">
                  <label className={`flex items-start gap-2 cursor-pointer group ${showValidationErrors && !kvkkAccepted ? 'bg-red-50 dark:bg-red-950/20 p-2 rounded border border-red-200 dark:border-red-900' : ''
                    }`}>
                    <input
                      type="checkbox"
                      checked={kvkkAccepted}
                      onChange={(e) => handleKvkkChange(e.target.checked)}
                      className={`mt-1 w-4 h-4 rounded focus:ring-2 focus:ring-primary cursor-pointer ${showValidationErrors && !kvkkAccepted
                        ? 'border-red-500 border-2'
                        : 'border-border'
                        }`}
                    />
                    <span className={`text-xs transition-colors ${showValidationErrors && !kvkkAccepted
                      ? 'text-red-700 dark:text-red-400'
                      : 'text-muted-foreground group-hover:text-foreground'
                      }`}>
                      <Link href="/gizlilik" target="_blank" className="text-primary hover:underline">
                        KVKK sözleşmelerini
                      </Link>{" "}
                      okudum ve onaylıyorum.
                    </span>
                  </label>
                  {showValidationErrors && !kvkkAccepted && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1 ml-6">
                      KVKK sözleşmesini onaylamanız gerekmektedir.
                    </p>
                  )}
                </div>

                {/* Mesafeli Satış Sözleşmesi Onayı */}
                <div className="mb-4">
                  <label className={`flex items-start gap-2 cursor-pointer group ${showValidationErrors && !mesafeliSatisAccepted ? 'bg-red-50 dark:bg-red-950/20 p-2 rounded border border-red-200 dark:border-red-900' : ''
                    }`}>
                    <input
                      type="checkbox"
                      checked={mesafeliSatisAccepted}
                      onChange={(e) => handleMesafeliSatisChange(e.target.checked)}
                      className={`mt-1 w-4 h-4 rounded focus:ring-2 focus:ring-primary cursor-pointer ${showValidationErrors && !mesafeliSatisAccepted
                        ? 'border-red-500 border-2'
                        : 'border-border'
                        }`}
                    />
                    <span className={`text-xs transition-colors ${showValidationErrors && !mesafeliSatisAccepted
                      ? 'text-red-700 dark:text-red-400'
                      : 'text-muted-foreground group-hover:text-foreground'
                      }`}>
                      <Link href="/mesafeli-satis-sozlesmesi" target="_blank" className="text-primary hover:underline">
                        Mesafeli satış sözleşmesini
                      </Link>{" "}
                      okudum ve onaylıyorum.
                    </span>
                  </label>
                  {showValidationErrors && !mesafeliSatisAccepted && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1 ml-6">
                      Mesafeli satış sözleşmesini onaylamanız gerekmektedir.
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    if (!kvkkAccepted || !mesafeliSatisAccepted) {
                      e.preventDefault()
                      setShowValidationErrors(true)
                      // Scroll to first error
                      setTimeout(() => {
                        const firstError = document.querySelector('.bg-red-50, .dark\\:bg-red-950\\/20')
                        if (firstError) {
                          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
                        }
                      }, 100)
                    } else {
                      window.location.href = isAuthenticated ? "/odeme" : "/odeme-auth"
                    }
                  }}
                  className={`block w-full py-4 font-medium text-sm uppercase tracking-wider text-center transition-colors ${kvkkAccepted && mesafeliSatisAccepted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                    : "bg-muted text-muted-foreground cursor-pointer hover:bg-muted/80"
                    }`}
                >
                  Ödemeye Geç
                </button>
                <Link
                  href="/urunler"
                  className="block w-full mt-3 py-4 border border-foreground text-foreground font-medium text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors text-center"
                >
                  Alışverişe Devam Et
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Personalization Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
          <DialogHeader>
            <DialogTitle>Kişiselleştirmeyi Düzenle</DialogTitle>
            <DialogDescription>
              Kişiselleştirme formunu düzenleyin. Değişiklikler sepetteki ürün fiyatını etkileyebilir.
            </DialogDescription>
          </DialogHeader>

          {editingItem && editingItem.product.personalizationForm && (
            <div className="mt-4 overflow-x-hidden">
              <PersonalizationFormRenderer
                formData={editingItem.product.personalizationForm}
                productId={editingItem.productId}
                variantId={editingItem.variantId || undefined}
                initialValues={(() => {
                  // Find the cart item to get existing personalization values
                  const cartItem = items.find(
                    (i) => i.productId === editingItem.productId && i.variantId === editingItem.variantId
                  )
                  return cartItem?.personalization?.userValues || {}
                })()}
                initialFileIds={(() => {
                  // Extract file IDs from personalization snapshot
                  const cartItem = items.find(
                    (i) => i.productId === editingItem.productId && i.variantId === editingItem.variantId
                  )
                  if (!cartItem?.personalization?.userValues) return undefined

                  const fileIdsByField: Record<string, string[]> = {}
                  const schema = editingItem.product.personalizationForm.schemaSnapshot

                  schema.fields.forEach((field: any) => {
                    const value = cartItem.personalization.userValues[field.key]
                    if (!value) return

                    const isFileField =
                      field.type === 'IMAGE_PICKER_SINGLE' ||
                      field.type === 'IMAGE_PICKER_MULTI' ||
                      field.type === 'FILE_UPLOAD_SINGLE' ||
                      field.type === 'FILE_UPLOAD_MULTI'

                    if (isFileField) {
                      const ids = Array.isArray(value) ? value : [value]
                      const validIds = ids.filter(
                        (id) => typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
                      )
                      if (validIds.length > 0) {
                        fileIdsByField[field.key] = validIds
                      }
                    }
                  })

                  return Object.keys(fileIdsByField).length > 0 ? fileIdsByField : undefined
                })()}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingItem(null)}
              disabled={isSavingPersonalization}
            >
              İptal
            </Button>
            <Button
              onClick={async () => {
                if (!editingItem) return

                setIsSavingPersonalization(true)
                try {
                  // Get personalization data from form
                  const formData = (window as any).__personalizationFormData

                  if (!formData) {
                    setIsSavingPersonalization(false)
                    return
                  }

                  // 1. Validate form
                  if (formData.validate) {
                    const isValid = await formData.validate()
                    if (!isValid) {
                      setIsSavingPersonalization(false)
                      return
                    }
                  }

                  // 2. Delete files marked for deletion (before uploading new ones)
                  const deletedFileIds = formData.deletedFileIds as string[] | undefined
                  if (deletedFileIds && deletedFileIds.length > 0) {
                    console.log('[CartContent] Deleting files marked for deletion', {
                      deletedFileIds,
                      count: deletedFileIds.length,
                    })
                    try {
                      const { uploadService } = await import('@/services/upload.service')
                      // Delete files in parallel
                      await Promise.all(
                        deletedFileIds.map(async (fileId) => {
                          try {
                            await uploadService.deleteUpload(fileId)
                            console.log('[CartContent] File deleted successfully', { fileId })
                          } catch (error: any) {
                            // If file is already deleted (404), that's fine - just log and continue
                            if (error.message?.includes('404') || error.message?.includes('bulunamadı') || error.message?.includes('not found')) {
                              console.log('[CartContent] File already deleted, continuing', { fileId })
                            } else {
                              console.error('[CartContent] Failed to delete file', {
                                fileId,
                                error: error.message,
                              })
                            }
                            // Continue with other files even if one fails
                          }
                        })
                      )
                      console.log('[CartContent] File deletion process completed')
                    } catch (error) {
                      console.error('[CartContent] Error during file deletion', error)
                      // Continue with the rest of the process even if deletion fails
                    }
                  }

                  // 3. Upload new files if they exist
                  let finalFormValues = { ...formData.formValues }
                  let allFileIds: string[] = []

                  const selectedFiles = formData.selectedFiles as Record<string, File[]> | undefined

                  // Extract existing file IDs from cart item (mevcut dosyalar)
                  // Bu, initialFileIds'den alınmalı çünkü formValues içinde File objeleri olabilir
                  const cartItem = items.find(
                    (i) => i.productId === editingItem.productId && i.variantId === editingItem.variantId
                  )

                  const existingFileIds: Record<string, string[]> = {}
                  if (cartItem?.personalization?.userValues) {
                    const schema = editingItem.product.personalizationForm.schemaSnapshot
                    schema.fields.forEach((field: any) => {
                      const value = cartItem.personalization.userValues[field.key]
                      if (!value) return

                      const isFileField =
                        field.type === 'IMAGE_PICKER_SINGLE' ||
                        field.type === 'IMAGE_PICKER_MULTI' ||
                        field.type === 'FILE_UPLOAD_SINGLE' ||
                        field.type === 'FILE_UPLOAD_MULTI'

                      if (isFileField) {
                        const ids = Array.isArray(value) ? value : [value]
                        const validIds = ids.filter(
                          (id) => typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
                        )
                        if (validIds.length > 0) {
                          existingFileIds[field.key] = validIds
                        }
                      }
                    })
                  }

                  // Also check formValues for any file IDs that might be there
                  Object.entries(finalFormValues).forEach(([key, value]) => {
                    if (value && !existingFileIds[key]) {
                      const field = editingItem.product.personalizationForm.schemaSnapshot.fields.find(
                        (f: any) => f.key === key
                      )
                      if (field) {
                        const isFileField =
                          field.type === 'IMAGE_PICKER_SINGLE' ||
                          field.type === 'IMAGE_PICKER_MULTI' ||
                          field.type === 'FILE_UPLOAD_SINGLE' ||
                          field.type === 'FILE_UPLOAD_MULTI'

                        if (isFileField) {
                          const ids = Array.isArray(value) ? value : [value]
                          const validIds = ids.filter(
                            (id) => typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
                          )
                          if (validIds.length > 0) {
                            existingFileIds[key] = validIds
                          }
                        }
                      }
                    }
                  })

                  if (selectedFiles && Object.keys(selectedFiles).length > 0) {
                    try {
                      // Get cart ID for organizing files
                      const { getCartId } = await import('@/lib/cart-storage')
                      const cartId = getCartId()

                      console.log('[CartContent] Uploading files with cart ID', {
                        cartId,
                        hasCartId: !!cartId,
                        cartIdType: typeof cartId,
                        selectedFilesCount: Object.keys(selectedFiles).length,
                        selectedFilesKeys: Object.keys(selectedFiles),
                      })

                      // Upload new files (with cart ID for folder organization)
                      const uploadedFileIds = await uploadPersonalizationFiles(selectedFiles, cartId || undefined)

                      // Prepare personalization data (combines existing + new files)
                      const prepared = preparePersonalizationData(
                        finalFormValues,
                        selectedFiles,
                        uploadedFileIds,
                        existingFileIds // Mevcut dosyaları da geçir
                      )

                      finalFormValues = prepared.formValues
                      allFileIds = prepared.fileIds

                      // Debug: Log final form values to verify file counts
                      console.log('[CartContent] Final form values after prepare:', finalFormValues)
                      console.log('[CartContent] Existing file IDs:', existingFileIds)
                      console.log('[CartContent] Selected files:', selectedFiles)
                      console.log('[CartContent] Uploaded file IDs:', uploadedFileIds)
                    } catch (uploadError: any) {
                      console.error('[CartContent] File upload failed:', uploadError)
                      setIsSavingPersonalization(false)
                      return
                    }
                  } else {
                    // No new files, just use existing file IDs
                    // Make sure existing file IDs are in finalFormValues
                    Object.entries(existingFileIds).forEach(([key, ids]) => {
                      allFileIds.push(...ids)
                      // Ensure existing file IDs are in finalFormValues
                      if (ids.length === 1) {
                        finalFormValues[key] = ids[0]
                      } else {
                        finalFormValues[key] = ids
                      }
                    })
                  }

                  // Debug: Log final values before sending to backend
                  console.log('[CartContent] Final values before update:', {
                    formValues: finalFormValues,
                    fileIds: allFileIds,
                    existingFileIds,
                  })

                  // Verify file counts for each field
                  editingItem.product.personalizationForm.schemaSnapshot.fields.forEach((field: any) => {
                    if (field.type.includes('MULTI') && (field.config?.minFileCount || field.config?.maxFileCount)) {
                      const fieldValue = finalFormValues[field.key]
                      const fileCount = fieldValue ? (Array.isArray(fieldValue) ? fieldValue.length : 1) : 0
                      console.log(`[CartContent] Field "${field.title}": ${fileCount} files (min: ${field.config?.minFileCount || 0}, max: ${field.config?.maxFileCount || 'unlimited'})`)
                    }
                  })

                  // 4. Update personalization with final values
                  await updatePersonalization(
                    editingItem.productId,
                    editingItem.variantId,
                    {
                      formValues: finalFormValues,
                      fileIds: allFileIds,
                    }
                  )

                  // Close dialog
                  setEditingItem(null)
                } catch (error: any) {
                  console.error('[CartContent] Failed to update personalization:', error)
                } finally {
                  setIsSavingPersonalization(false)
                }
              }}
              disabled={isSavingPersonalization}
            >
              {isSavingPersonalization ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Kaydediliyor...
                </>
              ) : (
                'Kaydet'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
