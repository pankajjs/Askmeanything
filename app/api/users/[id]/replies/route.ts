import { prisma, Prisma } from "@/lib/prisma";
import { withAuthentication } from "@/lib/with-auth";
import { NextRequest, NextResponse } from "next/server";

async function GetReplies(req: NextRequest, userData: Prisma.UserGetPayload<{}>) {
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

        if(date > Date.now()){
            return NextResponse.json({error: "Date is in the future"}, {status: 400})
        }

        if(date < (userData.createdAt - 24 * 60 * 60 * 1000)){
            return NextResponse.json({message: "No replies found", data: []}, {status: 200})
        }

        const replies = await prisma.reply.findMany({
            where: {
                question: {
                    createdBy: userId,
                },
                createdAt: {
                    gte: new Date(date).setHours(0, 0, 0, 0),
                    lte: new Date(date).setHours(23, 59, 59, 999)
                },
            },
            skip: (page - 1) * limit,
            take: Math.min(limit, 100),
            orderBy: {
                createdAt: "desc"
            },
            include: {
                question: {
                    omit: {
                        answered: true,
                        createdAt: true,
                        updatedAt: true,
                        userId: true,
                        id: true,
                        createdBy: true,
                    },
                    include:{
                        user: {
                            select:{
                                username: true,
                            }
                        }
                    },
                }
            },
        })

        return NextResponse.json({message: "Replies fetched successfully", data: replies}, {status: 200})
    }catch(error){
        console.error(error)
        return NextResponse.json({error: "Internal server error"}, {status: 500})
    }
}

export const GET = withAuthentication(GetReplies)