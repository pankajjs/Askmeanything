
import { NextRequest, NextResponse } from 'next/server';
import { decodeToken, generateToken, verifyToken } from './jwt';
import { prisma } from './prisma';
import { TokenExpiredError } from 'jsonwebtoken';
import { config } from './config';
import { cookies } from 'next/headers';
import { User } from './context';
import { API_ERROR } from './api-error';
 
type Handler = (req: NextRequest, userData: User) => Promise<Response>;
 
export function withAuthentication(handler: Handler) {
  return async (req: NextRequest) => {
    try{
        const token = req.cookies.get(config.userToken.cookieName)?.value;
        
        if (!token) {
            return NextResponse.json({
                error: API_ERROR.UNAUTHORIZED.error,
                message: API_ERROR.UNAUTHORIZED.message
            }, { status: API_ERROR.UNAUTHORIZED.status })
        }

        const { id } = verifyToken(token) as {id: string};
        
        const user = await prisma.user.findUnique({
            where: {
                id
            },
        })

        if(!user){
            return NextResponse.json({
                error: API_ERROR.UNAUTHORIZED.error,
                message: API_ERROR.UNAUTHORIZED.message
            }, { status: API_ERROR.UNAUTHORIZED.status })
        }

        return handler(req, user);
    }catch(error){
        console.error("Error while checking authentication", error)
        if (error instanceof TokenExpiredError){
            let token = req.cookies.get(config.userToken.cookieName)?.value as string;
            const {id, iat} = decodeToken(token) as {id: string, iat: number};

            if(Math.floor(Date.now() / 1000) - iat > config.userToken.refreshTtl){
                return NextResponse.json({
                    error: API_ERROR.UNAUTHORIZED.error,
                    message: API_ERROR.UNAUTHORIZED.message
                }, { status: API_ERROR.UNAUTHORIZED.status })
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
                return NextResponse.json({
                    error: API_ERROR.UNAUTHORIZED.error,
                    message: API_ERROR.UNAUTHORIZED.message
                }, { status: API_ERROR.UNAUTHORIZED.status })
            }

            return handler(req, user);
        }else{
            return NextResponse.json({
                error: API_ERROR.UNAUTHORIZED.error,
                message: API_ERROR.UNAUTHORIZED.message
            }, { status: API_ERROR.UNAUTHORIZED.status })
        }
    }
  };
}