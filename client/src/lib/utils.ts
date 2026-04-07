import { EntityError } from "@/lib/http"
import { clsx, type ClassValue } from "clsx"
import { UseFormSetError } from "react-hook-form"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"
import jwt from "jsonwebtoken"
import authApiRequest from "@/apiRequests/auth"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleErrorApi = ({ error, setError, duration }: {
  error: any,
  setError?: UseFormSetError<any>,
  duration?: number
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: 'server',
        message: item.message
      })
    })
  }
  else {
    toast.error(error?.payload?.message || 'Lỗi không xác định', {
      duration: duration ?? 5000,
    })
  }
}

const isBrowser = typeof window !== 'undefined'

/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}

export const getAccessTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem('accessToken') : null
}

export const getRefreshTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem('refreshToken') : null
}

export const setAccessTokenToLocalStorage = (accessToken: string) => {
  return isBrowser && localStorage.setItem('accessToken', accessToken)
}

export const setRefreshTokenToLocalStorage = (refreshToken: string) => {
  return isBrowser && localStorage.setItem('refreshToken', refreshToken)
}

export const checkAndRefreshToken = async (params?: { 
  onError?: () => void,
  onSuccess?: () => void
}) => {
  const accessToken = getAccessTokenFromLocalStorage()
  const refreshToken = getRefreshTokenFromLocalStorage()
  
  if (!accessToken || !refreshToken) return;

  const decodedAccessToken = jwt.decode(accessToken) as { exp: number, iat: number }
  const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number, iat: number }

  const now = Date.now() / 1000 - 1

  if (decodedRefreshToken.exp <= now) return;

  // If the refresh token is about to expire, refresh it
  if (decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
    try {
      const { payload } = await authApiRequest.refreshToken()
      setAccessTokenToLocalStorage(payload.data.accessToken)
      setRefreshTokenToLocalStorage(payload.data.refreshToken)

      params?.onSuccess?.()
    }
    catch (error) {
      params?.onError?.()
    }
  }
}