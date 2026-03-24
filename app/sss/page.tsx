"use client"

import { motion } from "framer-motion"
import { Footer } from "@/components/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, Package, ShoppingBag, Truck, CreditCard, Heart, RefreshCw } from "lucide-react"

const faqCategories = [
  {
    id: "products",
    title: "Ürünler",
    icon: Package,
    questions: [
      {
        question: "Ürünleriniz nasıl üretiliyor?",
        answer: "Ürünlerimiz 3D baskı teknolojisi kullanılarak üretilmektedir. Fotoğraflarınızı veya tasarımlarınızı yükledikten sonra, özel yazılımımız ile 3D model oluşturulur ve yüksek kaliteli malzemelerle baskı alınır. Her ürün özenle işlenir ve kalite kontrolünden geçer.",
      },
      {
        question: "Hangi boyutlarda ürünler mevcut?",
        answer: "Ürünlerimiz farklı boyutlarda mevcuttur. Standart boyutlar: Küçük (15x15cm), Orta (20x20cm), Büyük (25x25cm). Özel boyut talepleriniz için lütfen bizimle iletişime geçin.",
      },
      {
        question: "Ürünlerde hangi renkler kullanılıyor?",
        answer: "LED lambalarımız çok renkli RGB özelliğine sahiptir. Uzaktan kumanda ile renk değiştirebilir, parlaklık ayarı yapabilir ve farklı ışık efektleri seçebilirsiniz. Ayrıca sıcak beyaz ve soğuk beyaz modları da mevcuttur.",
      },
      {
        question: "Kişiselleştirme nasıl yapılıyor?",
        answer: "Ürün sayfasında fotoğrafınızı yükleyebilir, yazı ekleyebilir ve tasarımınızı özelleştirebilirsiniz. Tasarımınızı onayladıktan sonra üretime geçilir. Kişiselleştirilmiş ürünlerde değişiklik yapılamaz, bu yüzden sipariş vermeden önce tasarımınızı kontrol etmenizi öneririz.",
      },
    ],
  },
  {
    id: "orders",
    title: "Sipariş",
    icon: ShoppingBag,
    questions: [
      {
        question: "Sipariş nasıl verilir?",
        answer: "Ürün sayfasında istediğiniz ürünü seçin, kişiselleştirme seçeneklerini doldurun ve sepete ekleyin. Sepetinizdeki ürünleri kontrol edip ödeme sayfasına geçin. Ödeme bilgilerinizi girip siparişinizi tamamlayın.",
      },
      {
        question: "Siparişimi nasıl takip edebilirim?",
        answer: "Siparişiniz onaylandıktan sonra size bir sipariş numarası gönderilir. Bu numara ile web sitemizden sipariş durumunuzu takip edebilirsiniz. Ayrıca her aşamada e-posta ve SMS ile bilgilendirilirsiniz.",
      },
      {
        question: "Siparişimi iptal edebilir miyim?",
        answer: "Üretime başlanmamış siparişlerinizi iptal edebilirsiniz. Üretime başlanmış veya kişiselleştirilmiş ürünlerde iptal yapılamaz. İptal talebiniz için lütfen müşteri hizmetlerimizle iletişime geçin.",
      },
      {
        question: "Siparişim ne zaman hazır olur?",
        answer: "Standart ürünler 1-3 iş günü içinde hazırlanır. Kişiselleştirilmiş ürünlerde bu süre 3-5 iş gününe çıkabilir. Yoğun dönemlerde süre uzayabilir, bu durumda size bilgi verilir.",
      },
    ],
  },
  {
    id: "shipping",
    title: "Kargo",
    icon: Truck,
    questions: [
      {
        question: "Kargo süresi ne kadar?",
        answer: "Siparişleriniz hazırlandıktan sonra 1-3 iş günü içinde kargoya verilir. Kargo süresi adresinize göre 2-5 iş günü arasında değişmektedir. Hızlı kargo seçeneği ile bu süre kısaltılabilir.",
      },
      {
        question: "Kargo ücreti ne kadar?",
        answer: "500 TL ve üzeri siparişlerde kargo ücretsizdir. 500 TL altındaki siparişlerde standart kargo ücreti 50 TL'dir. Hızlı kargo seçeneği için ek ücret alınır.",
      },
      {
        question: "Hangi kargo firması kullanılıyor?",
        answer: "Güvenilir kargo firmaları ile çalışıyoruz. Siparişiniz kargoya verildiğinde size kargo takip numaranız gönderilir ve hangi firma ile gönderildiği belirtilir.",
      },
      {
        question: "Yurtdışına kargo yapılıyor mu?",
        answer: "Şu an için sadece Türkiye içi kargo hizmeti vermekteyiz. Yurtdışı kargo hizmeti için lütfen bizimle iletişime geçin.",
      },
    ],
  },
  {
    id: "returns",
    title: "İade",
    icon: RefreshCw,
    questions: [
      {
        question: "İade süresi ne kadar?",
        answer: "Ürünlerinizi teslim aldığınız tarihten itibaren 14 gün içinde iade edebilirsiniz. İade için ürünün orijinal ambalajında, hasarsız ve kullanılmamış olması gerekmektedir.",
      },
      {
        question: "Kişiselleştirilmiş ürünlerde iade yapılabilir mi?",
        answer: "Kişiselleştirilmiş ürünlerde (fotoğraf, yazı vb. eklenen) normal iade hakkı bulunmamaktadır. Ancak üretim hatası veya hasarlı teslimat durumunda iade kabul edilir.",
      },
      {
        question: "İade ücreti kim ödüyor?",
        answer: "Üretim hatası veya yanlış ürün gönderimi durumunda iade kargo ücreti tarafımızca karşılanır. Müşteri kaynaklı iadelerde (beğenmeme, yanlış sipariş vb.) iade kargo ücreti müşteriye aittir.",
      },
      {
        question: "Para iadesi ne zaman yapılıyor?",
        answer: "İade edilen ürün kontrol edildikten sonra ödeme 3-5 iş günü içinde iade edilir. İade işlemi aynı ödeme yöntemi ile yapılır.",
      },
    ],
  },
  {
    id: "payment",
    title: "Ödeme",
    icon: CreditCard,
    questions: [
      {
        question: "Hangi ödeme yöntemleri kabul ediliyor?",
        answer: "Kredi kartı, banka kartı, havale/EFT ve kapıda ödeme seçenekleri mevcuttur. Tüm ödeme işlemleri güvenli ödeme altyapısı ile gerçekleştirilir.",
      },
      {
        question: "Ödeme güvenli mi?",
        answer: "Evet, tüm ödeme işlemleri SSL sertifikası ile korunmaktadır. Kredi kartı bilgileriniz saklanmaz ve güvenli ödeme altyapısı kullanılır.",
      },
      {
        question: "Taksit yapılabiliyor mu?",
        answer: "Kredi kartı ile yapılan ödemelerde bankanızın taksit seçenekleri geçerlidir. Taksit sayısı bankanıza ve kartınıza göre değişiklik gösterebilir.",
      },
    ],
  },
  {
    id: "general",
    title: "Genel",
    icon: HelpCircle,
    questions: [
      {
        question: "Garanti var mı?",
        answer: "Tüm ürünlerimiz 1 yıl garantilidir. Üretim hatası veya malzeme kaynaklı sorunlarda ücretsiz değişim veya tamir hizmeti sunulur.",
      },
      {
        question: "Hediye paketi yapılıyor mu?",
        answer: "Evet, ürünleriniz hediye paketi ile gönderilebilir. Sipariş sırasında hediye paketi seçeneğini işaretleyebilirsiniz. Ayrıca kişiselleştirilmiş hediye notu ekleyebilirsiniz.",
      },
      {
        question: "Toplu sipariş yapılabilir mi?",
        answer: "Evet, kurumsal veya toplu siparişler için özel fiyatlandırma yapılabilir. Lütfen bizimle iletişime geçin.",
      },
      {
        question: "Nasıl iletişime geçebilirim?",
        answer: "İletişim sayfamızdan bize ulaşabilir, e-posta gönderebilir veya telefon ile arayabilirsiniz. Müşteri hizmetlerimiz hafta içi 09:00-18:00 saatleri arasında hizmetinizdedir.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <>
      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-12 bg-background overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Sıkça Sorulan Sorular</p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight text-balance mb-6">
                Merak Ettikleriniz
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Ürünlerimiz, sipariş süreci, kargo ve iade işlemleri hakkında en çok sorulan soruların cevapları burada.
              </p>
            </motion.div>
          </div>
        </section>

        {/* FAQ Sections */}
        <section className="pt-12 pb-24 bg-background">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="space-y-16">
              {faqCategories.map((category, categoryIndex) => {
                const IconComponent = category.icon
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-accent/10 rounded-md flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-accent" />
                      </div>
                      <h2 className="font-serif text-2xl sm:text-3xl text-foreground">{category.title}</h2>
                    </div>

                    <Accordion type="single" collapsible className="w-full space-y-2">
                      {category.questions.map((faq, index) => (
                        <AccordionItem
                          key={index}
                          value={`${category.id}-${index}`}
                          className="bg-secondary border border-border rounded-lg px-4"
                        >
                          <AccordionTrigger className="text-left hover:no-underline py-4">
                            <span className="font-medium text-foreground">{faq.question}</span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-muted-foreground leading-relaxed pl-2">{faq.answer}</p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </motion.div>
                )
              })}
            </div>

            {/* Contact CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-16 p-8 bg-secondary rounded-lg text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-accent" />
                </div>
              </div>
              <h3 className="font-serif text-2xl text-foreground mb-3">Sorunuz mu var?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Aradığınız cevabı bulamadıysanız, bizimle iletişime geçmekten çekinmeyin. Size yardımcı olmaktan mutluluk duyarız.
              </p>
              <a
                href="/iletisim"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors font-medium"
              >
                İletişime Geç
              </a>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
