import { API_ERROR } from "@/lib/api-error";
import { User } from "@/lib/context";
import { prisma } from "@/lib/prisma";
import { withAuthentication } from "@/lib/with-auth";
import { NextRequest, NextResponse } from "next/server";

async function CreateReplies(req: NextRequest, _userData: User) {
    try{
        const questionId = req.nextUrl.pathname.split("/")[3];
        if(!questionId){
            return NextResponse.json({
                error: API_ERROR.BAD_REQUEST.error,
                message: "Question ID is required"
            }, {status: API_ERROR.BAD_REQUEST.status})
        }

        const createRepliesDto = await req.json() as {data: string};
        if(!createRepliesDto.data){
            return NextResponse.json({
                error: API_ERROR.BAD_REQUEST.error,
                message: "Data is required"
            }, {status: API_ERROR.BAD_REQUEST.status})
        }

        if(createRepliesDto.data.length > 200){
            return NextResponse.json({
                error: API_ERROR.BAD_REQUEST.error,
                message: "Data is too long"
            }, {status: API_ERROR.BAD_REQUEST.status})
        }

        const question = await prisma.question.findUnique({
            where: {
                id: questionId
            }
        })
        if(!question){
            return NextResponse.json({
                error: API_ERROR.NOT_FOUND.error,
                message: "Question not found"
            }, {status: API_ERROR.NOT_FOUND.status})
        }

        if(question.answered){
            return NextResponse.json({
                error: API_ERROR.CONFLICT.error,
                message: "Question already answered"
            }, {status: API_ERROR.CONFLICT.status})
        }

        const [_, createdReply] = await prisma.$transaction([
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
                    question: {
                        connect: {
                            id: questionId,
                        }
                    }
                }
            })
        ])

        return NextResponse.json({message: "Reply created successfully", data: createdReply}, {status: 200})
    }catch(error){
        console.error("Error while creating reply", error)
        return NextResponse.json({
            error: API_ERROR.INTERNAL_SERVER_ERROR.error,
            message: API_ERROR.INTERNAL_SERVER_ERROR.message
        }, {status: API_ERROR.INTERNAL_SERVER_ERROR.status})
    }
}

export const POST = withAuthentication(CreateReplies)