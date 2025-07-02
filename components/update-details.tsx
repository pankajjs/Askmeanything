"use client"

import { Button } from "./ui/button"
import { useContext, useState } from "react"
import { AuthContext } from "@/lib/context"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { updateUser } from "@/lib/api/users"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { User } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"


export const UpdateDetails = ({user}:{user: User}) => {
    const {user: authUser, setUser} = useContext(AuthContext);
    const router = useRouter();
    
    const [userDetails, setUserDetails] = useState({
        username: user?.username ?? "",
        status: user?.status ?? `Ask something interesting huh:)`,
        active: user.active ? "Yes" : "No"
    })

    const updateUserMutation = useMutation({
        mutationFn: () => updateUser({
            username: userDetails.username,
            status: userDetails.status,
            active: userDetails.active === "Yes",
        }),
        onSuccess(data){
            if(data){
                setUser({
                    ...authUser!,
                    username: data.username,
                    active: data.active,
                    updatedAt: data.updatedAt,
                    status: data.status,
                })
                window.location.href = `${process.env.NEXT_PUBLIC_DOMAIN}/${data.username}`
                toast.success("Update your details, Please refresh the page.");
            }
        },
        onError(){
            toast.error("Failed to update your details")
        }
    })

    return (
        user?.username === authUser?.username &&
        <Dialog>
        <form>
          <DialogTrigger asChild>
            <Button variant={"outline"} className="rounded-sm">
                <span className="text-sm">Update Details</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
                <div className="grid gap-3">
                    <Label htmlFor="status-1">Status</Label>
                    <Input id="status-1" className="" name="status" value={userDetails.status} onChange={(e)=>{
                        setUserDetails((p)=>{
                            return {
                                ...p,
                                status: e.target.value,
                            }
                        });
                    }} />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="username-1">Username</Label>
                    <Input id="username-1" name="username" value={userDetails.username} onChange={(e)=>{
                        setUserDetails((p)=>{
                            return {
                                ...p,
                                username: e.target.value,
                            }
                        });
                    }}/>
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="username-1">Are you receiving questions today?</Label>
                    <Select value={userDetails.active} onValueChange={(v)=>{
                        setUserDetails((s)=>{
                            return {
                                ...s,
                                active: v,
                            }
                        })
                    }}>
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter className="flex">
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" onClick={()=>updateUserMutation.mutateAsync()}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
            
    )
}