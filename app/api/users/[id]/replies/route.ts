import { API_ERROR } from "@/lib/api-error";
import { User } from "@/lib/context";
import { prisma } from "@/lib/prisma";
import { withAuthentication } from "@/lib/with-auth";
import { NextRequest, NextResponse } from "next/server";

async function GetReplies(req: NextRequest, userData: User) {
    try{
        const userId = req.nextUrl.pathname.split("/")[3];

        if(!userId){
            return NextResponse.json({
                error: API_ERROR.BAD_REQUEST.error,
                message: "User ID is required"
            }, {status: API_ERROR.BAD_REQUEST.status})
        }

        if(userId !== userData.id){
            return NextResponse.json({
                error: API_ERROR.FORBIDDEN.error,
                message: API_ERROR.FORBIDDEN.message
            }, {status: API_ERROR.FORBIDDEN.status})
        }

        const page = Number(req.nextUrl.searchParams.get("page")) || 1;
        const limit = Number(req.nextUrl.searchParams.get("limit")) || 10;
        const currentDate = Date.now()
        const date = Number(req.nextUrl.searchParams.get("date") || currentDate);

        if(isNaN(date)){
            return NextResponse.json({
                error: API_ERROR.BAD_REQUEST.error,
                message: "Invalid date format"
            }, {status: API_ERROR.BAD_REQUEST.status})
        }

        if(date > Date.now()){
            return NextResponse.json({
                error: API_ERROR.BAD_REQUEST.error,
                message: "Date can't be in the future"
            }, {status: API_ERROR.BAD_REQUEST.status})
        }

        if(date < (userData.createdAt - 24 * 60 * 60 * 1000)){
            return NextResponse.json({
                error: API_ERROR.NOT_FOUND.error,
                message: "No replies found"
            }, {status: API_ERROR.NOT_FOUND.status})
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
        console.error("Error while fetching replies by user", error)
        return NextResponse.json({
            error: API_ERROR.INTERNAL_SERVER_ERROR.error,
            message: API_ERROR.INTERNAL_SERVER_ERROR.message
        }, {status: API_ERROR.INTERNAL_SERVER_ERROR.status})
    }
}

export const GET = withAuthentication(GetReplies)