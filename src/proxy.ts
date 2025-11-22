import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname
    const userRole = token?.role as string

    // Define role-based access
    // Admin can access everything
    // Manager can access manager and user routes
    // User can only access user routes

    if (path.startsWith("/dashboard/admin") && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    if (path.startsWith("/dashboard/manager") && !["ADMIN", "MANAGER"].includes(userRole)) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // Users are allowed in /dashboard/user and /dashboard/profile by default if authenticated
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*"
  ]
}
