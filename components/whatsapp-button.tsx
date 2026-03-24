"use client"

import { MessageCircle } from "lucide-react"

/** Forge tarzı sabit WhatsApp iletişim butonu - sağ alt köşede */
export function WhatsAppButton() {
  const phoneNumber = "902125551234"
  const message = "Merhaba, ürünleriniz hakkında bilgi almak istiyorum."
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[hsl(142,70%,45%)] text-secondary-foreground p-4 rounded-full shadow-elevated hover:scale-110 transition-transform duration-300"
      aria-label="WhatsApp ile iletişime geç"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  )
}
