
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-at-least-32-chars-long';
const key = new TextEncoder().encode(SECRET_KEY);

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value

    let user = null
    if (token) {
        try {
            const { payload } = await jwtVerify(token, key, {
                algorithms: ['HS256'],
            })
            user = payload
        } catch (e) {
            // Invalid token
        }
    }

    // Protected routes
    const protectedPaths = ['/feed', '/create', '/profile', '/explore', '/saved', '/notifications', '/settings']
    const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))

    if (isProtectedPath && !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/auth/login'
        return NextResponse.redirect(url)
    }

    // Redirect authenticated users away from auth pages
    const authPaths = ['/auth/login', '/auth/sign-up']
    const isAuthPath = authPaths.some(path => request.nextUrl.pathname.startsWith(path))

    if (isAuthPath && user) {
        const url = request.nextUrl.clone()
        url.pathname = '/feed'
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
