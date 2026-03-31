"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, ShoppingCart, Phone, ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/contexts/cart-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getUser as getCookieUser, isAuthenticated as isCookieAuthenticated } from "@/lib/auth-client"

/** Forge tarzı Compass Reklam header bileşeni - Top bar + Ana navigasyon + Mega menü */
const categories = [
  {
    name: "Baskı Makineleri",
    subcategories: [
      { name: "UV Baskı", href: "/urunler?categorySlugs=uv-baski" },
      { name: "Dijital Baskı", href: "/urunler?categorySlugs=dijital-baski" },
      { name: "Süblimasyon Baskı", href: "/urunler?categorySlugs=dijital-baski" },
    ],
  },
  {
    name: "Kesim Makineleri",
    subcategories: [
      { name: "Plotter Folyo Kesici", href: "/urunler?categorySlugs=plotter-folyo-kesici" },
      { name: "Etiket Kesim", href: "/urunler?categorySlugs=etiket-kesim" },
      { name: "Fiber Markalama", href: "/urunler?categorySlugs=fiber-markalama" },
    ],
  },
  {
    name: "Malzeme & Sarf",
    subcategories: [
      { name: "Mürekkepler", href: "/urunler?categorySlugs=malzeme-sarf" },
      { name: "Baskı Malzemeleri", href: "/urunler?categorySlugs=malzeme-sarf" },
      { name: "Yedek Parçalar", href: "/urunler?categorySlugs=malzeme-sarf" },
    ],
  },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const pathname = usePathname()
  const { getTotalItems } = useCart()
  const { user: contextUser, isAuthenticated: contextIsAuthenticated, logout } = useAuth()
  const [initialUser, setInitialUser] = useState<unknown>(null)
  const [initialIsAuthenticated, setInitialIsAuthenticated] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!isInitialized) {
      const cookieUser = getCookieUser()
      const cookieAuth = isCookieAuthenticated()
      setInitialUser(cookieUser)
      setInitialIsAuthenticated(cookieAuth)
      setIsInitialized(true)
    }
  }, [isInitialized])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setMegaMenuOpen(false)
  }, [pathname])

  const user = contextUser || initialUser
  const isAuthenticated = contextIsAuthenticated || initialIsAuthenticated

  return (
    <>
      {/* Top bar */}
      <div className="bg-secondary">
        <div className="container flex items-center justify-between py-2 text-xs text-secondary-foreground">
          <div className="flex items-center gap-4">
            <a href="tel:+902125551234" className="flex items-center gap-1 hover:text-primary transition-colors">
              <Phone className="h-3 w-3" />
              +90 212 555 12 34
            </a>
            <span className="hidden sm:inline text-muted-foreground">|</span>
            <span className="hidden sm:inline text-muted-foreground">Pazartesi - Cumartesi: 09:00 - 18:00</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/hakkimizda" className="hover:text-primary transition-colors">Hakkımızda</Link>
            <Link href="/iletisim" className="hover:text-primary transition-colors">İletişim</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-card/95 backdrop-blur-md shadow-elevated" : "bg-card"
        }`}
      >
        <div className="container flex items-center justify-between py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/compass-reklam-logo.png"
              alt="Compass Reklam"
              width={170}
              height={48}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Ana Sayfa</Link>
            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <Link href="/urunler" className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors">
                Ürünler <ChevronDown className="h-3 w-3" />
              </Link>
              <AnimatePresence>
                {megaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[600px] bg-card rounded-lg shadow-elevated border border-border p-6 grid grid-cols-2 gap-6"
                  >
                    {categories.map((cat) => (
                      <div key={cat.name}>
                        <h4 className="font-display font-semibold text-sm text-foreground mb-2 border-b border-primary/30 pb-1">
                          {cat.name}
                        </h4>
                        <ul className="space-y-1">
                          {cat.subcategories.map((sub) => (
                            <li key={sub.name}>
                              <Link
                                href={sub.href}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link href="/hizmetler" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Hizmetler</Link>
            <Link href="/hakkimizda" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Hakkımızda</Link>
            <Link href="/blog" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Blog</Link>
            <Link href="/iletisim" className="text-sm font-medium text-foreground hover:text-primary transition-colors">İletişim</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            <Link href="/sepet">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold flex items-center justify-center text-primary-foreground">
                  {getTotalItems()}
                </span>
              </Button>
            </Link>
            <Link href="/teklif-al">
              <Button variant="hero" size="sm" className="hidden md:flex">
                Teklif Al
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {isAuthenticated && user ? (
                  <>
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {(user as { firstname?: string; lastname?: string }).firstname} {(user as { firstname?: string; lastname?: string }).lastname}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {(user as { email?: string }).email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Çıkış Yap
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/giris" className="cursor-pointer w-full">
                        Giriş Yap
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/kayit" className="cursor-pointer w-full">
                        Üye Ol
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-card border-t border-border overflow-hidden"
            >
              <nav className="container py-4 flex flex-col gap-3">
                <Link href="/" className="text-sm font-medium py-2">Ana Sayfa</Link>
                <Link href="/urunler" className="text-sm font-medium py-2">Ürünler</Link>
                <div className="pt-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Kategoriler</p>
                  <div className="flex flex-col gap-2">
                    <Link href="/urunler?categorySlugs=uv-baski" className="text-sm py-1">UV Baskı</Link>
                    <Link href="/urunler?categorySlugs=dijital-baski" className="text-sm py-1">Dijital Baskı</Link>
                    <Link href="/urunler?categorySlugs=plotter-folyo-kesici" className="text-sm py-1">Plotter Folyo Kesici</Link>
                    <Link href="/urunler?categorySlugs=etiket-kesim" className="text-sm py-1">Etiket Kesim</Link>
                    <Link href="/urunler?categorySlugs=fiber-markalama" className="text-sm py-1">Fiber Markalama</Link>
                    <Link href="/urunler?categorySlugs=malzeme-sarf" className="text-sm py-1">Malzeme & Sarf</Link>
                  </div>
                </div>
                <Link href="/hizmetler" className="text-sm font-medium py-2">Hizmetler</Link>
                <Link href="/hakkimizda" className="text-sm font-medium py-2">Hakkımızda</Link>
                <Link href="/blog" className="text-sm font-medium py-2">Blog</Link>
                <Link href="/iletisim" className="text-sm font-medium py-2">İletişim</Link>
                <Link href="/teklif-al">
                  <Button variant="hero" className="mt-2 w-full">Teklif Al</Button>
                </Link>
                {isAuthenticated && user ? (
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="text-sm font-medium py-2 text-left flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Çıkış Yap
                  </button>
                ) : (
                  <div className="flex gap-2 mt-2">
                    <Link href="/giris" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">Giriş Yap</Button>
                    </Link>
                    <Link href="/kayit" className="flex-1">
                      <Button variant="default" size="sm" className="w-full">Üye Ol</Button>
                    </Link>
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
