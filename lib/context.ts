import { createContext, useContext } from "react";
import { Prisma } from "./prisma";

export type User = Prisma.UserGetPayload<{}>
export type AuthContextType = {
    user: User | undefined
    isLoading: boolean
    logout: () => Promise<boolean>
}

export const AuthContext = createContext<AuthContextType>({
    user: undefined,
    isLoading: true,
    logout: async () => false
})