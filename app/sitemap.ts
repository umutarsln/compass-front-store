import type { MetadataRoute } from "next"
import { blogPosts } from "@/lib/blog-content"
import { getSiteUrl } from "@/lib/structured-data"
import { getStaticFrontendProducts } from "@/lib/static-product-details"
import { getUsdTryRate } from "@/lib/exchange-rate"

/** Statik sayfa rotaları */
const STATIC_ROUTES: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"] }> = [
  { path: "", priority: 1, changeFrequency: "daily" },
  { path: "/urunler", priority: 0.9, changeFrequency: "daily" },
  { path: "/hizmetler", priority: 0.8, changeFrequency: "monthly" },
  { path: "/hakkimizda", priority: 0.7, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
  { path: "/iletisim", priority: 0.7, changeFrequency: "monthly" },
  { path: "/teklif-al", priority: 0.8, changeFrequency: "monthly" },
  { path: "/sss", priority: 0.5, changeFrequency: "monthly" },
  { path: "/gizlilik", priority: 0.3, changeFrequency: "yearly" },
  { path: "/kullanim-kosullari", priority: 0.3, changeFrequency: "yearly" },
]

/**
 * Arama motorları için dinamik sitemap üretir.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl()
  const now = new Date()
  const usdTryRate = await getUsdTryRate()
  const products = getStaticFrontendProducts(usdTryRate)

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/urun/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  return [...staticEntries, ...productEntries, ...blogEntries]
}
