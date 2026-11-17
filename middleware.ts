import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROLES } from './constants';
import { AUTH_ROUTES, ROUTES } from './constants/routes';
import { auth } from './lib/auth';
import { createRouterMatcher } from './lib/routeMatcher';

const routeMatcher = createRouterMatcher([
    { matcher: AUTH_ROUTES.SIGN_IN, auth: false },
    { matcher: AUTH_ROUTES.TERMS, auth: false },
    { matcher: '/admission/preadmission/transactions/application-form/payment/success', auth: false },
    { matcher: '/admission/preadmission/transactions/application-form/payment/failure', auth: false },
    { matcher: ROUTES.DASHBOARD, auth: true },
    {
        matcher: ROUTES.ADMISSION.ADMISSION_SUB_MENUS.PREADMISSION,
        auth: true,
        role: [ROLES.GENERAL_STAFF]
    }
]);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ✅ Skip middleware for API auth routes to prevent fetch errors/recursion
    if (pathname.startsWith('/api/auth/')) {
        return NextResponse.next();
    }

    const session = await auth();

    const isLoggedIn = session;
    const userRole = session?.role;

    // ✅ FIXED: Only intercept OLD payment page routes, not API routes
    if (request.method === 'POST') {
        // Check if POST is to OLD page routes (not API routes)
        if (pathname.startsWith('/admission/preadmission/transactions/application-form/payment/success/')) {
            const transactionId = pathname.split('/').pop();
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
            console.log('baseUrl Success POST Middleware', baseUrl);

            const redirectUrl = `${baseUrl}/api/payment/callback/success?transaction_id=${transactionId}`;
            const response = NextResponse.redirect(redirectUrl, { status: 307 });

            response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
            response.headers.set('Pragma', 'no-cache');

            return response;
        }

        if (pathname.startsWith('/admission/preadmission/transactions/application-form/payment/failure/')) {
            const transactionId = pathname.split('/').pop();
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
            console.log('baseUrl Failure POST Middleware', baseUrl);

            const redirectUrl = `${baseUrl}/api/payment/callback/failure?transaction_id=${transactionId}`;
            const response = NextResponse.redirect(redirectUrl, { status: 307 });

            response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
            response.headers.set('Pragma', 'no-cache');

            return response;
        }
    }

    // ✅ Allow API payment callback routes to pass through without auth
    if (pathname.startsWith('/api/payment/callback/')) {
        return NextResponse.next();
    }

    // Check for which must be accessible even without login
    if (pathname === AUTH_ROUTES.TERMS) {
        return NextResponse.next();
    }

    // Allow payment result pages (success/failure display pages)
    if (pathname.startsWith('/admission/preadmission/transactions/application-form/payment/')) {
        return NextResponse.next();
    }

    // Allow public access to dynamic single-segment paths like /VVVS
    if (/^\/[A-Za-z0-9]+$/.test(pathname)) {
        return NextResponse.next();
    }

    if (pathname === AUTH_ROUTES.SIGN_IN) {
        // Check for sign-in page access
        if (isLoggedIn) {
            const redirectedFrom = request.nextUrl.searchParams.get('redirectedFrom');
            if (redirectedFrom !== 'home') {
                const redirectUrl = new URL('/', request.url);
                redirectUrl.searchParams.set('redirectedFrom', 'signin');
                return NextResponse.redirect(redirectUrl);
            }
            return NextResponse.next();
        }
        return NextResponse.next();
    }

    const matchedRoute = routeMatcher(pathname);

    if (!matchedRoute) {
        return NextResponse.next();
    }

    if (matchedRoute.auth && !isLoggedIn) {
        const callbackUrl = encodeURIComponent(pathname);
        return NextResponse.redirect(new URL(`${AUTH_ROUTES.SIGN_IN}?callbackUrl=${callbackUrl}`, request.url));
    }

    if (matchedRoute.role) {
        const roles = Array.isArray(matchedRoute.role) ? matchedRoute.role : [matchedRoute.role];
        if (userRole && !roles.includes(userRole)) {
            return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
        }
    }

    if (pathname === '/' && isLoggedIn) {
        const redirectedFrom = request.nextUrl.searchParams.get('redirectedFrom');
        if (redirectedFrom === AUTH_ROUTES.SIGN_IN) {
            const cleanUrl = new URL('/', request.url);
            return NextResponse.redirect(cleanUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Exclude Next.js internals, static files, and manifest.json
        '/((?!_next|manifest\\.json|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)'
    ]
};
