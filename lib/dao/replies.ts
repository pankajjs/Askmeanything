import { Filter } from "firebase-admin/firestore";
import { db } from "../config/firestore";
import { Reply } from "../types";
import { NotFoundError } from "../errors";

export type Prop = {
    userId: string,
    createdAt: number,
}

export type CreateReplyDto ={
    data: string,    
    questionId: string,
    createdBy: string,
}

export const createReply = async ({data, questionId, createdBy}: CreateReplyDto): Promise<Reply> => {
    try{
        const replyDoc = await db.collection("replies").add({
            data,
            questionId,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            createdBy,
        })

        return {
            id: replyDoc.id,
            ...(await replyDoc.get()).data(),
        } as Reply;
    }catch(error){
        console.error(`(createReply): Error while creating reply`, error);
        throw error;
    }
}

export const deleteReplyByQuestionId = async (qId: string) => {
    try{
        const repliesDoc = await db.collection("replies").where("questionId", "==", qId).get();
        
        if(repliesDoc.empty){
            throw new NotFoundError("Reply not found");
        }
        
        repliesDoc.forEach(doc=>doc.ref.delete())
        return qId;
    }catch(error){
        console.error(`(deleteReplyByQuestionId): Error while deleting reply by questionId:${qId}`, error);
        throw error;
    }
}

export const findRepliesByUserId = async ({userId, createdAt}: Prop) => {
    try{
        const repliesDoc = await db.collection("replies").where(
            Filter.and(
                Filter.where("createdBy", "==", userId),
                Filter.where("createdAt", ">=", new Date(createdAt).setHours(0, 0, 0, 0)),
                Filter.where("createdAt", "<=", new Date(createdAt).setHours(23, 59, 59, 999))
            )
        ).orderBy("createdAt", "desc")
        .get();

        const replies:Reply[] = []
        repliesDoc.forEach(r=>{
            replies.push({
                id: r.id,
                createdAt: r.data().createdAt,
                createdBy: r.data().createdBy,
                data: r.data().data,
                questionId: r.data().questionId,
                updatedAt: r.data().updatedAt,
            })
        })
        return replies;
    }catch(error){
        console.error(`(findRepliesByUserId): Error while fetching replies by userId:${userId}`, error);
        throw error;
    }
}