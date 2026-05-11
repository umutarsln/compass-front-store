import { Clock, Mail, MapPin, Phone } from "lucide-react"

/** Genel iş telefonu; sabit arama FAB ve iletişim kartı aynı numarayı kullanır. */
export const SITE_PHONE_TEL_HREF = "tel:+905534678607" as const
/** Ekranda gösterilen telefon metni (boşluklu). */
export const SITE_PHONE_DISPLAY = "0553 467 86 07"

/** Yeni Compass Reklam Google Maps işletme konumu. */
const CONTACT_MAP_URL =
  "https://www.google.com/maps/place/Compass+Reklam+Plotter+Dijital+Bask%C4%B1+Makineleri+-+%C4%B0lev+Group+ltd+%C5%9Fti/@36.9375321,30.7029017,16.19z/data=!4m6!3m5!1s0x14c38ff40f3b32f5:0xec839d573c72829f!8m2!3d36.9369033!4d30.703501!16s%2Fg%2F11jybkg3pf?entry=ttu&g_ep=EgoyMDI2MDUwNi4wIKXMDSoASAFQAw%3D%3D"

/**
 * WhatsApp `wa.me` bağlantıları için E.164 (başında + yok, yalnızca rakamlar).
 * `SITE_PHONE_TEL_HREF` ile aynı hattı ifade eder.
 */
export const SITE_PHONE_WA_E164 = SITE_PHONE_TEL_HREF.replace(/^tel:\+/, "")

/**
 * İletişim sayfası için tek merkezden yönetilen kart bilgileri.
 */
export const contactInfoCards = [
  { icon: Phone, label: "Telefon", value: SITE_PHONE_DISPLAY, href: SITE_PHONE_TEL_HREF },
  { icon: Mail, label: "E-posta", value: "compassreklam@outlook.com", href: "mailto:compassreklam@outlook.com" },
  {
    icon: MapPin,
    label: "Adres",
    value: "Compass Reklam Plotter Digital Baski Makineleri (Ilev Group Ltd. Sti.)",
    href: CONTACT_MAP_URL,
  },
  { icon: Clock, label: "Çalışma Saatleri", value: "Her gün 7/24 açık" },
]

/**
 * İletişim sayfası başlık ve açıklama metinleri.
 */
export const contactPageText = {
  badge: "İletişim",
  title: "Bize Ulaşın",
  description: "Sorularınız, teklif talepleriniz veya teknik destek için bizimle iletişime geçin.",
  formTitle: "İletişim Formu",
  formDescription: "Formu doldurun, size en kısa sürede dönüş yapalım.",
}

/**
 * İletişim sayfası harita gömme bağlantısı.
 */
export const contactMapEmbedUrl =
  "https://www.google.com/maps?q=36.9369033,30.703501&z=16&output=embed"
