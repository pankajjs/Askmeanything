"use client"

import { getAuthUser } from "@/lib/api/users";
import { AuthContext} from "@/lib/context";
import { User } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | undefined>(undefined)
    const { data, isSuccess } = useQuery({
        queryKey: ["auth-user"],
        queryFn: getAuthUser,
        retry(failureCount) {
            return failureCount < 1;
        },
    })

    useEffect(()=>{
        if(isSuccess){
            setUser(data)
        }
    }, [isSuccess])
    
    return <AuthContext.Provider value={{user, setUser}}>{children}</AuthContext.Provider>
}