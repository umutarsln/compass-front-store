import { SITE_PHONE_WA_E164 } from "@/lib/contact-content"

/**
 * Teklif talepleri için WhatsApp numarası (E.164, `wa.me` için başında + olmadan).
 * İletişim sayfasındaki `SITE_PHONE_TEL_HREF` ile aynı kaynaktan türetilir.
 */
export const WHATSAPP_TEKLIF_PHONE_E164 = SITE_PHONE_WA_E164

/** Sepet satırının WhatsApp metninde kullanılan özeti. */
export interface QuoteWhatsAppCartLine {
  name: string
  quantity: number
}

/** Teklif Al formunun WhatsApp metnine aktarılan alanları. */
export interface QuoteWhatsAppFormFields {
  fullName: string
  company: string
  email: string
  phone: string
  message: string
}

/**
 * Düz metin gövdesini `wa.me` açma URL’sine çevirir (UTF-8 `encodeURIComponent`).
 * @param plainText Gönderilecek mesaj (önceden encode edilmemiş)
 */
export function buildWhatsAppTeklifOpenUrl(plainText: string): string {
  return `https://wa.me/${WHATSAPP_TEKLIF_PHONE_E164}?text=${encodeURIComponent(plainText)}`
}

/**
 * Teklif Al sayfası formu ve sepet satırlarından WhatsApp sohbetine yapıştırılacak metni üretir.
 * @param fields Ad, firma, iletişim ve serbest mesaj
 * @param cartLines Sepetteki ürün adı ve adetleri (boş olabilir)
 */
export function buildQuoteRequestWhatsAppBody(
  fields: QuoteWhatsAppFormFields,
  cartLines: QuoteWhatsAppCartLine[],
): string {
  const name = fields.fullName.trim()
  const company = fields.company.trim()
  const email = fields.email.trim()
  const phone = fields.phone.trim()
  const message = fields.message.trim()

  const lines: string[] = [
    "Merhaba, web sitesindeki Teklif Al formundan teklif talep ediyorum.",
    "",
    `• Ad Soyad: ${name}`,
  ]
  if (company) lines.push(`• Firma: ${company}`)
  lines.push(`• E-posta: ${email}`)
  lines.push(`• Telefon: ${phone}`)

  if (message) {
    lines.push("")
    lines.push("Mesaj:")
    lines.push(message)
  }

  if (cartLines.length > 0) {
    lines.push("")
    lines.push("Sepetteki ürünler:")
    for (const line of cartLines) {
      lines.push(`- ${line.name.trim()} (Adet: ${line.quantity})`)
    }
  }

  return lines.join("\n")
}
