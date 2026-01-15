"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ProductCard } from "@/components/product-card"
import { products, categories } from "@/lib/products"

export function AllProducts() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.categorySlug === selectedCategory)
    : products

  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground">Tüm Ürünler</h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Fotoğraflarınızdan benzersiz LED lambalara. Koleksiyonumuzu keşfedin.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-5 py-2 text-sm font-medium border transition-colors ${
              selectedCategory === null
                ? "border-foreground bg-foreground text-background"
                : "border-border text-foreground hover:border-foreground"
            }`}
          >
            Tümü
          </button>
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => setSelectedCategory(category.slug)}
              className={`px-5 py-2 text-sm font-medium border transition-colors ${
                selectedCategory === category.slug
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-foreground hover:border-foreground"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
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
      </div>
    </section>
  )
}
