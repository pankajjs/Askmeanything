import { NextRequest, NextResponse } from "next/server";
import { BadRequestError, handleError, NotFoundError } from "@/lib/errors";
import { CreateQuestionRequestDto } from "@/lib/types";
import { findUserByUserName } from "@/lib/dao/users";
import { createQuestion } from "@/lib/dao/questions";

export async function POST(req: NextRequest) {
    try{
        const {createdFor, data, createdBy} = await req.json() as CreateQuestionRequestDto;
        const user = await findUserByUserName(createdFor);
        
        if(!user){
            throw new NotFoundError("User not found");
        }

        if(user.username === createdBy){
            throw new BadRequestError("You need therapy");
        }

        if(data.length > 200){
            throw new BadRequestError("Question is too long");
        }

        if(!user.active){
            throw new BadRequestError("Host is not active today.");
        }

        const question = await createQuestion({
            data,
            createdBy: createdBy ?? "anon-user",
            createdFor: user.username
        })

        return NextResponse.json({
            id: question.id,
            data: question.data,
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
            answered: question.answered,
        }, {status: 201})
    }catch(error){
        console.error(`(POST): `, error);
        return handleError(error as Error);
    }
}