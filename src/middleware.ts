import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Check if user is authenticated for protected routes
    if (pathname.startsWith('/dashboard')) {
        // Check for session cookie - Better Auth typically uses this cookie name
        const sessionCookie = request.cookies.get('better-auth.session_token') || 
                            request.cookies.get('session_token') ||
                            request.cookies.get('session');
        
        if (!sessionCookie) {
            return NextResponse.redirect(new URL('/auth', request.url));
        }
    }

    // Handle password verification for links
    if (pathname.match(/^\/[^\/]+$/) && !pathname.startsWith('/dashboard') && !pathname.startsWith('/auth') && !pathname.startsWith('/api')) {
        // Check if this is a password verification request
        if (request.nextUrl.searchParams.has('password_verified')) {
            const response = NextResponse.next();
            response.headers.set('x-password-verified', 'true');
            return response;
        }
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
};