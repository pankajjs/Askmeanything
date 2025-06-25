"use client"

import { Dashboard } from "@/components/dashboard";
import { AuthContext } from "@/lib/context";
import { useParams } from "next/navigation";
import { useContext } from "react";

export default function Page() {
  const {username} = useParams()
  const { user, loading } = useContext(AuthContext);

  if(loading){
    return <div className="flex justify-center items-center p-10">
      Checking authorization.....
    </div>
  }

  if(!user || user?.username !== username){
    return <div className="flex justify-center items-center p-10">
      You are not authorized access this page.
    </div>
  }

  return <div className="flex justify-center items-center">
    <Dashboard/>
  </div>
}

