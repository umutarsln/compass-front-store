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
                <h2 className="font-serif text-3xl sm:text-4xl text-foreground">Teslimat Şartları</h2>
              </div>

              <div className="max-w-4xl">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="delivery-time">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-accent" />
                        <span>Teslimat Süresi</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-8 space-y-3 text-muted-foreground">
                        <p>
                          Siparişleriniz, ödeme onayının alınmasının ardından 1–5 iş günü içerisinde kargoya teslim edilir. 
                          Ürünlerin teslim süresi, alıcının bulunduğu adrese ve kargo firmasının çalışma koşullarına bağlı olarak değişiklik gösterebilir.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="cargo-company">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-accent" />
                        <span>Kargo Firması</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-8 space-y-3 text-muted-foreground">
                        <p>
                          Siparişler, anlaşmalı kargo firması aracılığıyla gönderilmektedir. Kargo firmasından kaynaklanan gecikmelerden firmamız sorumlu tutulamaz.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="delivery-moment">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-accent" />
                        <span>Teslimat Anı</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-8 space-y-3 text-muted-foreground">
                        <p>
                          Sipariş, alıcının belirtmiş olduğu teslimat adresinde bizzat kendisine veya adresteki yetkili kişiye teslim edilir. 
                          Teslimat sırasında paketin hasarlı olduğunun tespit edilmesi halinde, kargo görevlisine tutanak tutturulması gerekmektedir.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="missing-damaged">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-accent" />
                        <span>Eksik / Hatalı Ürün</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-8 space-y-3 text-muted-foreground">
                        <p>
                          Teslimat sırasında eksik veya hatalı ürün tespit edilmesi durumunda, en geç 3 iş günü içerisinde bizimle iletişime geçilmesi gerekmektedir.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
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
                <h2 className="font-serif text-3xl sm:text-4xl text-foreground">İade ve Cayma Koşulları</h2>
              </div>

              <div className="max-w-4xl">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="cancellation-right">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-accent" />
                        <span>Cayma Hakkı</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-8 space-y-3 text-muted-foreground">
                        <p>
                          6502 sayılı Tüketicinin Korunması Hakkında Kanun gereği, alıcı ürünü teslim aldığı tarihten itibaren 14 gün içerisinde herhangi bir gerekçe göstermeksizin cayma hakkını kullanabilir.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="return-conditions">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-accent" />
                        <span>İade Şartları</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-8 space-y-3 text-muted-foreground">
                        <p className="font-medium text-foreground mb-2">İade edilecek ürünlerin;</p>
                        <ul className="list-disc list-inside space-y-2">
                          <li>Kullanılmamış,</li>
                          <li>Orijinal ambalajında,</li>
                          <li>Tekrar satılabilir durumda</li>
                        </ul>
                        <p className="mt-3">olması gerekmektedir.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="non-returnable">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-3">
                        <RefreshCw className="w-5 h-5 text-accent" />
                        <span>İade Kapsamı Dışındaki Ürünler</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-8 space-y-3 text-muted-foreground">
                        <p className="mb-2">Aşağıdaki ürünlerde cayma hakkı kullanılamaz:</p>
                        <ul className="list-disc list-inside space-y-2">
                          <li>Kişiye özel üretilen ürünler</li>
                          <li>Hijyen sebebiyle iadesi uygun olmayan ürünler</li>
                          <li>Kullanılmış veya zarar görmüş ürünler</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="return-process">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-accent" />
                        <span>İade Süreci</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-8 space-y-3 text-muted-foreground">
                        <p>
                          Cayma hakkının kullanılması durumunda, iade talebi tarafımıza iletildikten sonra ürün, anlaşmalı kargo firması ile gönderilmelidir. 
                          İade edilen ürün tarafımıza ulaştıktan sonra 14 gün içerisinde ücret iadesi yapılır.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="refund">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-accent" />
                        <span>Ücret İadesi</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-8 space-y-3 text-muted-foreground">
                        <p>
                          Ücret iadesi, ödeme yapılan yöntemle aynı şekilde gerçekleştirilmektedir. Banka kaynaklı gecikmeler firmamızın sorumluluğunda değildir.
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
