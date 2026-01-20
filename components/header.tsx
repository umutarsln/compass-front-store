"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ShoppingBag, Instagram, User, LogOut } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getUser as getCookieUser, isAuthenticated as isCookieAuthenticated } from "@/lib/auth-client"

const navItems = [
  { href: "/", label: "Anasayfa" },
  { href: "/urunler", label: "Ürünler" },
  { href: "/sevgililer-gunu", label: "Sevgililer Günü" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [initialUser, setInitialUser] = useState<any>(null)
  const [initialIsAuthenticated, setInitialIsAuthenticated] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const { getTotalItems } = useCart()
  const { user: contextUser, isAuthenticated: contextIsAuthenticated, logout } = useAuth()

  // İlk render'da cookie'den auth durumunu oku
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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Context'ten gelen user varsa onu kullan, yoksa initial user'ı kullan
  const user = contextUser || initialUser
  const isAuthenticated = contextIsAuthenticated || initialIsAuthenticated

  return (
    <>
      {/* Çıkış Butonu - Sol tarafta, dikey ortada */}
      {/* {isAuthenticated && user && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          onClick={logout}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-[50] bg-primary text-primary-foreground rounded-r-2xl shadow-2xl hover:bg-primary/90 transition-all duration-300 flex flex-col items-center justify-center gap-2 px-3 py-4 min-w-[60px] group border-r-4 border-primary hover:border-primary/50 cursor-pointer"
          aria-label="Çıkış Yap"
        >
          <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
          <span className="text-[9px] uppercase tracking-wider font-medium opacity-80">Çıkış</span>
        </motion.button>
      )} */}

      <header
        className={`fixed top-7 md:top-8 left-0 right-0 z-[49] transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
          }`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <nav className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logos/shawk-logo.svg"
                alt="Shawk Logo"
                width={180}
                height={60}
                className="h-12 md:h-14 w-auto"
                priority
              />
            </Link>

            <div className="hidden lg:flex items-center gap-10">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              {/* Sosyal Medya İkonları - Desktop'ta görünür */}
              <div className="hidden lg:flex items-center gap-2">
                <a
                  href="https://www.instagram.com/shawk.lamp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-foreground hover:text-accent transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                {/* <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-foreground hover:text-accent transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a> */}
                <a
                  href="https://wa.me/905519770858"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-foreground hover:text-accent transition-colors"
                  aria-label="WhatsApp"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </a>
              </div>

              <Link href="/sepet" className="relative flex items-center gap-2 p-2 text-foreground hover:text-accent transition-colors">
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-accent text-accent-foreground text-xs flex items-center justify-center rounded-full px-1">
                      {getTotalItems()}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline text-sm font-medium">Sepetim</span>
              </Link>

              {/* Profile Icon / Auth */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-2 text-foreground hover:text-accent hover:bg-accent/10 rounded-md transition-all cursor-pointer">
                    <User className="w-5 h-5" />
                    <span className="hidden sm:inline text-sm font-medium">
                      {isAuthenticated && user
                        ? `${user.firstname} ${user.lastname}`
                        : "Giriş Yap / Üye Ol"}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {isAuthenticated && user ? (
                    <>
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user.firstname} {user.lastname}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
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

              <button className="lg:hidden p-2 text-foreground" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </nav>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-background border-t border-border"
            >
              <div className="px-6 py-6 space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block text-lg font-medium text-foreground hover:text-accent transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Mobil Auth Linkleri */}
                {isAuthenticated && user ? (
                  <div className="pt-4 border-t border-border">
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm font-medium text-foreground">
                        {user.firstname} {user.lastname}
                      </p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      <button
                        onClick={() => {
                          logout()
                          setIsMobileMenuOpen(false)
                        }}
                        className="flex items-center gap-2 text-lg font-medium text-foreground hover:text-accent transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-border space-y-2">
                    <Link
                      href="/giris"
                      className="block text-lg font-medium text-foreground hover:text-accent transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Giriş Yap
                    </Link>
                    <Link
                      href="/kayit"
                      className="block text-lg font-medium text-foreground hover:text-accent transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Üye Ol
                    </Link>
                  </div>
                )}

                {/* Mobil Sosyal Medya İkonları */}
                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  <a
                    href="https://www.instagram.com/shawk.lamp/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-foreground hover:text-accent transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  {/* <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-foreground hover:text-accent transition-colors"
                  aria-label="TikTok"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a> */}
                  <a
                    href="https://wa.me/905519770858"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-foreground hover:text-accent transition-colors"
                    aria-label="WhatsApp"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
