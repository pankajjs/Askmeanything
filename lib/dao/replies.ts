import { Filter } from "firebase-admin/firestore";
import { db } from "../config/firestore";
import { Reply } from "../types";
import { NotFoundError } from "../errors";

export type Prop = {
    createdFor: string,
    createdAt: number,
}

export type CreateReplyDto ={
    data: string,    
    questionId: string,
    createdFor: string,
    createdBy: string
}

export const createReply = async ({data, questionId, createdFor, createdBy}: CreateReplyDto): Promise<Reply> => {
    try{
        const replyDoc = await db.collection("replies").add({
            data,
            questionId,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            createdFor,
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

export const findRepliesByUserName = async ({createdFor, createdAt}: Prop) => {
    try{
        const repliesDoc = await db.collection("replies").where(
            Filter.and(
                Filter.where("createdFor", "==", createdFor),
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
                createdFor: r.data().createdFor,
                data: r.data().data,
                questionId: r.data().questionId,
                updatedAt: r.data().updatedAt,
                createdBy: r.data().createdBy,
            })
        })
        return replies;
    }catch(error){
        console.error(`(findRepliesByUserId): Error while fetching replies by createdFor:${createdFor}`, error);
        throw error;
    }
}