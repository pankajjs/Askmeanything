import { NextRequest, NextResponse } from "next/server";
import { prisma, Prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
    try{
        const data = await req.json() as {data: string, username: string};

       const user = await prisma.user.findFirst({
            where: {
                username: data.username
            }
        })

        if(!user){
            return NextResponse.json({error: "User not found"}, {status: 404})
        }

        if(data.data.length > 200){
            return NextResponse.json({error: "Question is too long"}, {status: 400})
        }

        const question = await prisma.question.create({
            data: {
                data: data.data,
                user: {
                    connect: {
                       id: user.id
                    }
                }
            },
            omit: {
                userId: true,
            }
        })

        return NextResponse.json({
            message: "Question created successfully",
            data: question
        }, {status: 200})
    }catch(error){
        console.log(error);
        return NextResponse.json({error: "Internal server error"}, {status: 500})
    }
}