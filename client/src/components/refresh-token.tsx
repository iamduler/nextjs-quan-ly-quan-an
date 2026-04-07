'use client'

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { checkAndRefreshToken } from "@/lib/utils"

const UNAUTHENTICATED_PATHS = ['/login', '/register', '/logout']

export default function RefreshToken() {
	const pathname = usePathname()
	const TIME_OUT = 1000

	useEffect(() => {
		if (UNAUTHENTICATED_PATHS.includes(pathname)) return

		let interval: any = null
		
		checkAndRefreshToken({ onError: () => {
			clearInterval(interval)
		}}) // Check and refresh token immediately

		interval = setInterval(checkAndRefreshToken, TIME_OUT)

		return () => clearInterval(interval)
	}, [pathname])

	return null
}