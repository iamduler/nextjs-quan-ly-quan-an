import { NextResponse, NextRequest } from 'next/server'

const privatePaths = ['/manage']
const unAuthPaths = ['/login']
 
// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl
	const isAuthenticated = Boolean(request.cookies.get('accessToken')?.value)

	console.log('pathname', pathname)
	console.log('isAuthenticated', isAuthenticated)

	// If not logged in and trying to access private paths, redirect to login
	if (privatePaths.some(path => pathname.startsWith(path)) && !isAuthenticated) {
		return NextResponse.redirect(new URL('/login', request.url))
	}

	// If logged in and trying to access unAuth paths, redirect to home
	if (unAuthPaths.some(path => pathname.startsWith(path)) && isAuthenticated) {
		return NextResponse.redirect(new URL('/', request.url))
	}

	return NextResponse.next()
}
 
export const config = {
  matcher: ['/manage/:path*', '/login'],
}