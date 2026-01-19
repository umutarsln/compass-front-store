"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { authService, LoginDto, RegisterDto, User } from "@/services/auth.service"
import { isAuthenticated, isTokenExpired, getToken } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { syncOnLogin } from "@/lib/cart-sync"
import { clearCartData } from "@/lib/cart-storage"
import { clearFavorites } from "@/lib/favorites-storage"

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (loginDto: LoginDto) => Promise<void>
    register: (registerDto: RegisterDto) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    // Sayfa yüklendiğinde kullanıcı bilgisini kontrol et
    useEffect(() => {
        const checkAuth = () => {
            try {
                const token = getToken()
                if (token && !isTokenExpired(token)) {
                    const currentUser = authService.getCurrentUser()
                    if (currentUser) {
                        setUser(currentUser)
                    } else {
                        // Token var ama user bilgisi yok, logout yap
                        authService.logout()
                        setUser(null)
                    }
                } else {
                    // Token yok veya expire olmuş
                    authService.logout()
                    setUser(null)
                }
            } catch (error) {
                console.error("Auth check error:", error)
                authService.logout()
                setUser(null)
            } finally {
                setIsLoading(false)
            }
        }

        checkAuth()

        // Token expire kontrolü için interval
        const interval = setInterval(() => {
            const token = getToken()
            if (token && isTokenExpired(token)) {
                authService.logout()
                setUser(null)
            }
        }, 60000) // Her dakika kontrol et

        return () => clearInterval(interval)
    }, [])

    const login = async (loginDto: LoginDto) => {
        try {
            const response = await authService.login(loginDto)
            setUser(response.user)

            // Wait a bit to ensure token is set in localStorage
            // This ensures axios interceptor can pick up the token
            await new Promise(resolve => setTimeout(resolve, 200))

            // Sync cart and favorites on login (silently fail if it doesn't work)
            try {
                await syncOnLogin()
            } catch (syncError: any) {
                // Only log non-401 errors (401 is expected during login flow)
                if (syncError?.response?.status !== 401) {
                    console.error("Cart sync error on login:", syncError)
                }
                // Don't fail login if sync fails
            }
            router.push("/")
        } catch (error: any) {
            throw error
        }
    }

    const register = async (registerDto: RegisterDto) => {
        try {
            console.log("Auth context register:", registerDto)
            const response = await authService.register(registerDto)
            console.log("Register response:", response)
            setUser(response.user)

            // Wait a bit to ensure token is set in localStorage
            // This ensures axios interceptor can pick up the token
            await new Promise(resolve => setTimeout(resolve, 200))

            // Sync cart and favorites on register (same as login)
            try {
                await syncOnLogin()
            } catch (syncError: any) {
                // Only log non-401 errors (401 is expected during register flow)
                if (syncError?.response?.status !== 401) {
                    console.error("Cart sync error on register:", syncError)
                }
                // Don't fail register if sync fails
            }
            router.push("/")
        } catch (error: any) {
            console.error("Auth context register error:", error)
            throw error
        }
    }

    const logout = () => {
        // Clear auth data
        authService.logout()
        setUser(null)

        // Clear cart and favorites from localStorage
        clearCartData()
        clearFavorites()

        // Reload page to reset all state
        if (typeof window !== 'undefined') {
            window.location.href = '/'
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user && isAuthenticated(),
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
