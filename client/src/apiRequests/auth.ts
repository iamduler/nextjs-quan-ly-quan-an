import http from "@/lib/http";
import { LoginBodyType, LoginResType, LogoutBodyType, RefreshTokenBodyType, RefreshTokenResType } from "@/schemaValidations/auth.schema";

const authApiRequest = {
	// Prevent multiple requests
	refreshTokenRequest: null as null | Promise<{
		status: number
		payload: RefreshTokenResType
	}>,

	sLogin: (body: LoginBodyType) => http.post<LoginResType>('/auth/login', body), // Server-side login
	login: (body: LoginBodyType) => http.post<LoginResType>('/api/auth/login', body, { baseUrl: '' }), // Client-side login
	sLogout: (body: LogoutBodyType & { accessToken: string }) => http.post('/auth/logout', { refreshToken: body.refreshToken }, {
		headers: {
			Authorization: `Bearer ${body.accessToken}`
		}
	}),
	logout: () => http.post('/api/auth/logout', null, { baseUrl: '' }),
	sRefreshToken: (body: RefreshTokenBodyType) => http.post<RefreshTokenResType>('/auth/refresh-token', body),
	async refreshToken() {
		if (this.refreshTokenRequest) {
			return this.refreshTokenRequest
		}

		this.refreshTokenRequest = http.post<RefreshTokenResType>('/api/auth/refresh-token', null, { baseUrl: '' })
		const response = await this.refreshTokenRequest
		this.refreshTokenRequest = null
		return response
	},
}

export default authApiRequest