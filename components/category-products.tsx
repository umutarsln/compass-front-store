"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/products"

interface CategoryProductsProps {
  category: {
    slug: string
    name: string
    description: string
    image: string
  }
  products: Product[]
}

export function CategoryProducts({ category, products }: CategoryProductsProps) {
  return (
    <section className="bg-background">
      <div className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <Image src={category.image || "/placeholders/placeholder.svg"} alt={category.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-foreground/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-background">{category.name}</h1>
            <p className="mt-4 text-lg text-background/80 max-w-xl mx-auto px-6">{category.description}</p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="flex gap-8">
          {/* Filtre Sidebar - Placeholder */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h2 className="text-lg font-medium text-foreground mb-6">Filtreler</h2>
              <div className="space-y-6">
                {/* Fiyat Filtresi Placeholder */}
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">Fiyat Aralığı</h3>
                  <div className="space-y-2">
                    <div className="h-10 bg-secondary rounded border border-border"></div>
                    <div className="h-10 bg-secondary rounded border border-border"></div>
                  </div>
                </div>
                
                {/* Renk Filtresi Placeholder */}
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">Renk</h3>
                  <div className="space-y-2">
                    <div className="h-8 bg-secondary rounded border border-border"></div>
                    <div className="h-8 bg-secondary rounded border border-border"></div>
                    <div className="h-8 bg-secondary rounded border border-border"></div>
                  </div>
                </div>
                
                {/* Boyut Filtresi Placeholder */}
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">Boyut</h3>
                  <div className="space-y-2">
                    <div className="h-8 bg-secondary rounded border border-border"></div>
                    <div className="h-8 bg-secondary rounded border border-border"></div>
                    <div className="h-8 bg-secondary rounded border border-border"></div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Ürünler Grid */}
          <div className="flex-1">
            {products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 lg:gap-8">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    category={product.category}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground">Bu kategoride henüz ürün bulunmuyor.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
