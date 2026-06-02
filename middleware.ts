import { NextResponse, type NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, type AdminSession } from "@/lib/auth/session";

/**
 * Guards everything under /admin and /api/admin. The login routes themselves
 * stay public so the owner can get in. Unauthorized page requests redirect to
 * the login screen; unauthorized API requests get a 401 JSON.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";
  if (isLoginPage || isLoginApi) return NextResponse.next();

  const res = NextResponse.next();
  const session = await getIronSession<AdminSession>(req, res, sessionOptions);

  if (session.isLoggedIn) return res;

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
