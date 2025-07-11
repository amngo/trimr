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
    
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*'],
};