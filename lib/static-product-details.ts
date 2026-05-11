import type { FrontendProduct } from "@/lib/product-transformer"
import type { Category as StoreCategory } from "@/services/categories"
import type { Category, Gallery, Image, ProductDetail, Stock } from "@/services/products"
import { usdToTry } from "@/lib/exchange-rate"
import { PRICE_EX_VAT_LABEL } from "@/lib/vat"

/**
 * Statik ürün kaynakları: `tryPrice` varsa sabit TL, yoksa `usdPrice` USD’den TL’ye çevrilir.
 * Elde edilen TL tutarları KDV hariç kabul edilir.
 * Ürünler grid/detayda fiyat yanında `{@link PRICE_EX_VAT_LABEL}` gösterilir.
 */
export { PRICE_EX_VAT_LABEL as STATIC_DETAIL_PRICE_VAT_LABEL }

type StaticProductDetailSeed = {
  id: string
  slug: string
  name: string
  subtitle: string
  description: string
  usdPrice: number
  tryPrice?: number
  category: { name: string; slug: string }
  imagePaths: string[]
}

/** Statik görsel nesnesi üretir (ProductDetail.gallery için). */
function makeImage(id: string, s3Url: string, displayName: string): Image {
  return {
    id,
    s3Url,
    displayName,
    filename: displayName,
  }
}

/** Statik gallery üretir: main + thumbnail + detay görselleri. */
function makeGallery(imagePaths: string[]): Gallery {
  const [main, thumb, ...rest] = imagePaths
  return {
    mainImage: main ? makeImage(`img-main-${main}`, main, "main") : null,
    thumbnailImage: thumb ? makeImage(`img-thumb-${thumb}`, thumb, "thumbnail") : null,
    detailImages: rest.map((p, i) => makeImage(`img-detail-${i}-${p}`, p, `detail-${i + 1}`)),
  }
}

/** API gelene kadar kullanılacak statik stok bilgisi üretir. */
function makeStock(usableQuantity = 1): Stock {
  return {
    availableQuantity: usableQuantity,
    reservedQuantity: 0,
    usableQuantity,
  }
}

/** API gelene kadar kullanılacak statik kategori alanını üretir. */
function makeCategories(seed: StaticProductDetailSeed): Category[] {
  return [
    {
      id: `static-cat-${seed.category.slug}`,
      name: seed.category.name,
      slug: seed.category.slug,
      description: undefined,
    },
  ]
}

/**
 * Statik seed'den ProductDetail (SIMPLE) üretir.
 * Not: Varyasyon/personalization şimdilik kapalı; amaç sadece detay sayfasını göstermek.
 * `basePrice` / `price` TL cinsinden KDV hariçtir.
 */
function toSimpleProductDetail(seed: StaticProductDetailSeed, usdTryRate: number): ProductDetail {
  const tlPrice = seed.tryPrice ?? usdToTry(seed.usdPrice, usdTryRate)
  const now = new Date().toISOString()
  return {
    productId: seed.id,
    name: seed.name,
    subtitle: seed.subtitle,
    slug: seed.slug,
    description: seed.description,
    basePrice: tlPrice,
    discountedPrice: null,
    type: "SIMPLE",
    price: tlPrice,
    sku: `STATIC-${seed.id}`,
    stock: makeStock(1),
    gallery: makeGallery(seed.imagePaths),
    categories: makeCategories(seed),
    tags: [],
    variantOptions: null,
    variantCombinations: null,
    selectedCombination: null,
    seoTitle: seed.name,
    seoDescription: seed.description,
    seoKeywords: [],
    personalizationForm: null,
    createdAt: now,
    updatedAt: now,
  }
}

/**
 * Ürün detayları (API gelene kadar).
 * Veritabanına aktarmak için: shawk-ecommerce-backend içinde `npm run seed:store-static`
 * — veri kaynağı `scripts/seed-store-static-catalog-data.mjs` ile senkron tutulmalıdır.
 */
