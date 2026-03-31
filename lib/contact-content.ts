import { Clock, Mail, MapPin, Phone } from "lucide-react"

/**
 * İletişim sayfası için tek merkezden yönetilen kart bilgileri.
 */
export const contactInfoCards = [
  { icon: Phone, label: "Telefon", value: "0553 467 86 07", href: "tel:+905534678607" },
  { icon: Mail, label: "E-posta", value: "demo@compassreklam.com", href: "mailto:demo@compassreklam.com" },
  {
    icon: MapPin,
    label: "Adres",
    value: "Compass Reklam Plotter Digital Baski Makineleri (Ilev Group Ltd. Sti.)",
    href: "https://www.google.com/maps/place/compass+Reklam+plotter+digital+bask%C4%B1+makineleri+%C4%B0lev+group+ltd+%C5%9Fti/@36.9247915,30.691733,17z/data=!3m1!4b1!4m6!3m5!1s0x14c38ff40f3b32f5:0xec839d573c72829f!8m2!3d36.9247872!4d30.6943133!16s%2Fg%2F11jybkg3pf?entry=ttu&g_ep=EgoyMDI2MDMyNC4wIKXMDSoASAFQAw%3D%3D",
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
  "https://www.google.com/maps?q=compass%20Reklam%20plotter%20digital%20bask%C4%B1%20makineleri%20%C4%B0lev%20group%20ltd%20%C5%9Fti&output=embed"
