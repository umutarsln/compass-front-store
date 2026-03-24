import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/contexts/cart-context"
import { FavoritesProvider } from "@/contexts/favorites-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { CartSidebar } from "@/components/cart-sidebar"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { AnalyticsPageView } from "@/components/analytics-page-view"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const playfair = Playfair_Display({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Compass Reklam | Endüstriyel Baskı Teknolojileri",
  description: "Endüstriyel baskı teknolojilerinde Türkiye'nin lider çözüm ortağı. UV Baskı, DTF, Lazer Kesim makineleri.",
  generator: 'v0.app',
  icons: {
    icon: '/logos/favicon-compass.png',
    apple: '/logos/favicon-compass.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr">
      <head>
        {/* Google Tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-9WTD6QPS7W"></script>
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-9WTD6QPS7W');`,
          }}
        />
      </head>
      <body className={`font-sans antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <AnalyticsPageView />
              <Header />
              {children}
              <CartSidebar />
              <WhatsAppButton />
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
