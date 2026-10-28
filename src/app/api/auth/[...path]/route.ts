const AUTH_API_BASE_URL = (
  process.env.AUTH_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:4000" : "")
).replace(/\/+$/, "");

const allowedAuthPaths = new Set([
  "login/student",
  "login/staff",
  "register",
  "me",
  "logout",
]);

type RouteContext = { params: Promise<{ path: string[] }> };

async function proxyAuthRequest(request: Request, context: RouteContext) {
  const { path } = await context.params;
  const authPath = path.join("/");

  if (!allowedAuthPaths.has(authPath)) {
    return Response.json({ error: { message: "Authentication route not found." } }, { status: 404 });
  }
  if (!AUTH_API_BASE_URL) {
    return Response.json({ error: { message: "Sign-in service is not configured." } }, { status: 503 });
  }

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const cookie = request.headers.get("cookie");
  if (contentType) headers.set("content-type", contentType);
  if (cookie) headers.set("cookie", cookie);

  try {
    const upstream = await fetch(`${AUTH_API_BASE_URL}/api/auth/${authPath}`, {
      method: request.method,
      headers,
      ...(request.method === "GET" || request.method === "HEAD" ? {} : { body: await request.arrayBuffer() }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    const responseHeaders = new Headers({ "Cache-Control": "no-store" });
    const upstreamContentType = upstream.headers.get("content-type");
    if (upstreamContentType) responseHeaders.set("content-type", upstreamContentType);
    for (const setCookie of upstream.headers.getSetCookie()) {
      responseHeaders.append("set-cookie", setCookie);
    }

    return new Response(await upstream.arrayBuffer(), {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch {
    return Response.json({ error: { message: "We could not reach the sign-in service. Please try again." } }, { status: 503 });
  }
}

export const GET = proxyAuthRequest;
export const POST = proxyAuthRequest;
