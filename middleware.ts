import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  // Public paths
  if (path === '/' || path === '/login') {
    return supabaseResponse;
  }

  // Protect private paths
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Role-Based Access Control
  // Fetch user role from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = profile?.role;
  
  console.log("Middleware user.id:", user.id, "role:", role, "path:", path);

  if (path.startsWith('/admin') && role !== 'super_admin' && role !== 'district_admin') {
    console.log("Redirecting /admin to /login");
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (path.startsWith('/manager') && role !== 'centre_manager') {
    // Note: the SQL schema uses 'centre_manager'
    console.log("Redirecting /manager to /login because role is:", role);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (path.startsWith('/farmer') && role !== 'farmer') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect root authenticated to their dashboard
  if (path === '/') {
    if (role === 'farmer') return NextResponse.redirect(new URL('/farmer', request.url));
    if (role === 'centre_manager') return NextResponse.redirect(new URL('/manager', request.url));
    if (role === 'super_admin' || role === 'district_admin') return NextResponse.redirect(new URL('/admin', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
