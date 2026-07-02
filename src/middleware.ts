import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { updateSession } from '@/lib/supabase/middleware';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return await updateSession(request);
  }
  return intlMiddleware(request);
}

export const config = {
  // Match both localized paths and dashboard paths, exclude api, next internal, and static files
  matcher: ['/', '/(en|mr)/:path*', '/dashboard/:path*'],
};
