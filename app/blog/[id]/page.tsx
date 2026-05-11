import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, Calendar, Clock, Tag, User } from "lucide-react"
import { Footer } from "@/components/footer"
import { blogPosts, getBlogPostById, getRelatedBlogPosts } from "@/lib/blog-content"

type BlogDetailPageProps = {
  params: Promise<{ id: string }>
}

/** Statik üretim için tüm blog detay URL parametrelerini döndürür. */
export function generateStaticParams() {
  return blogPosts.map((post) => ({ id: post.id }))
}

/** Blog detay sayfası için yazıya özel SEO metadata üretir. */
export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const post = getBlogPostById(id)

  if (!post) {
    return {
      title: "Blog Yazısı Bulunamadı | Compass Reklam",
      description: "Aradığınız Compass Reklam blog yazısı bulunamadı.",
    }
  }

  return {
    title: `${post.title} | Compass Reklam Blog`,
    description: post.excerpt,
    keywords: [post.category, ...post.highlights],
    authors: [{ name: post.author }],
    alternates: {
      canonical: `/blog/${post.id}`,
    },
    openGraph: {
      title: `${post.title} | Compass Reklam Blog`,
      description: post.excerpt,
      type: "article",
      publishedTime: post.dateTime,
      authors: [post.author],
      images: [
        {
          url: post.image,
          alt: post.imageAlt,
        },
      ],
    },
  }
}

/** Blog yazısı için JSON-LD yapılandırılmış veri nesnesini hazırlar. */
function buildBlogPostJsonLd(post: NonNullable<ReturnType<typeof getBlogPostById>>) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Compass Reklam",
    },
    datePublished: post.dateTime,
    dateModified: post.dateTime,
    keywords: [post.category, ...post.highlights].join(", "),
  }
}

/** Tekil blog yazısını detay içeriği, yazar kutusu ve benzer yazılarla gösterir. */
export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { id } = await params
  const post = getBlogPostById(id)

  if (!post) {
    notFound()
  }

  const relatedPosts = getRelatedBlogPosts(post)
  const structuredData = buildBlogPostJsonLd(post)

  return (
    <>
      <main className="min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <section className="bg-secondary py-8">
          <div className="container">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all hover:gap-3"
            >
              <ArrowLeft className="h-4 w-4" /> Bloga Dön
            </Link>
          </div>
        </section>

        <article>
          <section className="relative overflow-hidden bg-secondary pb-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.18),transparent_35%)]" />
            <div className="container relative">
              <div className="mx-auto max-w-4xl text-center">
                <div className="mb-5 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
                    <Tag className="h-3 w-3" /> {post.category}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> <time dateTime={post.dateTime}>{post.date}</time>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {post.readTime}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <User className="h-3 w-3" /> {post.author}
                  </span>
                </div>
                <h1 className="font-display text-4xl font-bold leading-tight text-secondary-foreground md:text-5xl">
                  {post.title}
                </h1>
                <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
              </div>
            </div>
          </section>

          <section className="py-12">
            <div className="container">
              <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-elevated">
                <div className="relative aspect-[16/8] overflow-hidden bg-muted">
                  <Image src={post.image} alt={post.imageAlt} fill className="object-cover" priority />
                </div>

                <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1fr_280px]">
                  <div>
                    <div className="mb-8 rounded-xl bg-muted/70 p-5">
                      <p className="mb-3 text-sm font-semibold text-foreground">Bu yazıda öne çıkanlar</p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {post.highlights.map((highlight) => (
                          <li key={highlight} className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-5 text-muted-foreground">
                      {post.content.map((paragraph) => (
                        <p key={paragraph} className="text-base leading-8 md:text-lg">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>

                  <aside className="h-fit rounded-xl border border-border bg-background p-5">
                    <p className="text-sm font-semibold uppercase tracking-wider text-primary">Yazar</p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{post.author}</p>
                        <p className="text-sm text-muted-foreground">Compass Reklam</p>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-border pt-5">
                      <p className="text-sm font-semibold text-foreground">Kategori</p>
                      <p className="mt-1 text-sm text-muted-foreground">{post.category}</p>
                    </div>

                    <div className="mt-5 border-t border-border pt-5">
                      <p className="text-sm font-semibold text-foreground">Okuma Süresi</p>
                      <p className="mt-1 text-sm text-muted-foreground">{post.readTime}</p>
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          </section>
        </article>

        {relatedPosts.length > 0 && (
          <section className="bg-muted/50 py-14">
            <div className="container">
              <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-primary">Benzer Yazılar</p>
                  <h2 className="font-display text-3xl font-bold text-foreground">Aynı Kategoriden Devam Edin</h2>
                </div>
                <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3">
                  Tüm Yazılar <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.id}`}
                    className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={relatedPost.image}
                        alt={relatedPost.imageAlt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <p className="mb-2 text-xs font-semibold text-primary">{relatedPost.category}</p>
                      <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary">
                        {relatedPost.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {relatedPost.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
