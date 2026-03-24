"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Shield,
  Truck,
  Headphones,
  Award,
  Settings,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  Printer,
  Scissors,
  Layers,
  Package,
  Wrench,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import type { FrontendProduct } from "@/lib/product-transformer"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
}

const categories = [
  { name: "Baskı Makineleri", icon: Printer, count: 24, image: "/images/forge/product-flatbed.jpg" },
  { name: "Kesim Makineleri", icon: Scissors, count: 18, image: "/images/forge/product-laser.jpg" },
  { name: "Laminasyon", icon: Layers, count: 12, image: "/images/forge/product-laminator.jpg" },
  { name: "Sarf Malzemeleri", icon: Package, count: 45, image: "/images/forge/product-rolltoroll.jpg" },
]

const stats = [
  { value: "500+", label: "Mutlu Müşteri" },
  { value: "15+", label: "Yıl Tecrübe" },
  { value: "1000+", label: "Kurulu Makine" },
  { value: "7/24", label: "Teknik Destek" },
]

const references = [
  "Mega Reklam",
  "Star Tabela",
  "Ankara Print",
  "İzmir Dijital",
  "Antalya Reklam",
  "Konya Baskı",
]

const blogPosts = [
  { title: "UV Baskı Teknolojisinde Son Trendler", date: "5 Mart 2026", category: "Teknoloji" },
  { title: "DTF Baskının Tekstil Sektöründeki Yeri", date: "28 Şubat 2026", category: "Sektör" },
  { title: "Doğru Baskı Makinesi Nasıl Seçilir?", date: "20 Şubat 2026", category: "Rehber" },
]

interface IndexSectionsProps {
  featuredProducts: FrontendProduct[]
}

/**
 * Ana sayfa Forge Index bölümleri
 */
