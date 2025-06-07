import { NextRequest } from "next/server";
import { prisma, Prisma } from "@/lib/prisma"
import { cookies } from "next/headers";

export async function POST(ree: NextRequest) {
    try{
        const data = await ree.json() as Prisma.QuestionGetPayload<{
            omit:{
                id: true,
                createdAt: true,
                updatedAt: true,
                answered: true,
                userId: true
            }
        }
        >;

        await prisma.question.create({
            data: {
                data: data.data,
                user: {
                    connect: {
                        id: "",
                    }
                }
            }
        })
    }catch(error){

    }
}