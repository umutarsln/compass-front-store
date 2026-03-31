import type { FrontendProduct } from "@/lib/product-transformer"
import type { Category, Gallery, Image, ProductDetail, Stock } from "@/services/products"
import { usdToTry } from "@/lib/exchange-rate"

type StaticProductDetailSeed = {
  id: string
  slug: string
  name: string
  subtitle: string
  description: string
  usdPrice: number
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
 */
function toSimpleProductDetail(seed: StaticProductDetailSeed, usdTryRate: number): ProductDetail {
  const tlPrice = usdToTry(seed.usdPrice, usdTryRate)
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

/** Ürün detayları (API gelene kadar). */
const STATIC_DETAIL_SEEDS: StaticProductDetailSeed[] = [
  {
    id: "uv-flatbed-pro",
    slug: "compass-uv-9060-uv-baski-makinesi",
    name: "COMPASS UV 9060 UV BASKI MAKİNESİ",
    subtitle: "60x90 cm endüstriyel UV baskı çözümü",
    description:
      `AUDLEY UV9060 platformunda 60x90 cm baskı alanı sunan endüstriyel UV baskı makinesi.

- TX800 / i3200 kafa konfigürasyonları
- Metal, ahşap, deri, akrilik, cam ve seramik üzerine baskı
- Görsel konumlama destekli tam otomatik çalışma
- Endüstriyel kullanım odaklı gövde ve üretim kararlılığı`,
    usdPrice: 11500,
    category: { name: "UV Baskı", slug: "uv-baski" },
    imagePaths: [
      "/urunler/folyokesim/compass-uv-9060-uv-baski-makinesi/compass-uv-9060-uv-baski-makinesi-01-877b4d3e.jpeg",
    ],
  },
  {
    id: "roll-to-roll-eco",
    slug: "compass-uv-baski-makinesi",
    name: "COMPASS UV BASKI MAKİNESİ",
    subtitle: "İstenilen ölçülerde üretilebilen UV baskı",
    description:
      `Firma adına yerli üretim yaklaşımıyla konumlandırılan UV baskı makinesi.

- 60x90 cm baskı alanı
- İstenilen ölçülerde üretim/konfigürasyon seçeneği
- Çoklu yüzeyde baskı (metal, ahşap, deri, akrilik, cam, seramik)
- Tam otomatik, endüstriyel çalışma modeli`,
    usdPrice: 12000,
    category: { name: "UV Baskı", slug: "uv-baski" },
    imagePaths: [
      "/urunler/folyokesim/compass-uv-baski-makinesi/compass-uv-baski-makinesi-01-2ec39392.png",
    ],
  },
  {
    id: "sublimasyon-dijital",
    slug: "sublimasyon-dijital-baski-makinesi",
    name: "Epson i3200 Baskı Kafalı Süblimasyon Dijital Baskı Makinesi",
    subtitle: "Kumaş, bayrak ve afiş için endüstriyel çözüm",
    description:
      `Kumaş, bayrak ve afiş üretimlerinde yüksek kalite için i3200 kafalı süblimasyon dijital baskı çözümü.

- Çift taraflı bayrak ve farklı kumaş tipleriyle uyum
- Kırışıklık önleyici sürme sistemi
- Otomatik senkron toplama ile sürekli baskı
- Solmaya dayanıklı süblimasyon mürekkep uyumu`,
    usdPrice: 11500,
    category: { name: "Dijital Baskı", slug: "dijital-baski" },
    imagePaths: [
      "/urunler/folyokesim/epson-i3200-baski-kafali-sublimasyon-dijital-baski-makinesi/epson-i3200-baski-kafali-sublimasyon-dijital-baski-makinesi-01-67ff2857.png",
      "/urunler/folyokesim/epson-i3200-baski-kafali-sublimasyon-dijital-baski-makinesi/epson-i3200-baski-kafali-sublimasyon-dijital-baski-makinesi-02-7007b9a0.png",
      "/urunler/folyokesim/epson-i3200-baski-kafali-sublimasyon-dijital-baski-makinesi/epson-i3200-baski-kafali-sublimasyon-dijital-baski-makinesi-03-df521957.png",
    ],
  },
  {
    id: "plotter-175-ppf",
    slug: "175-cm-ppf-folyo-kesim-makinesi-plotter",
    name: "175 CM PPF/FOLYO KESİM MAKİNESİ PLOTTER",
    subtitle: "175 cm net kesim alanı, optik kameralı",
    description:
      `Yoğun PPF, folyo ve etiket uygulamaları için profesyonel kesici plotter.

- Step/servo motor teknolojisi
- Geniş net kesim alanı (ürün sayfasında 150 cm sınıfı kullanım vurgusu)
- Kamera destekli optik okuma (Bas-Kes)
- 800 mm/sn kesim hızı ve 20-1000 gr baskı ayarı
- Corel Draw entegrasyonu ve Sign Master yazılım desteği`,
    usdPrice: 2750,
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
      "/urunler/folyokesim/folyo-kesim-makinesi-plotter-kamera-135cm-net-kesim-alani-profesyonel/folyo-kesim-makinesi-plotter-kamera-135cm-net-kesim-alani-profesyonel-01-26f9bad3.png",
      "/urunler/folyokesim/folyo-kesim-makinesi-plotter-kamera-135cm-net-kesim-alani-profesyonel/folyo-kesim-makinesi-plotter-kamera-135cm-net-kesim-alani-profesyonel-02-55885071.png",
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
      "/urunler/folyokesim/plotter-folyo-kesim-makinesi-kamerali-135cm-net-kesim-alani/plotter-folyo-kesim-makinesi-kamerali-135cm-net-kesim-alani-01-0926d2c4.png",
      "/urunler/folyokesim/plotter-folyo-kesim-makinesi-kamerali-135cm-net-kesim-alani/plotter-folyo-kesim-makinesi-kamerali-135cm-net-kesim-alani-02-0ea18486.png",
      "/urunler/folyokesim/plotter-folyo-kesim-makinesi-kamerali-135cm-net-kesim-alani/plotter-folyo-kesim-makinesi-kamerali-135cm-net-kesim-alani-03-14a26bf1.png",
    ],
  },
  {
    id: "plotter-servo",
    slug: "urun",
    name: "PLOTTER FOLYO KESİM MAKİNESİ Servo Motor (Ultra Sessiz)",
    subtitle: "Servo motorlu ultra sessiz çalışma",
    description:
      `Servo motorlu, ultra sessiz çalışma karakteri sunan profesyonel plotter folyo kesici.

- 122 cm net kesim alanı
- 6 teker sistemli pinç roller
- ARM camera optik kesim özelliği
- 800 mm/sn kesim hızı ve 20-1000 gr basınç
- Corel Draw direkt kesim`,
    usdPrice: 1350,
    category: { name: "Plotter Folyo Kesici", slug: "plotter-folyo-kesici" },
    imagePaths: [
      "/urunler/folyokesim/plotter-folyo-kesim-makinesi-servo-motor-ultra-sessiz/plotter-folyo-kesim-makinesi-servo-motor-ultra-sessiz-01-49f93bc5.jpg",
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
      "/urunler/folyokesim/plotter-ppf-folyo-kesim-makinesi-kamerali-160cm-net-kesim-alani/plotter-ppf-folyo-kesim-makinesi-kamerali-160cm-net-kesim-alani-01-0926d2c4.png",
      "/urunler/folyokesim/plotter-ppf-folyo-kesim-makinesi-kamerali-160cm-net-kesim-alani/plotter-ppf-folyo-kesim-makinesi-kamerali-160cm-net-kesim-alani-02-0ea18486.png",
      "/urunler/folyokesim/plotter-ppf-folyo-kesim-makinesi-kamerali-160cm-net-kesim-alani/plotter-ppf-folyo-kesim-makinesi-kamerali-160cm-net-kesim-alani-03-14a26bf1.png",
    ],
  },
  {
    id: "xl-1600tx",
    slug: "xl-1600tx-i3200-2-baski-kafasi-ic-mekan-dis-mekan-uv-dijital-baski-makinesi",
    name: "XL-1600TX I3200 2 BASKI KAFASI",
    subtitle: "Indoor/Outdoor/UV uyumlu dijital baskı",
    description:
      `Çift i3200 baskı kafalı, indoor/outdoor/UV işlere uygun endüstriyel dijital baskı makinesi.

- Hoson Gigabit ağ bağlantısı
- Leadshine çift servo motor
- Akıllı kurutma + harici üçlü kurutucu
- Otomatik kafa temizleme ve medya eksikliği uyarısı
- Çarpışma önleyici kafa koruma sistemi`,
    usdPrice: 11500,
    category: { name: "Dijital Baskı", slug: "dijital-baski" },
    imagePaths: [
      "/urunler/folyokesim/xl-1600tx-i3200-2-baski-kafasi-ic-mekan-dis-mekan-uv-dijital-baski-makinesi/xl-1600tx-i3200-2-baski-kafasi-ic-mekan-dis-mekan-uv-dijital-baski-makinesi-01-df1a1460.png",
      "/urunler/folyokesim/xl-1600tx-i3200-2-baski-kafasi-ic-mekan-dis-mekan-uv-dijital-baski-makinesi/xl-1600tx-i3200-2-baski-kafasi-ic-mekan-dis-mekan-uv-dijital-baski-makinesi-02-2566c51d.png",
      "/urunler/folyokesim/xl-1600tx-i3200-2-baski-kafasi-ic-mekan-dis-mekan-uv-dijital-baski-makinesi/xl-1600tx-i3200-2-baski-kafasi-ic-mekan-dis-mekan-uv-dijital-baski-makinesi-03-6b42c2eb.png",
    ],
  },
  {
    id: "xl-1680q",
    slug: "dijital-baski-makinesi-kahverengi",
    name: "XL-1680Q/1930Q/2200Q/F1080/I3200 Dijital Baskı Makinesi",
    subtitle: "Geniş baskı kapasitesi, yeni nesil platform",
    description:
      `Geniş baskı kapasitesi ve ileri seviye mekanik altyapı ile profesyonel üretim için konumlandırılan model.

- Akıllı ısıtma sistemi ve bağımsız sıcaklık kontrolü
- Çift motorlu iletim
- Hansen kart altyapısı
- Yükseltilebilir bakım istasyonu
- Tabela, araç kaplama, etiket ve transfer baskı kullanım alanları`,
    usdPrice: 11500,
    category: { name: "Dijital Baskı", slug: "dijital-baski" },
    imagePaths: [
      "/urunler/folyokesim/xl-1680q-1930q-2200q-f1080-i3200-indoor-outdoor-uv-dijital-baski-makinesi/xl-1680q-1930q-2200q-f1080-i3200-indoor-outdoor-uv-dijital-baski-makinesi-01-75e1bf56.png",
      "/urunler/folyokesim/xl-1680q-1930q-2200q-f1080-i3200-indoor-outdoor-uv-dijital-baski-makinesi/xl-1680q-1930q-2200q-f1080-i3200-indoor-outdoor-uv-dijital-baski-makinesi-02-36907c42.png",
      "/urunler/folyokesim/xl-1680q-1930q-2200q-f1080-i3200-indoor-outdoor-uv-dijital-baski-makinesi/xl-1680q-1930q-2200q-f1080-i3200-indoor-outdoor-uv-dijital-baski-makinesi-03-f313a1c5.png",
    ],
  },
  {
    id: "xl-1680s",
    slug: "xl-1680s-1850s-tek-baski-kafasi-ic-mekan-dis-mekan-uv-dijital-baski-makinesi",
    name: "XL-1680S / 1850S TEK BASKI KAFASI",
    subtitle: "VSDT teknolojili tek kafa dijital baskı",
    description:
      `VSDT değişken damla teknolojili, tek baskı kafalı dijital baskı makinesi.

- 3.5 pl - 12 pl damla aralığı
- Panelden feathering (tüylenme) ayarı
- Otomatik sönümleme besleme sistemi
- Kesinti noktası devam ettirme
- Düşük mürekkep tüketimi ve yüksek çözünürlük`,
    usdPrice: 11500,
    category: { name: "Dijital Baskı", slug: "dijital-baski" },
    imagePaths: [
      "/urunler/folyokesim/xl-1680s-1850s-tek-baski-kafasi-ic-mekan-dis-mekan-uv-dijital-baski-makinesi/xl-1680s-1850s-tek-baski-kafasi-ic-mekan-dis-mekan-uv-dijital-baski-makinesi-01-895ceb81.png",
      "/urunler/folyokesim/xl-1680s-1850s-tek-baski-kafasi-ic-mekan-dis-mekan-uv-dijital-baski-makinesi/xl-1680s-1850s-tek-baski-kafasi-ic-mekan-dis-mekan-uv-dijital-baski-makinesi-02-ddb70896.png",
      "/urunler/folyokesim/xl-1680s-1850s-tek-baski-kafasi-ic-mekan-dis-mekan-uv-dijital-baski-makinesi/xl-1680s-1850s-tek-baski-kafasi-ic-mekan-dis-mekan-uv-dijital-baski-makinesi-03-20b58fd6.png",
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

/** Statik ürün detaylarını id/slug üzerinden hızlı lookup için indexler. */
function buildStaticDetailIndex(usdTryRate: number): Record<string, ProductDetail> {
  const index: Record<string, ProductDetail> = {}
  for (const seed of STATIC_DETAIL_SEEDS) {
    const detail = toSimpleProductDetail(seed, usdTryRate)
    index[seed.id] = detail
    index[seed.slug] = detail
  }
  return index
}

/** Statik ürünleri FrontendProduct listesine çevirir (ürünler sayfası fallback'ı). */
export function getStaticFrontendProducts(usdTryRate: number): FrontendProduct[] {
  const stock = { availableQuantity: 1, reservedQuantity: 0, usableQuantity: 1 }
  return STATIC_DETAIL_SEEDS.map((seed) => {
    const priceInTry = usdToTry(seed.usdPrice, usdTryRate)
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
 * Slug veya productId ile statik ürün detayını döndürür.
 * Bulunamazsa null döner (caller notFound veya başka fallback yapabilir).
 */
export function getStaticProductDetailBySlugOrId(slugOrId: string, usdTryRate = 39): ProductDetail | null {
  const key = (slugOrId || "").trim()
  if (!key) return null
  const index = buildStaticDetailIndex(usdTryRate)
  return index[key] ?? null
}

