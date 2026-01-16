import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // List of public paths that don't need authentication check
  const publicPaths = [
    "/",
    "/login",
    "/signup",
    "/pricing",
    "/about",
    "/blog",
    "/contact",
    "/privacy",
    "/terms",
    "/checkout",
    "/auth",
    "/api",
  ];

  // Check if the current path starts with any public path
  const isPublicPath = publicPaths.some(
    (path) => request.nextUrl.pathname === path || 
              request.nextUrl.pathname.startsWith(`${path}/`)
  );

  // Skip middleware for public paths
  if (isPublicPath) {
    return NextResponse.next();
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};