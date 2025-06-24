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
