import { getProducts, type ProductListItem } from "@/services/products"
import { getStaticCatalogCoverImageBySlug, getStaticFrontendProducts } from "@/lib/static-product-details"
import { getUsdTryRate } from "@/lib/exchange-rate"
import { addVat } from "@/lib/vat"

/** Google Merchant feed kanal bilgileri */
const FEED_CHANNEL = {
  title: "Compass Reklam",
  description:
    "Endüstriyel baskı teknolojilerinde Türkiye'nin lider çözüm ortağı. UV baskı, DTF, lazer kesim ve plotter makineleri.",
  brand: "Compass Reklam",
} as const

/** Kategori slug → Google ürün taksonomisi eşlemesi */
const GOOGLE_CATEGORY_BY_SLUG: Record<string, string> = {
  "dijital-baski":
    "Business & Industrial > Printing & Graphic Arts > Commercial Printing Equipment > Digital Printers",
  "plotter-folyo-kesici":
    "Business & Industrial > Printing & Graphic Arts > Commercial Printing Equipment > Plotters",
  "uv-baski":
    "Business & Industrial > Printing & Graphic Arts > Commercial Printing Equipment > Digital Printers",
  "lazer-kesim":
    "Business & Industrial > Manufacturing > Laser Cutting Equipment",
  "dtf-baski":
    "Business & Industrial > Printing & Graphic Arts > Commercial Printing Equipment > Digital Printers",
  "sublimasyon-baski":
    "Business & Industrial > Printing & Graphic Arts > Commercial Printing Equipment > Digital Printers",
}

const DEFAULT_GOOGLE_CATEGORY =
  "Business & Industrial > Printing & Graphic Arts > Commercial Printing Equipment"

/** Feed XML'inde kullanılacak ürün satırı */
export interface GoogleShoppingFeedItem {
  id: string
  title: string
  link: string
  description: string
  price: string
  availability: "in stock" | "out of stock"
  imageLink: string
  googleProductCategory: string
  brand: string
  mpn: string
  productType: string
}

/**
 * Site kök URL'ini ortam değişkeninden okur; yoksa production varsayılanını döner.
 */
export function getSiteBaseUrl(): string {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://www.compass.com.tr"
  return configured.replace(/\/+$/, "")
}

/**
 * XML özel karakterlerini güvenli metne çevirir.
 */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

/**
 * KDV hariç TL tutarını Google Merchant fiyat formatına (KDV dahil TRY) dönüştürür.
 */
export function formatGooglePrice(priceExVat: number): string {
  const priceInclVat = addVat(priceExVat)
  return `${priceInclVat.toFixed(2)} TRY`
}

/**
 * Göreli yolları mutlak URL'ye çevirir; zaten mutlak URL ise olduğu gibi döner.
 */
