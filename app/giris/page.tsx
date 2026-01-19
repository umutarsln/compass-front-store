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
import { LogIn, Loader2 } from "lucide-react"

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const { login, isAuthenticated } = useAuth()
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
        setIsLoading(true)

        try {
            await login(formData)
            toast({
                title: "Giriş Başarılı",
                description: "Hoş geldiniz!",
            })
        } catch (error: any) {
            toast({
                title: "Giriş Başarısız",
                description: error?.response?.data?.message || "Email veya şifre hatalı",
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
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Giriş Yap</p>
                            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight text-balance mb-6">
                                Hesabınıza Giriş Yapın
                            </h1>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Hesabınıza giriş yaparak alışverişe devam edebilirsiniz.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Login Form Section */}
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
                                            placeholder="Şifrenizi girin"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Giriş yapılıyor...
                                            </>
                                        ) : (
                                            <>
                                                <LogIn className="w-4 h-4 mr-2" />
                                                Giriş Yap
                                            </>
                                        )}
                                    </Button>

                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">
                                            Hesabınız yok mu?{" "}
                                            <Link href="/kayit" className="text-primary hover:underline font-medium">
                                                Üye Ol
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
