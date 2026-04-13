import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage    = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isAdminPage   = pathname.startsWith("/admin");
  const isUserPage    = pathname.startsWith("/user");
  const isProtected   = isAdminPage || isUserPage;

  // not logged in and trying to access protected page → redirect to login
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // already logged in and trying to visit login/register → redirect to home
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/login", "/register"],
};