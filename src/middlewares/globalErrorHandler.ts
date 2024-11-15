import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../app/utils/error";

const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): any => {

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            status: err.statusCode,
            message: err.message,
        });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || "Something went wrong!",
    });
};

export default globalErrorHandler;