'use client'

import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from "@/lib/utils"
import { useLogoutMutation } from "@/queries/useAuth"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"
import { useAppContext } from "@/components/app-provider"

export default function LogoutPage() {
	const { mutateAsync } = useLogoutMutation()
	const router = useRouter()
	const ref = useRef<any>(null)
	const refreshToken = useSearchParams().get('refreshToken')
	const accessToken = useSearchParams().get('accessToken')
	const { setIsAuth } = useAppContext()
	
	useEffect(() => {
		if (ref.current || 
			(refreshToken && refreshToken != getRefreshTokenFromLocalStorage()) ||
			(accessToken && accessToken != getAccessTokenFromLocalStorage())
		) {
			router.push('/')
			return
		}
		
		ref.current = mutateAsync // Tạm thời lưu lại mutateAsync để tránh gọi lại API trong strict mode

		mutateAsync().then((_) => {
			setTimeout(() => {
				ref.current = null
			}, 1000)

			setIsAuth(false)
			router.push('/login')
		})
	}, [mutateAsync, router, refreshToken, accessToken])

	return (
		<div>Logout Page</div>
	)
}