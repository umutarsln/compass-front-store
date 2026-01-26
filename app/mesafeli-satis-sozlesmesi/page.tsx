"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FileText, User, Package, CreditCard, Truck, RotateCcw, AlertCircle, Scale } from "lucide-react"

export default function MesafeliSatisSozlesmesiPage() {
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
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Mesafeli Satış Sözleşmesi</p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight text-balance mb-6">
                Mesafeli Satış Sözleşmesi
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                İşbu Mesafeli Satış Sözleşmesi ("Sözleşme"), aşağıda bilgileri yer alan Satıcı ile Alıcı arasında, elektronik ortamda kurulmuştur.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contract Content */}
        <section className="py-24 bg-background">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="prose prose-lg max-w-none"
            >
              <div className="space-y-8">
                {/* 1. TARAFLAR */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <User className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">1. TARAFLAR</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">SATICI</h3>
                      <ul className="space-y-1 text-muted-foreground text-sm">
                        <li><span className="font-medium">Firma Unvanı:</span> AMEAN BİLGİSAYAR ENERJİ TURİZM GIDA SANAYİ VE TİCARET LİMİTED ŞİRKETİ</li>
                        <li><span className="font-medium">Adres:</span>Gençlik Mah. Tevfik Işık Cad. 2.Kural Apt. No:13/B Muratpaşa/Antalya - Posta Kodu: 07100</li>
                        <li><span className="font-medium">Telefon:</span> 0551 977 08 58</li>
                        <li><span className="font-medium">E-Posta:</span> info@shawk.com.tr</li>
                        <li><span className="font-medium">Web Sitesi:</span> www.shawk.com.tr</li>
                      </ul>
                    </div>
                    
                    <div className="pt-4 border-t border-border">
                      <h3 className="font-semibold text-foreground mb-2">ALICI</h3>
                      <ul className="space-y-1 text-muted-foreground text-sm">
                        <li><span className="font-medium">Adı Soyadı:</span> Sipariş sırasında beyan edilen bilgiler</li>
                        <li><span className="font-medium">Adres:</span> Sipariş sırasında beyan edilen adres</li>
                        <li><span className="font-medium">Telefon / E-posta:</span> Sipariş sırasında beyan edilen bilgiler</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 2. SÖZLEŞMENİN KONUSU */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">2. SÖZLEŞMENİN KONUSU</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    İşbu sözleşmenin konusu, Alıcı'nın Satıcı'ya ait internet sitesi üzerinden elektronik ortamda sipariş verdiği ürün/hizmetin satışı ve teslimine ilişkin tarafların hak ve yükümlülüklerinin belirlenmesidir.
                  </p>
                </div>

                {/* 3. SÖZLEŞME KONUSU ÜRÜN BİLGİLERİ */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <Package className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">3. SÖZLEŞME KONUSU ÜRÜN BİLGİLERİ</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-muted-foreground border-collapse">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-3 font-medium text-foreground">Ürün/Hizmet Adı</th>
                          <th className="text-center py-2 px-3 font-medium text-foreground">Adet</th>
                          <th className="text-right py-2 px-3 font-medium text-foreground">Birim Fiyatı</th>
                          <th className="text-right py-2 px-3 font-medium text-foreground">Ara Toplam</th>
                          <th className="text-right py-2 px-3 font-medium text-foreground">Kargo Ücreti</th>
                          <th className="text-right py-2 px-3 font-medium text-foreground">Toplam Satış Bedeli</th>
                          <th className="text-center py-2 px-3 font-medium text-foreground">Ödeme Şekli</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td colSpan={7} className="py-4 px-3 text-center text-muted-foreground">
                            Bu bilgiler sipariş sırasında Alıcı tarafından onaylanmıştır.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 4. ÖDEME VE FATURALANDIRMA */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">4. ÖDEME VE FATURALANDIRMA</h2>
                  </div>
                  <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                    <li>Ödeme işlemleri, iyzico altyapısı üzerinden güvenli şekilde gerçekleştirilmektedir.</li>
                    <li>Kredi kartı bilgileri Satıcı tarafından saklanmaz ve kaydedilmez.</li>
                    <li>Fatura, Alıcı'nın sipariş sırasında bildirdiği fatura bilgilerine göre düzenlenir.</li>
                  </ul>
                </div>

                {/* 5. TESLİMAT ŞARTLARI */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <Truck className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">5. TESLİMAT ŞARTLARI</h2>
                  </div>
                  <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                    <li>Ürünler, ödeme onayını takiben 1–5 iş günü içerisinde kargoya teslim edilir.</li>
                    <li>Teslimat, Alıcı'nın sipariş sırasında belirtmiş olduğu adrese yapılır.</li>
                    <li>Kargo firmasından kaynaklanan gecikmelerden Satıcı sorumlu değildir.</li>
                    <li>Teslimat sırasında hasarlı paketler için kargo görevlisine tutanak tutturulması gerekmektedir.</li>
                  </ul>
                </div>

                {/* 6. CAYMA HAKKI */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <RotateCcw className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">6. CAYMA HAKKI</h2>
                  </div>
                  <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                    <li>Alıcı, ürünü teslim aldığı tarihten itibaren 14 gün içerisinde herhangi bir gerekçe göstermeksizin cayma hakkını kullanabilir.</li>
                    <li>Cayma hakkının kullanılması için bu süre içerisinde Satıcı'ya yazılı bildirimde bulunulması gerekmektedir.</li>
                  </ul>
                </div>

                {/* 7. CAYMA HAKKININ KULLANILAMAYACAĞI DURUMLAR */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">7. CAYMA HAKKININ KULLANILAMAYACAĞI DURUMLAR</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Aşağıdaki ürünlerde cayma hakkı kullanılamaz:
                  </p>
                  <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                    <li>Alıcıya özel olarak üretilen ürünler</li>
                    <li>Hijyen sebebiyle iadesi uygun olmayan ürünler</li>
                    <li>Kullanılmış, zarar görmüş veya tekrar satılamayacak ürünler</li>
                  </ul>
                </div>

                {/* 8. İADE VE ÜCRET İADESİ */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <RotateCcw className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">8. İADE VE ÜCRET İADESİ</h2>
                  </div>
                  <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                    <li>Cayma hakkı kapsamında iade edilen ürün, Satıcı'ya ulaştıktan sonra 14 gün içerisinde ücret iadesi yapılır.</li>
                    <li>Ücret iadesi, ödeme yapılan yöntemle aynı şekilde gerçekleştirilir.</li>
                    <li>Banka veya ödeme kuruluşu kaynaklı gecikmeler Satıcı'nın sorumluluğunda değildir.</li>
                  </ul>
                </div>

                {/* 9. MÜCBİR SEBEPLER */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">9. MÜCBİR SEBEPLER</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Tarafların kontrolü dışında gelişen; doğal afetler, savaş, grev, altyapı arızaları gibi durumlar mücbir sebep olarak kabul edilir. Bu hallerde taraflar yükümlülüklerinden sorumlu tutulamaz.
                  </p>
                </div>

                {/* 10. YETKİLİ MAHKEME */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <Scale className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">10. YETKİLİ MAHKEME</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    İşbu sözleşmenin uygulanmasında, T.C. Ticaret Bakanlığı tarafından ilan edilen parasal sınırlara göre Alıcı'nın yerleşim yerindeki veya Satıcı'nın bulunduğu yerdeki Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.
                  </p>
                </div>

                {/* 11. YÜRÜRLÜK */}
                <div className="bg-secondary p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground">11. YÜRÜRLÜK</h2>
                  </div>
                  <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                    <li>Alıcı, işbu sözleşmede yer alan tüm koşulları okuduğunu, anladığını ve elektronik ortamda onayladığını kabul eder.</li>
                    <li>Siparişin tamamlanmasıyla birlikte işbu sözleşme yürürlüğe girer.</li>
                  </ul>
                </div>

                {/* İletişim */}
                <div className="bg-accent/10 p-6 rounded-lg border border-accent/20">
                  <h3 className="font-semibold text-foreground mb-2">Sorularınız mı var?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Mesafeli satış sözleşmesi hakkında sorularınız için bizimle iletişime geçebilirsiniz.
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
