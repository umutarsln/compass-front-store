export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  categorySlug: string
  description: string
  images: string[]
  colors: string[]
  sizes: string[]
  deliveryTime: string
  specifications?: Record<string, string>
  detailedDescription?: string
}

export const products: Product[] = [
  
  
]

export const categories = [
  {
    id: "en-cok-satanlar",
    name: "En Çok Satılanlar",
    slug: "en-cok-satanlar",
  },
  {
    id: "yeni-urunler",
    name: "Yeni Ürünler",
    slug: "yeni-urunler",
  },
]

export function getProductsByCategory(categorySlug: string): Product[] {
  if (categorySlug === "en-cok-satanlar") {
    // En çok satanlar için özel ürünler (şimdilik en popüler olanları seçiyoruz)
    return products.filter((product) => 
      ["sevgili-silüet-lamba", "kalp-fotograf-lamba", "isim-yazili-lamba", "dogum-gunu-lamba"].includes(product.id)
    )
  }
  return products.filter((product) => product.categorySlug === categorySlug)
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug)
}