export function IndexSections({ featuredProducts }: IndexSectionsProps) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/forge/hero-printer.jpg"
            alt="Endüstriyel baskı makinesi"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/70 to-transparent" />
        </div>
        <div className="container relative z-10 py-20">
          <motion.div initial="hidden" animate="visible" className="max-w-2xl" variants={fadeUp}>
            <motion.span
              custom={0}
              variants={fadeUp}
              className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            >
              <Zap className="h-4 w-4" /> Endüstriyel Baskı Çözümleri
            </motion.span>
            <motion.h1
              custom={1}
              variants={fadeUp}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-background leading-tight mb-6"
            >
              Baskı Teknolojisinde <span className="text-gradient">Güvenilir</span> Çözüm Ortağınız
            </motion.h1>
            <motion.p
              custom={2}
              variants={fadeUp}
              className="text-lg text-background/80 mb-8 leading-relaxed"
            >
              Dünya markası baskı, kesim ve laminasyon makineleri ile işletmenizi bir adım öne taşıyın. Kurulum,
              eğitim ve 7/24 teknik destek hizmetleriyle yanınızdayız.
            </motion.p>
            <motion.div custom={3} variants={fadeUp} className="flex flex-wrap gap-4">
              <Link href="/urunler">
                <Button size="lg" className="text-base">
                  Ürünleri Keşfet <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/teklif-al">
                <Button variant="outline" size="lg" className="text-base border-background text-background hover:bg-background/10">
                  Ücretsiz Teklif Alın
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="bg-card border-y border-border">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, text: "2 Yıl Garanti" },
              { icon: Truck, text: "Ücretsiz Kurulum" },
              { icon: Headphones, text: "7/24 Destek" },
              { icon: Award, text: "Yetkili Distribütör" },
            ].map((item, i) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 justify-center"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium text-sm text-foreground">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Kategoriler</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">Ürün Kategorileri</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href="/urunler" className="group relative overflow-hidden rounded-lg aspect-[4/3] block">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <cat.icon className="h-5 w-5 text-primary" />
                      <h3 className="font-display font-semibold text-background">{cat.name}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">{cat.count} ürün</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Öne Çıkanlar</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">Popüler Ürünler</h2>
            </div>
            <Link href="/urunler">
              <Button variant="outline" size="sm">
                Tümünü Gör <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.slice(0, 6).map((product) => <ProductCard key={product.id} {...product} />)
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Henüz ürün bulunmuyor. Ürünler yüklendikten sonra burada görünecektir.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Technical Service */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Teknik Servis</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                Profesyonel Teknik Destek
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Uzman ekibimizle kurulum, bakım, onarım ve eğitim hizmetleri sunuyoruz. Tüm Türkiye genelinde yerinde
                servis garantisi ile makineleriniz her zaman en iyi performansla çalışır.
              </p>
              <div className="space-y-4">
                {[
                  "Yerinde kurulum ve devreye alma",
                  "Periyodik bakım ve kalibrasyon",
                  "Uzaktan ve yerinde teknik destek",
                  "Operatör eğitim programları",
                  "Orijinal yedek parça temini",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/hizmetler">
                <Button size="lg" className="mt-8">
                  <Wrench className="mr-2 h-5 w-5" /> Servis Talebi Oluştur
                </Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-[4/3] rounded-lg shadow-elevated overflow-hidden">
                <Image
                  src="/images/forge/product-flatbed.jpg"
                  alt="Teknik servis"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-card rounded-lg shadow-elevated p-5 border border-border">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Settings className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-lg text-foreground">1000+</p>
                    <p className="text-xs text-muted-foreground">Başarılı kurulum</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-20 bg-secondary">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Neden Biz?</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary-foreground mt-2">
              Compass Reklam Farkı
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: "Yetkili Distribütör",
                desc: "Dünya markası üreticilerin Türkiye yetkili distribütörüyüz.",
              },
              {
                icon: Users,
                title: "Uzman Ekip",
                desc: "Alanında uzman mühendis ve teknisyen kadromuzla hizmet veriyoruz.",
              },
              {
                icon: Headphones,
                title: "Satış Sonrası Destek",
                desc: "7/24 teknik destek, eğitim ve yedek parça hizmeti sunuyoruz.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center p-8 rounded-lg bg-secondary-foreground/5 border border-muted/20"
              >
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-secondary-foreground text-lg mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-primary">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="font-display text-3xl md:text-4xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/80 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* References */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Referanslar</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">Güvenilir İş Ortaklarımız</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {references.map((ref) => (
              <div
                key={ref}
                className="h-20 rounded-lg border border-border bg-card flex items-center justify-center hover:border-primary/50 hover:shadow-card transition-all duration-300"
              >
                <span className="font-display font-semibold text-muted-foreground">{ref}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <div className="flex items-center justify-center gap-1 text-primary">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-primary" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">500+ müşteriden 4.9/5 ortalama puan</p>
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Blog</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">Son Yazılar</h2>
            </div>
            <Link href="/blog">
              <Button variant="outline" size="sm">
                Tümünü Gör <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post, i) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-lg overflow-hidden shadow-card border border-border hover:shadow-elevated transition-all duration-300"
              >
                <div className="h-48 bg-secondary" />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-primary font-semibold">{post.category}</span>
                    <span className="text-xs text-muted-foreground">• {post.date}</span>
                  </div>
                  <h3 className="font-display font-semibold text-foreground hover:text-primary transition-colors cursor-pointer">
                    {post.title}
                  </h3>
                  <Link
                    href="/blog"
                    className="text-sm text-primary font-medium mt-3 inline-flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Devamını Oku <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-secondary">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary-foreground mb-4">
              İşletmenizi Büyütmeye Hazır Mısınız?
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Ücretsiz demo ve fiyat teklifi için hemen bizimle iletişime geçin. Uzman ekibimiz en uygun çözümü
              sizinle birlikte belirlesin.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/teklif-al">
                <Button size="lg" className="text-base">
                  Ücretsiz Teklif Alın
                </Button>
              </Link>
              <a href="https://wa.me/905519770858" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="text-base border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10">
                  WhatsApp ile Yazın
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
