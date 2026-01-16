import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/contexts/cart-context"
import { FavoritesProvider } from "@/contexts/favorites-context"
import { CartSidebar } from "@/components/cart-sidebar"
import { Topbar } from "@/components/topbar"
import { WhatsAppButton } from "@/components/whatsapp-button"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const playfair = Playfair_Display({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Shawk | Anılarınızı Işığa Dönüştürün",
  description: "Fotoğraflarınızdan kişiselleştirilmiş 3D baskılı LED lambalar. Sevdiklerinize anlamlı hediyeler.",
  generator: 'v0.app',
  icons: {
    icon: '/logos/favicon-shawk.png',
    apple: '/logos/favicon-shawk.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr">
      <body className={`font-sans antialiased`}>
        <CartProvider>
          <FavoritesProvider>
            <Topbar />
            {children}
            <CartSidebar />
            <WhatsAppButton />
          </FavoritesProvider>
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
