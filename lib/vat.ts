/**
 * Türkiye için uygulanan KDV oranı (%20); backend `common/vat.ts` ile aynı olmalı.
 */
export const VAT_RATE = 0.2

/**
 * KDV hariç tutara %20 ekleyerek iki ondalık basamağa yuvarlar (sepet/ödeme ile uyumlu).
 */
export function addVat(amountExVat: number): number {
  return Math.round(amountExVat * (1 + VAT_RATE) * 100) / 100
}

/**
 * Ürün listesi ve detayda KDV hariç fiyatın yanında gösterilen kısa etiket.
 */
export const PRICE_EX_VAT_LABEL = "+ KDV"

/**
 * Birim fiyat KDV hariçken satır toplamını KDV dahil hesaplar.
 */
export function lineTotalWithVat(unitPriceExVat: number, quantity: number): number {
  return Math.round(addVat(unitPriceExVat) * quantity * 100) / 100
}

/** Sepet satırı tipi: KDV hariç birim fiyat ve adet. */
export type CartLineForVat = {
  discountedPrice?: number | null
  basePrice?: number
  price: number
  quantity: number
}

/**
 * Sepet kalemlerinden indirim öncesi KDV hariç brüt ara toplamı hesaplar (backend sepet alt toplamı ile uyumlu).
 */
export function sumCartLinesExVat(items: ReadonlyArray<CartLineForVat>): number {
  if (items.length === 0) return 0
  const raw = items.reduce((sum, item) => {
    const unit = Number(item.discountedPrice ?? item.basePrice ?? item.price)
    return sum + unit * item.quantity
  }, 0)
  return Math.round(raw * 100) / 100
}

/**
 * KDV dahil ve KDV hariç tutar farkından KDV tutarını hesaplar (özet satırında kullanım için).
 */
export function vatAmountFromExAndIncl(exVat: number, inclVat: number): number {
  return Math.round((inclVat - exVat) * 100) / 100
}

/** API’den gelen sepet ara toplamı (minimal alanlar). */
export type CartTotalsForVat = {
  subtotal: number
  discountAmount: number
  total: number
}

/**
 * API `subtotal` değeri satır KDV hariç toplamıyla aynıysa backend tutarları KDV hariç döndürüyor demektir (eski sürüm veya tutarsız yanıt).
 */
export function isApiCartSubtotalLikelyExVat(
  cartTotals: CartTotalsForVat | null | undefined,
  linesExVat: number,
): boolean {
  if (cartTotals == null) return true
  return Math.abs(cartTotals.subtotal - linesExVat) < 0.05
}

/**
 * Ödenecek sepet toplamını KDV dahil tek tutarda döndürür: API KDV dahil veya hariç olabilir.
 */
export function resolveCartFinalTotalInclVat(
  linesExVat: number,
  cartTotals: CartTotalsForVat | null | undefined,
): number {
  const inclFromLines = addVat(linesExVat)
  if (cartTotals == null) {
    return inclFromLines
  }
  if (isApiCartSubtotalLikelyExVat(cartTotals, linesExVat)) {
    return addVat(Math.max(0, cartTotals.total))
  }
  return cartTotals.total
}

/**
 * İndirim öncesi KDV dahil ara toplamı her zaman satırlardan hesaplar (özet satırları tutarlı kalır).
 */
export function grossInclVatFromCartLines(linesExVat: number): number {
  return addVat(linesExVat)
}
