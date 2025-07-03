import { Filter } from "firebase-admin/firestore";
import { db } from "../config/firestore";
import { Question } from "../types";

export type CreateQuestionDto = {
    data: string,
    createdFor: string,
    createdBy: string,
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
        console.error(`(updateQuestionById): Error while updating question by id:${id}`, error);
        throw error;
    }
}

export const createQuestion = async ({data, createdFor, createdBy}: CreateQuestionDto): Promise<Question> => {
    try{
        const questionDoc = await db.collection("questions").add({
            data,
            createdBy,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            answered: false,
            createdFor,
        });
        
        const question = (await questionDoc.get()).data() as Question;

        return {
            id: questionDoc.id,
            data: question.data,
            answered: question.answered,
            updatedAt: question.updatedAt,
            createdAt: question.createdAt,
            createdFor: question.createdFor,
        }
    }catch(error){
        console.error("(createQuestion): Error while creating question", error);
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
        } as Question;
    }catch(error){
        console.error(`(findQuestionById): Error while fetching question by id:${id}`, error);
        throw error;
    }
}

export const deleteQuestionById = async (id: string) => {
    try{
        await db.collection("questions").doc(id).delete();
    }catch(error){
        console.error(`(deleteQuestionById): Error while deleting question by id:${id}`, error);
        throw error;
    }
}

export type Prop = {
    answered?: boolean
    createdAt: number
    createdFor: string,
}

export const findQuestionsByUserName = async ({createdFor, createdAt, answered}: Prop) => {
    try{
        const questionsDoc = await db.collection("questions")
                            .where(
                                Filter.and(
                                    Filter.where("createdFor", "==", createdFor),
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
                createdFor: q.data().createdFor,
            })
        })

        return questions;
    }catch(error){
        console.error(`(findQuestionsByUserId): Error while fetching questions by username:${createdFor}`, error);
        throw error;
    }
}