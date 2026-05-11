"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Footer } from "@/components/footer"
import { ArrowRight, Calendar, Clock, User, Tag } from "lucide-react"
import { blogCategories, blogPosts } from "@/lib/blog-content"

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
              {blogCategories.map((cat) => (
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
                <Image src={featured.image} alt={featured.imageAlt} fill className="object-cover" />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-1 text-xs text-primary font-semibold bg-primary/10 px-3 py-1 rounded-full">
                    <Tag className="h-3 w-3" /> {featured.category}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> <time dateTime={featured.dateTime}>{featured.date}</time>
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {featured.readTime}
                  </span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">{featured.title}</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">{featured.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" /> {featured.author}
                  </span>
                  <Link
                    href={`/blog/${featured.id}`}
                    className="text-sm text-primary font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Devamını Oku <ArrowRight className="h-3 w-3" />
                  </Link>
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
                      alt={post.imageAlt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs text-primary font-semibold">{post.category}</span>
                      <span className="text-xs text-muted-foreground">
                        <time dateTime={post.dateTime}>• {post.date}</time>
                      </span>
                      <span className="text-xs text-muted-foreground">{post.readTime}</span>
                    </div>
                    <h3 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3" /> {post.author}
                      </span>
                      <Link
                        href={`/blog/${post.id}`}
                        className="text-sm text-primary font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        Oku <ArrowRight className="h-3 w-3" />
                      </Link>
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
