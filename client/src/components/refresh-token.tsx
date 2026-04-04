'use client'

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage, setAccessTokenToLocalStorage, setRefreshTokenToLocalStorage } from "@/lib/utils"
import jwt from "jsonwebtoken"
import authApiRequest from "@/apiRequests/auth"

const UNAUTHENTICATED_PATHS = ['/login', '/register', '/logout']

export default function RefreshToken() {
	const pathname = usePathname()
	const TIME_OUT = 1000

	useEffect(() => {
		if (UNAUTHENTICATED_PATHS.includes(pathname)) return

		let interval: any = null
		const checkAndRefreshToken = async () => {
			const accessToken = getAccessTokenFromLocalStorage()
			const refreshToken = getRefreshTokenFromLocalStorage()
			
			if (!accessToken || !refreshToken) return

			const decodedAccessToken = jwt.decode(accessToken) as { exp: number, iat: number }
			const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number, iat: number }

			const now = Math.floor(Date.now() / 1000)

			if (decodedAccessToken.exp <= now) return;

			// If the refresh token is about to expire, refresh it
			if (decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
				try {
					const { payload } = await authApiRequest.refreshToken()
					setAccessTokenToLocalStorage(payload.data.accessToken)
					setRefreshTokenToLocalStorage(payload.data.refreshToken)
				}
				catch (error) {
					clearInterval(interval)
				}
			}
		}

		checkAndRefreshToken() // Check and refresh token immediately

		interval = setInterval(checkAndRefreshToken, TIME_OUT)

		return () => clearInterval(interval)
	}, [pathname])

	return null
}