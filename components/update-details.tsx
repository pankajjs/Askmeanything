"use client"
import { Button } from "./ui/button"
import { useContext } from "react"
import { AuthContext, User } from "@/lib/context"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Label } from "./ui/label"
import { Input } from "./ui/input"


export const UpdateDetails = ({user}:{user: User}) => {
    const {user: authUser} = useContext(AuthContext);
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
              <div className="flex flex-col gap-3">
                <Label htmlFor="name-1">Status</Label>
                <div className="flex gap-3">
                    <Input id="name-1" className="" name="name" defaultValue={`Ask something interesting to ${authUser.username}`} />
                    <Button>Save</Button>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="username-1">Username</Label>
                <div className="flex gap-3">
                <Input id="username-1" name="username" defaultValue={authUser.username} />
                <Button>Save</Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="w-full">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
            
    )
}