import Link from "next/link"

/**
 * 404 sayfası - Forge NotFound UI
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Sayfa bulunamadı</p>
        <Link href="/" className="text-primary underline hover:text-primary/90">
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  )
}
