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

export type Question = {
    id: string;
    createdAt: number;
    updatedAt: number;
    data: string;
    answered: boolean;
    userId: string;
    createdBy?: string,
}

export type Reply = {
    createdAt: number,
    data: string,
    id: string,
    qId: string,
    updatedAt: number,
    username: string,
}

export const createSuccessResponse = (message: string, data?: object) => {
    return {
        success: true,
        message,
        data,
    }
}

export type CreateQuestionDto = {
    data: string, 
    username: string, 
    createdBy?: string
}