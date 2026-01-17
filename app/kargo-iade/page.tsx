"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Package, Truck, RefreshCw, Shield } from "lucide-react"

export default function ShippingReturnsPage() {
  return (
    <>
      <Header />
      <main className="pt-26 md:pt-[108px]">
        {/* Hero Section */}
        <section className="relative py-24 bg-background overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Kargo & İade</p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight text-balance mb-6">
                Kargo ve İade Politikamız
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Siparişlerinizin güvenli bir şekilde size ulaşması ve memnun kalmadığınız durumlarda kolay iade süreci için tüm detaylar burada.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Shipping Information */}
        <section className="py-24 bg-secondary">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-accent/10 rounded-md flex items-center justify-center">
                  <Truck className="w-6 h-6 text-accent" />
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl text-foreground">Kargo Bilgileri</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-background p-6 rounded-lg">
                  <h3 className="font-semibold text-foreground text-lg mb-3">Kargo Süresi</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Siparişleriniz onaylandıktan sonra 1-3 iş günü içinde hazırlanır ve kargoya verilir. 
                    Kargo süresi adresinize göre 2-5 iş günü arasında değişmektedir.
                  </p>
                </div>

                <div className="bg-background p-6 rounded-lg">
                  <h3 className="font-semibold text-foreground text-lg mb-3">Kargo Ücreti</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    500 TL ve üzeri siparişlerde kargo ücretsizdir. 500 TL altındaki siparişlerde 
                    standart kargo ücreti 50 TL'dir. Hızlı kargo seçeneği mevcuttur.
                  </p>
                </div>

                <div className="bg-background p-6 rounded-lg">
                  <h3 className="font-semibold text-foreground text-lg mb-3">Kargo Takibi</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Siparişiniz kargoya verildiğinde e-posta ve SMS ile kargo takip numaranızı 
                    size iletiriz. Sipariş durumunuzu web sitemizden de takip edebilirsiniz.
                  </p>
                </div>

                <div className="bg-background p-6 rounded-lg">
                  <h3 className="font-semibold text-foreground text-lg mb-3">Teslimat</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Ürünleriniz özenle paketlenir ve güvenli bir şekilde adresinize teslim edilir. 
                    Teslimat sırasında ürünü kontrol etmenizi öneririz.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Returns Information */}
        <section className="py-24 bg-background">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-accent/10 rounded-md flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-accent" />
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl text-foreground">İade Koşulları</h2>
              </div>

              <div className="max-w-4xl">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="return-policy">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-accent" />
                        <span>İade Hakkı</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-8 space-y-3 text-muted-foreground">
                        <p>
                          Ürünlerinizi teslim aldığınız tarihten itibaren 14 gün içinde iade edebilirsiniz. 
                          İade için ürünün orijinal ambalajında, hasarsız ve kullanılmamış olması gerekmektedir.
                        </p>
                        <p>
                          Kişiselleştirilmiş ürünlerde (fotoğraf, yazı vb. eklenen) iade hakkı bulunmamaktadır, 
                          ancak üretim hatası veya hasarlı teslimat durumunda iade kabul edilir.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="return-process">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-accent" />
                        <span>İade Süreci</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-8 space-y-3 text-muted-foreground">
                        <ol className="list-decimal list-inside space-y-2">
                          <li>İade talebinizi web sitemizden veya müşteri hizmetlerimizden oluşturun.</li>
                          <li>Size gönderilecek iade kargo etiketini ürünün üzerine yapıştırın.</li>
                          <li>Ürünü orijinal ambalajında, hasarsız şekilde kargoya verin.</li>
                          <li>Ürün kontrol edildikten sonra ödeme 3-5 iş günü içinde iade edilir.</li>
                        </ol>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="return-shipping">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-accent" />
                        <span>İade Kargo Ücreti</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-8 space-y-3 text-muted-foreground">
                        <p>
                          Üretim hatası veya yanlış ürün gönderimi durumunda iade kargo ücreti tarafımızca karşılanır.
                        </p>
                        <p>
                          Müşteri kaynaklı iadelerde (beğenmeme, yanlış sipariş vb.) iade kargo ücreti müşteriye aittir.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="exchange">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-3">
                        <RefreshCw className="w-5 h-5 text-accent" />
                        <span>Değişim</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-8 space-y-3 text-muted-foreground">
                        <p>
                          Ürün değişimi için önce iade işlemini tamamlamanız, ardından yeni ürünü sipariş etmeniz gerekmektedir.
                        </p>
                        <p>
                          Aynı fiyatlı ürünlerde değişim yapılabilir. Fiyat farkı varsa ek ödeme veya iade işlemi yapılır.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <div className="mt-12 p-6 bg-secondary rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">İade İşlemleri İçin</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  İade işlemlerinizle ilgili sorularınız için müşteri hizmetlerimizle iletişime geçebilirsiniz.
                </p>
                <a
                  href="/iletisim"
                  className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                >
                  İletişim Sayfasına Git →
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
