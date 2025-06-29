import { Filter } from "firebase-admin/firestore";
import { db } from "../config/firestore";
import { Question } from "../types";

export type CreateQuestionDto = {
    data: string,
    userId: string,
    createdBy: string,
    username: string,
}

export const updateQuestionById = async (id: string, questionDto: Partial<Question>) => {
    try{
        questionDto = {...questionDto, updatedAt: Date.now()}

        await db.collection("questions").doc(id).update({
            ...questionDto,
        })

        return {
            ...questionDto,
        }
    }catch(error){
        console.error(`Error while updating question by id:${id}`, error);
        throw error;
    }
}

export const createQuestion = async ({data, userId, createdBy, username}: CreateQuestionDto): Promise<Question> => {
    try{
        const questionDoc = await db.collection("questions").add({
            data,
            userId,
            createdBy,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            answered: false,
            username,
        });
        
        const question = (await questionDoc.get()).data() as unknown as Question;

        return {
            id: questionDoc.id,
            data: question.data,
            answered: question.answered,
            updatedAt: question.updatedAt,
            createdAt: question.createdAt,
            userId: question.userId,
            username: question.username
        }
    }catch(error){
        console.error("Error while creating question", error);
        throw error;
    }
}

export const findQuestionById = async (id: string): Promise<Question | null> => {
    try{
        const question = await db.collection("questions").doc(id).get();
        
        if(!question.exists){
            return null;
        }

        return {
            id: question.id,
            ...question.data(),
        } as unknown as Question;
    }catch(error){
        console.error(`Error while fetching question by id:${id}`, error);
        throw error;
    }
}

export const deleteQuestionById = async (id: string) => {
    try{
        await db.collection("questions").doc(id).delete();
    }catch(error){
        console.error(`Error while deleting question by id:${id}`, error);
        throw error;
    }
}

export type Prop = {
    id: string,
    answered?: boolean
    createdAt: number
}

export const findQuestionsByUserId = async ({id, createdAt, answered}: Prop) => {
    try{
        const questionsDoc = await db.collection("questions")
                            .where(
                                Filter.and(
                                    Filter.where("userId", "==", id),
                                    Filter.where("createdAt", ">=", new Date(createdAt).setHours(0, 0, 0, 0)),
                                    Filter.where("createdAt", "<=", new Date(createdAt).setHours(23, 59, 59, 999)),
                                    Filter.where("answered", "==", answered)
                                )
                            )
                            .orderBy("createdAt", "desc")
                            .get();
        
        const questions:Question[] = []
        questionsDoc.forEach((q)=>{
            questions.push({
                id: q.id,
                answered: q.data().answered,
                createdAt: q.data().createdAt,
                data: q.data().data,
                updatedAt: q.data().updatedAt,
                userId: q.data().userId,
                username: q.data().username,
            })
        })

        return questions;
    }catch(error){
        console.error(`Error while fetching questions by userId:${id}`, error);
        throw error;
    }
}