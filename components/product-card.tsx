"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Heart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useFavorites } from "@/contexts/favorites-context"

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  category: string
}

export function ProductCard({ id, name, price, image, category }: ProductCardProps) {
  // Backend'den gelen id ile ürün detay sayfasına yönlendir
  const detailUrl = `/urun/${id}`
  const { addToCart } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [isHovered, setIsHovered] = useState(false)
  
  const favorite = isFavorite(id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      id,
      name,
      price,
      image,
      color: "Varsayılan",
      size: "Varsayılan",
    })
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite({
      id,
      name,
      price,
      image,
      category,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={detailUrl} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
          <Image
            src={image || "/placeholders/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(255,200,150,0.15)]" />
          </div>
          
          {/* Action Buttons */}
          <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}>
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                favorite
                  ? "bg-red-500/90 text-white"
                  : "bg-background/80 text-foreground hover:bg-background"
              }`}
              aria-label={favorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
            >
              <Heart className={`w-4 h-4 ${favorite ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={handleAddToCart}
              className="p-2 rounded-full bg-background/80 text-foreground hover:bg-background backdrop-blur-sm transition-colors"
              aria-label="Sepete Ekle"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{category}</p>
          <h3 className="mt-1 text-sm font-medium text-foreground group-hover:text-accent transition-colors">{name}</h3>
          <p className="mt-1 text-sm text-foreground font-medium">{price.toLocaleString("tr-TR")} ₺</p>
        </div>
      </Link>
    </motion.div>
  )
}
