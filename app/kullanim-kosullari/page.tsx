"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FileText, AlertCircle, CheckCircle, XCircle, Shield } from "lucide-react"

export default function TermsOfServicePage() {
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
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Kullanım Koşulları</p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight text-balance mb-6">
                Kullanım Şartları ve Koşulları
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Shawk web sitesini kullanarak, aşağıdaki kullanım koşullarını kabul etmiş sayılırsınız.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-24 bg-background">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="prose prose-lg max-w-none"
            >
              <div className="space-y-8">
                {/* Genel Koşullar */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">Genel Koşullar</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Shawk web sitesini ziyaret ederek ve hizmetlerimizi kullanarak, aşağıdaki kullanım koşullarını 
                    kabul etmiş sayılırsınız. Bu koşulları kabul etmiyorsanız, lütfen web sitemizi kullanmayın.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Bu koşullar, web sitemizin kullanımı, sipariş verme süreci, ürünlerimiz ve hizmetlerimizle 
                    ilgili tüm hak ve yükümlülükleri kapsar.
                  </p>
                </div>

                {/* Hesap ve Sipariş */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">Hesap ve Sipariş</h2>
                  </div>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-accent">•</span>
                      <span>Sipariş verirken doğru ve güncel bilgileri sağlamak sizin sorumluluğunuzdadır.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-accent">•</span>
                      <span>Siparişleriniz onaylandıktan sonra iptal edilebilir, ancak üretime başlanmış ürünlerde iptal yapılamaz.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-accent">•</span>
                      <span>Fiyatlar ve ürün bilgileri önceden haber verilmeksizin değiştirilebilir.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-accent">•</span>
                      <span>Stok durumu gerçek zamanlı olarak güncellenir, ancak nadir durumlarda stok tükenmesi yaşanabilir.</span>
                    </li>
                  </ul>
                </div>

                {/* Kişiselleştirme */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">Kişiselleştirme ve İçerik</h2>
                  </div>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-accent">•</span>
                      <span>Yüklediğiniz fotoğraflar ve içerikler yalnızca ürün üretimi için kullanılır.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-accent">•</span>
                      <span>Telif hakkı ihlali içeren içerikler yükleyemezsiniz. Bu durumda sorumluluk size aittir.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-accent">•</span>
                      <span>Kişiselleştirilmiş ürünlerde değişiklik yapılamaz ve iade hakkı bulunmamaktadır (üretim hatası hariç).</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-accent">•</span>
                      <span>Uygunsuz içerikler (şiddet, cinsellik, nefret söylemi vb.) kabul edilmez.</span>
                    </li>
                  </ul>
                </div>

                {/* Ödeme */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <Shield className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">Ödeme ve Faturalama</h2>
                  </div>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-accent">•</span>
                      <span>Tüm ödemeler güvenli ödeme altyapısı ile gerçekleştirilir.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-accent">•</span>
                      <span>Fiyatlar KDV dahil olarak gösterilir.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-accent">•</span>
                      <span>Sipariş onaylandıktan sonra ödeme işlemi gerçekleştirilir.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-accent">•</span>
                      <span>Fatura bilgilerinizi sipariş sırasında doğru şekilde girmeniz gerekmektedir.</span>
                    </li>
                  </ul>
                </div>

                {/* Fikri Mülkiyet */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <Shield className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">Fikri Mülkiyet</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Web sitemizdeki tüm içerikler (metin, görseller, logolar, tasarımlar) Shawk'a aittir ve 
                    telif hakkı koruması altındadır. İzinsiz kullanım, kopyalama veya dağıtım yasaktır.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Ürünlerimizde kullandığınız içeriklerin (fotoğraflar, metinler) size ait olduğunu veya 
                    kullanım izniniz olduğunu kabul etmiş sayılırsınız.
                  </p>
                </div>

                {/* Sorumluluk Reddi */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">Sorumluluk Reddi</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Shawk, web sitesinin kesintisiz ve hatasız çalışmasını garanti etmez. Aşağıdaki durumlarda 
                    sorumluluk kabul etmeyiz:
                  </p>
                  <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                    <li>Teknik arızalar ve kesintiler</li>
                    <li>Üçüncü taraf hizmetlerindeki sorunlar</li>
                    <li>Kullanıcı hatalarından kaynaklanan sorunlar</li>
                    <li>Yanlış veya eksik bilgi girişinden kaynaklanan sorunlar</li>
                  </ul>
                </div>

                {/* Değişiklikler */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">Koşul Değişiklikleri</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Kullanım koşullarımız zaman zaman güncellenebilir. Önemli değişikliklerde size bildirim 
                    göndereceğiz. Güncel koşullar her zaman web sitemizde yayınlanmaktadır. Değişikliklerden 
                    sonra web sitemizi kullanmaya devam etmeniz, güncellenmiş koşulları kabul ettiğiniz 
                    anlamına gelir.
                  </p>
                </div>

                {/* Uygulanacak Hukuk */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <Shield className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">Uygulanacak Hukuk</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Bu kullanım koşulları Türkiye Cumhuriyeti yasalarına tabidir. Herhangi bir uyuşmazlık 
                    durumunda Türkiye mahkemeleri yetkilidir.
                  </p>
                </div>

                {/* İletişim */}
                <div className="bg-accent/10 p-6 rounded-lg border border-accent/20">
                  <h3 className="font-semibold text-foreground mb-2">Sorularınız mı var?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Kullanım koşulları hakkında sorularınız için bizimle iletişime geçebilirsiniz.
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
