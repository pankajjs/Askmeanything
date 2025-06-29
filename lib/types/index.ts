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
    username: string,
}

export type Reply = {
    id: string,
    questionId: string,
    data: string,
    createdAt: number,
    updatedAt: number,
    createdBy: string,
}

export const createSuccessResponse = (message: string, data?: object) => {
    return {
        success: true,
        message,
        data,
    }
}

export type CreateQuestionRequestDto = {
    data: string, 
    username: string, 
    createdBy?: string
}