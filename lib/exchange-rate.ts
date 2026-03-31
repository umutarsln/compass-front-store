/** Kur servisi erişilemezse kullanılacak varsayılan USD/TRY kuru. */
const FALLBACK_USD_TRY = 44

/**
 * USD/TRY kurunu dış servisten alır.
 * Servis yanıtı geçersizse güvenli fallback kur döner.
 */
export async function getUsdTryRate(): Promise<number> {
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/USD", {
      method: "GET",
      cache: "no-store",
      next: { revalidate: 0 },
    })
    if (!response.ok) return FALLBACK_USD_TRY

    const data = (await response.json()) as {
      result?: string
      rates?: Record<string, number>
    }
    const tryRate = data?.rates?.TRY
    if (data?.result !== "success" || !tryRate || Number.isNaN(tryRate)) {
      return FALLBACK_USD_TRY
    }
    return tryRate
  } catch {
    return FALLBACK_USD_TRY
  }
}

/**
 * USD fiyatı, verilen kur ile TL'ye çevirir.
 * Her zaman tam sayıya yuvarlanmış TL döner.
 */
export function usdToTry(usdPrice: number, usdTryRate: number): number {
  const convertedPrice = usdPrice * usdTryRate
  return Math.ceil(convertedPrice / 100) * 100
}

