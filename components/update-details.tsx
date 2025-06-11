"use client"
import { toast } from "sonner"
import { Button } from "./ui/button"


export const UpdateDetails = () => {
    return (
        <Button variant={"outline"} className="rounded-sm" onClick={() => {
            toast.info("This feature is not available yet")
        }}>
            <span className="text-sm">Update Details</span>
        </Button>
    )
}