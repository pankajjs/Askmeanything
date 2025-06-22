"use client"
import { toast } from "sonner"
import { Button } from "./ui/button"
import { useContext } from "react"
import { AuthContext, User } from "@/lib/context"


export const UpdateDetails = ({user}:{user: User}) => {
    const {user: authUser} = useContext(AuthContext);
    return (
        user?.username === authUser?.username &&
            <Button variant={"outline"} className="rounded-sm" onClick={() => {
                toast.info("This feature is not available yet")
            }}>
                <span className="text-sm">Update Details</span>
            </Button>
    )
}