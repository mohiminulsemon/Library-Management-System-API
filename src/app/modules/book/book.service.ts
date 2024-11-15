import prisma from "../../shared/prisma";
import { validate as isUUID } from 'uuid';
import { BadRequestError, ConflictError, NotFoundError } from "../../utils/error";

const getBookById = async (bookId: string) => {
    if (!isUUID(bookId)) {
        throw new BadRequestError(`Invalid book ID format. Please provide a valid UUID.`);
    }

    const book = await prisma.book.findUnique({
        where: { bookId },
    });

    if (!book) {
        throw new NotFoundError(`Sorry, the book with ID ${bookId} could not be found. Please check the ID and try again.`);
    }

    return book;
};

const createBook = async (payload: any) => {
    const existingBook = await prisma.book.findFirst({
        where: {
            title: payload.title,
        },
    });

    if (existingBook) {
        throw new ConflictError(`A book with the title ${payload.title} already exists.`);
    }
    
    const cretedBook = await prisma.book.create({
        data: {
            title: payload.title,
            genre: payload.genre,
            publishedYear: payload.publishedYear,
            totalCopies: payload.totalCopies,
            availableCopies: payload.availableCopies,
        },
    });
    return cretedBook;
};

const getAllBooksFromDB = async () => {
    const books = await prisma.book.findMany();

    if (books.length === 0) {
        throw new NotFoundError("No books found in the database.");
    }

    return books;
};

const getBookByIdFromDB = async (bookId: string) => {
    // const book = await prisma.book.findUnique({
    //     where: { bookId },
    // });
    // return book;
    return await getBookById(bookId);
};

const updateBookIntoDB = async (bookId: string, payload: any) => {
    await getBookById(bookId);
    const updatedBook = await prisma.book.update({
        where: { bookId },
        data: {
            title: payload.title,
            genre: payload.genre,
            publishedYear: payload.publishedYear,
            totalCopies: payload.totalCopies,
            availableCopies: payload.availableCopies,
        },
    });

    return updatedBook;
};

const deleteBookFromDB = async (bookId: string) => {
    await getBookById(bookId);
    const deletedBook = await prisma.book.delete({
        where: { bookId },
    });

    return deletedBook;
};

export const BookService = {
    createBook,
    getAllBooksFromDB,
    getBookByIdFromDB,
    updateBookIntoDB,
    deleteBookFromDB
};
