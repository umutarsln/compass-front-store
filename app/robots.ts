import type { MetadataRoute } from "next"
import { getSiteUrl } from "@/lib/structured-data"

/**
 * robots.txt — sitemap konumunu ve tarama kurallarını tanımlar.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl()

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/odeme-auth", "/giris", "/kayit", "/siparislerim"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
