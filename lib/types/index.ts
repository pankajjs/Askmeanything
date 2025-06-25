import { Prisma } from "../config/prisma";

export type User = Prisma.UserGetPayload<{
    select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
        roles: true,
        status: true,
        active: true
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
