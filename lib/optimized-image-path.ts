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
 * Galeri veya liste için görsel yollarını WebP'ye normalize eder.
 */
export function toWebpImagePaths(paths: string[]): string[] {
  return paths.map(toWebpImagePath)
}
