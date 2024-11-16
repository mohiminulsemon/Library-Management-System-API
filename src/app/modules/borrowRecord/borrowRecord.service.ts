import prisma from "../../shared/prisma";
import { validate as isUUID } from 'uuid';
import { BadRequestError, NotFoundError } from "../../utils/error";
import { StatusCodes } from "http-status-codes";

const borrowBookFromDB = async (bookId: string, memberId: string) => {
    if (!isUUID(bookId)) {
        throw new BadRequestError(`Invalid book ID format. Please provide a valid UUID.`);
    }

    if (!isUUID(memberId)) {
        throw new BadRequestError(`Invalid member ID format. Please provide a valid UUID.`);
    }

    return await prisma.$transaction(async (prisma) => {
        const book = await prisma.book.findUnique({
            where: { bookId },
        });

        if (!book) {
            throw new NotFoundError(`Oops! The book with ID ${bookId} could not be found. Please check the ID and try again.`);
        }

        if (book.availableCopies <= 0) {
            throw new NotFoundError(`Sorry, the book "${book.title}" is currently out of stock and cannot be borrowed at the moment.`);
        }

        const member = await prisma.member.findUnique({
            where: { memberId },
        });

        if (!member) {
            throw new NotFoundError(`Sorry, the member with ID ${memberId} could not be found. Please check the ID and try again.`);
        }

        const existingBorrow = await prisma.borrowRecord.findFirst({
            where: { memberId, bookId, returnDate: null },
        });

        if (existingBorrow) {
            throw new BadRequestError(`You have already borrowed this book and have not returned it yet.`);
        }

        await prisma.book.update({
            where: { bookId },
            data: { availableCopies: { decrement: 1 } },
        });

        const borrowRecord = await prisma.borrowRecord.create({
            data: {
                bookId,
                memberId,
                borrowDate: new Date(),
            },
            select: {
                borrowId: true,
                bookId: true,
                memberId: true,
                borrowDate: true,
            },
        });

        return borrowRecord;
    });
};

const returnBookFromDB = async (borrowId: string) => {
    if (!isUUID(borrowId)) {
        throw new BadRequestError("Invalid borrow ID format. Please provide a valid UUID.");
    }
    return await prisma.$transaction(async (prisma) => {
        const borrowRecord = await prisma.borrowRecord.findUnique({
            where: { borrowId },
            include: { book: true },
        });

        if (!borrowRecord) {
            throw new NotFoundError(`No borrow record found for ID '${borrowId}'. Please check the borrow ID and try again.`);
        }

        if (borrowRecord.returnDate) {
            throw new BadRequestError(`This book has already been returned on ${borrowRecord.returnDate}. No further action is required.`);
        }

        const book = await prisma.book.findUnique({
            where: { bookId: borrowRecord.bookId },
        });

        await prisma.borrowRecord.update({
            where: { borrowId },
            data: { returnDate: new Date() },
        });

        const result = await prisma.book.update({
            where: { bookId: borrowRecord.bookId },
            data: { availableCopies: { increment: 1 } },
        });

        return result;
    });
};


const overdueBooksCheck = async () => {
    const overDueLimitDays = 14;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - overDueLimitDays);
    const overdueBooks = await prisma.borrowRecord.findMany({
        where: {
            returnDate: null,
            borrowDate: {
                lt: cutoffDate,
            },
        },
        select: {
            borrowId: true,
            borrowDate: true,
            book: {
                select: {
                    title: true,
                },
            },
            member: {
                select: {
                    name: true,
                },
            },
        },
    });

    if (overdueBooks.length === 0) {
        return {
            success: true,
            status: 200,
            message: "No overdue books",
            data: [],
        };
    }

    const overdueList = overdueBooks.map((record) => {
        const overdueDays = Math.max(
            0,
            Math.floor((new Date().getTime() - new Date(record.borrowDate).getTime()) / (1000 * 60 * 60 * 24)) - overDueLimitDays
        );
        return {
            borrowId: record.borrowId,
            bookTitle: record.book.title,
            borrowerName: record.member.name,
            overdueDays,
        };
    });

    return {
        success: true,
        status: StatusCodes.OK,
        message: "Overdue borrow list fetched",
        data: overdueList,
    };
};

export const BorrowedBookService = {
    borrowBookFromDB,
    returnBookFromDB,
    overdueBooksCheck
};