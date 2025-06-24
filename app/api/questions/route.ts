import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/config/prisma"
import { BadRequestError, handleError, NotFoundError } from "@/lib/errors";

export async function POST(req: NextRequest) {
    try{
        const data = await req.json() as {data: string, username: string, createdBy?: string};


       const user = await prisma.user.findFirst({
            where: {
                username: data.username
            }
        })

        if(!user){
            return handleError(new NotFoundError("User not found"));
        }

        if(user.id === data.createdBy){
            return handleError(new BadRequestError("You need therapy"))
        }

        if(data.data.length > 200){
            return handleError(new BadRequestError("Question is too long"))
        }

        const question = await prisma.question.create({
            data: {
                data: data.data,
                createdBy: data.createdBy,
                user: {
                    connect: {
                       id: user.id
                    }
                },
                createdAt: Date.now(),
                updatedAt: Date.now(),
            },
            omit: {
                userId: true,
                createdBy: true,
            }
        })

        return NextResponse.json({
            message: "Question sent successfully",
            data: question
        }, {status: 200})
    }catch(error){
        console.error("Error while creating question", error)
        return handleError();
    }
}