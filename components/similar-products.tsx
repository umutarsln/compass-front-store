"use client"

import { motion } from "framer-motion"
import { ProductCard } from "@/components/product-card"
import type { ProductListItem } from "@/services/products"
import { transformProductListItem } from "@/lib/product-transformer"

interface SimilarProductsProps {
  products: ProductListItem[]
}

export function SimilarProducts({ products }: SimilarProductsProps) {
  const transformedProducts = products.map(transformProductListItem)

  return (
    <section className="py-16 bg-secondary">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-serif text-2xl sm:text-3xl text-foreground text-center mb-12"
        >
          Benzer Ürünler
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {transformedProducts.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              {...product}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
