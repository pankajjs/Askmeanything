import { prisma, Prisma } from "@/lib/prisma";
import { withAuthentication } from "@/lib/with-auth";
import { NextRequest, NextResponse } from "next/server";

async function CreateReplies(req: NextRequest, userData: Prisma.UserGetPayload<{}>) {
    try{
        const questionId = req.nextUrl.pathname.split("/")[3];
        if(!questionId){
            return NextResponse.json({error: "Question ID is required"}, {status: 400})
        }

        const createRepliesDto = await req.json() as {data: string};
        if(!createRepliesDto.data){
            return NextResponse.json({error: "Data is required"}, {status: 400})
        }

        if(createRepliesDto.data.length > 200){
            return NextResponse.json({error: "Data is too long"}, {status: 400})
        }

        const question = await prisma.question.findUnique({
            where: {
                id: questionId
            }
        })
        if(!question){
            return NextResponse.json({error: "Question not found"}, {status: 404})
        }

        if(question.answered){
            return NextResponse.json({error: "Question already answered"}, {status: 400})
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
        console.log(error);
        return NextResponse.json({error: "Internal server error"}, {status: 500})
    }
}

export const POST = withAuthentication(CreateReplies)