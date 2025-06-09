"use client"

import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { useCallback, useContext } from "react"
import { AuthContext } from "@/lib/context"
import { toast } from "sonner"
import { ThemeToggle } from "./theme-toggle"
import { DashboardIcon, ExitIcon } from "@radix-ui/react-icons"
import Link from "next/link"

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
        <div className="px-8 py-4">
            <div className="flex justify-between items-center border-[1px] rounded-full p-4">
                <div>
                    <h1>Logo</h1>
                </div>
                <div className="nav-links flex items-center justify-center gap-4">
                    <ThemeToggle/>
                    { user ? (
                        <div className="flex items-center justify-center gap-4">
                            <Link href={`${user.username}/dashboard`}>
                            <DashboardIcon/>
                            </Link>
                            <ExitIcon onClick={handleLogout}/>
                        </div>
                    ) : (
                        <Button onClick={handleLogin}>Login</Button> 
                    )}
                </div>
            </div>
        </div>
    )
}