import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request) {
    const token = await getToken({
        req: request,
        secret: process.env.JWT_SECRET,
    })

    const isAuthenticated = !!token
    const isAdmin = token?.role === "admin"

    const { pathname } = request.nextUrl

    // Admin routes protection
    if (pathname.startsWith("/admin") && !isAdmin) {
        const url = new URL("/", request.url)
        return NextResponse.redirect(url)
    }

    // Protected routes that require authentication
    if (
        (pathname.startsWith("/ke-hoach-bua-an") ||
            pathname.startsWith("cong-thuc/aiSuggest") ||
            pathname.startsWith("/history") ||
            pathname.startsWith("/results") ||
            pathname.startsWith("/profile")) &&
        !isAuthenticated
    ) {
        const url = new URL("/", request.url)
        // Add a query parameter to show a login prompt
        url.searchParams.set("login", "required")
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/admin/:path*",
        "cong-thuc/aiSuggest/:path*",
        "/ke-hoach-bua-an/:path*",
        "/history/:path*",
        "/results/:path*",
        "/profile/:path*",
    ],
}