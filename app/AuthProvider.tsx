"use client"

import { getAuthUser } from "@/lib/api/users";
import { AuthContext, User } from "@/lib/context";
import React, { useCallback, useEffect, useState } from "react";

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | undefined>(undefined)
    const [isLoading, setIsLoading] = useState(true)
    
    const fetchAuthUser = useCallback(async () => {
        const user = await getAuthUser()
        if(user){
            setUser(user)
            setIsLoading(false)
        }else{
            setIsLoading(false)
        }
    }, [])

    const logout = useCallback(async () => {
        try{
            const res = await fetch("/api/auth/logout", {
                method: "POST",
            })
            console.log(res.ok, res.status)
            if (res.ok){
                setUser(undefined)
                return true;
            }
        }catch(error){
            console.error(error)
        }
        return false;
    }, [])



    useEffect(()=>{
        fetchAuthUser()
    }, [fetchAuthUser])


    return <AuthContext.Provider value={{user, isLoading, logout}}>{children}</AuthContext.Provider>
}