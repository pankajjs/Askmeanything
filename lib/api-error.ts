export const API_ERROR = {
    INTERNAL_SERVER_ERROR: {
        error: "INTERNAL_SERVER_ERROR",
        status: 500,
        message: "Something went wrong"
    },
    NOT_FOUND: {
        error: "NOT_FOUND",
        status: 404
    },
    BAD_REQUEST: {
        error: "BAD_REQUEST",
        status: 400
    },
    UNAUTHORIZED: {
        error : "Unauthorized",
        status: 401,
        message: "Unauthorized"
    },
    FORBIDDEN: {
        error: "Forbidden",
        status: 403,
        message: "You are not authorized to access this resource"
    },
    CONFLICT: {
        error: "Conflict",
        status: 409,
    }
}