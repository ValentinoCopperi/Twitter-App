import { NextRequest, NextResponse } from 'next/server';
import { userData } from '@/lib/session';

export async function middleware(req: NextRequest) {
  const { isLoggedIn } = await userData();

  const protectedRoutes = ['/user/me', '/settings']; 

  if (!isLoggedIn && protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/user/me', '/settings'], 
};
