import { NextRequest, NextResponse } from "next/server";

/**
 * Backend callback URL'ini üretir.
 */
function buildBackendReturnUrl(search: URLSearchParams): string {
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4141").replace(/\/+$/, "");
  const qs = search.toString();
  return `${apiBase}/payments/qnbpay/return${qs ? `?${qs}` : ""}`;
}

/**
 * QNB GET dönüşünü backend return endpoint'ine yönlendirir.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const target = buildBackendReturnUrl(request.nextUrl.searchParams);
  return NextResponse.redirect(target, { status: 307 });
}

/**
 * QNB POST dönüşünü query'e çevirip backend return endpoint'ine yönlendirir.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const formData = await request.formData();
  const search = new URLSearchParams();
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      search.append(key, value);
    }
  }
  const target = buildBackendReturnUrl(search);
  return NextResponse.redirect(target, { status: 307 });
}
