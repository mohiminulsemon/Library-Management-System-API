import { Response } from "express";

const sendResponse = <T>(
    res: Response,
    jsonData: {
        success: boolean;
        statusCode: number;
        message: string;
        data?: T | null | undefined;
    }
) => {
    res.status(jsonData.statusCode).json({
        success: jsonData.success,
        status: jsonData.statusCode,
        message: jsonData.message,
        data: jsonData.data || null || undefined,
    });
};

export default sendResponse;