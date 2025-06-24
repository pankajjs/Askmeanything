import jwt from "jsonwebtoken";
import { config } from "../config/config";

export const generateToken = (data: {id: string}): string => {
    return jwt.sign(data, process.env.AUTH_PRIVATE_KEY!, {
        algorithm: "RS256",
        expiresIn: config.userToken.ttl
    })
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, process.env.AUTH_PUBLIC_KEY!, {
        algorithms: ["RS256"]
    })
}

export const decodeToken = (token: string)  => {
    return jwt.decode(token)
}