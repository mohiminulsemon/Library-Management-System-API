import { StatusCodes } from "http-status-codes";

class AppError extends Error {
    statusCode: number;
    status: string;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
        Error.captureStackTrace(this, this.constructor);
    }
}

class BadRequestError extends AppError {
    constructor(message: string) {
        super(message, StatusCodes.BAD_REQUEST);
    }
}

class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, StatusCodes.NOT_FOUND);
    }
}

class ConflictError extends AppError {
    constructor(message: string) {
        super(message, StatusCodes.CONFLICT);
    }
}


export { AppError, BadRequestError, NotFoundError, ConflictError };
