import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  const { pathname } = req.nextUrl;

  // Protect /admin/dashboard and /admin/reviews
  if ((pathname.startsWith("/admin/dashboard") || pathname.startsWith("/admin/reviews") || pathname === "/admin") && !token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/dashboard/:path*", "/admin/reviews/:path*"],
};
