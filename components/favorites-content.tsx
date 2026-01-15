"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, AlertCircle, Sparkles, Tag } from "lucide-react"
import { useFavorites } from "@/contexts/favorites-context"
import { useCart } from "@/contexts/cart-context"

const marketingMessages = [
  {
    type: "urgency",
    icon: AlertCircle,
    title: "Favorilerin Tükenmek Üzere!",
    message: "Sevdiğiniz ürünler stokta kalmayabilir. Hemen sipariş verin!",
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-900",
  },
  {
    type: "discount",
    icon: Tag,
    title: "Favorilerine Özel İndirim!",
    message: "Favorilerinizdeki ürünlerde %15'e varan indirim fırsatı!",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    borderColor: "border-green-200 dark:border-green-900",
  },
  {
    type: "special",
    icon: Sparkles,
    title: "Özel Fırsat!",
    message: "Favorilerinizdeki ürünlerden 2 veya daha fazla alana ücretsiz kargo!",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    borderColor: "border-purple-200 dark:border-purple-900",
  },
]

export function FavoritesContent() {
  const { items, removeFromFavorites, isFavorite } = useFavorites()
  const { addToCart } = useCart()
  const [currentMessage, setCurrentMessage] = useState(0)

  useEffect(() => {
    if (items.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % marketingMessages.length)
    }, 5000) // Her 5 saniyede bir değişir

    return () => clearInterval(interval)
  }, [items.length])

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      color: "Varsayılan",
      size: "Varsayılan",
    })
  }

  const detailUrl = (category: string) => {
    return category === "Kişiye Özel Tasarımlar" ? "/urun-detay-kisiye-ozel" : "/urun-detay"
  }

  if (items.length === 0) {
    return (
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-4">Favorileriniz Boş</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Henüz favorilerinize ürün eklemediniz. Beğendiğiniz ürünleri favorilerinize ekleyerek daha sonra kolayca bulabilirsiniz.
            </p>
            <Link
              href="/urunler"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Ürünleri Keşfet
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const MessageComponent = marketingMessages[currentMessage]
  const MessageIcon = MessageComponent.icon

  return (
    <section className="py-12 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-2">Favorilerim</h1>
          <p className="text-muted-foreground">{items.length} ürün favorilerinizde</p>
        </motion.div>

        {/* Marketing Mesajları */}
        {items.length > 0 && (
          <motion.div
            key={currentMessage}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
            className={`mb-8 p-6 rounded-lg border ${MessageComponent.bgColor} ${MessageComponent.borderColor} border-2`}
          >
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 ${MessageComponent.color}`}>
                <MessageIcon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className={`text-lg font-semibold mb-1 ${MessageComponent.color}`}>
                  {MessageComponent.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {MessageComponent.message}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Favoriler Listesi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-secondary rounded-lg">
                <Link href={detailUrl(item.category)}>
                  <Image
                    src={item.image || "/placeholders/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />
                
                {/* Favorilerden Çıkar Butonu */}
                <button
                  onClick={() => removeFromFavorites(item.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-background/80 text-red-500 hover:bg-red-500 hover:text-white backdrop-blur-sm transition-colors"
                  aria-label="Favorilerden Çıkar"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>

                {/* Sepete Ekle Butonu */}
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full py-2 px-4 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors rounded-md flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Sepete Ekle
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.category}</p>
                <Link href={detailUrl(item.category)}>
                  <h3 className="mt-1 text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                    {item.name}
                  </h3>
                </Link>
                <p className="mt-1 text-sm text-foreground font-medium">{item.price.toLocaleString("tr-TR")} ₺</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
