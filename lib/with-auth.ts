
import { NextRequest, NextResponse } from 'next/server';
import { decodeToken, generateToken, verifyToken } from './jwt';
import { prisma } from './prisma';
import { TokenExpiredError } from 'jsonwebtoken';
import { config } from './config';
import { cookies } from 'next/headers';
 
type Handler = (req: NextRequest, context?: any) => Promise<Response>;
 
export function withAuthentication(handler: Handler): Handler {
  return async (req: NextRequest, _context: any) => {
    try{
        const token = req.cookies.get(config.userToken.cookieName)?.value;
        
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = verifyToken(token);
        
        const user = await prisma.user.findUnique({
            where: {
                id
            },
        })

        return handler(req, user);
    }catch(error){
        console.error(error)
        if (error instanceof TokenExpiredError){
            let token = req.cookies.get(config.userToken.cookieName)?.value as string;
            const {id, iat} = decodeToken(token);

            if(Math.floor(Date.now() / 1000) - iat > config.userToken.refreshTtl){
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }

            token = generateToken({id});
            const cookieStore = await cookies()
            
            cookieStore.set(config.userToken.cookieName, token, {
                httpOnly: true,
                secure: config.NODE_ENV === "production",
                maxAge: config.userToken.ttl
            })
            
            let user = await prisma.user.findUnique({
                where: {
                    id
                },
            })
            return handler(req, user);
        }else{
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
    }
  };
}