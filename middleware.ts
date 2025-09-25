import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/', '/login', '/signup'];

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get('token')?.value;

    // ✅ If user is logged in
    if (token) {
        // block access to public pages
        if (PUBLIC_PATHS.includes(pathname)) {
            const generateUrl = new URL('/generate', req.url);
            return NextResponse.redirect(generateUrl);
        }
        // otherwise allow
        return NextResponse.next();
    }

    // ✅ If user is not logged in
    if (!token) {
        const isProtected =
            pathname.startsWith('/generate') || pathname.startsWith('/api/generate-report');

        // if trying to access protected route, redirect to login
        if (isProtected) {
            const loginUrl = new URL('/login', req.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    // default allow
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/signup',
        '/generate/:path*',
        '/api/generate-report/:path*',
    ],
};
