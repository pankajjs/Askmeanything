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
    createdFor: string, // username of host
    createdBy?: string, // username of guest/anon
}

export type Reply = {
    id: string,
    questionId: string,
    data: string,
    createdAt: number,
    updatedAt: number,
    createdFor?: string, // username of guest/anon
    createdBy: string // username of host
}

export type CreateQuestionRequestDto = {
    data: string, 
    createdFor: string, // username of host
    createdBy?: string // username of guest/anon
}