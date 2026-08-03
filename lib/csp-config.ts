/**
 * Ortam değişkeninden geçerli URL origin değerini güvenli şekilde çıkarır.
 */
function parseOrigin(value: string | undefined): string | null {
  if (!value?.trim()) return null
  try {
    return new URL(value.trim()).origin
  } catch {
    return null
  }
}

/**
 * Virgülle ayrılmış URL/origin listesini benzersiz origin dizisine dönüştürür.
 */
function parseOriginList(value: string | undefined): string[] {
  if (!value?.trim()) return []
  return [
    ...new Set(
      value
        .split(",")
        .map((part) => parseOrigin(part.trim()))
        .filter((origin): origin is string => Boolean(origin)),
    ),
  ]
}

/**
 * CSP connect-src için izin verilen API origin listesini toplar.
 */
export function getAllowedApiOrigins(): string[] {
  const origins = new Set<string>()

  for (const origin of [
    parseOrigin(process.env.NEXT_PUBLIC_API_URL),
    parseOrigin(process.env.NEXT_PUBLIC_API_ORIGIN),
    parseOrigin(process.env.API_ORIGIN),
    ...parseOriginList(process.env.CSP_API_ORIGINS),
  ]) {
    if (origin) origins.add(origin)
  }

  return [...origins]
}

/** QNBpay ve iyzico ödeme akışları için varsayılan form-action origin'leri. */
const DEFAULT_FORM_ACTION_ORIGINS = [
  "https://test.qnbpay.com.tr",
  "https://qnbpay.com.tr",
  "https://www.qnbpay.com.tr",
  "https://cpp.iyzipay.com",
  "https://sandbox-cpp.iyzipay.com",
] as const

/**
 * CSP form-action için izin verilen origin listesini döndürür (QNBpay POST, iyzico form).
 */
export function getAllowedFormActionOrigins(): string[] {
  const origins = new Set<string>(["'self'", ...DEFAULT_FORM_ACTION_ORIGINS])

  for (const origin of parseOriginList(process.env.CSP_FORM_ACTION_ORIGINS)) {
    origins.add(origin)
  }

  for (const origin of getAllowedApiOrigins()) {
    origins.add(origin)
  }

  return [...origins]
}

/** Ödeme sayfalarında iframe kullanımı için varsayılan frame-src origin'leri. */
const DEFAULT_FRAME_ORIGINS = [
  "https://www.googletagmanager.com",
  "https://cpp.iyzipay.com",
  "https://sandbox-cpp.iyzipay.com",
  "https://test.qnbpay.com.tr",
  "https://qnbpay.com.tr",
  "https://www.qnbpay.com.tr",
] as const

/**
 * CSP frame-src için izin verilen origin listesini döndürür.
 */
export function getAllowedFrameOrigins(): string[] {
  const origins = new Set<string>(["'self'", ...DEFAULT_FRAME_ORIGINS])

  for (const origin of parseOriginList(process.env.CSP_FRAME_ORIGINS)) {
    origins.add(origin)
  }

  return [...origins]
}

/**
 * Ortam ve entegrasyonlara göre Content-Security-Policy başlık değerini üretir.
 */
export function buildContentSecurityPolicy(isDev: boolean): string {
  const apiOrigins = getAllowedApiOrigins()
  const connectSrc = [
    "'self'",
    ...apiOrigins,
    "https://www.google-analytics.com",
    "https://*.google-analytics.com",
    "https://www.googletagmanager.com",
    "https://*.amazonaws.com",
    "https://vitals.vercel-insights.com",
    "https://va.vercel-scripts.com",
  ]
    .filter(Boolean)
    .join(" ")

  const formAction = getAllowedFormActionOrigins().join(" ")
  const frameSrc = getAllowedFrameOrigins().join(" ")

  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    `connect-src ${connectSrc}`,
    `frame-src ${frameSrc}`,
    "object-src 'none'",
    "base-uri 'self'",
    `form-action ${formAction}`,
    "frame-ancestors 'self'",
  ]

  if (!isDev) {
    directives.push("upgrade-insecure-requests")
  }

  return directives.join("; ")
}
