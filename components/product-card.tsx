"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Heart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useFavorites } from "@/contexts/favorites-context"
import { Badge } from "@/components/ui/badge"
import type { FrontendProduct } from "@/lib/product-transformer"

interface ProductCardProps extends FrontendProduct { }

export function ProductCard({
  id,
  name,
  subtitle,
  price,
  basePrice,
  isOnSale,
  discountedPrice,
  image,
  category,
  stock,
  variantValues,
}: ProductCardProps) {
  // Backend'den gelen id ile ürün detay sayfasına yönlendir
  const detailUrl = `/urun/${id}`
  const { addToCart } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [isHovered, setIsHovered] = useState(false)

  const favorite = isFavorite(id)

  // İndirim yüzdesini hesapla
  const discountPercent = isOnSale && discountedPrice && basePrice > discountedPrice
    ? Math.round(((basePrice - discountedPrice) / basePrice) * 100)
    : 0

  // Stok durumu
  const isInStock = stock.usableQuantity > 0

  // Varyasyonlu ürün mü kontrol et
  const isVariantProduct = variantValues && variantValues.length > 0

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
      className={!isInStock ? "opacity-10" : ""}
    >
      <Link href={detailUrl} className={`group block ${!isInStock ? "opacity-80 grayscale-25" : ""}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-secondary rounded-lg">
          <Image
            src={image || "/placeholders/placeholder.svg"}
            alt={name}
            fill
            loading="eager"
            className={`object-cover transition-transform duration-500 ${isInStock ? "group-hover:scale-105" : ""}`}
          />
          {isInStock && (
            <>
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(255,200,150,0.15)]" />
              </div>
            </>
          )}

          {/* İndirim Badge - Sol Üst */}
          {isOnSale && discountPercent > 0 && (
            <div className="absolute top-3 left-3 z-10">
              <Badge className="bg-red-500 text-white font-bold text-xs px-2 py-1 shadow-lg">
                %{discountPercent} İNDİRİM
              </Badge>
            </div>
          )}

          {/* Stok Durumu Badge - Sol Alt */}
          {!isInStock && (
            <div className="absolute bottom-3 left-3 z-10">
              <Badge variant="destructive" className="font-semibold text-xs px-2 py-1 shadow-lg opacity-90">
                Stokta Yok
              </Badge>
            </div>
          )}

          {/* Action Buttons */}
          <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}>
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-full backdrop-blur-sm transition-colors ${favorite
                ? "bg-red-500/90 text-white"
                : "bg-background/80 text-foreground hover:bg-background"
                }`}
              aria-label={favorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
            >
              <Heart className={`w-4 h-4 ${favorite ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{category}</p>
          <h3 className={`mt-1 text-lg font-semibold text-foreground line-clamp-2 min-h-12 ${isInStock ? "group-hover:text-accent transition-colors" : ""}`}>
            {name}
          </h3>

          <p className="mt-1 text-xs text-muted-foreground min-h-4 line-clamp-1">{subtitle}</p>


          {/* Fiyat ve İndirim */}
          <div className="mt-2 flex items-baseline gap-2">
            {isOnSale && discountedPrice && basePrice > discountedPrice ? (
              <>
                <span className="text-lg font-bold text-foreground">
                  {discountedPrice.toLocaleString("tr-TR")} ₺
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {basePrice.toLocaleString("tr-TR")} ₺
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-foreground">
                {price.toLocaleString("tr-TR")} ₺
              </span>
            )}
          </div>

          {/* Varyasyon Bilgileri */}
          {isVariantProduct && variantValues.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {variantValues.map((variant, index) => {
                const label = variant.variantOption?.name || '';
                const displayValue = variant.value;

                return (
                  <div key={variant.id || index} className="flex items-center gap-1">
                    {variant.colorCode ? (
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-4 h-4 rounded-full border border-border flex-shrink-0"
                          style={{ backgroundColor: variant.colorCode }}
                          title={`${label}: ${displayValue}`}
                        />
                        {label && (
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                            {label}:
                          </span>
                        )}
                        <span className="text-xs text-foreground font-medium">{displayValue}</span>
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-xs px-2 py-0.5 h-auto font-normal">
                        {label && (
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wide mr-1">
                            {label}:
                          </span>
                        )}
                        {displayValue}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
