import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { updateSession } from '@/lib/supabase/middleware';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Database integration is currently disabled. 
    // Bypassing Supabase auth check so UI remains accessible without DB variables.
    // return await updateSession(request);
    return NextResponse.next();
  }
  return intlMiddleware(request);
}

export const config = {
  // Match both localized paths and dashboard paths, exclude api, next internal, and static files
  matcher: ['/', '/(en|mr)/:path*', '/dashboard/:path*'],
};
