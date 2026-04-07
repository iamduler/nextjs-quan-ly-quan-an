'use client'

import { checkAndRefreshToken, getRefreshTokenFromLocalStorage } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function RefreshTokenPage() {
	const router = useRouter()
	const refreshToken = useSearchParams().get('refreshToken')
	const redirect = useSearchParams().get('redirect')
	
	useEffect(() => {
		if (refreshToken && refreshToken == getRefreshTokenFromLocalStorage()) {
			checkAndRefreshToken({
				onSuccess: () => {
					console.log('redirect', redirect)
					router.push(redirect ?? '/')
				}
			})
		}
		else {
			router.push('/')
		}
	}, [refreshToken, router, redirect])

	return (
		<div>Refresh Token...</div>
	)
}