export function resolveAbsoluteUrl(pathOrUrl: string, siteBaseUrl: string): string {
  const value = (pathOrUrl || "").trim()
  if (!value) return `${siteBaseUrl}/placeholders/placeholder.svg`
  if (/^https?:\/\//i.test(value)) return value
  return `${siteBaseUrl}${value.startsWith("/") ? value : `/${value}`}`
}

/**
 * Ürün açıklamasını feed için düz metne indirger ve uzunluğu sınırlar.
 */
export function normalizeFeedDescription(description: string): string {
  const plain = description
    .replace(/\r\n/g, "\n")
    .replace(/[*_#>`-]/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  if (!plain) return FEED_CHANNEL.description
  return plain.length > 5000 ? `${plain.slice(0, 4997)}...` : plain
}

/**
 * Ürün adından marka tahmin eder; bulunamazsa Compass Reklam döner.
 */
export function inferProductBrand(productName: string): string {
  const knownBrands = [
    "Epson",
    "Compass",
    "Siemens",
    "Roland",
    "Mimaki",
    "Mutoh",
    "GravaTech",
    "GCC",
    "Summa",
  ]

  const normalized = productName.toLowerCase()
  for (const brand of knownBrands) {
    if (normalized.includes(brand.toLowerCase())) {
      return brand === "Compass" ? FEED_CHANNEL.brand : brand
    }
  }

  return FEED_CHANNEL.brand
}

/**
 * Kategori slug'ına göre Google ürün kategorisini döndürür.
 */
export function getGoogleProductCategory(categorySlug?: string, categoryName?: string): string {
  if (categorySlug && GOOGLE_CATEGORY_BY_SLUG[categorySlug]) {
    return GOOGLE_CATEGORY_BY_SLUG[categorySlug]
  }

  if (categoryName) {
    return `${DEFAULT_GOOGLE_CATEGORY} > ${categoryName}`
  }

  return DEFAULT_GOOGLE_CATEGORY
}

/**
 * API ürün kaydından feed satırı üretir.
 */
export function buildFeedItemFromProduct(
  product: ProductListItem,
  siteBaseUrl: string,
): GoogleShoppingFeedItem | null {
  const slug = product.slug?.trim()
  if (!slug) return null

  const category = product.categories[0]
  const staticCover = getStaticCatalogCoverImageBySlug(slug)
  const imagePath =
    staticCover ||
    product.gallery?.mainImage?.s3Url ||
    product.gallery?.thumbnailImage?.s3Url ||
    "/placeholders/placeholder.svg"

  const effectivePrice = product.discountedPrice ?? product.price ?? product.basePrice
  if (!effectivePrice || effectivePrice <= 0) return null

  const stockQty = product.stock?.usableQuantity ?? 0

  return {
    id: product.sku || product.productId || product.id,
    title: product.name,
    link: `${siteBaseUrl}/urun/${slug}`,
    description: normalizeFeedDescription(product.description || product.subtitle || product.name),
    price: formatGooglePrice(effectivePrice),
    availability: stockQty > 0 ? "in stock" : "out of stock",
    imageLink: resolveAbsoluteUrl(imagePath, siteBaseUrl),
    googleProductCategory: getGoogleProductCategory(category?.slug, category?.name),
    brand: inferProductBrand(product.name),
    mpn: product.sku || product.productId || product.id,
    productType: category?.name || "Endüstriyel Baskı Makineleri",
  }
}

/**
 * Backend'den tüm ürünleri sayfalı olarak çeker.
 */
export async function fetchAllProductsForFeed(): Promise<ProductListItem[]> {
  const limit = 100
  let page = 1
  let totalPages = 1
  const products: ProductListItem[] = []

  while (page <= totalPages) {
    const response = await getProducts({ page, limit, orderBy: "created_at_desc" })
    products.push(...response.products)
    totalPages = response.totalPages || 1
    page += 1
  }

  return products
}

/**
 * API erişilemezse statik katalogdan ProductListItem benzeri kayıt üretir.
 */
async function fetchStaticProductsForFeed(): Promise<ProductListItem[]> {
  const usdTryRate = await getUsdTryRate()
  const staticProducts = getStaticFrontendProducts(usdTryRate)

  return staticProducts.map((product) => ({
    id: product.id,
    productId: product.productId,
    variantCombinationId: null,
    name: product.name,
    subtitle: product.subtitle,
    slug: product.slug,
    description: product.subtitle || product.name,
    price: product.price,
    basePrice: product.basePrice,
    discountedPrice: product.discountedPrice,
    sku: `STATIC-${product.id}`,
    stock: product.stock,
    gallery: {
      mainImage: {
        id: `static-${product.id}`,
        s3Url: product.image,
        displayName: product.name,
        filename: product.name,
      },
      thumbnailImage: null,
      detailImages: [],
    },
    categories: [
      {
        id: `static-cat-${product.slug}`,
        name: product.category,
        slug: product.category.toLowerCase().replace(/\s+/g, "-"),
      },
    ],
    tags: [],
    variantValues: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }))
}

/**
 * Feed satırlarını benzersiz ürün koduna göre birleştirir.
 */
export function dedupeFeedItems(items: GoogleShoppingFeedItem[]): GoogleShoppingFeedItem[] {
  const map = new Map<string, GoogleShoppingFeedItem>()
  for (const item of items) {
    map.set(item.id, item)
  }
  return Array.from(map.values())
}

/**
 * Tek bir feed satırını RSS item XML'ine dönüştürür.
 */
export function renderFeedItemXml(item: GoogleShoppingFeedItem): string {
  return [
    "  <item>",
    `    <title>${escapeXml(item.title)}</title>`,
    `    <link>${escapeXml(item.link)}</link>`,
    `    <description>${escapeXml(item.description)}</description>`,
    `    <g:id>${escapeXml(item.id)}</g:id>`,
    "    <g:condition>new</g:condition>",
    `    <g:price>${escapeXml(item.price)}</g:price>`,
    `    <g:availability>${item.availability}</g:availability>`,
    `    <g:image_link>${escapeXml(item.imageLink)}</g:image_link>`,
    `    <g:google_product_category>${escapeXml(item.googleProductCategory)}</g:google_product_category>`,
    "    <g:identifier_exists>false</g:identifier_exists>",
    `    <g:brand>${escapeXml(item.brand)}</g:brand>`,
    `    <g:mpn>${escapeXml(item.mpn)}</g:mpn>`,
    `    <g:product_type>${escapeXml(item.productType)}</g:product_type>`,
    "  </item>",
  ].join("\n")
}

/**
 * Google Merchant Center RSS/XML feed içeriğini üretir.
 */
export async function buildGoogleShoppingFeedXml(): Promise<string> {
  const siteBaseUrl = getSiteBaseUrl()

  let sourceProducts: ProductListItem[] = []
  try {
    sourceProducts = await fetchAllProductsForFeed()
  } catch (error) {
    console.error("[google-shopping-feed] API ürünleri alınamadı, statik katalog kullanılacak:", error)
  }

  if (sourceProducts.length === 0) {
    sourceProducts = await fetchStaticProductsForFeed()
  }

  const feedItems = dedupeFeedItems(
    sourceProducts
      .map((product) => buildFeedItemFromProduct(product, siteBaseUrl))
      .filter((item): item is GoogleShoppingFeedItem => item !== null),
  )

  const itemsXml = feedItems.map(renderFeedItemXml).join("\n")

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">',
    "<channel>",
    `  <title>${escapeXml(FEED_CHANNEL.title)}</title>`,
    `  <link>${escapeXml(siteBaseUrl)}</link>`,
    `  <description>${escapeXml(FEED_CHANNEL.description)}</description>`,
    itemsXml,
    "</channel>",
    "</rss>",
  ].join("\n")
}
