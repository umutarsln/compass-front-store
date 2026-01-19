"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { UserPlus, Loader2 } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { register, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Eğer zaten giriş yapılmışsa ana sayfaya yönlendir
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Şifre kontrolü
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Hata",
        description: "Şifreler eşleşmiyor",
        variant: "destructive",
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Hata",
        description: "Şifre en az 6 karakter olmalıdır",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const { confirmPassword, ...registerData } = formData
      console.log("Register data:", registerData)
      await register(registerData)
      toast({
        title: "Kayıt Başarılı",
        description: "Hesabınız oluşturuldu ve giriş yapıldı!",
      })
    } catch (error: any) {
      console.error("Register error:", error)
      const errorMessage = 
        error?.response?.data?.message || 
        error?.message || 
        "Kayıt işlemi başarısız oldu. Lütfen tekrar deneyin."
      toast({
        title: "Kayıt Başarısız",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <>
      <Header />
      <main className="pt-26 md:pt-[108px]">
        {/* Hero Section */}
        <section className="relative py-12 bg-background overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Üye Ol</p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight text-balance mb-6">
                Yeni Hesap Oluşturun
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Hemen üye olun ve özel kampanyalardan haberdar olun.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Register Form Section */}
        <section className="pt-12 pb-24 bg-background">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-md mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="firstname" className="block text-sm font-medium text-foreground mb-2">
                      Ad <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="text"
                      id="firstname"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleChange}
                      required
                      placeholder="Adınız"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="lastname" className="block text-sm font-medium text-foreground mb-2">
                      Soyad <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="text"
                      id="lastname"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                      required
                      placeholder="Soyadınız"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      E-posta Adresi <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="ornek@email.com"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                      Şifre <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="En az 6 karakter"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                      Şifre Tekrar <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Şifrenizi tekrar girin"
                      disabled={isLoading}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Kayıt yapılıyor...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Üye Ol
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Zaten hesabınız var mı?{" "}
                      <Link href="/giris" className="text-primary hover:underline font-medium">
                        Giriş Yap
                      </Link>
                    </p>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
