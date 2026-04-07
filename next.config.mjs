/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  /** Eski ürün slug’ından yeni eco solvent sayfasına kalıcı yönlendirme. */
  async redirects() {
    return [
      {
        source: "/urun/sublimasyon-dijital-baski-makinesi",
        destination: "/urun/eco-solvent-dijital-baski-makinesi",
        permanent: true,
      },
      {
        source: "/urun/175-cm-ppf-folyo-kesim-makinesi-plotter",
        destination: "/urun/175-cm-ppf-folyo-kesim-makinesi-plotter-step-motor",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
