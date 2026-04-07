'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import RefreshToken from './refresh-token'
import { createContext, useContext, useEffect, useState } from 'react'
import { getAccessTokenFromLocalStorage, removeTokensFromLocalStorage } from '@/lib/utils'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false, // Không refetch lại dữ liệu khi focus lại window
			refetchOnMount: false, // Không refetch lại dữ liệu khi component mount
		}
	}
})

const AppContext = createContext({
	isAuth: false,
	setIsAuth: (isAuth: boolean) => {},
})

export const useAppContext = () => {
	return useContext(AppContext)
}

export default function AppProvider({ children }: {
	children: React.ReactNode
}) {
	const [isAuth, setIsAuthState] = useState(false)

	useEffect(() => {
		const accessToken = getAccessTokenFromLocalStorage()
		
		if (accessToken) {
			setIsAuthState(true)
		}
	}, [])

	/**
	 * If using React 19 & Next.js 15, we don't need use useCallback to memo the setIsAuth function
	 */
	const setIsAuth = (isAuth: boolean) => {
		setIsAuthState(isAuth)

		!isAuth && removeTokensFromLocalStorage()
	}

	/**
	 * If using React 19 & Next.js 15, we don't need use AppContext.Provider, using AppContext instead	
	 */
	return (
		<AppContext value={{ isAuth, setIsAuth }}>
			<QueryClientProvider client={queryClient}>
				{children}
				<RefreshToken />
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</AppContext>
	)
}