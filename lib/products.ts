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
  {
    id: "sevgili-silüet-lamba",
    name: "Sevgili Silüet Lamba",
    price: 349,
    image: "/romantic/romantic-couple-heart-shaped-led-lamp-warm-glow.jpg",
    category: "Kişiye Özel Tasarımlar",
    categorySlug: "kisiye-ozel-tasarimlar",
    description:
      "Sevgilinizin fotoğrafından özel olarak tasarlanan bu lamba, odanıza romantik bir atmosfer katar. LED ışıklar ile aydınlatılan silüet, karanlıkta büyüleyici bir görünüm sunar.",
    images: [
      "/romantic/romantic-couple-heart-shaped-led-lamp-warm-glow.jpg",
      "/products/led-lamp-glowing-in-dark-room-creating-ambient-lig.jpg",
      "/lifestyle/cozy-bedroom-with-led-lamp-on-nightstand-warm-roma.jpg",
    ],
    colors: ["Sıcak Beyaz", "Soğuk Beyaz", "RGB"],
    sizes: ["Küçük (15cm)", "Orta (20cm)", "Büyük (25cm)"],
    deliveryTime: "3-5 iş günü",
    specifications: {
      "Malzeme": "Akrilik ve LED",
      "Güç": "USB ile çalışır",
      "Ağırlık": "500g - 800g (boyuta göre)",
      "Garanti": "1 yıl",
    },
    detailedDescription:
      "Bu özel tasarım lamba, sevgilinizin fotoğrafından profesyonel olarak hazırlanan silüet ile üretilir. Yüksek kaliteli akrilik malzeme kullanılarak üretilen lamba, uzun ömürlü LED ışık kaynağı ile donatılmıştır. USB bağlantısı sayesinde kolayca şarj edilebilir ve her yerde kullanılabilir.\n\nLambanız, özenle seçilmiş fotoğrafınızdan oluşturulan silüet ile kişiselleştirilir. Her lamba özel olarak üretildiği için benzersizdir ve sevdikleriniz için anlamlı bir hediye olacaktır.\n\nKullanım alanları:\n- Yatak odası dekorasyonu\n- Oturma odası aksesuarı\n- Özel günler için hediye\n- Romantik atmosfer yaratma",
  },
  {
    id: "kalp-fotograf-lamba",
    name: "Kalp Fotoğraf Lamba",
    price: 399,
    image: "/gifts/couple-holding-personalized-lamp-gift.jpg",
    category: "Kişiye Özel Tasarımlar",
    categorySlug: "kisiye-ozel-tasarimlar",
    description:
      "Kalp şeklinde tasarlanan bu özel lamba, sevgilinizin fotoğrafını benzersiz bir sanat eserine dönüştürür.",
    images: [
      "/gifts/couple-holding-personalized-lamp-gift.jpg",
      "/products/led-lamp-product-photo-aesthetic-minimalist.jpg",
      "/gifts/unboxing-personalized-lamp-gift-moment.jpg",
    ],
    colors: ["Sıcak Beyaz", "Pembe", "Kırmızı"],
    sizes: ["Standart (18cm)"],
    deliveryTime: "3-5 iş günü",
  },
  {
    id: "isim-yazili-lamba",
    name: "İsim Yazılı Lamba",
    price: 299,
    image: "/products/personalized-name-letter-led-lamp-glowing-warm.jpg",
    category: "Kişiye Özel Tasarımlar",
    categorySlug: "kisiye-ozel-tasarimlar",
    description: "Sevdiğiniz kişinin ismi veya özel bir mesajla kişiselleştirilebilen zarif LED lamba.",
    images: [
      "/products/personalized-name-letter-led-lamp-glowing-warm.jpg",
      "/products/led-lamp-on-desk-home-office-decor.jpg",
      "/products/close-up-led-lamp-detail-craftsmanship.jpg",
    ],
    colors: ["Sıcak Beyaz", "Soğuk Beyaz"],
    sizes: ["Küçük (12cm)", "Orta (18cm)", "Büyük (24cm)"],
    deliveryTime: "3-5 iş günü",
  },
  {
    id: "harf-monogram-lamba",
    name: "Harf Monogram Lamba",
    price: 279,
    image: "/products/led-lamp-product-photo-aesthetic-minimalist.jpg",
    category: "Kişiye Özel Tasarımlar",
    categorySlug: "kisiye-ozel-tasarimlar",
    description: "Tek harf veya monogram tasarımlı şık LED lamba. Ofis masanız veya yatak odanız için ideal.",
    images: [
      "/products/led-lamp-product-photo-aesthetic-minimalist.jpg",
      "/products/led-lamp-on-desk-home-office-decor.jpg",
      "/lifestyle/bedroom-interior-with-glowing-led-lamp.jpg",
    ],
    colors: ["Sıcak Beyaz", "Altın", "Gümüş"],
    sizes: ["Standart (20cm)"],
    deliveryTime: "3-5 iş günü",
  },
  {
    id: "takim-logo-lamba",
    name: "Takım Logo Lamba",
    price: 329,
    image: "/products/sports-team-logo-led-lamp-decorative-lighting.jpg",
    category: "Hazır Tasarım Koleksiyonları",
    categorySlug: "hazir-tasarim-koleksiyonlari",
    description:
      "Favori takımınızın logosu veya sembolü ile özelleştirilmiş LED lamba. Taraftar odaları için mükemmel.",
    images: [
      "/products/sports-team-logo-led-lamp-decorative-lighting.jpg",
      "/products/led-lamp-glowing-in-dark-room-creating-ambient-lig.jpg",
      "/products/close-up-led-lamp-detail-craftsmanship.jpg",
    ],
    colors: ["Takım Renkleri", "Sıcak Beyaz", "RGB"],
    sizes: ["Orta (20cm)", "Büyük (30cm)"],
    deliveryTime: "5-7 iş günü",
  },
  {
    id: "film-karakter-lamba",
    name: "Film Karakter Lamba",
    price: 359,
    image: "/products/movie-character-silhouette-led-lamp-nightlight.jpg",
    category: "Hazır Tasarım Koleksiyonları",
    categorySlug: "hazir-tasarim-koleksiyonlari",
    description:
      "Favori film veya dizi karakterinizin silüetinden oluşan özel LED lamba. Koleksiyon parçası olarak ideal.",
    images: [
      "/products/movie-character-silhouette-led-lamp-nightlight.jpg",
      "/products/led-lamp-product-photo-aesthetic-minimalist.jpg",
      "/products/led-lamp-glowing-in-dark-room-creating-ambient-lig.jpg",
    ],
    colors: ["Sıcak Beyaz", "RGB"],
    sizes: ["Küçük (15cm)", "Orta (22cm)"],
    deliveryTime: "5-7 iş günü",
  },
  {
    id: "dogum-gunu-lamba",
    name: "Doğum Günü Özel Lamba",
    price: 379,
    image: "/gifts/special-occasion-celebration-led-lamp-gift.jpg",
    category: "Yaklaşan Özel Gün",
    categorySlug: "yaklasan-ozel-gun",
    description: "Doğum günü, yıldönümü veya özel günler için tasarlanmış kişiselleştirilmiş LED lamba.",
    images: [
      "/gifts/special-occasion-celebration-led-lamp-gift.jpg",
      "/gifts/unboxing-personalized-lamp-gift-moment.jpg",
      "/gifts/couple-looking-at-personalized-led-lamp-gift-unwra.jpg",
    ],
    colors: ["Sıcak Beyaz", "RGB"],
    sizes: ["Orta (20cm)", "Büyük (28cm)"],
    deliveryTime: "3-5 iş günü",
  },
  {
    id: "yildonumu-lamba",
    name: "Yıldönümü Anı Lamba",
    price: 429,
    image: "/gifts/couple-looking-at-personalized-led-lamp-gift-unwra.jpg",
    category: "Yaklaşan Özel Gün",
    categorySlug: "yaklasan-ozel-gun",
    description: "Yıldönümünüzü kutlamak için özel tasarım. Tarih ve isimlerinizle kişiselleştirilebilir LED lamba.",
    images: [
      "/gifts/couple-looking-at-personalized-led-lamp-gift-unwra.jpg",
      "/romantic/romantic-couple-heart-shaped-led-lamp-warm-glow.jpg",
      "/lifestyle/cozy-bedroom-with-led-lamp-on-nightstand-warm-roma.jpg",
    ],
    colors: ["Sıcak Beyaz", "Pembe", "Altın"],
    sizes: ["Standart (22cm)"],
    deliveryTime: "3-5 iş günü",
  },
]

export const categories = [
  {
    slug: "kisiye-ozel-tasarimlar",
    name: "Kişiye Özel Tasarımlar",
    description: "Fotoğraflarınızdan özel olarak tasarlanan benzersiz LED lambalar.",
    image: "/campaigns/KENDİ LAMBANI TASARLA -c (kare) kopyası.png",
  },
  {
    slug: "hazir-tasarim-koleksiyonlari",
    name: "Hazır Tasarım Koleksiyonları",
    description: "Önceden hazırlanmış özel tasarım koleksiyonlarımız.",
    image: "/campaigns/hazır tasarım koleksiyonları (yatay).png",
  },
  {
    slug: "yaklasan-ozel-gun",
    name: "Yaklaşan Özel Gün",
    description: "Yaklaşan özel günler için özel tasarımlar ve kampanyalar.",
    image: "/gifts/special-occasion-celebration-led-lamp-gift.jpg",
  },
  {
    slug: "en-cok-satanlar",
    name: "En Çok Satanlar",
    description: "En popüler ve çok satan ürünlerimiz.",
    image: "/products/sports-team-logo-led-lamp-decorative-lighting.jpg",
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
