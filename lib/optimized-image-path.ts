/**
 * Yerel statik görsel yolunu WebP karşılığına çevirir (`public/urunler` optimizasyonu).
 */
export function toWebpImagePath(src: string | null | undefined): string {
  if (!src) return src ?? ""
  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("//") ||
    src.endsWith(".webp") ||
    src.endsWith(".svg") ||
    src.startsWith("/placeholders")
  ) {
    return src
  }
  return src.replace(/\.(png|jpe?g)$/i, ".webp")
}

/**
 * localhost/127.0.0.1 üzerindeki storefront görsellerini next/image ile uyumlu göreli yola çevirir.
 * Eski port (3000) veya yeni port (3050) fark etmez; `/urunler/...` olarak normalize edilir.
 */
export function normalizeStoreImageUrl(src: string | null | undefined): string {
  if (!src) return ""
  if (!src.startsWith("http://") && !src.startsWith("https://")) return src

  try {
    const url = new URL(src)
    const isLocalHost =
      url.hostname === "localhost" || url.hostname === "127.0.0.1"
    if (
      isLocalHost &&
      (url.pathname.startsWith("/urunler") || url.pathname.startsWith("/placeholders"))
    ) {
      return url.pathname
    }
  } catch {
    // geçersiz URL — olduğu gibi bırak
  }

  return src
}

/**
 * Ürün görseli için localhost normalize + WebP dönüşümü uygular.
 */
export function resolveStoreImageSrc(src: string | null | undefined): string {
  const normalized = normalizeStoreImageUrl(src)
  return toWebpImagePath(normalized || "/placeholders/placeholder.svg") || "/placeholders/placeholder.svg"
}

/**
 * Galeri veya liste için görsel yollarını WebP'ye normalize eder.
 */
export function toWebpImagePaths(paths: string[]): string[] {
  return paths.map(toWebpImagePath)
}
