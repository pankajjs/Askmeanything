import { db } from "../config/firestore";
import { CreateQuestionDto, Question } from "../types";

export const createQuestion = async (questionDto: CreateQuestionDto): Promise<Question> => {
    try{
        const question = await db.collection("questions").add({
          data: questionDto.data,
          username: questionDto.username,
          createdBy: questionDto.createdBy,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          answered: false,
        });
        
        const data = (await question.get()).data as unknown as Question;

        return {
            id: question.id,
            data: data.data,
            answered: data.answered,
            updatedAt: data.updatedAt,
            createdAt: data.createdAt,
            userId: data.userId
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