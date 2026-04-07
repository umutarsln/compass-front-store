import { PRICE_EX_VAT_LABEL } from "@/lib/vat"

/**
 * Statik katalog (`products`) fiyatlarının yanında gösterilecek metin; `price` KDV hariçtir.
 */
export const STATIC_PRODUCT_PRICE_VAT_LABEL = PRICE_EX_VAT_LABEL

/**
 * `lib/products` statik ürün satırı. Fiyat alanı KDV hariç TL; arayüzde {@link STATIC_PRODUCT_PRICE_VAT_LABEL} ile belirtilir.
 */
export interface Product {
  id: string
  name: string
  /** KDV hariç liste fiyatı (gösterimde + KDV). */
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

/**
 * Statik makine kataloğu (ör. all-products / yedek listeler).
 * Tüm `price` değerleri KDV hariç TL; arayüzde {@link STATIC_PRODUCT_PRICE_VAT_LABEL} ile işaretlenir.
 */
export const products: Product[] = [
  {
    id: "eco-solvent-dijital",
    name: "Epson i3200 Eco Solvent Dijital Baski Makinesi",
    price: 506000,
    image:
      "/urunler/folyokesim/epson-i3200-baski-kafali-sublimasyon-dijital-baski-makinesi/epson-i3200-baski-kafali-sublimasyon-dijital-baski-makinesi-01-67ff2857.png",
    category: "Dijital Baski",
    categorySlug: "dijital-baski",
    description:
      "Vinil, branda ve genis format reklam icin i3200 kafali eco solvent dijital baski cozumu.",
    images: [
      "/urunler/folyokesim/epson-i3200-baski-kafali-sublimasyon-dijital-baski-makinesi/epson-i3200-baski-kafali-sublimasyon-dijital-baski-makinesi-01-67ff2857.png",
    ],
    colors: [],
    sizes: [],
    deliveryTime: "3-5 is gunu",
  },
  {
    id: "plotter-175-ppf-step",
    name: "175 CM PPF/FOLYO KESIM MAKINESI (Step Motor)",
    price: 121000,
    image: "/urunler/folyokesim/175-cm-ppf-folyo-kesim-makinesi-plotter/175-cm-ppf-folyo-kesim-makinesi-plotter-01-48d0a713.png",
    category: "Plotter Folyo Kesici",
    categorySlug: "plotter-folyo-kesici",
    description:
      "Step motorlu, optik kamerali genis format PPF ve folyo plotter; ekonomik seri uretim ve gunluk kesim icin.",
    images: [
      "/urunler/folyokesim/175-cm-ppf-folyo-kesim-makinesi-plotter/175-cm-ppf-folyo-kesim-makinesi-plotter-01-48d0a713.png",
    ],
    colors: [],
    sizes: [],
    deliveryTime: "3-5 is gunu",
  },
  {
    id: "plotter-175-ppf-servo",
    name: "175 CM PPF/FOLYO KESIM MAKINESI (Servo Motor)",
    price: 145000,
    image: "/urunler/folyokesim/175-cm-ppf-folyo-kesim-makinesi-plotter/175-cm-ppf-folyo-kesim-makinesi-plotter-01-48d0a713.png",
    category: "Plotter Folyo Kesici",
    categorySlug: "plotter-folyo-kesici",
    description:
      "Servo motorlu, kapali dongu surus; yuksek hizda hassasiyet, PPF ve ince detay icin profesyonel plotter.",
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

/**
 * Verilen urun id'sine gore statik urunu bulur.
 * `sublimasyon-dijital` eski kimligi `eco-solvent-dijital` ile eslestirilir.
 * `plotter-175-ppf` eski kimligi `plotter-175-ppf-step` ile eslestirilir.
 */
export function getProductById(id: string): Product | undefined {
  let resolvedId = id
  if (id === "sublimasyon-dijital") resolvedId = "eco-solvent-dijital"
  if (id === "plotter-175-ppf") resolvedId = "plotter-175-ppf-step"
  return products.find((product) => product.id === resolvedId)
}

/** Verilen slug'a gore kategori bilgisini bulur. */
export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug)
}
