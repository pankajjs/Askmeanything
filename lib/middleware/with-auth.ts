
import { NextRequest } from 'next/server';
import { decodeToken, generateToken, verifyToken } from '../jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { config } from '../config/config';
import { cookies } from 'next/headers';
import { User } from '../types';
import { handleError, UnauthorizedError } from '../errors';
import { findUserById } from '../dao/users';
 
type Handler = (req: NextRequest, userData: User) => Promise<Response>;
 
export function withAuthentication(handler: Handler) {
  return async (req: NextRequest) => {
    try{
        const token = req.cookies.get(config.userToken.cookieName)?.value;

        if (!token) {
            throw new UnauthorizedError();
        }

        const { id } = verifyToken(token) as {id: string};
        const user = await findUserById(id);
        
        if(!user){
            throw new UnauthorizedError();
        }

        return handler(req, user);
    }catch(error){
        console.error("(withAuthentication): Error while checking authentication", error)
        try{
            if (error instanceof TokenExpiredError){
                let token = req.cookies.get(config.userToken.cookieName)?.value as string;
                const {id, iat} = decodeToken(token) as {id: string, iat: number};
    
                if(Math.floor(Date.now() / 1000) - iat > config.userToken.refreshTtl){
                    throw new UnauthorizedError();
                }
    
                token = generateToken({id});
                const cookieStore = await cookies()
                
                cookieStore.set(config.userToken.cookieName, token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: config.userToken.ttl
                })
                
                const user = await findUserById(id);
                
                if(!user){
                    return new UnauthorizedError();
                }
    
                return handler(req, user);
            }
        }catch(error){
            return handleError(new UnauthorizedError());
        }
    }
  };
}