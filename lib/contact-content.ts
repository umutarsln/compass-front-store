import { Clock, Mail, MapPin, Phone } from "lucide-react"

/**
 * İletişim sayfası için tek merkezden yönetilen kart bilgileri.
 */
export const contactInfoCards = [
  { icon: Phone, label: "Telefon", value: "0555 000 00 00", href: "tel:+905550000000" },
  { icon: Mail, label: "E-posta", value: "demo@compassreklam.com", href: "mailto:demo@compassreklam.com" },
  { icon: MapPin, label: "Adres", value: "Yenidoğan Mah. 3079 sokak no:13, Kepez / Antalya" },
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
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3182.5!2d30.7!3d36.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDU0JzAwLjAiTiAzMMKwNDInMDAuMCJF!5e0!3m2!1str!2str!4v1"
