"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import { Upload, Check, Truck, Shield, Clock, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import type { Product } from "@/lib/products"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { addToCart } = useCart()
  const router = useRouter()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
  })

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  const handleAddToCart = () => {
    setIsAddingToCart(true)
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      color: selectedColor,
      size: selectedSize,
    })
    
    // Show feedback animation
    setTimeout(() => {
      setIsAddingToCart(false)
    }, 500)
  }

  return (
    <section className="py-12 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                Anasayfa
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/kategoriler" className="hover:text-foreground transition-colors">
                Kategoriler
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/kategoriler/${product.categorySlug}`} className="hover:text-foreground transition-colors">
                {product.category}
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground">{product.name}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="relative aspect-[4/5] bg-secondary overflow-hidden">
              <Image
                src={product.images[selectedImage] || "/placeholders/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
                    aria-label="Önceki resim"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
                    aria-label="Sonraki resim"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            <div className="flex gap-3 mt-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 overflow-hidden ${
                    selectedImage === index ? "ring-2 ring-foreground" : ""
                  }`}
                >
                  <Image
                    src={image || "/placeholders/placeholder.svg"}
                    alt={`${product.name} - Görsel ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-sm text-muted-foreground uppercase tracking-wider">{product.category}</p>
            <h1 className="mt-2 font-serif text-3xl sm:text-4xl text-foreground">{product.name}</h1>
            <p className="mt-4 text-2xl font-medium text-foreground">{product.price.toLocaleString("tr-TR")} ₺</p>
            <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="mt-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Renk</label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 text-sm border transition-colors ${
                        selectedColor === color
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Boyut</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-sm border transition-colors ${
                        selectedSize === size
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Fotoğrafınızı Yükleyin</label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
                    isDragActive ? "border-accent bg-accent/5" : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <input {...getInputProps()} />
                  {previewUrl ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative w-24 h-24">
                        <Image
                          src={previewUrl || "/placeholders/placeholder.svg"}
                          alt="Yüklenen fotoğraf"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-accent">
                        <Check className="w-4 h-4" />
                        {uploadedFile?.name}
                      </div>
                      <p className="text-xs text-muted-foreground">Değiştirmek için tıklayın veya sürükleyin</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-foreground">
                          {isDragActive ? "Bırakın..." : "Fotoğrafınızı buraya sürükleyin"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">veya tıklayarak seçin</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="flex-1 py-4 bg-primary text-primary-foreground font-medium text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAddingToCart ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Ekleniyor...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    Sepete Ekle
                  </>
                )}
              </button>
              <Link
                href="/sepet"
                className="px-6 py-4 border-2 border-foreground text-foreground font-medium text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors flex items-center justify-center"
              >
                Sepete Git
              </Link>
            </div>

            <div className="mt-8 flex justify-center">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-foreground">Teslimat</p>
                    <p className="text-xs text-muted-foreground">{product.deliveryTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-foreground">Güvenli</p>
                    <p className="text-xs text-muted-foreground">SSL Ödeme</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-foreground">Özel Üretim</p>
                    <p className="text-xs text-muted-foreground">Sizin için</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Ürün Özellikleri ve Açıklama Tab Bölümü */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 lg:mt-20"
        >
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="w-full lg:w-fit mb-0 h-auto bg-transparent border-b border-border rounded-none p-0">
              <TabsTrigger 
                value="specifications" 
                className="px-6 py-3 text-base font-medium data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:bg-transparent rounded-none"
              >
                Ürün Özellikleri
              </TabsTrigger>
              <TabsTrigger 
                value="description" 
                className="px-6 py-3 text-base font-medium data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:bg-transparent rounded-none"
              >
                Ürün Açıklaması
              </TabsTrigger>
            </TabsList>

            <TabsContent value="specifications" className="mt-0">
              <div className="bg-secondary/30 border-x border-b border-border p-6 lg:p-8 -mt-px">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">Boyut Seçenekleri</span>
                      <span className="text-sm text-foreground leading-relaxed">{product.sizes.join(", ")}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">Renk Seçenekleri</span>
                      <span className="text-sm text-foreground leading-relaxed">{product.colors.join(", ")}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">Teslimat Süresi</span>
                      <span className="text-sm text-foreground leading-relaxed">{product.deliveryTime}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">Kategori</span>
                      <span className="text-sm text-foreground leading-relaxed">{product.category}</span>
                    </div>
                  </div>
                  
                  {product.specifications && Object.keys(product.specifications).length > 0 && (
                    <div className="mt-8 pt-8 border-t border-border">
                      <h4 className="text-base font-medium text-foreground mb-6">Teknik Özellikler</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="flex flex-col">
                            <span className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">{key}</span>
                            <span className="text-sm text-foreground leading-relaxed">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="description" className="mt-0">
              <div className="bg-secondary/30 border-x border-b border-border p-6 lg:p-8 -mt-px">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-4">Ürün Hakkında</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                  
                  {product.detailedDescription && (
                    <div className="pt-6 border-t border-border">
                      <h3 className="text-lg font-medium text-foreground mb-4">Detaylı Açıklama</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                        {product.detailedDescription}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  )
}
