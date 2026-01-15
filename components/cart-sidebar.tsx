"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

export function CartSidebar() {
  const pathname = usePathname()
  const { items, isSidebarOpen, openSidebar, closeSidebar, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart()

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
            className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-primary text-primary-foreground p-4 rounded-l-full shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Sepeti Aç"
          >
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-accent text-accent-foreground text-xs font-semibold flex items-center justify-center rounded-full">
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

          {/* Close Button - Sidebar'ın sol ortasında */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={closeSidebar}
            className="fixed right-[10vw] top-1/2 -translate-y-1/2 z-[75] bg-primary text-primary-foreground rounded-l-2xl shadow-2xl hover:bg-white hover:text-primary hover:shadow-primary/20 transition-all duration-300 flex flex-col items-center justify-center gap-2 px-4 py-5 min-w-[70px] group border-l-4 border-primary hover:border-primary/50 cursor-pointer"
            style={{ right: 'max(10vw, 200px)' }}
            aria-label="Sepeti Kapat"
          >
            <div className="relative">
              <X className="w-6 h-6 transition-transform duration-300 group-hover:rotate-180" />
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[10px] uppercase tracking-wider font-medium opacity-80">Ürün</span>
              <span className="text-base font-bold leading-none">{getTotalItems()}</span>
            </div>
          </motion.button>

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-[10vw] min-w-[200px] bg-background border-l border-border z-[75] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Sepetim</h2>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Sepetiniz boş</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.color}-${item.size}`} className="flex gap-3 pb-4 border-b border-border last:border-0">
                      <div className="relative w-16 h-16 flex-shrink-0 bg-secondary rounded overflow-hidden">
                        <Image
                          src={item.image || "/placeholders/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-foreground truncate">{item.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.color} • {item.size}
                        </p>
                        <p className="text-sm font-medium text-foreground mt-1">
                          {item.price.toLocaleString("tr-TR")} ₺
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity - 1)}
                            className="p-1 hover:bg-secondary rounded transition-colors"
                            aria-label="Azalt"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity + 1)}
                            className="p-1 hover:bg-secondary rounded transition-colors"
                            aria-label="Artır"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id, item.color, item.size)}
                            className="ml-auto p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-colors"
                            aria-label="Kaldır"
                          >
                            <Trash2 className="w-3 h-3" />
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
              <div className="border-t border-border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Toplam:</span>
                  <span className="text-lg font-bold">{getTotalPrice().toLocaleString("tr-TR")} ₺</span>
                </div>
                <Link
                  href="/sepet"
                  onClick={closeSidebar}
                  className="block w-full py-3 bg-primary text-primary-foreground text-center font-medium uppercase tracking-wider hover:bg-primary/90 transition-colors"
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
