export type BlogPost = {
  id: string
  title: string
  excerpt: string
  date: string
  dateTime: string
  author: string
  category: string
  readTime: string
  image: string
  imageAlt: string
  featured?: boolean
  highlights: string[]
  content: string[]
}

export const BLOG_PAGE_DESCRIPTION =
  "Compass Reklam blogunda UV baskı, DTF tekstil baskı, lazer kesim, laminasyon ve dijital reklam üretimi hakkında güncel rehberler ve profesyonel ipuçları."

export const BLOG_PAGE_KEYWORDS = [
  "UV baskı",
  "DTF baskı",
  "baskı makinesi",
  "lazer kesim",
  "laminasyon",
  "reklam makineleri",
  "dijital baskı",
  "Compass Reklam",
]

export const blogCategories = ["Tümü", "Teknoloji", "Sektör", "Rehber", "İpuçları"]

export const blogPosts = [
  {
    id: "uv-baski-trendleri",
    title: "UV Baskı Teknolojisinde 2026 Trendleri",
    excerpt:
      "UV baskı makinelerinde hız, düşük enerji tüketimi, beyaz boya performansı ve otomasyon 2026 yatırımlarının ana gündemi haline geliyor.",
    date: "5 Mart 2026",
    dateTime: "2026-03-05",
    author: "Mert İlev",
    category: "Teknoloji",
    readTime: "8 dk okuma",
    image: "/images/forge/product-flatbed.jpg",
    imageAlt: "Endüstriyel UV flatbed baskı makinesi ile reklam üretimi",
    featured: true,
    highlights: [
      "UV LED kürleme sayesinde daha düşük enerji tüketimi ve hızlı teslimat",
      "Ahşap, cam, metal, pleksi ve kompozit yüzeylerde yüksek tutunma",
      "Beyaz boya ve vernik katmanlarıyla daha premium tabela uygulamaları",
    ],
    content: [
      "UV baskı teknolojisi, reklam üretiminde hız ve yüzey çeşitliliği arayan işletmeler için en güçlü çözümlerden biri olmaya devam ediyor. 2026'da öne çıkan ana eğilim, yalnızca daha yüksek çözünürlük değil; aynı zamanda daha kararlı renk yönetimi, daha az fire ve daha kısa teslim süreleri.",
      "Flatbed ve hibrit UV baskı makinelerinde otomatik yükseklik algılama, güçlü vakum tabla, beyaz boya sirkülasyonu ve vernik uygulamaları yatırım kararında belirleyici hale geliyor. Bu özellikler özellikle tabela, dekorasyon, promosyon ve kişiselleştirilmiş ürün üretiminde kalite farkı oluşturuyor.",
      "UV LED kürleme sistemleri, geleneksel kurutma süreçlerine göre daha hızlı sonuç verdiği için üretim hattında bekleme süresini azaltır. Mürekkebin yüzeye temas ettiği anda kürlenmesi, cam, metal, ahşap, pleksi, PVC ve kompozit panel gibi farklı malzemelerde daha temiz bir iş akışı sağlar.",
      "2026'da işletmelerin en çok sorguladığı konulardan biri beyaz boya performansıdır. Şeffaf, koyu renkli veya renkli yüzeylerde doğru beyaz boya altyapısı kullanılmadığında baskı soluk görünebilir. Bu nedenle beyaz boya sirkülasyonu, nozzle tıkanma riskini azaltan bakım sistemi ve RIP yazılımındaki katman kontrolü kritik hale gelir.",
      "Vernik uygulaması da UV baskıda premium algıyı güçlendiren önemli bir başlıktır. Kabartmalı logo, lokal parlaklık, özel doku efekti ve kişiselleştirilmiş promosyon ürünleri gibi işlerde vernik katmanı müşterinin ürüne verdiği değeri artırır. Bu özellik, reklam atölyeleri için yalnızca baskı değil, katma değerli ürün üretme fırsatı doğurur.",
      "Makine seçiminde baskı alanı, kafa sayısı, kafa markası, tabla vakum gücü ve otomatik yükseklik ölçümü birlikte değerlendirilmelidir. Çok büyük tabla her işletme için doğru tercih olmayabilir; önemli olan günlük sipariş ölçüleri, kullanılan malzeme tipi ve operatörün çalışma temposudur.",
      "Toplam maliyet hesabında yalnızca makine fiyatına bakmak yanıltıcıdır. Mürekkep tüketimi, bakım sıklığı, yedek parça erişimi, operatör eğitimi ve teknik servis hızı yatırımın geri dönüş süresini belirler. Özellikle yoğun üretim yapan işletmeler için plansız duruş süresi, sarf maliyetinden daha büyük bir kayıp yaratabilir.",
      "Doğru UV baskı makinesini seçerken günlük üretim hacmi, çalışılacak malzeme ölçüleri, servis erişimi ve sarf maliyeti birlikte değerlendirilmelidir. Compass Reklam, işletmenin gerçek üretim akışına göre makine konumlandırması yaparak yatırımın daha hızlı geri dönmesine yardımcı olur.",
    ],
  },
  {
    id: "dtf-tekstil",
    title: "DTF Baskının Tekstil Sektöründeki Yükselişi",
    excerpt:
      "DTF baskı; düşük adetli tekstil üretimi, hızlı numune hazırlama ve canlı renk beklentisi olan markalar için esnek bir çözüm sunuyor.",
    date: "28 Şubat 2026",
    dateTime: "2026-02-28",
    author: "Mert İlev",
    category: "Sektör",
    readTime: "7 dk okuma",
    image: "/images/forge/product-dtf.jpg",
    imageAlt: "DTF tekstil baskı makinesi ile tişört transfer üretimi",
    highlights: [
      "Pamuk, polyester ve karışım kumaşlarda geniş uygulama alanı",
      "Stok riski olmadan kişiye özel ve butik üretim imkanı",
      "Canlı renk, ince detay ve yıkama dayanımı dengesi",
    ],
    content: [
      "DTF baskı, tekstil sektöründe küçük ve orta ölçekli üreticilerin siparişe özel çalışma modelini güçlendirdi. Kalıp maliyeti gerektirmemesi, farklı kumaş türlerine uygulanabilmesi ve düşük adetlerde ekonomik sonuç vermesi bu teknolojiyi öne çıkarıyor.",
      "Markalı tişört, iş kıyafeti, promosyon tekstili ve butik koleksiyon üretiminde DTF baskı, numune süresini ciddi şekilde kısaltır. Tasarım dijital ortamdan doğrudan filme aktarıldığı için renk revizyonları ve kişiselleştirme talepleri daha hızlı yönetilir.",
      "DTF sisteminin en güçlü tarafı, stok tutmadan üretim yapmaya imkan vermesidir. Bir marka aynı tasarımı farklı beden, renk veya müşteri adına göre kolayca çoğaltabilir. Bu durum özellikle e-ticaret, okul kulübü ürünleri, kurumsal promosyonlar ve etkinlik tekstilleri için ciddi avantaj sağlar.",
      "Baskı kalitesini belirleyen unsur yalnızca yazıcı değildir. Film kalitesi, pigment mürekkep, beyaz mürekkep yoğunluğu, hot melt toz, kurutma sıcaklığı ve pres ayarı birlikte çalışır. Bu zincirdeki zayıf halka, yıkama dayanımını veya yüzey hissini doğrudan etkiler.",
      "DTF üretiminde beyaz mürekkep yönetimi ayrıca dikkat ister. Beyaz kanal düzenli çalışmadığında tıkanma, renk solukluğu veya transfer yüzeyinde tutunma problemi oluşabilir. Bu nedenle günlük bakım rutini, otomatik karıştırma sistemi ve operatör disiplini uzun vadeli verim için önemlidir.",
      "Pres aşamasında kumaş türüne göre sıcaklık, basınç ve süre ayarı yapılmalıdır. Pamuk, polyester, karışım kumaş, sweatshirt veya iş kıyafeti aynı reçeteyle her zaman en iyi sonucu vermez. Test baskısı yapmak, seri üretim öncesinde renk ve tutunma riskini azaltır.",
      "DTF yatırımında başlangıç maliyeti kadar üretim kapasitesi de hesaplanmalıdır. Günlük kaç metre film basılacağı, kaç operatörle çalışılacağı, kurutma ünitesinin hızı ve pres sayısı gerçek kapasiteyi belirler. Sadece yazıcı hızına bakmak işletmenin teslimat süresini doğru göstermez.",
      "Verimli bir DTF hattı için yazıcı, tozlama, kurutma, pres ve sarf kalitesi birlikte düşünülmelidir. Doğru ekipman kombinasyonu, hem baskı dayanımını artırır hem de operatörün günlük üretim temposunu daha öngörülebilir hale getirir.",
    ],
  },
  {
    id: "dogru-makine-secimi",
    title: "Doğru Baskı Makinesi Nasıl Seçilir?",
    excerpt:
      "Baskı makinesi yatırımı yapmadan önce üretim hacmi, malzeme türü, servis desteği ve toplam sahip olma maliyeti birlikte incelenmeli.",
    date: "20 Şubat 2026",
    dateTime: "2026-02-20",
    author: "Mert İlev",
    category: "Rehber",
    readTime: "9 dk okuma",
    image: "/images/forge/product-rolltoroll.jpg",
    imageAlt: "Roll-to-roll dijital baskı makinesi ile reklam baskısı",
    highlights: [
      "Sadece makine fiyatına değil, sarf ve bakım maliyetine de bakın",
      "Günlük üretim hacmini gerçek sipariş verileriyle hesaplayın",
      "Kurulum, eğitim ve teknik servis kapasitesini yatırım kriteri yapın",
    ],
    content: [
      "Doğru baskı makinesini seçmek, teknik özellik listesini karşılaştırmaktan daha fazlasıdır. İşletmenin bugün ürettiği işler, hedeflediği müşteri grubu ve teslimat standardı yatırım kararının merkezinde olmalıdır.",
      "UV, DTF, roll-to-roll veya lazer kesim gibi farklı teknolojiler farklı üretim ihtiyaçlarına cevap verir. Örneğin tabela ve sert yüzey baskısı için UV flatbed öne çıkarken, tekstil kişiselleştirmede DTF daha esnek bir başlangıç sunabilir.",
      "İlk adım, mevcut siparişlerinizi ürün tipine göre ayırmaktır. Branda, folyo, araç kaplama, pleksi tabela, promosyon ürün, tekstil baskı veya etiket kesim gibi işler aynı makineyle verimli üretilmez. Üretim portföyünü netleştirmek, gereksiz kapasiteye para bağlamayı engeller.",
      "İkinci adım günlük ve aylık üretim hacmini gerçekçi hesaplamaktır. Bir makinenin katalog hızında çalışması her zaman mümkün değildir; dosya hazırlığı, malzeme yükleme, kurutma, bakım, operatör molası ve kalite kontrol süresi hesaba katılmalıdır. Gerçek kapasite, yalnızca maksimum hız verisiyle ölçülmez.",
      "Baskı kalitesi tarafında çözünürlük tek başına yeterli değildir. Renk yönetimi, kafa yapısı, damla boyutu, RIP yazılımı, ICC profil desteği ve kullanılan sarf malzeme nihai kaliteyi belirler. Aynı makine farklı mürekkep veya medya ile farklı sonuç verebilir.",
      "Servis ve yedek parça erişimi yatırımın en kritik başlıklarından biridir. Baskı makinesi durduğunda yalnızca o günkü üretim değil, müşteri teslimat sözü ve marka güveni de etkilenir. Bu nedenle satın alma kararında teknik servis organizasyonu, eğitim süreci ve parça bulunabilirliği fiyat kadar önemlidir.",
      "Toplam sahip olma maliyeti hesaplanırken elektrik tüketimi, sarf gideri, bakım parçaları, fire oranı ve işçilik de dikkate alınmalıdır. Daha düşük satın alma bedeli olan bir makine, yüksek fire veya sık arıza nedeniyle uzun vadede daha pahalı hale gelebilir.",
      "Büyüme planı da makine seçiminde belirleyici olmalıdır. Bugün düşük adetli çalışan bir işletme, altı ay sonra farklı ürün gruplarına girmek istiyorsa makine parkını buna göre konumlandırmalıdır. Ancak gelecekteki ihtimal için gereğinden büyük yatırım yapmak da nakit akışını zorlayabilir.",
      "Satın alma sürecinde baskı hızı, çözünürlük, maksimum medya ölçüsü, yazılım uyumu, operatör eğitimi ve servis süresi birlikte değerlendirilmelidir. Compass Reklam, müşterilerine yalnızca makine değil; kurulumdan üretim optimizasyonuna kadar devam eden bir çözüm modeli sunar.",
    ],
  },
  {
    id: "lazer-kesim-rehber",
    title: "Lazer Kesim Makineleri: Kapsamlı Rehber",
    excerpt:
      "Fiber lazer ve CO2 lazer teknolojileri farklı malzemelerde farklı avantajlar sağlar; doğru seçim üretim kalitesini ve maliyeti doğrudan etkiler.",
    date: "15 Şubat 2026",
    dateTime: "2026-02-15",
    author: "Mert İlev",
    category: "Rehber",
    readTime: "8 dk okuma",
    image: "/images/forge/product-laser.jpg",
    imageAlt: "Lazer kesim makinesi ile hassas reklam ve tabela üretimi",
    highlights: [
      "Fiber lazer metal kesim ve markalama işlerinde yüksek verim sağlar",
      "CO2 lazer akrilik, ahşap, deri ve benzeri malzemelerde güçlüdür",
      "Kesim kalitesi için güç, tabla ölçüsü ve duman tahliyesi önemlidir",
    ],
    content: [
      "Lazer kesim makineleri reklam, tabela, promosyon ve endüstriyel üretimde hassasiyet beklentisini karşılayan temel ekipmanlardan biridir. Ancak her lazer teknolojisi aynı malzemede aynı performansı göstermez.",
      "Fiber lazer makineleri metal yüzeylerde hız ve hassasiyet avantajı sunarken, CO2 lazer makineleri akrilik, ahşap, deri, kumaş ve organik malzemelerde daha geniş kullanım alanına sahiptir. Bu nedenle yatırım kararı, kesilecek ana malzeme grubuna göre verilmelidir.",
      "Reklam sektöründe lazer kesim en çok pleksi harf, yönlendirme tabelası, promosyon ürün, dekoratif panel, ahşap obje ve özel tasarım parçaların üretiminde kullanılır. Kesim kenarının temizliği, tekrar edilebilir ölçü hassasiyeti ve karmaşık formları hızlı çıkarabilmesi üretim kalitesini artırır.",
      "Fiber lazer tercih eden işletmeler genellikle metal markalama, ince metal kesim, paslanmaz çelik, alüminyum, pirinç veya endüstriyel parça uygulamalarına odaklanır. Fiber lazer, metal yüzeylerde yüksek enerji yoğunluğu sunduğu için temas etmeden kalıcı ve net sonuç verir.",
      "CO2 lazer ise akrilik, ahşap, deri, kumaş, karton ve benzeri organik malzemelerde daha doğru bir seçenektir. Özellikle akrilik kesimde parlak kenar kalitesi ve detaylı form üretimi için CO2 lazerler reklam atölyelerinde sık tercih edilir.",
      "Watt değeri kesim kapasitesini etkiler, fakat tek karar kriteri değildir. Optik sistem kalitesi, tabla yapısı, lineer kızaklar, soğutma performansı, hava desteği ve yazılım uyumu günlük üretimde en az güç kadar belirleyicidir. Zayıf mekanik yapı, yüksek watt değerinin avantajını düşürebilir.",
      "Duman tahliyesi ve filtreleme sistemi hem iş güvenliği hem de makine ömrü açısından önemlidir. Özellikle akrilik, ahşap ve deri kesiminde ortaya çıkan duman doğru şekilde tahliye edilmezse lens kirlenmesi, koku problemi ve kesim kalitesinde düşüş yaşanabilir.",
      "Operatör güvenliği için kapalı kabin, acil stop, kapak sensörü, uygun göz koruması ve çalışma alanı düzeni ihmal edilmemelidir. Lazer makinesi yüksek hassasiyetli bir üretim aracı olduğu kadar doğru kullanılmadığında risk oluşturabilecek güçlü bir sistemdir.",
      "Makine seçiminde yalnızca watt değeri yeterli bir ölçüt değildir. Tabla ölçüsü, soğutma sistemi, duman tahliyesi, yazılım desteği ve güvenlik donanımları uzun vadeli üretim kalitesini belirler.",
    ],
  },
  {
    id: "laminasyon-ipuclari",
    title: "Laminasyonda Kaliteyi Artırmanın 5 Yolu",
    excerpt:
      "Doğru film seçimi, temiz yüzey hazırlığı ve kontrollü baskı ayarı laminasyon kalitesini belirleyen en kritik adımlardır.",
    date: "8 Şubat 2026",
    dateTime: "2026-02-08",
    author: "Mert İlev",
    category: "İpuçları",
    readTime: "7 dk okuma",
    image: "/images/forge/product-laminator.jpg",
    imageAlt: "Soğuk laminasyon makinesi ile baskı koruma uygulaması",
    highlights: [
      "Film türünü iç mekan, dış mekan ve zemin kullanımına göre seçin",
      "Toz, nem ve statik elektrik kaynaklı kabarcıkları işlem öncesi azaltın",
      "Basınç ve hız ayarını baskı yüzeyine göre test ederek belirleyin",
    ],
    content: [
      "Laminasyon, baskının görsel kalitesini korumanın yanında kullanım ömrünü de uzatır. Özellikle dış mekan reklamları, araç kaplama, zemin grafikleri ve yoğun temas alanlarında doğru laminasyon uygulaması kritik öneme sahiptir.",
      "Kaliteyi artırmanın ilk adımı doğru film seçimidir. Parlak, mat, kumlu, zemin veya UV dayanımlı film seçenekleri kullanılacak alana göre tercih edilmelidir. Yanlış film seçimi, kısa sürede kenar kalkması veya yüzey bozulması gibi sorunlara neden olabilir.",
      "Parlak laminasyon renkleri daha canlı gösterirken mat laminasyon yansımayı azaltır ve daha kurumsal bir görünüm verir. Zemin grafikleri için kaymaz yüzeyli özel filmler, araç kaplama için esnek ve dış mekan dayanımı yüksek filmler tercih edilmelidir.",
      "Baskı yüzeyinin yeterince kuruması laminasyon kalitesini doğrudan etkiler. Özellikle solvent veya eco solvent baskılarda gaz çıkışı tamamlanmadan laminasyon yapılırsa kabarcık, bulanıklık veya kenar kalkması oluşabilir. Kuruma süresi üretim planına dahil edilmelidir.",
      "Makine basıncı ve hız ayarı her medya için aynı olmamalıdır. Çok yüksek basınç filmi gerebilir, çok düşük basınç ise yapışmayı zayıflatabilir. Operatörün küçük testlerle doğru ayarı bulması, büyük metrajlı işlerde fireyi ciddi şekilde azaltır.",
      "Toz, statik elektrik ve ortam nemi laminasyonun görünmeyen düşmanlarıdır. Uygulama alanı temiz tutulmalı, medya yüzeyi kontrol edilmeli ve mümkünse toz alma işlemi yapılmalıdır. Küçük bir partikül, büyük bir panelde gözle görülür kabarcığa dönüşebilir.",
      "Rulo hizalaması da kalite için kritik bir adımdır. Film rulosu eğik takıldığında ilerleyen metrajlarda kırışma veya kenara doğru kaçma oluşabilir. Operatörün başlangıç hizalamasını dikkatli yapması, uygulama boyunca daha stabil sonuç verir.",
      "Uygulama öncesinde yüzeyin temiz olması, baskının yeterince kuruması ve makine basıncının doğru ayarlanması gerekir. Küçük test uygulamaları, seri üretime geçmeden önce olası fireyi azaltır.",
    ],
  },
  {
    id: "dijital-donusum",
    title: "Reklam Sektöründe Dijital Dönüşüm",
    excerpt:
      "Dijital baskı teknolojileri reklam üretimini daha hızlı, ölçülebilir ve kişiselleştirilebilir hale getirerek işletmelere yeni gelir alanları açıyor.",
    date: "1 Şubat 2026",
    dateTime: "2026-02-01",
    author: "Mert İlev",
    category: "Sektör",
    readTime: "8 dk okuma",
    image: "/images/forge/hero-printer.jpg",
    imageAlt: "Dijital reklam üretiminde endüstriyel baskı teknolojileri",
    highlights: [
      "Kişiselleştirilmiş reklam ürünleri daha kısa teslim süreleriyle üretilebilir",
      "Dijital iş akışları teklif, üretim ve teslimat süreçlerini izlenebilir yapar",
      "Makine yatırımı doğru planlandığında yeni hizmet kategorileri doğurur",
    ],
    content: [
      "Reklam sektörü artık yalnızca büyük adetli üretimlerle değil, hızlı ve kişiselleştirilmiş siparişlerle de büyüyor. Dijital baskı teknolojileri, markaların kısa sürede kampanya üretmesini ve farklı hedef kitlelere özel görseller hazırlamasını kolaylaştırıyor.",
      "Modern üretim atölyelerinde teklif, tasarım, baskı, kesim ve teslimat süreçleri dijital araçlarla daha kontrollü yönetiliyor. Bu sayede fire oranı düşerken müşteriyle iletişim ve iş takibi daha profesyonel hale geliyor.",
      "Dijital dönüşümün ilk etkisi hızda görülür. Eskiden uzun hazırlık süresi gerektiren işler, dijital dosya akışı sayesinde daha kısa sürede üretime alınabilir. Bu durum kampanya baskıları, mağaza içi görseller, etkinlik materyalleri ve kişiselleştirilmiş promosyon ürünlerinde önemli avantaj sağlar.",
      "İkinci büyük etki ölçülebilirliktir. Siparişin hangi aşamada olduğu, hangi operatörde beklediği, ne kadar fire oluştuğu ve teslimatın ne zaman yapılacağı dijital takip sistemleriyle daha net izlenebilir. Bu sayede işletme yalnızca üretim yapan değil, süreci yöneten bir yapıya dönüşür.",
      "Kişiselleştirme, dijital dönüşümün en güçlü gelir alanlarından biridir. İsimli ürünler, düşük adetli kampanyalar, özel tasarım tekstiller, butik dekorasyon ürünleri ve kurumsal hediyeler artık daha hızlı hazırlanabilir. Bu da reklam işletmelerine standart baskı işlerinin ötesinde yeni hizmet kategorileri açar.",
      "Makine parkı dijital dönüşümün merkezinde yer alır. UV baskı sert yüzey ve promosyon ürünlerinde, DTF tekstil tarafında, roll-to-roll geniş format baskıda, lazer kesim ise şekillendirme ve kişiselleştirme aşamasında tamamlayıcı rol oynar. Bu makineler birlikte planlandığında üretim hattı daha esnek hale gelir.",
      "Dijitalleşme yalnızca makine almak anlamına gelmez. Dosya arşivi, renk profili yönetimi, teklif şablonları, stok takibi, bakım planı ve müşteri iletişimi de bu dönüşümün parçalarıdır. İyi kurgulanmış bir sistem, operatör değişse bile üretim standardını korumaya yardımcı olur.",
      "Rekabet avantajı için işletmelerin sadece hızlı üretmesi yetmez; tutarlı kalite, net teslimat süresi ve güçlü satış sonrası iletişim de gerekir. Dijital iş akışları bu üç alanı destekleyerek müşteri memnuniyetini ve tekrar sipariş oranını artırır.",
      "Dijital dönüşümün merkezinde doğru teknoloji yatırımı yer alır. UV baskı, DTF tekstil baskı, lazer kesim ve laminasyon ekipmanları birlikte planlandığında reklam işletmeleri daha geniş ürün portföyüyle rekabet avantajı elde eder.",
    ],
  },
] satisfies BlogPost[]

/** Verilen blog id değerine karşılık gelen yazıyı döndürür. */
export function getBlogPostById(id: string) {
  return blogPosts.find((post) => post.id === id) ?? null
}

/** Blog detay sayfasında gösterilecek aynı kategori yazılarını döndürür. */
export function getRelatedBlogPosts(post: BlogPost, limit = 3) {
  return blogPosts.filter((item) => item.id !== post.id && item.category === post.category).slice(0, limit)
}
