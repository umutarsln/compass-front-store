"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Shield, Lock, Eye, FileText } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="pt-26 md:pt-[108px]">
        {/* Hero Section */}
        <section className="relative pt-24 pb-12 bg-background overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Gizlilik Politikası</p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight text-balance mb-6">
                Gizlilik ve Güvenlik
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Kişisel verilerinizin korunması bizim için önemlidir. Gizlilik politikamız hakkında tüm detaylar burada.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <section className="py-24 bg-background">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="prose prose-lg max-w-none"
            >
              <div className="space-y-8">
                {/* Veri Toplama */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">Veri Toplama</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Shawk olarak, hizmetlerimizi sunabilmek için aşağıdaki kişisel verileri topluyoruz:
                  </p>
                  <ul className="mt-4 space-y-2 text-muted-foreground list-disc list-inside">
                    <li>Ad, soyad ve iletişim bilgileri (e-posta, telefon, adres)</li>
                    <li>Sipariş ve ödeme bilgileri</li>
                    <li>Ürün tercihleri ve alışveriş geçmişi</li>
                    <li>Web sitesi kullanım verileri (çerezler, IP adresi)</li>
                    <li>Kişiselleştirme için yüklenen fotoğraflar ve içerikler</li>
                  </ul>
                </div>

                {/* Veri Kullanımı */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <Eye className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">Veri Kullanımı</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Topladığımız verileri aşağıdaki amaçlarla kullanıyoruz:
                  </p>
                  <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                    <li>Siparişlerinizi işlemek ve teslim etmek</li>
                    <li>Müşteri hizmetleri sağlamak</li>
                    <li>Ürün ve hizmetlerimizi geliştirmek</li>
                    <li>Yasal yükümlülüklerimizi yerine getirmek</li>
                    <li>Size özel kampanya ve teklifler sunmak (izin verdiğiniz takdirde)</li>
                    <li>Web sitesi deneyimini iyileştirmek</li>
                  </ul>
                </div>

                {/* Veri Güvenliği */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <Lock className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">Veri Güvenliği</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Kişisel verilerinizin güvenliğini sağlamak için endüstri standardı güvenlik önlemleri alıyoruz. 
                    Tüm ödeme işlemleri SSL şifreleme ile korunmaktadır. Verileriniz yalnızca yetkili personel 
                    tarafından erişilebilir ve üçüncü taraflarla paylaşılmaz.
                  </p>
                </div>

                {/* Çerezler */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <Shield className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">Çerezler (Cookies)</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Web sitemiz, kullanıcı deneyimini iyileştirmek için çerezler kullanmaktadır. Çerezler:
                  </p>
                  <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                    <li>Oturum yönetimi için kullanılır</li>
                    <li>Tercihlerinizi hatırlamamıza yardımcı olur</li>
                    <li>Site performansını analiz etmemize olanak sağlar</li>
                    <li>Kişiselleştirilmiş içerik sunmamıza yardımcı olur</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz, ancak bu durumda bazı özellikler düzgün çalışmayabilir.
                  </p>
                </div>

                {/* Veri Paylaşımı */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <Shield className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">Üçüncü Taraf Paylaşımı</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Kişisel verilerinizi, yalnızca hizmetlerimizi sunabilmek için gerekli olan durumlarda 
                    güvenilir üçüncü taraflarla paylaşıyoruz (kargo firmaları, ödeme işlemcileri). Bu 
                    paylaşımlar KVKK ve GDPR uyumlu olarak gerçekleştirilmektedir.
                  </p>
                </div>

                {/* Haklarınız */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <Shield className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">Haklarınız</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    KVKK kapsamında aşağıdaki haklara sahipsiniz:
                  </p>
                  <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                    <li>Kişisel verilerinize erişim hakkı</li>
                    <li>Kişisel verilerinizin düzeltilmesini talep etme hakkı</li>
                    <li>Kişisel verilerinizin silinmesini talep etme hakkı</li>
                    <li>Kişisel verilerinizin işlenmesine itiraz etme hakkı</li>
                    <li>Kişisel verilerinizin aktarılmasını talep etme hakkı</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    Bu haklarınızı kullanmak için bizimle iletişime geçebilirsiniz.
                  </p>
                </div>

                {/* Değişiklikler */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">Politika Değişiklikleri</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Gizlilik politikamız zaman zaman güncellenebilir. Önemli değişikliklerde size bildirim 
                    göndereceğiz. Güncel politika her zaman web sitemizde yayınlanmaktadır.
                  </p>
                </div>

                {/* İletişim */}
                <div className="bg-accent/10 p-6 rounded-lg border border-accent/20">
                  <h3 className="font-semibold text-foreground mb-2">Sorularınız mı var?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Gizlilik politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz.
                  </p>
                  <a
                    href="/iletisim"
                    className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                  >
                    İletişim Sayfasına Git →
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
