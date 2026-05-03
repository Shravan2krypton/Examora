import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // For demo mode, allow access to all pages
  // In production, you would implement proper authentication here
  const publicPaths = ["/", "/login", "/register", "/leaderboard", "/dashboard/admin", "/dashboard/student"];
  
  // Allow access to all paths in demo mode
  if (publicPaths.some(p => path.startsWith(p)) || path.startsWith("/api")) {
    return NextResponse.next();
  }
  
  // For any other paths, allow access in demo mode
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
