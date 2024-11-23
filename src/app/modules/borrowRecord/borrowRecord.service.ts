import { validate as isUUID } from "uuid";
import { BadRequestError, NotFoundError } from "../../errors/error";
import { StatusCodes } from "http-status-codes";
import prisma from "../../shared/prisma";

// Helper for UUID validation
const validateUUID = (id: string, type: string) => {
  if (!isUUID(id)) {
    throw new BadRequestError(`Invalid ${type} ID format. Please provide a valid UUID.`);
  }
};

// Helper to fetch and validate an entity
const fetchEntityOrThrow = async (entity: string, where: any, errorMessage: string) => {
    const result = await (prisma as any)[entity].findUnique({ where });
  if (!result) {
    throw new NotFoundError(errorMessage);
  }
  return result;
}

const borrowBookFromDB = async (bookId: string, memberId: string) => {
  validateUUID(bookId, "book");
  validateUUID(memberId, "member");

  return await prisma.$transaction(async (prisma) => {
    const book = await fetchEntityOrThrow(
      "book",
      { bookId },
      `Oops! The book with ID ${bookId} could not be found. Please check the ID and try again.`
    );

    if (book.availableCopies <= 0) {
      throw new NotFoundError(`Sorry, the book "${book.title}" is currently out of stock.`);
    }

    const member = await fetchEntityOrThrow(
      "member",
      { memberId },
      `Sorry, the member with ID ${memberId} could not be found. Please check the ID and try again.`
    );

    const existingBorrow = await prisma.borrowRecord.findFirst({
      where: { memberId, bookId, returnDate: null },
    });

    if (existingBorrow) {
      throw new BadRequestError(`You have already borrowed this book and not returned it yet.`);
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
  validateUUID(borrowId, "borrow");

  return await prisma.$transaction(async (prisma) => {
    const borrowRecord = await prisma.borrowRecord.findUnique({
      where: { borrowId },
      include: { book: true },
    });

    if (!borrowRecord) {
      throw new NotFoundError(`No borrow record found for ID '${borrowId}'.`);
    }

    if (borrowRecord.returnDate) {
      throw new BadRequestError(`This book has already been returned on ${borrowRecord.returnDate}.`);
    }

    await prisma.borrowRecord.update({
      where: { borrowId },
      data: { returnDate: new Date() },
    });

    const updatedBook = await prisma.book.update({
      where: { bookId: borrowRecord.bookId },
      data: { availableCopies: { increment: 1 } },
    });

    return updatedBook;
  });
};

const overdueBooksCheck = async () => {
  const overdueLimitDays = 14;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - overdueLimitDays);

  const overdueRecords = await prisma.borrowRecord.findMany({
    where: {
      returnDate: null,
      borrowDate: { lt: cutoffDate },
    },
    select: {
      borrowId: true,
      borrowDate: true,
      book: { select: { title: true } },
      member: { select: { name: true } },
    },
  });

  const overdueList = overdueRecords.map((record) => {
    const overdueDays = Math.max(
      0,
      Math.floor((Date.now() - record.borrowDate.getTime()) / (1000 * 60 * 60 * 24)) - overdueLimitDays
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
    message: overdueList.length ? "Overdue borrow list fetched" : "No overdue books",
    data: overdueList,
  };
};

export const BorrowedBookService = {
  borrowBookFromDB,
  returnBookFromDB,
  overdueBooksCheck,
};
