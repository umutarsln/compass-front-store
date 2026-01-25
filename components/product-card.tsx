"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
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
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={!isInStock ? "opacity-10" : ""}
    >
      <Link href={detailUrl} className={`group block ${!isInStock ? "opacity-80 grayscale-25" : ""}`}>
        <div className="relative aspect-4/5 overflow-hidden bg-secondary rounded-lg">
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

          {/* Action Buttons */}
          {/* {isInStock && (
            <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-opacity duration-300 ${isHovered || isAdding ? "opacity-100" : "opacity-0"}`}>
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="p-2 rounded-full backdrop-blur-sm bg-background/80 text-foreground hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Sepete Ekle"
              >
                {isAdding ? (
                  <Spinner className="w-4 h-4" />
                ) : (
                  <ShoppingCart className="w-4 h-4" />
                )}
              </button>
            </div>
          )} */}
        </div>
        <div className="mt-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{category}</p>
          <h3 className={`mt-1 text-lg font-semibold text-foreground line-clamp-2 min-h-12 ${isInStock ? "group-hover:text-accent transition-colors" : ""}`}>
            {name}
          </h3>

          <p className="mt-1 text-xs text-muted-foreground min-h-4 line-clamp-1">{subtitle}</p>


          {/* Fiyat ve İndirim */}
          <div className="mt-2 flex items-baseline gap-2">
            {discountedPrice && basePrice > discountedPrice ? (
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
        </div>
      </Link>
    </motion.div>
  )
}
