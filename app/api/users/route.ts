import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//     try{
//        const user = await prisma.user.findMany({

//        })
//     }catch(error){
//         console.log(error);
//         return NextResponse.json({error: "Internal server error"}, {status: 500})
//     }
// }

export async function POST(req: NextRequest) {
    try{
        const username = req.nextUrl.searchParams.get("username");
        if(!username){
            return NextResponse.json({error: "Username is required"}, {status: 400})
        }
        const user = await prisma.user.findFirst({
            where: {
                username: username,
            },
        })
        if(!user){
            return NextResponse.json({error: "User not found"}, {status: 404})
        }
        return NextResponse.json({
            message: "User found",
            data:{
                username: user.username,
                roles: user.roles,
            }
        }, {status: 200})
    }catch(error){
        console.log(error);
        return NextResponse.json({error: "Internal server error"}, {status: 500})
    }
}