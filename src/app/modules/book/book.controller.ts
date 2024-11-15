import { RequestHandler } from "express";
import sendResponse from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAysnc";
import { BookService } from "./book.service";
import { StatusCodes } from "http-status-codes";

const createBook: RequestHandler = catchAsync(async (req, res) => {
    const result = await BookService.createBook(req.body);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: "Book created successfully",
        data: result,
    });
});

const getAllBooksFromDB: RequestHandler = catchAsync(async (req, res) => {
    const result = await BookService.getAllBooksFromDB();
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Books retrieved successfully",
        data: result,
    });
});

const getBookByIdFromDB: RequestHandler = catchAsync(async (req, res) => {
    let { bookId } = req.params;
    if (bookId.startsWith(":")) {
        bookId = bookId.substring(1);
    }
    const result = await BookService.getBookByIdFromDB(bookId);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Book retrieved successfully",
        data: result,
    });
});

const updateBookIntoDB: RequestHandler = catchAsync(async (req, res) => {
    let { bookId } = req.params;
    const payload = req.body;
    if (bookId.startsWith(":")) {
        bookId = bookId.substring(1);
    }
    const result = await BookService.updateBookIntoDB(bookId, payload);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Book updated successfully",
        data: result,
    });
});

const deleteBookFromDB: RequestHandler = catchAsync(async (req, res) => {
    let { bookId } = req.params;
    if (bookId.startsWith(":")) {
        bookId = bookId.substring(1);
    }
    await BookService.deleteBookFromDB(bookId);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Book successfully deleted",
    });
});

export const BookController = {
    createBook,
    getAllBooksFromDB,
    getBookByIdFromDB,
    updateBookIntoDB,
    deleteBookFromDB
};