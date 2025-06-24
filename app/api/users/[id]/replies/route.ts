import { BadRequestError, ForbiddenError, handleError, NotFoundError } from "@/lib/errors";
import { User } from "@/lib/types";
import { prisma } from "@/lib/config/prisma";
import { withAuthentication } from "@/middleware/with-auth";
import { NextRequest, NextResponse } from "next/server";

async function GetReplies(req: NextRequest, userData: User) {
    try{
        const userId = req.nextUrl.pathname.split("/")[3];

        if(!userId){
            return handleError(new BadRequestError("User Id is required"))
        }

        if(userId !== userData.id){
            return handleError(new ForbiddenError())
        }

        const page = Number(req.nextUrl.searchParams.get("page")) || 1;
        const limit = Number(req.nextUrl.searchParams.get("limit")) || 10;
        const currentDate = Date.now()
        const date = Number(req.nextUrl.searchParams.get("date") || currentDate);

        if(isNaN(date)){
            return handleError(new BadRequestError("Invalid date format"))
        }

        if(date > Date.now()){
            return handleError(new BadRequestError("Date can't be in the future"))
        }

        if(date < (userData.createdAt - 24 * 60 * 60 * 1000)){
            return handleError(new NotFoundError("No replies found"))
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
        return handleError()
    }
}

export const GET = withAuthentication(GetReplies)