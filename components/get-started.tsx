"use client"

import { AuthContext } from "@/lib/context"
import { Link } from "lucide-react"
import { useContext } from "react"
import { Button } from "./ui/button";

export const GetStarted = () => {
    const {user} = useContext(AuthContext);
    return <Link href={user ? `/${user.username}` : `/api/auth/login`}>
        <Button className="rounded-full p-5 text-md">Get Started</Button>
  </Link>
}