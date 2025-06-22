"use client"

import { API_URL } from "@/lib/api/constant";
import { getAuthUser } from "@/lib/api/users";
import { AuthContext, User } from "@/lib/context";
import React, { useCallback, useEffect, useState } from "react";

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | undefined>(undefined)
    const [isLoading, setIsLoading] = useState(true)
    
    const fetchAuthUser = useCallback(async () => {
        const res = await getAuthUser()
        if(!res.error){
            setUser(res.data)
            setIsLoading(false)
        }else{
            setIsLoading(false)
        }
    }, [])
    
    const logout = useCallback(async () => {
        try{
            const res = await fetch(`${API_URL}/auth/logout`, {
                method: "POST",
            })
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