
import { NextRequest, NextResponse } from 'next/server';
import { decodeToken, generateToken, verifyToken } from './jwt';
import { prisma } from './prisma';
import { TokenExpiredError } from 'jsonwebtoken';
import { config } from './config';
import { cookies } from 'next/headers';
import { User } from './context';
 
type Handler = (req: NextRequest, userData: User) => Promise<Response>;
 
export function withAuthentication(handler: Handler) {
  return async (req: NextRequest) => {
    try{
        const token = req.cookies.get(config.userToken.cookieName)?.value;
        
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = verifyToken(token) as {id: string};
        
        const user = await prisma.user.findUnique({
            where: {
                id
            },
        })

        if(!user){
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        return handler(req, user);
    }catch(error){
        console.error(error)
        if (error instanceof TokenExpiredError){
            let token = req.cookies.get(config.userToken.cookieName)?.value as string;
            const {id, iat} = decodeToken(token) as {id: string, iat: number};

            if(Math.floor(Date.now() / 1000) - iat > config.userToken.refreshTtl){
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }

            token = generateToken({id});
            const cookieStore = await cookies()
            
            cookieStore.set(config.userToken.cookieName, token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: config.userToken.ttl
            })
            
            const user = await prisma.user.findUnique({
                where: {
                    id
                },
            })

            if(!user){
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }

            return handler(req, user);
        }else{
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
    }
  };
}