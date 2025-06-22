import { NextResponse } from "next/server"

export class APIError extends Error{
    success: boolean
    message: string
    error: string
    status: number

    constructor(message: string, error: string, status: number){
        super(message)
        this.message = message
        this.success = false
        this.error = error
        this.status = status
    }
}

export class InternalServerError extends APIError {
    constructor(message: string = "Something went wrong"){
        super(message, "Internal Server Error", 500)
    }
}

export class BadRequestError extends APIError {
    constructor(message: string){
        super(message, "Bad Request", 400)
    }
}

export class NotFoundError extends APIError {
    constructor(message: string){
        super(message, "Not Found", 404);
    }
}

export class UnauthorizedError extends APIError {
    constructor(message: string = "Unauthorized"){
        super(message, "Unauthorized", 401)
    }
}

export class ForbiddenError extends APIError {
    constructor(message: string = "You are not authorized to access this resource"){
        super(message, "Forbidden", 403)
    }
}

export class ConflictError extends APIError {
    constructor(message: string){
        super(message, "Conflict", 409)
    }
}

export const handleError = (err?: Error) => {
    if(err instanceof APIError){
        return NextResponse.json({
            success: err.success,
            message: err.message,
            error: err.error,
        }, {status: err.status})
    }
    return NextResponse.json({
        success: false,
        message: "Something went wrong",
        error: "Internal Server Error"
    }, {
        status: 500,
    })
}