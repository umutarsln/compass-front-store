"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag, Tag, X, Check, ArrowLeft } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Spinner } from "@/components/ui/spinner"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

export function CartContent() {
  const { items, cartTotals, isLoading, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, applyCoupon: applyCouponToCart, removeCoupon: removeCouponFromCart, applyingCoupon, isUpdatingItem, isRemovingItem } = useCart()
  const { isAuthenticated } = useAuth()
  const [isCouponInputOpen, setIsCouponInputOpen] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [couponError, setCouponError] = useState<string | null>(null)
  const [kvkkAccepted, setKvkkAccepted] = useState(false)
  const [mesafeliSatisAccepted, setMesafeliSatisAccepted] = useState(false)
  const [showValidationErrors, setShowValidationErrors] = useState(false)

  const appliedCoupon = cartTotals?.appliedCoupon ?? null

  const handleApplyCoupon = async () => {
    setCouponError(null)
    const upperCode = couponCode.toUpperCase().trim()
    if (!upperCode) {
      setCouponError("Lütfen bir kupon kodu girin")
      return
    }
    const result = await applyCouponToCart(upperCode)
    if (result.success) {
      setCouponCode("")
      setIsCouponInputOpen(false)
    } else {
      setCouponError(result.message || "Geçersiz kupon kodu")
    }
  }

  const handleRemoveCoupon = () => {
    setCouponError(null)
    removeCouponFromCart()
  }

  // Sayfa yüklendiğinde KVKK ve mesafeli satış onayını oku
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKvkk = localStorage.getItem('shawk_kvkk_accepted')
      if (savedKvkk === 'true') {
        setKvkkAccepted(true)
      }
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

  const subtotal = cartTotals?.subtotal ?? getTotalPrice()
  const discountAmount = cartTotals?.discountAmount ?? 0
  const finalTotal = cartTotals?.total != null ? cartTotals.total : Math.max(0, getTotalPrice() - discountAmount)

  // Loading state - show skeleton
  if (isLoading) {
    return (
      <section className="py-12 bg-background min-h-screen overflow-x-hidden">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sepet Ürünleri Skeleton */}
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3 sm:gap-4 p-3 sm:p-4 border border-border bg-background">
                  <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 shrink-0" />
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

  // Empty state - Forge Cart UI
  if (items.length === 0) {
    return (
      <section className="py-24 bg-background min-h-[60vh] overflow-x-hidden">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">Sepetiniz Boş</h1>
            <p className="text-muted-foreground mb-6">Henüz sepetinize ürün eklemediniz.</p>
            <Link href="/urunler">
              <Button size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" /> Ürünlere Göz At
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    )
  }

  const totalItems = getTotalItems()

  return (
    <section className="py-12 bg-background min-h-screen overflow-x-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
            Sepetim <span className="text-primary">({totalItems})</span>
          </h1>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 w-full">
            {/* Sepet Ürünleri */}
            <div className="lg:col-span-2 space-y-4 w-full min-w-0">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 sm:gap-4 p-3 sm:p-4 border border-border bg-background w-full max-w-full overflow-hidden"
                >
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                    <Image
                      src={item.image || "/placeholders/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm sm:text-base text-foreground break-words">{item.name}</h3>
                    {item.variantValues && item.variantValues.length > 0 ? (
                      <div className="text-xs sm:text-sm text-muted-foreground mt-1 space-y-0.5 sm:space-y-1">
                        {item.variantValues.map((vv) => (
                          <div key={vv.id} className="flex items-center gap-1.5 sm:gap-2">
                            <span className="font-medium">{vv.variantOption?.name || 'Seçenek'}:</span>
                            {vv.variantOption?.type === 'COLOR' && vv.colorCode ? (
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <div
                                  className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-border shrink-0"
                                  style={{ backgroundColor: vv.colorCode }}
                                />
                                <span className="truncate">{vv.value}</span>
                              </div>
                            ) : (
                              <span className="truncate">{vv.value}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : null}
                    {item.personalization && (
                      <p className="mt-3 sm:mt-4 text-xs text-muted-foreground">Kişiselleştirmeli ürün</p>
                    )}
                    <div className="flex items-center justify-between mt-3 sm:mt-4 gap-2">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId || item.id, item.variantId || null, item.quantity - 1)}
                          disabled={isUpdatingItem(item.productId || item.id, item.variantId || null) || isRemovingItem(item.productId || item.id, item.variantId || null)}
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border border-border hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isUpdatingItem(item.productId || item.id, item.variantId || null) ? (
                            <Spinner className="w-3 h-3 sm:w-4 sm:h-4" />
                          ) : (
                            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                        </button>
                        <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId || item.id, item.variantId || null, item.quantity + 1)}
                          disabled={isUpdatingItem(item.productId || item.id, item.variantId || null) || isRemovingItem(item.productId || item.id, item.variantId || null)}
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border border-border hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isUpdatingItem(item.productId || item.id, item.variantId || null) ? (
                            <Spinner className="w-3 h-3 sm:w-4 sm:h-4" />
                          ) : (
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4">
                        <div className="flex flex-col items-end">
                          {item.discountedPrice && item.basePrice && item.discountedPrice < item.basePrice ? (
                            <>
                              <p className="text-xs sm:text-sm font-medium text-foreground">
                                {(item.discountedPrice * item.quantity).toLocaleString("tr-TR")} ₺
                              </p>
                              <p className="text-xs text-muted-foreground line-through">
                                {(item.basePrice * item.quantity).toLocaleString("tr-TR")} ₺
                              </p>
                            </>
                          ) : (
                            <p className="text-xs sm:text-sm font-medium text-foreground">
                              {((item.basePrice || item.price) * item.quantity).toLocaleString("tr-TR")} ₺
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId || item.id, item.variantId || null)}
                          disabled={isRemovingItem(item.productId || item.id, item.variantId || null) || isUpdatingItem(item.productId || item.id, item.variantId || null)}
                          className="p-1.5 sm:p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                          aria-label="Ürünü kaldır"
                        >
                          {isRemovingItem(item.productId || item.id, item.variantId || null) ? (
                            <Spinner className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Sipariş Özeti */}
            <div className="lg:col-span-1 w-full min-w-0">
              <div className="lg:sticky lg:top-24 p-4 sm:p-6 border border-border bg-background w-full max-w-full overflow-hidden">
                <h2 className="font-serif text-lg sm:text-xl text-foreground mb-4 sm:mb-6">Sipariş Özeti</h2>
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Toplam Ürün</span>
                    <span className="text-foreground">{getTotalItems()} adet</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Ara Toplam</span>
                    <span className="text-foreground">{subtotal.toLocaleString("tr-TR")} ₺</span>
                  </div>
                  {appliedCoupon && discountAmount > 0 && (
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">İndirim ({appliedCoupon.code})</span>
                      <span className="text-green-600 font-medium">-{discountAmount.toLocaleString("tr-TR")} ₺</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Kargo</span>
                    <span className="text-foreground">Ücretsiz</span>
                  </div>
                  <div className="border-t border-border pt-3 sm:pt-4">
                    <div className="flex justify-between">
                      <span className="font-medium text-sm sm:text-base text-foreground">Toplam</span>
                      <div className="flex flex-col items-end">
                        {appliedCoupon && discountAmount > 0 && (
                          <span className="text-xs text-muted-foreground line-through mb-0.5 sm:mb-1">
                            {subtotal.toLocaleString("tr-TR")} ₺
                          </span>
                        )}
                        <span className="font-medium text-foreground text-base sm:text-lg">
                          {finalTotal.toLocaleString("tr-TR")} ₺
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kupon Kodu */}
                <div className="mb-4">
                  {!appliedCoupon ? (
                    <>
                      {!isCouponInputOpen ? (
                        <button
                          onClick={() => setIsCouponInputOpen(true)}
                          className="w-full flex items-center justify-center gap-2 py-2 sm:py-2.5 text-xs sm:text-sm text-foreground border border-border hover:bg-secondary transition-colors"
                        >
                          <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
                          <div className="flex gap-1.5 sm:gap-2">
                            <input
                              type="text"
                              value={couponCode}
                              onChange={(e) => {
                                setCouponCode(e.target.value)
                                setCouponError(null)
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleApplyCoupon()
                              }}
                              placeholder="Kupon kodunu girin"
                              className="flex-1 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
                              autoFocus
                            />
                            <button
                              onClick={handleApplyCoupon}
                              disabled={applyingCoupon}
                              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-primary-foreground text-xs sm:text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0"
                            >
                              {applyingCoupon ? <Spinner className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : "Uygula"}
                            </button>
                            <button
                              onClick={() => {
                                setIsCouponInputOpen(false)
                                setCouponCode("")
                                setCouponError(null)
                              }}
                              className="px-2 sm:px-3 py-1.5 sm:py-2 border border-border hover:bg-secondary transition-colors shrink-0"
                            >
                              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                          {couponError && (
                            <p className="text-xs text-red-600">{couponError}</p>
                          )}
                        </motion.div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-800 dark:text-green-300">{appliedCoupon.code}</span>
                        <span className="text-xs text-green-600 dark:text-green-400">
                          {appliedCoupon.discountAmount.toLocaleString("tr-TR")} ₺ indirim uygulandı
                        </span>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        disabled={applyingCoupon}
                        className="text-green-600 hover:text-green-800 transition-colors disabled:opacity-50"
                        aria-label="Kuponu kaldır"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

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

                {/* Satın Al: sıradaki adım (ödeme) sayfasına yönlendirir */}
                <button
                  type="button"
                  onClick={(e) => {
                    if (!kvkkAccepted || !mesafeliSatisAccepted) {
                      e.preventDefault()
                      setShowValidationErrors(true)
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
                  className={`block w-full py-3 sm:py-4 font-medium text-xs sm:text-sm uppercase tracking-wider text-center transition-colors ${kvkkAccepted && mesafeliSatisAccepted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                    : "bg-muted text-muted-foreground cursor-pointer hover:bg-muted/80"
                    }`}
                >
                  Satın Al
                </button>
                {/* Teklif Al: teklif talebi sayfasına yönlendirir */}
                <Link
                  href="/teklif-al"
                  className="block w-full mt-2 sm:mt-3 py-3 sm:py-4 border border-foreground text-foreground font-medium text-xs sm:text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors text-center"
                >
                  Teklif Al
                </Link>
                <Link
                  href="/urunler"
                  className="block w-full mt-2 sm:mt-3 py-3 sm:py-4 border border-muted-foreground text-muted-foreground font-medium text-xs sm:text-sm uppercase tracking-wider hover:bg-muted hover:text-foreground transition-colors text-center"
                >
                  Alışverişe Devam Et
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
