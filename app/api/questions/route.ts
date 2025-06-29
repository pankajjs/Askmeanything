import { NextRequest, NextResponse } from "next/server";
import { BadRequestError, handleError, NotFoundError } from "@/lib/errors";
import { CreateQuestionRequestDto, createSuccessResponse } from "@/lib/types";
import { findUserByUserName } from "@/lib/dao/users";
import { createQuestion } from "@/lib/dao/questions";

export async function POST(req: NextRequest) {
    try{
        const data = await req.json() as CreateQuestionRequestDto;
        const user = await findUserByUserName(data.username);
        
        if(!user){
            throw new NotFoundError("User not found");
        }

        if(user.id === data.createdBy){
            throw new BadRequestError("You need therapy");
        }

        if(data.data.length > 200){
            throw new BadRequestError("Question is too long");
        }

        if(!user.active){
            throw new BadRequestError("Host is not active today.");
        }

        const question = await createQuestion({
            data: data.data,
            userId: user.id,
            createdBy: data.createdBy ?? "anon-user",
        })

        return NextResponse.json(createSuccessResponse(
            "Question sent successfully",
            question
        ), {status: 201})
    }catch(error){
        console.error(error);
        return handleError(error as unknown as Error);
    }
}