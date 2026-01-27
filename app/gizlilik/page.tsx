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
                Gizlilik ve Kişisel Verilerin Korunması Politikası
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Bu Gizlilik ve Kişisel Verilerin Korunması Politikası ("Politika"), Shawk tarafından işletilen internet sitesi üzerinden elde edilen kişisel verilerin kullanımına ve korunmasına ilişkin esasları düzenler.
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
                {/* 1. Toplanan Kişisel Veriler */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">1. Toplanan Kişisel Veriler</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Sitemiz üzerinden sunulan hizmetler kapsamında aşağıdaki kişisel veriler toplanabilmektedir:
                  </p>
                  <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                    <li>Ad, soyad</li>
                    <li>Telefon numarası</li>
                    <li>E-posta adresi</li>
                    <li>Teslimat ve fatura adresi</li>
                    <li>IP adresi ve site kullanım bilgileri</li>
                    <li>Ödeme işlemlerine ilişkin bilgiler (kart bilgileri saklanmaz)</li>
                  </ul>
                </div>

                {/* 2. Kişisel Verilerin Toplanma Yöntemi */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <Eye className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">2. Kişisel Verilerin Toplanma Yöntemi</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Kişisel veriler;
                  </p>
                  <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                    <li>Üyelik ve sipariş formları,</li>
                    <li>İletişim formları,</li>
                    <li>Çerezler (cookies),</li>
                    <li>Site kullanımı sırasında otomatik yollarla</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    toplanmaktadır.
                  </p>
                </div>

                {/* 3. Kişisel Verilerin İşlenme Amaçları */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <Shield className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">3. Kişisel Verilerin İşlenme Amaçları</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Toplanan kişisel veriler aşağıdaki amaçlarla işlenmektedir:
                  </p>
                  <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                    <li>Sipariş süreçlerinin yürütülmesi</li>
                    <li>Ödeme işlemlerinin gerçekleştirilmesi</li>
                    <li>Teslimat ve faturalandırma işlemleri</li>
                    <li>Müşteri destek hizmetlerinin sağlanması</li>
                    <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                    <li>Site güvenliğinin sağlanması</li>
                  </ul>
                </div>

                {/* 4. Kişisel Verilerin Aktarılması */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <Shield className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">4. Kişisel Verilerin Aktarılması</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Kişisel veriler;
                  </p>
                  <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                    <li>Ödeme altyapısı sağlayıcısı iyzico,</li>
                    <li>Anlaşmalı kargo firmaları,</li>
                    <li>Yetkili kamu kurumları</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    ile yalnızca hizmetin gerektirdiği ölçüde paylaşılmaktadır.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    Kredi kartı bilgileri firmamız tarafından kesinlikle saklanmaz, tüm ödeme işlemleri iyzico'nun güvenli altyapısı üzerinden gerçekleştirilir.
                  </p>
                </div>

                {/* 5. Kişisel Verilerin Saklama Süresi */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <Lock className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">5. Kişisel Verilerin Saklama Süresi</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Kişisel veriler, ilgili mevzuatta öngörülen süreler boyunca veya işlenme amacının gerektirdiği süre ile sınırlı olarak saklanmaktadır. Süre sonunda veriler silinir, yok edilir veya anonim hale getirilir.
                  </p>
                </div>

                {/* 6. Çerez (Cookie) Politikası */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <Shield className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">6. Çerez (Cookie) Politikası</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Sitemizde kullanıcı deneyimini geliştirmek amacıyla çerezler kullanılmaktadır. Tarayıcı ayarlarınızdan çerez kullanımını reddedebilirsiniz; ancak bu durumda sitenin bazı fonksiyonları düzgün çalışmayabilir.
                  </p>
                </div>

                {/* 7. Kişisel Veri Sahibinin Hakları */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <Shield className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">7. Kişisel Veri Sahibinin Hakları</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    6698 sayılı KVKK'nın 11. maddesi uyarınca veri sahipleri;
                  </p>
                  <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                    <li>Kişisel verilerinin işlenip işlenmediğini öğrenme</li>
                    <li>İşlenmişse buna ilişkin bilgi talep etme</li>
                    <li>Amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                    <li>Yanlış veya eksik işlenen verilerin düzeltilmesini isteme</li>
                    <li>Verilerin silinmesini veya yok edilmesini talep etme</li>
                    <li>İşlemenin kanuna aykırı olması halinde zararın giderilmesini talep etme</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    haklarına sahiptir.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    Bu haklara ilişkin talepler, aşağıdaki iletişim bilgileri üzerinden tarafımıza iletilebilir.
                  </p>
                </div>

                {/* 8. Veri Güvenliği */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <Lock className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">8. Veri Güvenliği</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Kişisel verilerin güvenliğinin sağlanması amacıyla;
                  </p>
                  <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                    <li>SSL sertifikası,</li>
                    <li>Güvenli sunucu altyapısı,</li>
                    <li>Yetkisiz erişim önleyici teknik ve idari tedbirler</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    uygulanmaktadır.
                  </p>
                </div>

                {/* 9. Politika Değişiklikleri */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">9. Politika Değişiklikleri</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Firmamız, işbu Gizlilik Politikası'nı güncelleme hakkını saklı tutar. Güncellenen metinler sitede yayımlandığı tarihte yürürlüğe girer.
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
