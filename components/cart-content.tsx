"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Spinner } from "@/components/ui/spinner"
import { Skeleton } from "@/components/ui/skeleton"

export function CartContent() {
  const { items, isLoading, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, isUpdatingItem, isRemovingItem } = useCart()
  const { isAuthenticated } = useAuth()

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
                  key={`${item.productId}-${item.variantId || 'simple'}`}
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
                        <p className="text-sm font-medium text-foreground">
                          {(item.price * item.quantity).toLocaleString("tr-TR")} ₺
                        </p>
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
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Kargo</span>
                    <span className="text-foreground">Ücretsiz</span>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between">
                      <span className="font-medium text-foreground">Toplam</span>
                      <span className="font-medium text-foreground text-lg">
                        {getTotalPrice().toLocaleString("tr-TR")} ₺
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  href={isAuthenticated ? "/odeme" : "/odeme-auth"}
                  className="block w-full py-4 bg-primary text-primary-foreground font-medium text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors text-center"
                >
                  Ödemeye Geç
                </Link>
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
    </section>
  )
}
