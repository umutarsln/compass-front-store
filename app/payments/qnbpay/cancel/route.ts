import { NextRequest, NextResponse } from "next/server";

/**
 * Backend cancel URL'ini üretir.
 */
function buildBackendCancelUrl(search: URLSearchParams): string {
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4141").replace(/\/+$/, "");
  const qs = search.toString();
  return `${apiBase}/payments/qnbpay/cancel${qs ? `?${qs}` : ""}`;
}

/**
 * QNB GET iptal dönüşünü backend cancel endpoint'ine yönlendirir.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const target = buildBackendCancelUrl(request.nextUrl.searchParams);
  return NextResponse.redirect(target, { status: 307 });
}

/**
 * QNB POST iptal dönüşünü query'e çevirip backend cancel endpoint'ine yönlendirir.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const formData = await request.formData();
  const search = new URLSearchParams();
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      search.append(key, value);
    }
  }
  const target = buildBackendCancelUrl(search);
  return NextResponse.redirect(target, { status: 307 });
}
