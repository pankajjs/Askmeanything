"use client"

import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { useCallback, useContext } from "react"
import { AuthContext } from "@/lib/context"
import { toast } from "sonner"
import { ThemeToggle } from "./theme-toggle"
import { DashboardIcon, ExitIcon} from "@radix-ui/react-icons"
import Link from "next/link"
import { User } from "lucide-react"
import { DynaPuff } from "next/font/google";
import { ToolTipWrapper } from "./tooltip-wrapper"

const dynaPuff = DynaPuff({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
})

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
        <div className="px-6 py-4 flex justify-center items-center">
            <div className="flex justify-between items-center border-[1px] rounded-full p-4 w-full xs:w-[80%] md:w-[70%] lg:w-[50%]">
                <div className="">
                    <Link href="/">
                        <span className={`${dynaPuff.className} text-2xl font-bold`}>AMA</span>
                    </Link>
                </div>
                <div className="nav-links flex items-center justify-center gap-4">
                    <ToolTipWrapper content="Change Theme">
                        <ThemeToggle/>
                    </ToolTipWrapper>
                    { user ? (
                        <div className="flex items-center justify-center gap-4">
                            <ToolTipWrapper content={user.username}>
                                <Link href={`/${user.username}`}><User className="w-4 h-4"/></Link>
                            </ToolTipWrapper>
                            <ToolTipWrapper content="Dashboard">
                                <Link href={`/${user.username}/dashboard`}>
                                    <DashboardIcon/>
                                </Link>
                            </ToolTipWrapper>
                            <ToolTipWrapper content={"Logout"}>
                                <ExitIcon onClick={handleLogout}/>
                            </ToolTipWrapper>
                        </div>
                    ) : (
                        <Button className="rounded-full" onClick={handleLogin}>Login</Button> 
                    )}
                </div>
            </div>
        </div>
    )
}