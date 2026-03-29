import { NextResponse, NextRequest } from 'next/server'

const privatePaths = ['/manage']
const unAuthPaths = ['/login']
 
// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl
	const refreshToken = request.cookies.get('refreshToken')?.value
	const accessToken = request.cookies.get('accessToken')?.value

	// Chưa đăng nhập thì không cho vào private paths
	if (privatePaths.some(path => pathname.startsWith(path)) && !refreshToken) {
		return NextResponse.redirect(new URL('/login', request.url))
	}

	// Đăng nhập rồi thì sẽ không cho vào login nữa
	if (unAuthPaths.some(path => pathname.startsWith(path)) && refreshToken) {
		return NextResponse.redirect(new URL('/', request.url))
	}

	// Đăng nhập rồi nhưng access token hết hạn
	if (privatePaths.some(path => pathname.startsWith(path)) && refreshToken && !accessToken) {
		const url = new URL('/logout', request.url);
		url.searchParams.set('refreshToken', refreshToken ?? '')
		return NextResponse.redirect(url)
	}
	
	return NextResponse.next()
}
 
export const config = {
  matcher: ['/manage/:path*', '/login'],
}