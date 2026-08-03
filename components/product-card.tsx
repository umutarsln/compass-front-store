"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, Eye } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import type { FrontendProduct } from "@/lib/product-transformer"
import { PRICE_EX_VAT_LABEL } from "@/lib/vat"

interface ProductCardProps extends FrontendProduct {
  /** LCP için ilk birkaç kartta true — geri kalan lazy yüklenir */
  priority?: boolean
}

/**
 * Ürün kartı — CSS hover animasyonu; Framer Motion yok (daha küçük JS bundle).
 */
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
  priority = false,
}: ProductCardProps) {
  const detailUrl = `/urun/${slug || id}`
  const router = useRouter()
  const { addToCart, isAddingToCart } = useCart()

  const realProductId = productId || id
  const isAdding = isAddingToCart(realProductId, null)

  const discountPercent = discountedPrice && basePrice > discountedPrice
    ? Math.round(((basePrice - discountedPrice) / basePrice) * 100)
    : 0

  const isInStock = stock.usableQuantity > 0

  const isVariantProduct = variantValues && variantValues.length > 0

  /** Sepete ekleme; kart linkinden bağımsız çalışır. */
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
      variantId: null,
    })
  }

  return (
    <div
      className={`group/card bg-card rounded-lg overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 border border-border hover:-translate-y-1 ${!isInStock ? "opacity-60" : ""}`}
    >
      <div
        className={`relative aspect-[4/3] overflow-hidden bg-white dark:bg-white ${!isInStock ? "opacity-80 grayscale-[0.25]" : ""}`}
      >
        <Link
          href={detailUrl}
          className={`absolute inset-0 z-[1] block ${isInStock ? "group-hover/card:[&_img]:scale-105" : ""}`}
          aria-label={`${name} — ürün detayı`}
        >
          <Image
            src={image || "/placeholders/placeholder.svg"}
            alt={name}
            fill
            priority={priority}
            loading={priority ? undefined : "lazy"}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain transition-transform duration-500"
          />
        </Link>
        {isInStock && (
          <div className="absolute inset-0 z-[2] flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-colors duration-300 pointer-events-none group-hover/card:bg-black/25 group-hover/card:opacity-100 group-hover/card:pointer-events-auto">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                router.push(detailUrl)
              }}
              className="rounded-full h-10 w-10 flex items-center justify-center bg-secondary text-white hover:bg-secondary/80 transition-colors border border-border"
              aria-label="Detayları görüntüle"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding}
              className="rounded-full h-10 w-10 flex items-center justify-center bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Sepete ekle"
            >
              {isAdding ? <Spinner className="w-4 h-4" /> : <ShoppingCart className="h-4 w-4" />}
            </button>
          </div>
        )}

        {discountedPrice && discountPercent > 0 && (
          <div className="absolute top-3 left-3 z-[3] pointer-events-none">
            <Badge className="bg-red-500 text-white font-bold text-xs px-2 py-1 shadow-lg">
              %{discountPercent} İNDİRİM
            </Badge>
          </div>
        )}

        {!isInStock && (
          <div className="absolute bottom-3 left-3 z-[3] pointer-events-none">
            <Badge variant="destructive" className="font-semibold text-xs px-2 py-1 shadow-lg opacity-90">
              Stokta Yok
            </Badge>
          </div>
        )}
      </div>

      <Link
        href={detailUrl}
        className="block p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-none"
      >
        <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">{category}</p>
        <h3 className="font-display font-semibold text-foreground line-clamp-2 text-sm leading-tight hover:text-primary transition-colors">
          {name}
        </h3>

        <p className="mt-1 text-xs text-muted-foreground min-h-4 line-clamp-1">{subtitle}</p>

        <div className="mt-2 flex items-baseline flex-wrap gap-x-1.5 gap-y-0 font-display">
          {price != null && price > 0 ? (
            discountedPrice && basePrice > discountedPrice ? (
              <>
                <span className="text-lg font-bold text-foreground">
                  {discountedPrice.toLocaleString("tr-TR")} ₺
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {basePrice.toLocaleString("tr-TR")} ₺
                </span>
                <span className="text-xs text-muted-foreground font-medium">{PRICE_EX_VAT_LABEL}</span>
              </>
            ) : (
              <>
                <span className="text-lg font-bold text-foreground">
                  {price.toLocaleString("tr-TR")} ₺
                </span>
                <span className="text-xs text-muted-foreground font-medium">{PRICE_EX_VAT_LABEL}</span>
              </>
            )
          ) : (
            <span className="text-lg font-bold text-accent">Teklif Alın</span>
          )}
        </div>

        {isVariantProduct && variantValues.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {variantValues.map((variant, index) => {
              const label = variant.variantOption?.name || ""
              const displayValue = variant.value

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
              )
            })}
          </div>
        )}
      </Link>

      <div className="px-4 pb-4 pt-0 mt-3 flex flex-col gap-2">
        <Button asChild variant="hero" size="sm" className="w-full text-xs">
          <Link href={detailUrl}>Satın Al</Link>
        </Button>
        <Button asChild variant="hero-outline" size="sm" className="w-full text-xs">
          <Link href={detailUrl}>Detayları İncele</Link>
        </Button>
      </div>
    </div>
  )
}
