import { createContext } from "react";
import { User } from "../types";

export type AuthContextType = {
    user: User | undefined
    setUser: (user: User | undefined)=>void
}

export const AuthContext = createContext<AuthContextType>({
    user: undefined,
    setUser: ()=>{}
})