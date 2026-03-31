import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin } from "lucide-react"

/** Forge tarzı Compass Reklam footer bileşeni - Marka, hızlı bağlantılar, ürün kategorileri, iletişim */
export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/compass-reklam-logo.png"
                alt="Compass Reklam"
                width={170}
                height={48}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Endüstriyel baskı teknolojilerinde Türkiye&apos;nin lider çözüm ortağı. 15+ yıllık deneyimimizle yanınızdayız.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-primary">Hızlı Bağlantılar</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/urunler" className="text-muted-foreground hover:text-primary transition-colors">Ürünler</Link></li>
              <li><Link href="/hizmetler" className="text-muted-foreground hover:text-primary transition-colors">Teknik Servis</Link></li>
              <li><Link href="/hakkimizda" className="text-muted-foreground hover:text-primary transition-colors">Hakkımızda</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/iletisim" className="text-muted-foreground hover:text-primary transition-colors">İletişim</Link></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-primary">Ürün Kategorileri</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/urunler" className="text-muted-foreground hover:text-primary transition-colors">UV Baskı Makineleri</Link></li>
              <li><Link href="/urunler" className="text-muted-foreground hover:text-primary transition-colors">DTF Yazıcılar</Link></li>
              <li><Link href="/urunler" className="text-muted-foreground hover:text-primary transition-colors">Lazer Kesim</Link></li>
              <li><Link href="/urunler" className="text-muted-foreground hover:text-primary transition-colors">Laminasyon Makineleri</Link></li>
              <li><Link href="/urunler" className="text-muted-foreground hover:text-primary transition-colors">Sarf Malzemeleri</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-primary">İletişim</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                İstanbul, Türkiye
              </li>
              <li>
                <a href="tel:+902125551234" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <Phone className="h-4 w-4 text-primary" />
                  +90 212 555 12 34
                </a>
              </li>
              <li>
                <a href="mailto:info@compassreklam.com" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-4 w-4 text-primary" />
                  info@compassreklam.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-muted mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 Compass Reklam. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/gizlilik" className="hover:text-primary transition-colors">Gizlilik Politikası</Link>
            <Link href="/kullanim-kosullari" className="hover:text-primary transition-colors">Kullanım Koşulları</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
