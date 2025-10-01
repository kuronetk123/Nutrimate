"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function useAuth() {
    const { data: session, status } = useSession()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (status !== "loading") {
            const timer = setTimeout(() => {
                setIsLoading(false)
            }, 50)

            return () => clearTimeout(timer)
        }
    }, [status])

    const login = async () => {
        await signIn("google", { callbackUrl: "/onboarding" })
    }

    const loginAdmin = async () => {
        await signIn("google", { callbackUrl: "/admin/auth-check" })
    }

    const logout = async () => {
        await signOut({ callbackUrl: "/" })
    }

    const isAuthenticated = !!session
    const isAdmin = session?.user?.role === "admin"
    console.log("session hook >> ", session)
    return {
        user: session?.user,
        loading: isLoading || status === "loading",
        login,
        loginAdmin,
        logout,
        isAuthenticated,
        isAdmin,
    }
}
