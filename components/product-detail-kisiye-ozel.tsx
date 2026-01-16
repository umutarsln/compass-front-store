"use client"

import { useState, useCallback, useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import { Upload, Check, Truck, Shield, Clock, ChevronLeft, ChevronRight, ShoppingCart, AlertCircle, Eye, Image as ImageIcon, Ruler, Info, Star } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { SimilarProducts } from "@/components/similar-products"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

// Örnek ürün verisi - tasarım için
const sampleProduct = {
  id: "kisiye-ozel-urun",
  name: "Kişiye Özel Tasarım",
  price: 349,
  image: "/KENDİ LAMBANI TASARLA -c (kare) kopyası.png",
  category: "Kişiye Özel Tasarımlar",
  description: "Fotoğraflarınızdan özel olarak tasarlanan bu lamba, odanıza romantik bir atmosfer katar. LED ışıklar ile aydınlatılan silüet, karanlıkta büyüleyici bir görünüm sunar.",
  images: [
    "/KENDİ LAMBANI TASARLA -c (kare) kopyası.png",
    "/led-lamp-glowing-in-dark-room-creating-ambient-lig.jpg",
    "/cozy-bedroom-with-led-lamp-on-nightstand-warm-roma.jpg",
  ],
  deliveryTime: "3-5 iş günü",
  specifications: {
    "Malzeme": "Akrilik ve LED",
    "Güç": "USB ile çalışır",
    "Çap Seçenekleri": "10cm, 12cm, 15cm",
    "Yükseklik Seçenekleri": "10cm, 12cm, 15cm",
    "Garanti": "1 yıl",
  },
  detailedDescription:
    "Kişiye özel tasarım lambalarımız, sevdikleriniz için benzersiz ve anlamlı hediyeler oluşturmanıza olanak tanır. Fotoğraflarınızdan profesyonel olarak hazırlanan silüetler, yüksek kaliteli akrilik malzeme ile birleşerek uzun ömürlü ve şık bir dekorasyon ürünü haline gelir.\n\nÜretim Süreci:\n- Fotoğrafınızı yükleyin\n- Çap ve yükseklik seçeneklerinden birini belirleyin\n- Tasarımınız hazırlanır ve üretime alınır\n- 3-5 iş günü içinde kapınıza teslim edilir\n\nKullanım Alanları:\n- Yatak odası dekorasyonu\n- Oturma odası aksesuarı\n- Özel günler için hediye\n- Romantik atmosfer yaratma\n- Kişisel çalışma alanı dekorasyonu",
}

const diameters = [10, 12, 15]
const heights = [10, 12, 15]

export function ProductDetailKisiyeOzel() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedDiameter, setSelectedDiameter] = useState<number | null>(null)
  const [selectedHeight, setSelectedHeight] = useState<number | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [activeTab, setActiveTab] = useState("specifications")
  const { addToCart } = useCart()
  const router = useRouter()
  const imageUploadRef = useRef<HTMLDivElement>(null)
  const similarProductsRef = useRef<HTMLDivElement>(null)
  const productDetailsRef = useRef<HTMLDivElement>(null)
  
  // Benzer ürünleri getir (aynı kategoriden) - şimdilik boş array (mock data formatı uyumsuz)
  const similarProducts: any[] = []

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
    setSelectedImage((prev) => (prev + 1) % sampleProduct.images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + sampleProduct.images.length) % sampleProduct.images.length)
  }

  const handleCustomizeClick = () => {
    // Görsel alanını göster ve aşağı kaydır
    setShowImageUpload(true)
    setTimeout(() => {
      imageUploadRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 100)
  }

  const handleAddToCartClick = () => {
    // Görsel yüklendiyse sepete ekle ve sepet sayfasına yönlendir
    if (uploadedFile && previewUrl && selectedDiameter && selectedHeight) {
      setIsAddingToCart(true)
      addToCart({
        id: sampleProduct.id,
        name: sampleProduct.name,
        price: sampleProduct.price,
        image: sampleProduct.image,
        color: `${selectedDiameter}cm Çap`,
        size: `${selectedHeight}cm Yükseklik`,
      }, false) // Sidebar açılmasın, sepet sayfasına yönlendirilecek
      
      setTimeout(() => {
        setIsAddingToCart(false)
        router.push("/sepet")
      }, 500)
    }
  }

  const handleViewSimilarProducts = () => {
    // Benzer ürünler bölümüne scroll yap
    setTimeout(() => {
      similarProductsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }

  const handleViewProductDetails = () => {
    // Ürün açıklaması sekmesini aç ve bölüme scroll yap
    setActiveTab("description")
    setTimeout(() => {
      if (productDetailsRef.current) {
        const headerOffset = 120 // Header yüksekliği + padding
        const elementPosition = productDetailsRef.current.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        })
      }
    }, 100)
  }

  const canCustomize = selectedDiameter !== null && selectedHeight !== null && !showImageUpload
  const canAddToCart = showImageUpload && uploadedFile && previewUrl && selectedDiameter && selectedHeight

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
            <li className="text-foreground">{sampleProduct.name}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="relative aspect-[4/5] bg-secondary overflow-hidden">
              <Image
                src={sampleProduct.images[selectedImage] || "/placeholders/placeholder.svg"}
                alt={sampleProduct.name}
                fill
                className="object-cover"
                priority
              />
              {sampleProduct.images.length > 1 && (
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
              {sampleProduct.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 overflow-hidden ${
                    selectedImage === index ? "ring-2 ring-foreground" : ""
                  }`}
                >
                  <Image
                    src={image || "/placeholders/placeholder.svg"}
                    alt={`${sampleProduct.name} - Görsel ${index + 1}`}
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
            <p className="text-sm text-muted-foreground uppercase tracking-wider">{sampleProduct.category}</p>
            <h1 className="mt-2 font-serif text-3xl sm:text-4xl text-foreground">{sampleProduct.name}</h1>
            <p className="mt-4 text-2xl font-medium text-foreground">{sampleProduct.price.toLocaleString("tr-TR")} ₺</p>
            <p className="mt-6 text-muted-foreground leading-relaxed">{sampleProduct.description}</p>

            <div className="mt-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Çap (cm)</label>
                <div className="flex flex-wrap gap-2">
                  {diameters.map((diameter) => (
                    <button
                      key={diameter}
                      onClick={() => setSelectedDiameter(diameter)}
                      className={`px-4 py-2 text-sm border transition-colors ${
                        selectedDiameter === diameter
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground"
                      }`}
                    >
                      {diameter} cm
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Yükseklik (cm)</label>
                <div className="flex flex-wrap gap-2">
                  {heights.map((height) => (
                    <button
                      key={height}
                      onClick={() => setSelectedHeight(height)}
                      className={`px-4 py-2 text-sm border transition-colors ${
                        selectedHeight === height
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground"
                      }`}
                    >
                      {height} cm
                    </button>
                  ))}
                </div>
              </div>

              {/* Kişiselleştir Butonu */}
              <div className="mt-6">
                <button
                  onClick={handleCustomizeClick}
                  disabled={!canCustomize}
                  className={`w-full py-5 text-base font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                    canCustomize
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                      : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                  }`}
                >
                  Kişiselleştir
                </button>
              </div>
            </div>

            <div className="mt-8 flex gap-4 justify-center">
              <button
                onClick={handleViewSimilarProducts}
                className="px-5 py-3 border-2 border-foreground text-foreground font-medium text-xs uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="w-3.5 h-3.5" />
                Benzer Ürünleri Gör
              </button>
              <button
                onClick={handleViewProductDetails}
                className="px-5 py-3 border-2 border-foreground text-foreground font-medium text-xs uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors flex items-center justify-center gap-2"
              >
                Ürünü Yakından Tanı
              </button>
            </div>

            <div className="mt-8 flex justify-center">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-foreground">Teslimat</p>
                    <p className="text-xs text-muted-foreground">{sampleProduct.deliveryTime}</p>
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

        {/* Görsel Yükleme Alanı - Scroll ile gösterilecek */}
        {showImageUpload && (
          <motion.div
            ref={imageUploadRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-16 max-w-2xl mx-auto"
          >
            <div className="bg-background border border-border p-8 rounded-lg">
              <h2 className="text-xl font-serif text-foreground mb-6 text-center">Fotoğrafınızı Yükleyin</h2>
              
              {/* Uyarılar */}
              <div className="mb-6 space-y-2">
                <div className="flex items-start gap-2 text-sm text-foreground bg-muted/50 p-3 rounded">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>Verilen alanı doldurunuz</p>
                </div>
                <div className="flex items-start gap-2 text-sm text-foreground bg-muted/50 p-3 rounded">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>720p altında görsel kullanmayınız</p>
                </div>
              </div>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? "border-accent bg-accent/5" : "border-border hover:border-muted-foreground"
                }`}
              >
                <input {...getInputProps()} />
                {previewUrl ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-32 h-32">
                      <Image
                        src={previewUrl || "/placeholders/placeholder.svg"}
                        alt="Yüklenen fotoğraf"
                        fill
                        className="object-cover rounded"
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
                    <Upload className="w-12 h-12 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-foreground">
                        {isDragActive ? "Bırakın..." : "Fotoğrafınızı buraya sürükleyin"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">veya tıklayarak seçin</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sepete Ekle Butonu - Görsel alanının sağ altında */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleAddToCartClick}
                  disabled={isAddingToCart || !canAddToCart}
                  className={`px-8 py-4 font-medium text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                    canAddToCart
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                  }`}
                >
                  {isAddingToCart ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Ekleniyor...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Sepete Ekle
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Ürün Özellikleri ve Açıklama Tab Bölümü */}
        <motion.div
          ref={productDetailsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 lg:mt-20"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
              <TabsTrigger 
                value="customization" 
                className="px-6 py-3 text-base font-medium data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:bg-transparent rounded-none"
              >
                Nasıl Kişiselleştirilir
              </TabsTrigger>
              <TabsTrigger 
                value="reviews" 
                className="px-6 py-3 text-base font-medium data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:bg-transparent rounded-none"
              >
                Müşterilerimizin Yorumları
              </TabsTrigger>
            </TabsList>

            <TabsContent value="specifications" className="mt-0">
              <div className="bg-secondary/30 border-x border-b border-border p-6 lg:p-8 -mt-px">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">Çap Seçenekleri</span>
                      <span className="text-sm text-foreground leading-relaxed">{diameters.join("cm, ")}cm</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">Yükseklik Seçenekleri</span>
                      <span className="text-sm text-foreground leading-relaxed">{heights.join("cm, ")}cm</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">Teslimat Süresi</span>
                      <span className="text-sm text-foreground leading-relaxed">{sampleProduct.deliveryTime}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">Kategori</span>
                      <span className="text-sm text-foreground leading-relaxed">{sampleProduct.category}</span>
                    </div>
                  </div>
                  
                  {sampleProduct.specifications && Object.keys(sampleProduct.specifications).length > 0 && (
                    <div className="mt-8 pt-8 border-t border-border">
                      <h4 className="text-base font-medium text-foreground mb-6">Teknik Özellikler</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(sampleProduct.specifications).map(([key, value]) => (
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
                      {sampleProduct.description}
                    </p>
                  </div>
                  
                  {sampleProduct.detailedDescription && (
                    <div className="pt-6 border-t border-border">
                      <h3 className="text-lg font-medium text-foreground mb-4">Detaylı Açıklama</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                        {sampleProduct.detailedDescription}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="customization" className="mt-0">
              <div className="bg-secondary/30 border-x border-b border-border p-6 lg:p-8 -mt-px">
                <div className="space-y-8">
                  {/* Fotoğraf Ekleme Adımları */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <ImageIcon className="w-6 h-6 text-foreground" />
                      <h3 className="text-lg font-medium text-foreground">Fotoğraf Ekleme Adımları</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                          1
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-medium text-foreground mb-2">Çap ve Yükseklik Seçimi</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Öncelikle lambanız için uygun çap ve yükseklik seçeneklerinden birini belirleyin. 
                            Seçim yapmadan fotoğraf yükleyemezsiniz.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                          2
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-medium text-foreground mb-2">Kişiselleştir Butonuna Tıklayın</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Çap ve yükseklik seçimini tamamladıktan sonra "Kişiselleştir" butonuna tıklayın. 
                            Bu buton fotoğraf yükleme alanını açacaktır.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                          3
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-medium text-foreground mb-2">Fotoğrafınızı Yükleyin</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                            Fotoğrafınızı sürükleyip bırakabilir veya tıklayarak seçebilirsiniz.
                          </p>
                          <div className="bg-muted/50 border border-border p-4 rounded-lg space-y-2">
                            <div className="flex items-start gap-2">
                              <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-muted-foreground">
                                <strong className="text-foreground">Önemli:</strong> Fotoğrafınızın çözünürlüğü en az 720p olmalıdır. 
                                Daha yüksek çözünürlük, daha kaliteli sonuç demektir.
                              </p>
                            </div>
                            <div className="flex items-start gap-2">
                              <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-muted-foreground">
                                Desteklenen formatlar: JPEG, JPG, PNG, WEBP
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                          4
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-medium text-foreground mb-2">Sepete Ekleyin</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Fotoğrafınızı yükledikten sonra "Sepete Ekle" butonuna tıklayarak siparişinizi tamamlayın. 
                            Fotoğrafınız otomatik olarak işleme alınacak ve lambanız özel olarak üretilecektir.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Çap ve Yükseklik Seçimi Rehberi */}
                  <div className="pt-6 border-t border-border">
                    <div className="flex items-center gap-3 mb-6">
                      <Ruler className="w-6 h-6 text-foreground" />
                      <h3 className="text-lg font-medium text-foreground">Çap ve Yükseklik Seçimi Rehberi</h3>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-base font-medium text-foreground mb-3">Çap Seçimi</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-muted/50 border border-border p-4 rounded-lg">
                            <div className="text-sm font-medium text-foreground mb-1">10cm</div>
                            <div className="text-xs text-muted-foreground">
                              Küçük alanlar için ideal. Masanızda veya komodininizde şık bir görünüm.
                            </div>
                          </div>
                          <div className="bg-muted/50 border border-border p-4 rounded-lg">
                            <div className="text-sm font-medium text-foreground mb-1">12cm</div>
                            <div className="text-xs text-muted-foreground">
                              Orta boyutlu odalar için mükemmel. En popüler seçenek.
                            </div>
                          </div>
                          <div className="bg-muted/50 border border-border p-4 rounded-lg">
                            <div className="text-sm font-medium text-foreground mb-1">15cm</div>
                            <div className="text-xs text-muted-foreground">
                              Geniş alanlar ve göz alıcı dekorasyon için ideal.
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-base font-medium text-foreground mb-3">Yükseklik Seçimi</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-muted/50 border border-border p-4 rounded-lg">
                            <div className="text-sm font-medium text-foreground mb-1">10cm</div>
                            <div className="text-xs text-muted-foreground">
                              Kompakt tasarım. Düşük tavanlı odalar için uygun.
                            </div>
                          </div>
                          <div className="bg-muted/50 border border-border p-4 rounded-lg">
                            <div className="text-sm font-medium text-foreground mb-1">12cm</div>
                            <div className="text-xs text-muted-foreground">
                              Standart yükseklik. Çoğu dekorasyon stiline uyum sağlar.
                            </div>
                          </div>
                          <div className="bg-muted/50 border border-border p-4 rounded-lg">
                            <div className="text-sm font-medium text-foreground mb-1">15cm</div>
                            <div className="text-xs text-muted-foreground">
                              Etkileyici görünüm. Geniş ve yüksek odalar için mükemmel.
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-medium text-foreground mb-2">İpucu</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              Çap ve yükseklik seçiminde, lambanızı nerede kullanacağınızı düşünün. 
                              Küçük masalar için 10-12cm çap, geniş alanlar için 15cm çap önerilir. 
                              Yükseklik seçiminde ise odanızın tavan yüksekliğini ve dekorasyon stilinizi göz önünde bulundurun.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-0">
              <div className="bg-secondary/30 border-x border-b border-border p-6 lg:p-8 -mt-px">
                <div className="space-y-6">
                  {/* Yorum 1 */}
                  <div className="border-b border-border pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-base font-medium text-foreground mb-1">Ayşe K.</h4>
                        <p className="text-xs text-muted-foreground">2 hafta önce</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-4 h-4 fill-accent text-accent"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Harika bir ürün! Sevgilime hediye olarak aldım ve çok beğendi. Fotoğraf kalitesi mükemmel, 
                      lamba çok şık görünüyor. Teslimat da hızlıydı, 3 günde geldi. Kesinlikle tavsiye ederim!
                    </p>
                  </div>

                  {/* Yorum 2 */}
                  <div className="border-b border-border pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-base font-medium text-foreground mb-1">Mehmet Y.</h4>
                        <p className="text-xs text-muted-foreground">1 ay önce</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-4 h-4 fill-accent text-accent"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Çap ve yükseklik seçimi çok kolaydı. Ürün tam istediğim gibi geldi. LED ışığı çok yumuşak 
                      ve göz yormuyor. Yatak odamızda mükemmel duruyor. Kalite fiyat dengesi harika!
                    </p>
                  </div>

                  {/* Yorum 3 */}
                  <div className="border-b border-border pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-base font-medium text-foreground mb-1">Zeynep A.</h4>
                        <p className="text-xs text-muted-foreground">3 hafta önce</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4].map((star) => (
                          <Star
                            key={star}
                            className="w-4 h-4 fill-accent text-accent"
                          />
                        ))}
                        <Star className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Genel olarak memnun kaldım. Fotoğraf yükleme süreci biraz karışık geldi ama sonuç güzel. 
                      Ürün kaliteli ve paketleme özenliydi. Tek eksik, daha fazla renk seçeneği olabilirdi.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Benzer Ürünler Bölümü - Footer'ın üstünde */}
        {similarProducts.length > 0 && (
          <div ref={similarProductsRef} className="mt-24">
            <SimilarProducts products={similarProducts} />
          </div>
        )}
      </div>
    </section>
  )
}
