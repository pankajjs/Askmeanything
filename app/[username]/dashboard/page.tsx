"use client"

import { Dashboard } from "@/components/dashboard";
import { AuthContext } from "@/lib/context";
import { useParams } from "next/navigation";
import { useContext } from "react";

export default function Page() {
  const {username} = useParams()
  const { user } = useContext(AuthContext);
  
  if(!user || user?.username != username){
    return <div>You are unauthorized to access this page</div>
  }

  return <div className="flex justify-center items-center">
    <Dashboard/>
  </div>
}

