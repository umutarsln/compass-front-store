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
import { PhoneCallButton } from "@/components/phone-call-button"
import { AnalyticsPageView } from "@/components/analytics-page-view"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const playfair = Playfair_Display({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Compass Reklam | Endüstriyel Baskı Teknolojileri",
  description: "Endüstriyel baskı teknolojilerinde Türkiye'nin lider çözüm ortağı. UV Baskı, DTF, Lazer Kesim makineleri.",
  generator: 'v0.app',
  icons: {
    icon: '/compass-reklam-logo.png',
    shortcut: '/compass-reklam-logo.png',
    apple: '/compass-reklam-logo.png',
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
        {/* Google Tag Manager — HEAD snippet (mümkün olan en üst konum) */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5N8PB529');`,
          }}
        />
        {/* Google Tag (gtag.js) — GA4 G-9WTD6QPS7W doğrudan ölçüm */}
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
        {/* Google Tag Manager — NOSCRIPT (body açılışından hemen sonra) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5N8PB529"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <AnalyticsPageView />
              <Header />
              {children}
              <CartSidebar />
              <PhoneCallButton />
              <WhatsAppButton />
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
