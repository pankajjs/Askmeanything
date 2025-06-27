import { BadRequestError, ConflictError, handleError, NotFoundError } from "@/lib/errors";
import { createSuccessResponse, User } from "@/lib/types";
import { prisma } from "@/lib/config/prisma";
import { withAuthentication } from "@/lib/middleware/with-auth";
import { NextRequest, NextResponse } from "next/server";

async function CreateReplies(req: NextRequest, _userData: User) {
    try{
        const questionId = req.nextUrl.pathname.split("/")[3];
        
        if(!questionId){
            return handleError(new BadRequestError("Question Id is required"));
        }

        const createRepliesDto = await req.json() as {data: string};
        
        if(!createRepliesDto.data){
            return handleError(new BadRequestError("Data is required"));
        }

        if(createRepliesDto.data.length > 200){
            return handleError(new BadRequestError("Replies is too long"))
        }

        const question = await prisma.question.findUnique({
            where: {
                id: questionId
            }
        })
        
        if(!question){
            return handleError(new NotFoundError("Question not found"))
        }

        if(question.answered){
            return handleError(new ConflictError("Question already answered"));
        }

        const [_, reply] = await prisma.$transaction([
            prisma.question.update({
                where: {
                    id: questionId
                },
                data: {
                    answered: true,
                    updatedAt: Date.now()
                }
            }),

            prisma.reply.create({
                data: {
                    data: createRepliesDto.data,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    qId: questionId,
                },
                include: {
                    question: {
                        select: {
                            user: {
                                select: {
                                    username: true,
                                }
                            }
                        }
                    }
                }
            })
        ]);

        return NextResponse.json(createSuccessResponse("Reply created successfully", reply), {status: 201})
    }catch(error){
        console.error("Error while creating reply", error)
        return handleError();
    }
}

export const POST = withAuthentication(CreateReplies)