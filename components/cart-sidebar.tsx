"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { X, Plus, Minus, ShoppingBag, Trash2, LogOut } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Spinner } from "@/components/ui/spinner"

export function CartSidebar() {
  const pathname = usePathname()
  const { items, isSidebarOpen, openSidebar, closeSidebar, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, isUpdatingItem, isRemovingItem } = useCart()
  const { isAuthenticated, logout } = useAuth()

  // Sepet sayfasında sidebar'ı gösterme
  if (pathname === "/sepet") {
    return null
  }

  return (
    <>
      {/* Floating Cart Button - Sidebar kapalıyken ve sepette ürün varsa görünür */}
      <AnimatePresence>
        {!isSidebarOpen && getTotalItems() > 0 && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={openSidebar}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-primary text-primary-foreground p-3 md:p-4 rounded-l-full shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Sepeti Aç"
          >
            <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
            <span className="absolute -top-1 -right-1 min-w-[18px] md:min-w-[20px] h-[18px] md:h-[20px] bg-accent text-accent-foreground text-[10px] md:text-xs font-semibold flex items-center justify-center rounded-full">
              {getTotalItems()}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
              className="fixed inset-0 bg-black/50 z-[70]"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[85vw] md:w-[10vw] md:min-w-[500px] bg-background border-l border-border z-[75] flex flex-col shadow-2xl"
            >
              {/* Close Button - Sidebar'ın sol ortasında, ekran kenarında */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={closeSidebar}
                className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 z-[76] bg-primary text-primary-foreground rounded-l-2xl shadow-2xl hover:bg-white hover:text-primary hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center w-14 h-14 md:w-12 md:h-12 group border-2 border-primary hover:border-primary/50 cursor-pointer active:scale-95"
                aria-label="Sepeti Kapat"
              >
                <X className="w-6 h-6 md:w-5 md:h-5 transition-transform duration-300 group-hover:rotate-90" />
              </motion.button>
              {/* Header */}
              <div className="flex items-center justify-between p-3 md:p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                  <h2 className="text-base md:text-lg font-semibold">Sepetim</h2>
                </div>
                <div className="flex items-center gap-2">
                  {/* Close Button - Header içinde entegre */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={closeSidebar}
                    className="bg-white text-black rounded-xl shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all duration-300 flex items-center justify-center w-9 h-9 md:w-10 md:h-10 group cursor-pointer active:scale-95 border border-border"
                    aria-label="Sepeti Kapat"
                  >
                    <X className="w-4 h-4 md:w-5 md:h-5 text-black transition-transform duration-300 group-hover:rotate-90" />
                  </motion.button>
                  {/* Mobil Çıkış Butonu */}
                  {/* {isAuthenticated && (
                    <button
                      onClick={() => {
                        logout()
                        closeSidebar()
                      }}
                      className="md:hidden flex items-center gap-1.5 px-2 py-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Çıkış Yap"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Çıkış</span>
                    </button>
                  )} */}
                </div>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-3 md:p-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <ShoppingBag className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground mb-4" />
                    <p className="text-sm md:text-base text-muted-foreground mb-6">Sepetiniz boş</p>
                    <Link
                      href="/urunler"
                      onClick={closeSidebar}
                      className="md:hidden w-full max-w-[280px] py-3 px-6 bg-primary text-primary-foreground text-center text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
                    >
                      Alışverişe Başla
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3 md:space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-2 md:gap-3 pb-3 md:pb-4 border-b border-border last:border-0">
                        <div className="relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0 bg-secondary rounded overflow-hidden">
                          <Image
                            src={item.image || "/placeholders/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs md:text-sm font-medium text-foreground truncate">{item.name}</h3>
                          {item.variantValues && item.variantValues.length > 0 ? (
                            <div className="text-[10px] md:text-xs text-muted-foreground mt-1 space-y-0.5">
                              {item.variantValues.map((vv) => (
                                <div key={vv.id} className="flex items-center gap-1 md:gap-1.5">
                                  <span className="font-medium">{vv.variantOption?.name || 'Seçenek'}:</span>
                                  {vv.variantOption?.type === 'COLOR' && vv.colorCode ? (
                                    <div className="flex items-center gap-1">
                                      <div
                                        className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full border border-border/50"
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
                          <p className="text-xs md:text-sm font-medium text-foreground mt-1">
                            {item.price.toLocaleString("tr-TR")} ₺
                          </p>
                          <div className="flex items-center gap-1.5 md:gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.productId || item.id, item.variantId || null, item.quantity - 1)}
                              disabled={isUpdatingItem(item.productId || item.id, item.variantId || null) || isRemovingItem(item.productId || item.id, item.variantId || null)}
                              className="p-0.5 md:p-1 hover:bg-secondary rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              aria-label="Azalt"
                            >
                              {isUpdatingItem(item.productId || item.id, item.variantId || null) ? (
                                <Spinner className="w-2.5 h-2.5 md:w-3 md:h-3" />
                              ) : (
                                <Minus className="w-2.5 h-2.5 md:w-3 md:h-3" />
                              )}
                            </button>
                            <span className="text-xs md:text-sm font-medium w-6 md:w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId || item.id, item.variantId || null, item.quantity + 1)}
                              disabled={isUpdatingItem(item.productId || item.id, item.variantId || null) || isRemovingItem(item.productId || item.id, item.variantId || null)}
                              className="p-0.5 md:p-1 hover:bg-secondary rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              aria-label="Artır"
                            >
                              {isUpdatingItem(item.productId || item.id, item.variantId || null) ? (
                                <Spinner className="w-2.5 h-2.5 md:w-3 md:h-3" />
                              ) : (
                                <Plus className="w-2.5 h-2.5 md:w-3 md:h-3" />
                              )}
                            </button>
                            <button
                              onClick={() => removeFromCart(item.productId || item.id, item.variantId || null)}
                              disabled={isRemovingItem(item.productId || item.id, item.variantId || null) || isUpdatingItem(item.productId || item.id, item.variantId || null)}
                              className="ml-auto p-1.5 md:p-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-destructive/20 hover:border-destructive shadow-sm hover:shadow-md"
                              aria-label="Kaldır"
                            >
                              {isRemovingItem(item.productId || item.id, item.variantId || null) ? (
                                <Spinner className="w-3.5 h-3.5 md:w-4 md:h-4" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-border p-3 md:p-4 space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base md:text-lg font-semibold">Toplam:</span>
                    <span className="text-base md:text-lg font-bold">{getTotalPrice().toLocaleString("tr-TR")} ₺</span>
                  </div>
                  <Link
                    href="/sepet"
                    onClick={closeSidebar}
                    className="block w-full py-2.5 md:py-3 bg-primary text-primary-foreground text-center text-sm md:text-base font-medium uppercase tracking-wider hover:bg-primary/90 transition-colors"
                  >
                    Sepete Git
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
