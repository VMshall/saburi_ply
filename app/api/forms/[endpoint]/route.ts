import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Same-origin form proxy (§8). The browser POSTs to /api/forms/<endpoint>; this handler
 * forwards verbatim to the external apiv2 backend and passes the upstream status + body
 * straight back, so client success/error handling (response.ok, result.success,
 * data.error.message) is unchanged. The backend (apiv2.saburiply.com) is OUT OF SCOPE and
 * untouched — its origin is never shipped to the client and there is no CORS to widen.
 *
 * Node runtime (not edge) so a plain fetch to the external origin works without extra config.
 */
export const runtime = "nodejs";
// Body is forwarded as-is; no static optimization of this route.
export const dynamic = "force-dynamic";

// Server-only env (no NEXT_PUBLIC_). Fallback to the known apiv2 URLs so local/preview works
// out of the box; override per environment in Vercel.
const API_BASE = process.env.API_BASE_URL ?? "https://apiv2.saburiply.com/api/web/v1";
const API_ADMIN_BASE = process.env.API_ADMIN_BASE_URL ?? "https://apiv2.saburiply.com/api/admin";

// Allow-list: endpoint → upstream base. (subscribers lives under the admin API; the rest under web/v1.)
const UPSTREAM: Record<string, string> = {
  "contact-us": API_BASE,
  quote: API_BASE,
  enquiry: API_BASE,
  "become-partner": API_BASE,
  "save-data": API_BASE,
  subscribers: API_ADMIN_BASE,
};

export async function POST(req: NextRequest, { params }: { params: { endpoint: string } }) {
  const base = UPSTREAM[params.endpoint];
  if (!base) {
    return NextResponse.json({ error: { message: "Unknown form endpoint" } }, { status: 404 });
  }

  const body = await req.text(); // forward the raw payload unchanged
  try {
    const upstream = await fetch(`${base}/${params.endpoint}`, {
      method: "POST",
      headers: { "Content-Type": req.headers.get("content-type") ?? "application/json" },
      body,
    });
    const text = await upstream.text();
    return new NextResponse(text, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") ?? "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      { error: { message: "Upstream request failed. Please try again." } },
      { status: 502 },
    );
  }
}
