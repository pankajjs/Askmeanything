import { User } from "@/lib/context";
import { prisma } from "@/lib/prisma";
import { withAuthentication } from "@/lib/with-auth";
import { NextRequest, NextResponse } from "next/server";

async function getQuestionsByUser(req: NextRequest, userData: User) {
    try{
        const userId = req.nextUrl.pathname.split("/")[3];

        if(!userId){
            return NextResponse.json({error: "User ID is required"}, {status: 400})
        }

        if(userId !== userData.id){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }

        const page = Number(req.nextUrl.searchParams.get("page")) || 1;
        const limit = Number(req.nextUrl.searchParams.get("limit")) || 10;
        const currentDate = Date.now()
        const date = Number(req.nextUrl.searchParams.get("date") || currentDate);

        if(isNaN(date)){
            return NextResponse.json({error: "Invalid date"}, {status: 400})
        }

        if (date > Date.now()){
            return NextResponse.json({error: "Date is in the future"}, {status: 400})
        }

        if (date < (userData.createdAt - 24 * 60 * 60 * 1000)){
            return NextResponse.json({message: "No questions found", data: []}, {status: 200})
        }

        const questions = await prisma.question.findMany({
            where: {
                userId: userId,
                createdAt: {
                    gte: new Date(date).setHours(0, 0, 0, 0),
                    lte: new Date(date).setHours(23, 59, 59, 999)
                },
            },
            orderBy: {
                createdAt: "desc"
            },
            skip: (page - 1) * limit,
            take: Math.min(limit, 100)
        })

        return NextResponse.json({message: "Questions fetched successfully", data: questions})
    }catch{
        return NextResponse.json({error: "Internal server error"}, {status: 500})
    }
}


export const GET = withAuthentication(getQuestionsByUser)
