"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Eye } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import type { FrontendProduct } from "@/lib/product-transformer"

interface ProductCardProps extends FrontendProduct { }

export function ProductCard({
  id,
  productId,
  name,
  subtitle,
  price,
  basePrice,
  discountedPrice,
  image,
  category,
  slug,
  stock,
  variantValues,
}: ProductCardProps) {
  // Backend'den gelen slug ile ürün detay sayfasına yönlendir
  const detailUrl = `/urun/${slug || id}`
  const { addToCart, isAddingToCart } = useCart()
  const [isHovered, setIsHovered] = useState(false)

  // Use productId for API calls, id for display
  const realProductId = productId || id
  const isAdding = isAddingToCart(realProductId, null)

  // İndirim yüzdesini hesapla
  const discountPercent = discountedPrice && basePrice > discountedPrice
    ? Math.round(((basePrice - discountedPrice) / basePrice) * 100)
    : 0

  // Stok durumu
  const isInStock = stock.usableQuantity > 0

  // Varyasyonlu ürün mü kontrol et
  const isVariantProduct = variantValues && variantValues.length > 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isAdding) return
    await addToCart({
      id: realProductId,
      name,
      price,
      image,
      productId: realProductId,
      variantId: null, // Product card is for simple products or list view
    })
  }


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group/card bg-card rounded-lg overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 border border-border ${!isInStock ? "opacity-60" : ""}`}
    >
      <Link href={detailUrl} className={`block ${!isInStock ? "opacity-80 grayscale-25" : ""}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
          <Image
            src={image || "/placeholders/placeholder.svg"}
            alt={name}
            fill
            loading="eager"
            className={`object-cover transition-transform duration-500 ${isInStock ? "group-hover/card:scale-105" : ""}`}
          />
          {isInStock && (
            <div className="absolute inset-0 bg-foreground/0 group-hover/card:bg-foreground/20 transition-colors duration-300 flex items-center justify-center gap-2 opacity-0 group-hover/card:opacity-100">
              <Link href={detailUrl} onClick={(e) => e.stopPropagation()} className="pointer-events-auto">
                <button
                  type="button"
                  className="rounded-full h-10 w-10 flex items-center justify-center bg-secondary text-white hover:bg-secondary/80 transition-colors border border-border"
                  aria-label="Detayları görüntüle"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </Link>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding}
                className="rounded-full h-10 w-10 flex items-center justify-center bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto"
                aria-label="Sepete ekle"
              >
                {isAdding ? <Spinner className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
              </button>
            </div>
          )}

          {/* İndirim Badge - Sol Üst */}
          {discountedPrice && discountPercent > 0 && (
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

        </div>
        <div className="p-4">
          <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">{category}</p>
          <h3 className={`font-display font-semibold text-foreground line-clamp-2 text-sm leading-tight hover:text-primary transition-colors ${!isInStock ? "" : ""}`}>
            {name}
          </h3>

          <p className="mt-1 text-xs text-muted-foreground min-h-4 line-clamp-1">{subtitle}</p>


          {/* Fiyat ve İndirim - Forge: 0 ise "Teklif Alın" accent renginde */}
          <div className="mt-2 flex items-baseline gap-2 font-display">
            {price != null && price > 0 ? (
              discountedPrice && basePrice > discountedPrice ? (
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
              )
            ) : (
              <span className="text-lg font-bold text-accent">Teklif Alın</span>
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
                          className="w-4 h-4 rounded-full border border-border shrink-0"
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

          <div className="mt-3 flex flex-col gap-2">
            {/* Satın Al: sıradaki adım (ürün detay veya sepet) için ürün detayına gider */}
            <Link href={detailUrl}>
              <Button variant="hero" size="sm" className="w-full text-xs">
                Satın Al
              </Button>
            </Link>
            <Link href={detailUrl}>
              <Button variant="hero-outline" size="sm" className="w-full text-xs">
                Detayları İncele
              </Button>
            </Link>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
