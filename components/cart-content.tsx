"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

export function CartContent() {
  const { items, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart()

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
              href="/kategoriler"
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
                  key={`${item.id}-${item.color}-${item.size}`}
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
                    <p className="text-sm text-muted-foreground mt-1">
                      Renk: {item.color} • Boyut: {item.size}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center border border-border hover:bg-secondary transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center border border-border hover:bg-secondary transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-sm font-medium text-foreground">
                          {(item.price * item.quantity).toLocaleString("tr-TR")} ₺
                        </p>
                        <button
                          onClick={() => removeFromCart(item.id, item.color, item.size)}
                          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Ürünü kaldır"
                        >
                          <Trash2 className="w-4 h-4" />
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
                  href="/odeme"
                  className="block w-full py-4 bg-primary text-primary-foreground font-medium text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors text-center"
                >
                  Ödemeye Geç
                </Link>
                <Link
                  href="/kategoriler"
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
