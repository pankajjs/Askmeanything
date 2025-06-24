"use client"

import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { useContext } from "react"
import { AuthContext } from "@/lib/context"
import { toast } from "sonner"
import { ThemeToggle } from "./theme-toggle"
import { DashboardIcon, ExitIcon} from "@radix-ui/react-icons"
import Link from "next/link"
import { User } from "lucide-react"
import { DynaPuff } from "next/font/google";
import { ToolTipWrapper } from "./tooltip-wrapper"
import { useMutation } from "@tanstack/react-query"
import { API_URL } from "@/lib/api/constant"

const dynaPuff = DynaPuff({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
})

export default function Navbar() {
    const router = useRouter()
    const {user, setUser} = useContext(AuthContext)

    const loginMutation = useMutation({
        mutationFn: async () => {
            router.push(`/api/auth/login?redirectUrl=${window.location.href}`)
        },
    })

    const logoutMutation = useMutation({
        mutationFn: async () => {
            return await fetch(`${API_URL}/auth/logout`, {
                method: "POST",
            })
        },
        onSuccess(data) {
            if(data.ok){
                setUser(undefined)
                toast.success("Logged out successfully")
            }
        },
        onError(){
            toast.error("Failed to logout")
        }
    })

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
                                <ExitIcon onClick={()=>logoutMutation.mutateAsync()}/>
                            </ToolTipWrapper>
                        </div>
                    ) : (
                        <Button className="rounded-full" onClick={()=>loginMutation.mutate()}>Login</Button> 
                    )}
                </div>
            </div>
        </div>
    )
}