"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Footer } from "@/components/footer"
import { ArrowRight, Calendar, User, Tag } from "lucide-react"

const blogPosts = [
  {
    id: "uv-baski-trendleri",
    title: "UV Baskı Teknolojisinde 2026 Trendleri",
    excerpt: "UV baskı teknolojisi her geçen yıl gelişmeye devam ediyor. 2026'da öne çıkan trendleri ve yenilikleri inceliyoruz.",
    date: "5 Mart 2026",
    author: "Ahmet Yılmaz",
    category: "Teknoloji",
    image: "/images/forge/product-flatbed.jpg",
    featured: true,
  },
  {
    id: "dtf-tekstil",
    title: "DTF Baskının Tekstil Sektöründeki Yükselişi",
    excerpt: "DTF baskı teknolojisi, tekstil sektöründe devrim yaratıyor. Avantajları ve uygulama alanlarını keşfedin.",
    date: "28 Şubat 2026",
    author: "Elif Kaya",
    category: "Sektör",
    image: "/images/forge/product-dtf.jpg",
  },
  {
    id: "dogru-makine-secimi",
    title: "Doğru Baskı Makinesi Nasıl Seçilir?",
    excerpt: "İşletmeniz için en uygun baskı makinesini seçerken dikkat etmeniz gereken 10 kritik faktörü açıklıyoruz.",
    date: "20 Şubat 2026",
    author: "Mehmet Demir",
    category: "Rehber",
    image: "/images/forge/product-rolltoroll.jpg",
  },
  {
    id: "lazer-kesim-rehber",
    title: "Lazer Kesim Makineleri: Kapsamlı Rehber",
    excerpt: "Fiber lazer ve CO2 lazer arasındaki farklar, kullanım alanları ve doğru seçim rehberi.",
    date: "15 Şubat 2026",
    author: "Ahmet Yılmaz",
    category: "Rehber",
    image: "/images/forge/product-laser.jpg",
  },
  {
    id: "laminasyon-ipuclari",
    title: "Laminasyonda Kaliteyi Artırmanın 5 Yolu",
    excerpt: "Laminasyon işlemlerinde kaliteyi artırmak ve maliyetleri düşürmek için pratik ipuçları.",
    date: "8 Şubat 2026",
    author: "Elif Kaya",
    category: "İpuçları",
    image: "/images/forge/product-laminator.jpg",
  },
  {
    id: "dijital-donusum",
    title: "Reklam Sektöründe Dijital Dönüşüm",
    excerpt: "Dijital baskı teknolojilerinin reklam sektörünü nasıl dönüştürdüğünü analiz ediyoruz.",
    date: "1 Şubat 2026",
    author: "Mehmet Demir",
    category: "Sektör",
    image: "/images/forge/hero-printer.jpg",
  },
]

const categories = ["Tümü", "Teknoloji", "Sektör", "Rehber", "İpuçları"]

/**
 * Blog sayfası - Forge Blog UI
 */
export default function BlogPage() {
  const featured = blogPosts[0]
  const rest = blogPosts.slice(1)

  return (
    <>
      <main>
        {/* Hero */}
        <section className="bg-secondary py-20">
          <div className="container text-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-primary font-semibold text-sm uppercase tracking-wider"
            >
              Blog
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-5xl font-bold text-secondary-foreground mt-3 mb-4"
            >
              Sektörden Haberler
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground max-w-2xl mx-auto text-lg"
            >
              Baskı teknolojileri, sektör trendleri ve faydalı rehberlerle güncel kalın.
            </motion.p>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 border-b border-border">
          <div className="container">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className="px-4 py-2 rounded-full text-sm font-medium bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-12">
          <div className="container">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-2 gap-8 bg-card rounded-lg overflow-hidden border border-border shadow-elevated"
            >
              <div className="relative aspect-video lg:aspect-auto lg:min-h-[300px]">
                <Image src={featured.image} alt={featured.title} fill className="object-cover" />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-1 text-xs text-primary font-semibold bg-primary/10 px-3 py-1 rounded-full">
                    <Tag className="h-3 w-3" /> {featured.category}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {featured.date}
                  </span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">{featured.title}</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">{featured.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" /> {featured.author}
                  </span>
                  <span className="text-sm text-primary font-medium inline-flex items-center gap-1 hover:gap-2 transition-all cursor-pointer">
                    Devamını Oku <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </motion.article>
          </div>
        </section>

        {/* Post Grid */}
        <section className="py-12 bg-muted/50">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-lg overflow-hidden border border-border shadow-card hover:shadow-elevated transition-all duration-300 group"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs text-primary font-semibold">{post.category}</span>
                      <span className="text-xs text-muted-foreground">• {post.date}</span>
                    </div>
                    <h3 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3" /> {post.author}
                      </span>
                      <span className="text-sm text-primary font-medium inline-flex items-center gap-1 hover:gap-2 transition-all cursor-pointer">
                        Oku <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
