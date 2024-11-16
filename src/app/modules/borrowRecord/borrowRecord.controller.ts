import { RequestHandler } from "express";
import catchAsync from "../../shared/catchAysnc";
import { BorrowedBookService } from "./borrowRecord.service";
import sendResponse from "../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const borrowBookFromDB: RequestHandler = catchAsync(async (req, res) => {
    const { bookId, memberId } = req.body;
    
    const result = await BorrowedBookService.borrowBookFromDB(bookId, memberId);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Book borrowed successfully",
        data: result,
    });
});

const returnBookFromDB: RequestHandler = catchAsync(async (req, res) => {
    const { borrowId } = req.body;
    await BorrowedBookService.returnBookFromDB(borrowId);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Book returned successfully",
    });
});

const overDueBooks: RequestHandler = catchAsync(async (req, res) => {
    let result = await BorrowedBookService.overdueBooksCheck();

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: result.message,
        data: result.data,
    });
});


export const BorrowedBookController = {
    borrowBookFromDB,
    returnBookFromDB,
    overDueBooks
};