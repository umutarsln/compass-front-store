import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/contexts/cart-context"
import { FavoritesProvider } from "@/contexts/favorites-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { DeferredLayoutWidgets } from "@/components/deferred-layout-widgets"
import { ThirdPartyScripts } from "@/components/third-party-scripts"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" })

/** Google Merchant Center alan adı doğrulama kodu (GOOGLE_SITE_VERIFICATION env) */
const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION ?? ""

export const metadata: Metadata = {
  title: "Compass Reklam | Endüstriyel Baskı Teknolojileri",
  description: "Endüstriyel baskı teknolojilerinde Türkiye'nin lider çözüm ortağı. UV Baskı, DTF, Lazer Kesim makineleri.",
  generator: 'v0.app',
  icons: {
    icon: '/logos/compass-reklam-logo.png',
    shortcut: '/logos/compass-reklam-logo.png',
    apple: '/logos/compass-reklam-logo.png',
  },
  ...(googleSiteVerification
    ? { verification: { google: googleSiteVerification } }
    : {}),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {/* Google Tag Manager — NOSCRIPT (JS kapalıyken) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TRHSB7C7"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5N8PB529"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <Header />
              {children}
              <DeferredLayoutWidgets />
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
        <ThirdPartyScripts />
        <Analytics />
      </body>
    </html>
  )
}
