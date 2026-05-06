import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './lib/i18n';

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  // /admin 경로는 다국어 미들웨어 거치지 않음
  if (req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }
  return intlMiddleware(req);
}

export const config = {
  // /api, /admin, /_next, public files 제외
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)'],
};
