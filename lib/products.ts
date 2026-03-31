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
    id: "uv-flatbed-pro",
    name: "COMPASS UV 9060 UV BASKI MAKINESI",
    price: 506000,
    image: "/urunler/folyokesim/compass-uv-9060-uv-baski-makinesi/compass-uv-9060-uv-baski-makinesi-01-877b4d3e.jpeg",
    category: "UV Baski",
    categorySlug: "uv-baski",
    description: "60x90 cm endustriyel UV baski cozumleri icin profesyonel model.",
    images: [
      "/urunler/folyokesim/compass-uv-9060-uv-baski-makinesi/compass-uv-9060-uv-baski-makinesi-01-877b4d3e.jpeg",
    ],
    colors: [],
    sizes: [],
    deliveryTime: "3-5 is gunu",
  },
  {
    id: "roll-to-roll-eco",
    name: "COMPASS UV BASKI MAKINESI",
    price: 528000,
    image: "/urunler/folyokesim/compass-uv-baski-makinesi/compass-uv-baski-makinesi-01-2ec39392.png",
    category: "UV Baski",
    categorySlug: "uv-baski",
    description: "Farkli olculerde uretilebilen UV baski makinesi.",
    images: ["/urunler/folyokesim/compass-uv-baski-makinesi/compass-uv-baski-makinesi-01-2ec39392.png"],
    colors: [],
    sizes: [],
    deliveryTime: "3-5 is gunu",
  },
  {
    id: "sublimasyon-dijital",
    name: "Sublimasyon Dijital Baski Makinesi",
    price: 506000,
    image:
      "/urunler/folyokesim/epson-i3200-baski-kafali-sublimasyon-dijital-baski-makinesi/epson-i3200-baski-kafali-sublimasyon-dijital-baski-makinesi-01-67ff2857.png",
    category: "Dijital Baski",
    categorySlug: "dijital-baski",
    description: "Kumas, bayrak ve afis uygulamalari icin i3200 kafali cozum.",
    images: [
      "/urunler/folyokesim/epson-i3200-baski-kafali-sublimasyon-dijital-baski-makinesi/epson-i3200-baski-kafali-sublimasyon-dijital-baski-makinesi-01-67ff2857.png",
    ],
    colors: [],
    sizes: [],
    deliveryTime: "3-5 is gunu",
  },
  {
    id: "plotter-175-ppf",
    name: "175 CM PPF/FOLYO KESIM MAKINESI",
    price: 121000,
    image: "/urunler/folyokesim/175-cm-ppf-folyo-kesim-makinesi-plotter/175-cm-ppf-folyo-kesim-makinesi-plotter-01-48d0a713.png",
    category: "Plotter Folyo Kesici",
    categorySlug: "plotter-folyo-kesici",
    description: "Optik kameralı, yuksek hizli profesyonel folyo kesim makinesi.",
    images: [
      "/urunler/folyokesim/175-cm-ppf-folyo-kesim-makinesi-plotter/175-cm-ppf-folyo-kesim-makinesi-plotter-01-48d0a713.png",
    ],
    colors: [],
    sizes: [],
    deliveryTime: "3-5 is gunu",
  },
  {
    id: "etiket-kesim-33x40",
    name: "33X40 Otomatik Beslemeli Etiket Kesim Makinesi",
    price: 96800,
    image: "/urunler/folyokesim/33x40-otomatik-beslemeli-etiket-kesim-makinesi/33x40-otomatik-beslemeli-etiket-kesim-makinesi-01-2e12fba9.jpeg",
    category: "Etiket Kesim",
    categorySlug: "etiket-kesim",
    description: "Otomatik kontur konumlandirma ve kagit besleme sistemi.",
    images: [
      "/urunler/folyokesim/33x40-otomatik-beslemeli-etiket-kesim-makinesi/33x40-otomatik-beslemeli-etiket-kesim-makinesi-01-2e12fba9.jpeg",
    ],
    colors: [],
    sizes: [],
    deliveryTime: "3-5 is gunu",
  },
  {
    id: "xl-1600tx",
    name: "XL-1600TX I3200 Cift Kafali Dijital Baski Makinesi",
    price: 506000,
    image:
      "/urunler/folyokesim/xl-1600tx-i3200-2-baski-kafasi-ic-mekan-dis-mekan-uv-dijital-baski-makinesi/xl-1600tx-i3200-2-baski-kafasi-ic-mekan-dis-mekan-uv-dijital-baski-makinesi-01-df1a1460.png",
    category: "Dijital Baski",
    categorySlug: "dijital-baski",
    description: "Endustriyel ic/dis mekan uygulamalari icin yuksek performansli model.",
    images: [
      "/urunler/folyokesim/xl-1600tx-i3200-2-baski-kafasi-ic-mekan-dis-mekan-uv-dijital-baski-makinesi/xl-1600tx-i3200-2-baski-kafasi-ic-mekan-dis-mekan-uv-dijital-baski-makinesi-01-df1a1460.png",
    ],
    colors: [],
    sizes: [],
    deliveryTime: "3-5 is gunu",
  },
  {
    id: "canva-fiber-markalama",
    name: "CANVA Fiber Lazer Markalama Makinesi",
    price: 303600,
    image: "/urunler/canva-fiber-markalama/f.m1.png",
    category: "Fiber Markalama",
    categorySlug: "fiber-markalama",
    description: "Metal yuzeylerde kalici ve yuksek hizli lazer markalama icin endustriyel cozum.",
    images: [
      "/urunler/canva-fiber-markalama/MARKALAMA-MOCK-UP-YAN-WEB.gif",
      "/urunler/canva-fiber-markalama/f.m1.png",
      "/urunler/canva-fiber-markalama/f.b4.png",
      "/urunler/canva-fiber-markalama/f.b5.png",
      "/urunler/canva-fiber-markalama/f.b8.png",
      "/urunler/canva-fiber-markalama/f.png",
      "/urunler/canva-fiber-markalama/8e928de1-7955-44e8-a382-531884c8a2c4.jpg",
      "/urunler/canva-fiber-markalama/ab7cb341-4e1d-4bee-b440-a9a20f61f3aa.jpg",
      "/urunler/canva-fiber-markalama/d0a2d28f-1a29-4332-89b9-e07660ad2eed.jpg",
    ],
    colors: [],
    sizes: [],
    deliveryTime: "3-5 is gunu",
  },
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

/** Verilen kategori slug'ina gore statik urunleri filtreler. */
export function getProductsByCategory(categorySlug: string): Product[] {
  if (categorySlug === "en-cok-satanlar") {
    // En çok satanlar için özel ürünler (şimdilik en popüler olanları seçiyoruz)
    return products.filter((product) => 
      ["sevgili-silüet-lamba", "kalp-fotograf-lamba", "isim-yazili-lamba", "dogum-gunu-lamba"].includes(product.id)
    )
  }
  return products.filter((product) => product.categorySlug === categorySlug)
}

/** Verilen urun id'sine gore statik urunu bulur. */
export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}

/** Verilen slug'a gore kategori bilgisini bulur. */
export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug)
}
