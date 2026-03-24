"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  Wrench,
  Settings,
  Truck,
  HeadphonesIcon,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  Cog,
  Monitor,
  Palette,
  GraduationCap,
} from "lucide-react"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
}

const services = [
  {
    icon: Wrench,
    title: "Teknik Servis",
    description:
      "Tüm baskı makineleriniz için yerinde ve uzaktan teknik destek hizmeti sunuyoruz. Arıza tespiti, onarım ve bakım işlemlerini uzman kadromuzla gerçekleştiriyoruz.",
    features: ["7/24 Destek Hattı", "Yerinde Servis", "Uzaktan Bağlantı", "Acil Müdahale"],
  },
  {
    icon: Settings,
    title: "Periyodik Bakım",
    description:
      "Makinelerinizin ömrünü uzatmak ve verimliliğini artırmak için düzenli bakım programları oluşturuyoruz.",
    features: ["Planlı Bakım", "Parça Değişimi", "Kalibrasyon", "Performans Raporu"],
  },
  {
    icon: Truck,
    title: "Kurulum & Devreye Alma",
    description:
      "Satın aldığınız makinelerin profesyonel kurulumu, kalibrasyonu ve devreye alma işlemlerini eksiksiz gerçekleştiriyoruz.",
    features: ["Profesyonel Kurulum", "Test Baskıları", "Kalibrasyon", "Konum Optimizasyonu"],
  },
  {
    icon: GraduationCap,
    title: "Eğitim & Danışmanlık",
    description:
      "Operatör eğitimlerinden iş süreçleri danışmanlığına kadar kapsamlı destek sağlıyoruz.",
    features: ["Operatör Eğitimi", "İş Akışı Danışmanlığı", "Renk Yönetimi", "Yazılım Eğitimi"],
  },
  {
    icon: Palette,
    title: "Renk Yönetimi & ICC Profil",
    description:
      "Baskılarınızda mükemmel renk tutarlılığı sağlamak için profesyonel ICC profil oluşturma ve renk yönetimi hizmeti.",
    features: ["ICC Profil", "Renk Kalibrasyonu", "Proof Yönetimi", "Spot Renk Eşleme"],
  },
  {
    icon: Monitor,
    title: "Yazılım Çözümleri",
    description:
      "RIP yazılımı kurulumu, iş akışı otomasyonu ve üretim yönetimi yazılımlarında destek.",
    features: ["RIP Yazılımı", "İş Akışı Otomasyonu", "ERP Entegrasyonu", "Bulut Çözümler"],
  },
]

const stats = [
  { value: "500+", label: "Tamamlanan Servis" },
  { value: "98%", label: "Müşteri Memnuniyeti" },
  { value: "< 4 saat", label: "Ort. Müdahale Süresi" },
  { value: "50+", label: "Uzman Teknisyen" },
]

/**
 * Hizmetler sayfası - Forge Services UI
 */
export default function ServicesPage() {
  return (
    <>
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative bg-secondary py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>
          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
                Profesyonel Hizmetler
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-foreground mb-6 leading-tight">
                Satış Sonrası
                <br />
                <span className="text-primary">Tam Destek</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Makine satışından teknik servise, eğitimden danışmanlığa kadar tüm süreçlerde yanınızdayız. Yatırımınızdan
                maksimum verim almanızı sağlıyoruz.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, i) => (
                <motion.div
                  key={service.title}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <Card className="h-full border-border hover:border-primary/40 transition-colors group">
                    <CardContent className="p-8">
                      <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                        <service.icon className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="font-display text-xl font-bold text-foreground mb-3">{service.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-6">{service.description}</p>
                      <ul className="space-y-2">
                        {service.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                            <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-secondary">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="text-center"
                >
                  <div className="font-display text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-14">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Servis Sürecimiz</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Hızlı ve etkili çözüm için optimize edilmiş iş akışımız.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  icon: HeadphonesIcon,
                  title: "Talep",
                  desc: "Telefon, WhatsApp veya web üzerinden talebinizi iletin.",
                },
                {
                  step: "02",
                  icon: Clock,
                  title: "Değerlendirme",
                  desc: "Uzman ekibimiz sorunu analiz eder ve çözüm planı oluşturur.",
                },
                {
                  step: "03",
                  icon: Cog,
                  title: "Müdahale",
                  desc: "Yerinde veya uzaktan bağlantıyla sorunu çözüyoruz.",
                },
                {
                  step: "04",
                  icon: Shield,
                  title: "Garanti",
                  desc: "Yapılan işlem garanti kapsamında takip edilir.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="text-center relative"
                >
                  <div className="text-6xl font-display font-bold text-primary/10 mb-4">{item.step}</div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-primary">
          <div className="container text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                Teknik Destek mi Gerekiyor?
              </h2>
              <p className="text-white/80 mb-8 max-w-xl mx-auto">
                Uzman ekibimiz sizin için hazır. Hemen bizimle iletişime geçin.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/iletisim">
                  <Button size="lg" variant="secondary" className="gap-2">
                    İletişime Geç <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href="https://wa.me/905519770858" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20">
                    WhatsApp ile Yaz
                  </Button>
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
