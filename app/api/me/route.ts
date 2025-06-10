import { User } from "@/lib/context";
import { prisma } from "@/lib/prisma";
import { withAuthentication } from "@/lib/with-auth";
import { NextRequest, NextResponse } from "next/server";

async function getUser(_req: NextRequest, userData: User){
    try{
        const user = await prisma.user.findUnique({
            where: { 
                id: userData.id,
            },
        })

        if(!user){
            return NextResponse.json({error: "User not found"}, {status: 404})
        }

        return NextResponse.json({
            message: "User fetched successfully",
            data: user
        })
    }catch(error){
        console.error(error)
        return NextResponse.json({error: "Internal server error"}, {status: 500})
    }
}

export const GET = withAuthentication(getUser);