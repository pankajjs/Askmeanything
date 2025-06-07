"use client"

import { toast } from "sonner"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

export default function Navbar() {
    const router = useRouter()
    const [auth, setAuth] = useState(false);

    const handleLogout = useCallback(async () => {
        try{
            const res = await fetch("/api/auth/logout", {
                method: "POST",
            })
            if (res.ok){
                setAuth(false)
                toast.success("Logged out successfully")
                router.push("/")
            }
        }catch(error){
            console.error(error)
            toast.error("Failed to logout")
        }
    }, [router])

    const handleLogin = useCallback(async () => {
        router.push(`/api/auth/login?redirectUrl=${window.location.href}`)
     }, [router])

     const fetchAuthUser = useCallback(async () => {
        try{
            const res = await fetch("/api/me", {
                method: "GET",
                credentials: "include",
            })
            if(res.ok){
                setAuth(true)
            }
        }catch(error){
            console.error(error)
        }
    }, [])

    useEffect(() => {
        fetchAuthUser()
    }, [fetchAuthUser])



    return (
        <div className="flex justify-between items-center p-4">
            <div>
                <h1>Logo</h1>
            </div>
            <div>
                {auth ? (
                    <Button onClick={handleLogout}>Logout</Button>
                ) : (
                    <Button onClick={handleLogin}>Login</Button> 
                )}
            </div>
        </div>
    )
}