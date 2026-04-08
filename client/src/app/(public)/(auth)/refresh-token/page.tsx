'use client'

import { checkAndRefreshToken, getRefreshTokenFromLocalStorage } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect } from "react"

function RefreshToken() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const refreshToken = searchParams.get('refreshToken')
	const redirect = searchParams.get('redirect')
	
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

export default function RefreshTokenPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<RefreshToken />
		</Suspense>
	)
}