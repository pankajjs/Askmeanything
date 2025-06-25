import { BadRequestError, ForbiddenError, handleError } from "@/lib/errors";
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

        const date = Date.now()

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

        console.log(replies)

        return NextResponse.json({message: "Replies fetched successfully", data: replies}, {status: 200})
    }catch(error){
        console.error("Error while fetching replies by user", error)
        return handleError()
    }
}

export const GET = withAuthentication(GetReplies)