const STATIC_DETAIL_SEEDS: StaticProductDetailSeed[] = [
  {
    id: "eco-solvent-dijital",
    slug: "eco-solvent-dijital-baski-makinesi",
    name: "Epson i3200 Baskı Kafalı Eco Solvent Dijital Baskı Makinesi",
    subtitle: "Vinil, branda ve iç/dış mekan uygulamaları için endüstriyel çözüm",
    description:
      `Vinil, branda, mesh ve afiş baskılarında yüksek çözünürlük sunan i3200 kafalı eco solvent dijital baskı çözümü.

- Araç kaplama, tabela ve geniş format reklam işleri için uygun
- İç ve dış mekanda solmaya dayanıklı eco solvent mürekkep uyumu
- Kırışıklık önleyici sürme sistemi
- Otomatik senkron toplama ile sürekli rulo baskı
- Düşük VOC’lu eco solvent mürekkeplerle çalışmaya uygun yapı`,
    usdPrice: 11500,
    category: { name: "Dijital Baskı", slug: "dijital-baski" },
    imagePaths: [
      "/urunler/folyokesim/epson-i3200-baski-kafali-sublimasyon-dijital-baski-makinesi/epson-i3200-baski-kafali-sublimasyon-dijital-baski-makinesi-01-67ff2857.png",
      "/urunler/folyokesim/epson-i3200-baski-kafali-sublimasyon-dijital-baski-makinesi/epson-i3200-baski-kafali-sublimasyon-dijital-baski-makinesi-02-7007b9a0.png",
      "/urunler/folyokesim/epson-i3200-baski-kafali-sublimasyon-dijital-baski-makinesi/epson-i3200-baski-kafali-sublimasyon-dijital-baski-makinesi-03-df521957.png",
    ],
  },
  {
    id: "plotter-175-ppf-step",
    slug: "175-cm-ppf-folyo-kesim-makinesi-plotter-step-motor",
    name: "175 CM PPF/FOLYO KESİM MAKİNESİ PLOTTER (Step Motor)",
    subtitle: "175 cm net kesim alanı, optik kameralı — açık döngü step sürücü",
    description:
      `PPF, folyo ve etiket işlerinde uygun maliyetli profesyonel kesim için step motorlu plotter.

- Step motor: açık döngü sürüş; yüksek hızlarda tork düşüşü ve ağır malzemede adım kaçırma riski servoya göre daha yüksektir
- Küçük puntolu detay ve çok ince çizgilerde servo modellere kıyasla sınır daha belirgindir; geniş grafik ve günlük folyo işleri için yeterli performans
- 175 cm sınıfı net kesim alanı (ürün kullanımında 150 cm bandı vurgusu)
- Kamera destekli optik okuma (Bas-Kes)
- 800 mm/sn kesim hızı ve 20–1000 gr baskı kuvveti ayarı
- Corel Draw entegrasyonu ve Sign Master yazılım desteği`,
    usdPrice: 2750,
    category: { name: "Plotter Folyo Kesici", slug: "plotter-folyo-kesici" },
    imagePaths: [
      "/urunler/folyokesim/175-cm-ppf-folyo-kesim-makinesi-plotter/175-cm-ppf-folyo-kesim-makinesi-plotter-01-48d0a713.png",
    ],
  },
  {
    id: "plotter-175-ppf-servo",
    slug: "175-cm-ppf-folyo-kesim-makinesi-plotter-servo-motor",
    name: "175 CM PPF/FOLYO KESİM MAKİNESİ PLOTTER (Servo Motor)",
    subtitle: "175 cm net kesim alanı, optik kameralı — kapalı döngü servo sürücü",
    description:
      `Yoğun PPF, ince detaylı folyo ve profesyonel atölye üretimi için servo motorlu plotter.

- Servo motor: enkoder ile kapalı döngü konum geri beslemesi; hedeflenen yol ile gerçek konum sürekli düzeltilir, “adım kaçırma” servo sistemde tipik değildir
- Yüksek hızda daha tutarlı tork ve genelde daha sessiz, daha akıcı hareket; küçük font ve karmaşık konturlarda daha net kesim
- İzleme (tracking) ve uzun baskılarda servo sürücüler genellikle step motorlu makinelere göre daha stabil kabul edilir
- 175 cm sınıfı net kesim alanı (ürün kullanımında 150 cm bandı vurgusu)
- Kamera destekli optik okuma (Bas-Kes)
- 800 mm/sn kesim hızı ve 20–1000 gr baskı kuvveti ayarı
- Corel Draw entegrasyonu ve Sign Master yazılım desteği`,
    usdPrice: 3300,
    category: { name: "Plotter Folyo Kesici", slug: "plotter-folyo-kesici" },
    imagePaths: [
      "/urunler/folyokesim/175-cm-ppf-folyo-kesim-makinesi-plotter/175-cm-ppf-folyo-kesim-makinesi-plotter-01-48d0a713.png",
    ],
  },
  {
    id: "etiket-kesim-33x40",
    slug: "33x40-otomatik-beslemeli-etiket-kesim-makinesi-2",
    name: "33X40 OTOMATIK BESLEMELİ ETİKET KESİM MAKİNESİ",
    subtitle: "Otomatik kontur konumlandırma ve besleme",
    description:
      `Etiket kesim süreçleri için otomatik beslemeli ve kontur odaklı yüksek hassasiyetli model.

- Entegre taşıyıcı kafa yapısı
- Dokunmatik ekran ile kolay kullanım
- Özel sabit kağıt besleme sistemi
- Otomatik kontur konumlandırma ve kağıt algılama
- Yüksek hassasiyetli kontur kesimi`,
    usdPrice: 2200,
    category: { name: "Etiket Kesim", slug: "etiket-kesim" },
    imagePaths: [
      "/urunler/folyokesim/33x40-otomatik-beslemeli-etiket-kesim-makinesi/33x40-otomatik-beslemeli-etiket-kesim-makinesi-01-2e12fba9.jpeg",
      "/urunler/folyokesim/33x40-otomatik-beslemeli-etiket-kesim-makinesi/33x40-otomatik-beslemeli-etiket-kesim-makinesi-02-65c9ad00.png",
    ],
  },
  {
    id: "etiket-kesim-33x40-beyaz",
    slug: "33x40-otomatik-beslemeli-etiket-kesim-makinesi-beyaz",
    name: "33X40 OTOMATIK BESLEMELİ ETİKET KESİM MAKİNESİ (Beyaz)",
    subtitle: "Otomatik kontur konumlandırma ve besleme",
    description:
      `33x40 otomatik beslemeli etiket kesim makinesinin beyaz kasa varyantı.

- Entegre taşıyıcı kafa
- Dokunmatik ekran
- Otomatik kontur konumlandırma
- Otomatik kağıt algılama
- Yüksek hassasiyetli kontur kesimi`,
    usdPrice: 2200,
    category: { name: "Etiket Kesim", slug: "etiket-kesim" },
    imagePaths: [
      "/urunler/folyokesim/33x40-otomatik-beslemeli-etiket-kesim-makinesi/33x40-otomatik-beslemeli-etiket-kesim-makinesi-01-62e9c175.jpeg",
    ],
  },
  {
    id: "plotter-135-prof",
    slug: "folyo-kesim-makinesi-plotter-optik-kamera-135cm-net-kesim-alani-profesyonel",
    name: "Folyo Kesim Makinesi Plotter - Kamera 135cm",
    subtitle: "Profesyonel kullanım için optik kameralı",
    description:
      `Dijital baskı kesimi, folyo etiket kesimi ve transfer işler için profesyonel optik kameralı model.

- Step/servo motor
- 124 cm net kesim alanı
- 6 tekerlekli pinç roller sistemi
- 10 metreye kadar düzgün medya takibi
- 800 mm/sn kesim hızı, 20-1000 gr basınç`,
    usdPrice: 1350,
    category: { name: "Plotter Folyo Kesici", slug: "plotter-folyo-kesici" },
    imagePaths: [
      "/urunler/folyokesim/folyo-kesim-makinesi-plotter-kamera-135cm-net-kesim-alani-profesyonel/folyo-kesim-makinesi-plotter-kamera-135cm-net-kesim-alani-profesyonel-02-55885071.png",
      "/urunler/folyokesim/folyo-kesim-makinesi-plotter-kamera-135cm-net-kesim-alani-profesyonel/folyo-kesim-makinesi-plotter-kamera-135cm-net-kesim-alani-profesyonel-01-26f9bad3.png",
      "/urunler/folyokesim/folyo-kesim-makinesi-plotter-kamera-135cm-net-kesim-alani-profesyonel/folyo-kesim-makinesi-plotter-kamera-135cm-net-kesim-alani-profesyonel-03-f64a9eee.png",
    ],
  },
  {
    id: "plotter-folyo-kesici",
    slug: "plotter-folyo-kesici",
    name: "PLOTTER FOLYO KESİM MAKİNESİ",
    subtitle: "Endüstriyel ve performans odaklı",
    description:
      `Folyo, etiket ve tekstil transfer kesimlerinde kullanılan profesyonel kesici plotter.

- Step motor
- 122 cm net kesim alanı
- ARM camera optik kesim (Bas-Kes)
- 800 mm/sn kesim hızı
- Corel Draw direkt kesim ve Sign Master lisanslı yazılım`,
    usdPrice: 1350,
    category: { name: "Plotter Folyo Kesici", slug: "plotter-folyo-kesici" },
    imagePaths: [
      "/urunler/folyokesim/plotter-folyo-kesim-makinesi/plotter-folyo-kesim-makinesi-01-49f93bc5.jpg",
    ],
  },
  {
    id: "plotter-60cm",
    slug: "plotter-folyo-kesici-60-cm-net-kesim-alani",
    name: "PLOTTER FOLYO KESİM MAKİNESİ 60 cm net kesim alanı",
    subtitle: "Kompakt 60 cm net kesim alanı",
    description:
      `Kompakt iş akışları için 60 cm net kesim alanına sahip plotter kesici.

- 4 teker sistemi ile kaydırmaz pinç roller
- ARM camera optik kesim
- 10 m medya takip
- 800 mm/sn kesim hızı
- Türkçe menü, dayanıklı dokunmatik panel`,
    usdPrice: 1300,
    category: { name: "Plotter Folyo Kesici", slug: "plotter-folyo-kesici" },
    imagePaths: [
      "/urunler/folyokesim/plotter-folyo-kesim-makinesi-60-cm-net-kesim-alani/plotter-folyo-kesim-makinesi-60-cm-net-kesim-alani-01-2160898a.jpg",
    ],
  },
  {
    id: "plotter-135-a1",
    slug: "plotter-folyo-kesim-makinesi-a1",
    name: "Plotter Folyo Kesim Makinesi Kameralı – 135Cm",
    subtitle: "A1 sınıf optik kameralı folyo kesim",
    description:
      `A1 sınıfında, yoğun folyo ve etiket işlerinde hassas kesim için optik kameralı model.

- Step/servo motor teknolojisi
- 124 cm net kesim alanı
- Bas-Kes optik okuma
- 800 mm/sn kesim hızı
- Reklam tabela, araç kaplama ve sticker uygulamalarına uygun`,
    usdPrice: 1350,
    category: { name: "Plotter Folyo Kesici", slug: "plotter-folyo-kesici" },
    imagePaths: [
      "/urunler/folyokesim/plotter-folyo-kesim-makinesi-kamerali-135cm-net-kesim-alani/plotter-folyo-kesim-makinesi-kamerali-135cm-net-kesim-alani-02-0ea18486.png",
      "/urunler/folyokesim/plotter-folyo-kesim-makinesi-kamerali-135cm-net-kesim-alani/plotter-folyo-kesim-makinesi-kamerali-135cm-net-kesim-alani-01-0926d2c4.png",
      "/urunler/folyokesim/plotter-folyo-kesim-makinesi-kamerali-135cm-net-kesim-alani/plotter-folyo-kesim-makinesi-kamerali-135cm-net-kesim-alani-03-14a26bf1.png",
    ],
  },
  {
    id: "plotter-125cm-optic",
    slug: "folyo-kesim-makinasi-125cm-optic",
    name: "125 CM Optik Folyo Kesim Makinesi Plotter",
    subtitle: "Optik gözlü, servo motorlu ve CorelDraw uyumlu profesyonel kesim plotteri",
    description:
      `Folyo, sticker, etiket ve tekstil transfer kesimlerinde hassas kontur kesimi için 125 cm sınıfı optik plotter çözümü.

- 125 cm kesim genişliği ile reklam, tabela ve araç kaplama işlerine uygun
- Optik göz sistemiyle bas-kes ve kontur konumlandırma desteği
- Servo motor yapısı sayesinde daha stabil hareket ve daha net kesim
- CorelDraw üzerinden doğrudan kesim iş akışına uygun kullanım
- Özel papuç sistemi ile folyo ve transfer medyasında kaymayı azaltan tutuş
- USB, flash bellek ve Bluetooth üzerinden kesim senaryolarına uygun yapı
- Android ve iOS cihazlardan doğrudan kesim destekleyen LX8 sınıfı kullanım`,
    usdPrice: 0,
    tryPrice: 80000,
    category: { name: "Plotter Folyo Kesici", slug: "plotter-folyo-kesici" },
    imagePaths: [
      "/urunler/folyo-kesim-makinası-125cm-optic.jpeg",
    ],
  },
  {
    id: "plotter-160-ppf",
    slug: "plotter-folyo-kesim-makinesi-optik-kamerali-160cm-net-kesim-alani",
    name: "Plotter PPF Folyo Kesim Makinesi Kameralı – 160Cm",
    subtitle: "160 cm net kesim alanı",
    description:
      `PPF ve folyo uygulamalarında geniş en için 160 cm sınıfı net kesim alanı sunan optik kameralı model.

- Step/servo motor teknolojisi
- Kamera destekli optik okuma
- 10 metreye kadar malzeme takibi
- 800 mm/sn kesim hızı
- Yüksek adetli reklam ve kaplama işlerine uygun`,
    usdPrice: 2500,
    category: { name: "Plotter Folyo Kesici", slug: "plotter-folyo-kesici" },
    imagePaths: [
      "/urunler/folyokesim/plotter-ppf-folyo-kesim-makinesi-kamerali-160cm-net-kesim-alani/plotter-ppf-folyo-kesim-makinesi-kamerali-160cm-net-kesim-alani-02-0ea18486.png",
      "/urunler/folyokesim/plotter-ppf-folyo-kesim-makinesi-kamerali-160cm-net-kesim-alani/plotter-ppf-folyo-kesim-makinesi-kamerali-160cm-net-kesim-alani-01-0926d2c4.png",
      "/urunler/folyokesim/plotter-ppf-folyo-kesim-makinesi-kamerali-160cm-net-kesim-alani/plotter-ppf-folyo-kesim-makinesi-kamerali-160cm-net-kesim-alani-03-14a26bf1.png",
    ],
  },
  {
    id: "my-color-180cm",
    slug: "dijital-baski-makinesi-my-color",
    name: "Dijital Baskı Makinesi – 180 cm Genişlik, Yüksek Hız",
    subtitle: "My Color 180 cm, I3200 destekli",
    description:
      `My Color serisi 180 cm dijital baskı makinesi, i3200 set desteğiyle hız ve kaliteyi bir araya getirir.

- 180 cm net baskı alanı
- 7-10 m²/saat baskı hızı
- Otomatik kafa temizleme/koruma
- Çift yönlü sarma motoru
- Isıtmalı kurutma sistemi (10-50 C)`,
    usdPrice: 6000,
    category: { name: "Dijital Baskı", slug: "dijital-baski" },
    imagePaths: [
      "/urunler/folyokesim/dijital-baski-makinesi-180-cm-genislik-yuksek-hiz-endustriyel-kalite/dijital-baski-makinesi-180-cm-genislik-yuksek-hiz-endustriyel-kalite-01-756efd81.png",
      "/urunler/folyokesim/dijital-baski-makinesi-180-cm-genislik-yuksek-hiz-endustriyel-kalite/dijital-baski-makinesi-180-cm-genislik-yuksek-hiz-endustriyel-kalite-02-aafc3f2b.jpg",
      "/urunler/folyokesim/dijital-baski-makinesi-180-cm-genislik-yuksek-hiz-endustriyel-kalite/dijital-baski-makinesi-180-cm-genislik-yuksek-hiz-endustriyel-kalite-04-c54c90e7.jpg",
      "/urunler/folyokesim/dijital-baski-makinesi-180-cm-genislik-yuksek-hiz-endustriyel-kalite/dijital-baski-makinesi-180-cm-genislik-yuksek-hiz-endustriyel-kalite-03-9321c166.jpg",

    ],
  },
  {
    id: "canva-fiber-markalama",
    slug: "canva-fiber-lazer-markalama-makinesi",
    name: "CANVA Fiber Lazer Markalama Makinesi",
    subtitle: "Metal ve endustriyel parcalar icin yuksek hizli kalici markalama",
    description:
      `CANVA Fiber Lazer Markalama Makinesi, metal ve teknik malzemelerde net, kontrastli ve kalici markalama icin tasarlanmistir.

- Paslanmaz celik, alüminyum, pirinc, bakir ve kaplamali yuzeylerde hassas markalama
- QR/Datamatrix, seri numarasi, logo ve barkod uygulamalarinda yuksek okunabilirlik
- Dusuk tuketim ve bakim ihtiyaci ile 7/24 endustriyel uretime uygun yapi
- Yuzeye temas etmeden isleme yaptigi icin parca deformasyonu ve asinmayi azaltir
- Otomotiv, elektronik, medikal cihaz, savunma ve promosyon urunlerinde yaygin kullanim`,
    usdPrice: 6900,
    category: { name: "Fiber Markalama", slug: "fiber-markalama" },
    imagePaths: [
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
  },
]

/** Statik ürün seed'lerinden ürünler sayfası filtrelerinde kullanılacak kategori listesini üretir. */
export function getStaticProductCategories(): StoreCategory[] {
  const uniqueCategories = Array.from(
    new Map(STATIC_DETAIL_SEEDS.map((seed) => [seed.category.slug, seed.category])).values(),
  )

  return uniqueCategories.map((category, index) => ({
    id: `static-${category.slug}`,
    name: category.name,
    slug: category.slug,
    description: undefined,
    parentId: null,
    parent: null,
    children: [],
    image: null,
    isActive: true,
    displayOrder: index,
    createdAt: "",
    updatedAt: "",
  }))
}

/** Statik ürün detaylarını id/slug üzerinden hızlı lookup için indexler. */
function buildStaticDetailIndex(usdTryRate: number): Record<string, ProductDetail> {
  const index: Record<string, ProductDetail> = {}
  for (const seed of STATIC_DETAIL_SEEDS) {
    const detail = toSimpleProductDetail(seed, usdTryRate)
    index[seed.id] = detail
    index[seed.slug] = detail
  }
  // Eco solvent ürünü eski süblimasyon id/slug ile sepet ve yer imi uyumluluğu
  const ecoSolvent = index["eco-solvent-dijital"]
  if (ecoSolvent) {
    index["sublimasyon-dijital"] = ecoSolvent
    index["sublimasyon-dijital-baski-makinesi"] = ecoSolvent
  }
  // 175 cm plotter tek üründen ikiye ayrıldı; eski id/slug Step varyantına yönlendirilir
  const plotter175Step = index["plotter-175-ppf-step"]
  if (plotter175Step) {
    index["plotter-175-ppf"] = plotter175Step
    index["175-cm-ppf-folyo-kesim-makinesi-plotter"] = plotter175Step
  }
  return index
}

/**
 * Statik ürünleri FrontendProduct listesine çevirir (`/urunler` API yokken).
 * Fiyatlar KDV hariç TL; ProductCard üzerinde + KDV etiketi gösterilir.
 */
export function getStaticFrontendProducts(usdTryRate: number): FrontendProduct[] {
  const stock = { availableQuantity: 1, reservedQuantity: 0, usableQuantity: 1 }
  return STATIC_DETAIL_SEEDS.map((seed) => {
    const priceInTry = seed.tryPrice ?? usdToTry(seed.usdPrice, usdTryRate)
    return {
      id: seed.id,
      productId: seed.id,
      name: seed.name,
      subtitle: seed.subtitle,
      price: priceInTry,
      basePrice: priceInTry,
      discountedPrice: null,
      image: seed.imagePaths[0] || "/placeholders/placeholder.svg",
      category: seed.category.name,
      slug: seed.slug,
      stock,
      variantValues: [],
    }
  })
}

/**
 * API listesi ile statik katalog kapak görselini hizalar: slug eşleşirse `imagePaths[0]` döner.
 */
export function getStaticCatalogCoverImageBySlug(slug: string): string | null {
  const key = (slug || "").trim()
  if (!key) return null
  const seed = STATIC_DETAIL_SEEDS.find((s) => s.slug === key)
  return seed?.imagePaths[0] ?? null
}

/**
 * API ürününün galerisini statik katalogdaki `imagePaths` sırasına çeker; ana görsel, ürünler sayfasındaki kapak ile aynı olur.
 */
export function alignApiProductGalleryWithStaticCatalog(
  product: ProductDetail,
  usdTryRate: number,
): ProductDetail {
  const staticDetail =
    getStaticProductDetailBySlugOrId(product.slug, usdTryRate) ??
    getStaticProductDetailBySlugOrId(product.productId, usdTryRate)
  if (!staticDetail) return product
  return {
    ...product,
    gallery: staticDetail.gallery,
  }
}

/**
 * Slug veya productId ile statik ürün detayını döndürür.
 * Bulunamazsa null döner (caller notFound veya başka fallback yapabilir).
 */
export function getStaticProductDetailBySlugOrId(slugOrId: string, usdTryRate = 39): ProductDetail | null {
  const key = (slugOrId || "").trim()
  if (!key) return null
  const index = buildStaticDetailIndex(usdTryRate)
  return index[key] ?? null
}

