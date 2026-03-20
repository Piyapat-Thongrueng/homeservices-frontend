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
    },
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const pathname = req.nextUrl.pathname

  const pathWithoutLocale =
    pathname.replace(/^\/(en|th)(?=\/|$)/, "") || "/"

  const isAuthPage =
    pathWithoutLocale === "/login" ||
    pathWithoutLocale.startsWith("/login/") ||
    pathWithoutLocale === "/register" ||
    pathWithoutLocale.startsWith("/register/") ||
    pathWithoutLocale.startsWith("/auth/login") ||
    pathWithoutLocale.startsWith("/auth/register")

  // Profile / reset-password use JWT in pages — do not block on Supabase session
  // (otherwise refresh → /auth/login → wrong UX or redirect to /).
  const isProtectedPage = pathWithoutLocale.startsWith("/dashboard")

  if (!session && isProtectedPage) {
    const localeMatch = pathname.match(/^\/(en|th)(?=\/|$)/)
    const prefix = localeMatch ? localeMatch[0] : ""
    return NextResponse.redirect(new URL(`${prefix}/login`, req.url))
  }

  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return res
}

export const config = {
  matcher: [
    "/login",
    "/en/login",
    "/th/login",
    "/register",
    "/en/register",
    "/th/register",
    "/auth/login",
    "/auth/register",
    "/en/auth/:path*",
    "/th/auth/:path*",
    "/dashboard/:path*",
    "/en/dashboard/:path*",
    "/th/dashboard/:path*",
  ],
}
