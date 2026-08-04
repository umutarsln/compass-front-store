/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4141",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3050",
      },
      {
        protocol: "https",
        hostname: "www.compassreklam.com",
      },
      {
        protocol: "https",
        hostname: "compassreklam.com",
      },
      {
        protocol: "https",
        hostname: "**.s3.**.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "**.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "cekilis-antalya-dev.s3.eu-north-1.amazonaws.com",
      },
    ],
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
