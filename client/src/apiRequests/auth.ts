import http from "@/lib/http";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";

const authApiRequest = {
	sLogin: (body: LoginBodyType) => http.post<LoginResType>('/auth/login', body), // Server-side login
	login: (body: LoginBodyType) => http.post<LoginResType>('/api/auth/login', body, { baseUrl: '' }), // Client-side login
}

export default authApiRequest