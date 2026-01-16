/**
 * Slug normalizasyon fonksiyonu
 * Türkçe karakterleri İngilizce karşılıklarına çevirir ve slug formatına uygun hale getirir
 */
export function normalizeSlug(slug: string): string {
  if (!slug) return ''

  // Türkçe karakterleri İngilizce karşılıklarına çevir
  const turkishToEnglish: Record<string, string> = {
    'ş': 's',
    'Ş': 'S',
    'ı': 'i',
    'İ': 'I',
    'ö': 'o',
    'Ö': 'O',
    'ü': 'u',
    'Ü': 'U',
    'ğ': 'g',
    'Ğ': 'G',
    'ç': 'c',
    'Ç': 'C',
  }

  let normalized = slug

  // Türkçe karakterleri değiştir
  for (const [turkish, english] of Object.entries(turkishToEnglish)) {
    normalized = normalized.replace(new RegExp(turkish, 'g'), english)
  }

  // Küçük harfe çevir
  normalized = normalized.toLowerCase()

  // Boşlukları tireye çevir
  normalized = normalized.replace(/\s+/g, '-')

  // Özel karakterleri temizle (sadece harf, rakam ve tire bırak)
  normalized = normalized.replace(/[^a-z0-9-]/g, '')

  // Birden fazla tireyi tek tireye çevir
  normalized = normalized.replace(/-+/g, '-')

  // Başta ve sonda tire varsa temizle
  normalized = normalized.replace(/^-+|-+$/g, '')

  return normalized
}

/**
 * İki slug'ın normalize edilmiş hallerini karşılaştırır
 */
export function compareSlugs(slug1: string, slug2: string): boolean {
  return normalizeSlug(slug1) === normalizeSlug(slug2)
}
