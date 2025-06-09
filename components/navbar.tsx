"use client"

import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { useCallback, useContext } from "react"
import { AuthContext } from "@/lib/context"
import { toast } from "sonner"

export default function Navbar() {
    const router = useRouter()
    const {user, logout} = useContext(AuthContext)

    const handleLogin = useCallback(async () => {
        router.push(`/api/auth/login?redirectUrl=${window.location.href}`)
     }, [router])


     const handleLogout = useCallback(async () => {
        const ok = await logout()
        if(ok) {
          toast.success("Logged out successfully")
          router.push("/")
        }
        else toast.error("Failed to logout")
     }, [logout, router])

    return (
        <div className="flex justify-between items-center p-4">
            <div>
                <h1>Logo</h1>
            </div>
            <div>
                { user ? (
                    <Button onClick={handleLogout}>Logout</Button>
                ) : (
                    <Button onClick={handleLogin}>Login</Button> 
                )}
            </div>
        </div>
    )
}