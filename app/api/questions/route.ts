import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import { API_ERROR } from "@/lib/api-error";

export async function POST(req: NextRequest) {
    try{
        const data = await req.json() as {data: string, username: string, createdBy?: string};

       const user = await prisma.user.findFirst({
            where: {
                username: data.username
            }
        })

        if(!user){
            return NextResponse.json({
                error: API_ERROR.NOT_FOUND.error,
                message: "User not found"
            }, {status: API_ERROR.NOT_FOUND.status})
        }

        if(data.data.length > 200){
            return NextResponse.json({
                error: API_ERROR.BAD_REQUEST.error,
                message: "Question is too long"
            }, {status: API_ERROR.BAD_REQUEST.status})
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
            message: "Question created successfully",
            data: question
        }, {status: 200})
    }catch(error){
        console.error("Error while creating question", error)
        return NextResponse.json({
            error: API_ERROR.INTERNAL_SERVER_ERROR.error,
            message: API_ERROR.INTERNAL_SERVER_ERROR.message
        }, {status: API_ERROR.INTERNAL_SERVER_ERROR.status})
    }
}