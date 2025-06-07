import jwt from "jsonwebtoken";
import { config } from "./config";

export const generateToken = (data: {id: string}): string => {
    return jwt.sign(data, config.userToken.privateKey, {
        algorithm: "RS256",
        expiresIn: config.userToken.ttl
    })
}

export const verifyToken = (token: string): any => {
    return jwt.verify(token, config.userToken.publicKey, {
        algorithms: ["RS256"]
    })
}

export const decodeToken = (token: string): any => {
    return jwt.decode(token)
}