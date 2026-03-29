'use client'

import { getRefreshTokenFromLocalStorage } from "@/lib/utils"
import { useLogoutMutation } from "@/queries/useAuth"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"

export default function LogoutPage() {
	const { mutateAsync } = useLogoutMutation()
	const router = useRouter()
	const ref = useRef<any>(null)
	const refreshToken = useSearchParams().get('refreshToken')
	
	useEffect(() => {
		if (ref.current || refreshToken != getRefreshTokenFromLocalStorage()) return
		
		ref.current = mutateAsync // Tạm thời lưu lại mutateAsync để tránh gọi lại API trong strict mode

		mutateAsync().then((_) => {
			setTimeout(() => {
				ref.current = null
			}, 1000)

			router.push('/login')
		})
	}, [mutateAsync, router, refreshToken])

	return (
		<div>Logout Page</div>
	)
}