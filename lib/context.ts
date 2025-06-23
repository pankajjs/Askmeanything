import { createContext } from "react";
import { Prisma } from "./prisma";

export type User = Prisma.UserGetPayload<{
    select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
        roles: true,
        status: true,
    }
}>

export type Question = Prisma.QuestionGetPayload<{
    select: {
        id: true;
        createdAt: true;
        updatedAt: true;
        data: true;
        answered: true;
        userId: true;
    }
}>

export type AuthContextType = {
    user: User | undefined
    isLoading: boolean
    logout: () => Promise<boolean>
}

export const AuthContext = createContext<AuthContextType>({
    user: undefined,
    isLoading: true,
    logout: async () => false,
})