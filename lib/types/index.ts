import { Prisma } from "../config/prisma";

export type User = {
    id: string,
    email: string,
    username: string,
    createdAt: number,
    updatedAt: number,
    roles: JSON,
    status: string,
    active: boolean
}

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

export type Reply = Prisma.ReplyGetPayload<{
    select: {
        createdAt: true,
        data: true,
        id: true,
        qId: true,
        updatedAt: true,
        question: {
            select: {
                user: {
                    select: {
                        username: true,
                    }
                }
            }
        }
    },
}>

export const createSuccessResponse = (message: string, data?: object) => {
    return {
        success: true,
        message,
        data,
    }
}