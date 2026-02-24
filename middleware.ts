import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {

  let res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // ดึง session จาก Supabase
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const pathname = req.nextUrl.pathname

  // =========================
  // DEFINE ROUTE TYPES
  // =========================

  const isAuthPage =
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register")

  const isProtectedPage =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/dashboard")

  // =========================
  // NOT LOGGED IN → BLOCK PROTECTED
  // =========================

  if (!session && isProtectedPage) {

    return NextResponse.redirect(
      new URL("/auth/login", req.url)
    )

  }

  // =========================
  // LOGGED IN → BLOCK AUTH PAGES
  // =========================

  if (session && isAuthPage) {

    return NextResponse.redirect(
      new URL("/", req.url)
    )

  }

  return res

}


// =========================
// MATCH ROUTES
// =========================

export const config = {
  matcher: [
    "/auth/login",
    "/auth/register",
    "/profile/:path*",
    "/reset-password/:path*",
    "/dashboard/:path*",
  ],
}