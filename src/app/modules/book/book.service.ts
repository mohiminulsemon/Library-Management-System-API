import prisma from "../../shared/prisma";
import { ConflictError, NotFoundError } from "../../errors/error";

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
    return books;
};

const getBookByIdFromDB = async (bookId: string) => {
    const book = await prisma.book.findUnique({
        where: { bookId },
      });

      if (!book) {
        throw new NotFoundError(`Please check the ID and try again.`);
        }
      return book;
};

const updateBookIntoDB = async (bookId: string, payload: any) => {
    const updatedBook = await prisma.book.update({
        where: { bookId },
        data: payload,
    });
    return updatedBook;
};

const deleteBookFromDB = async (bookId: string) => {
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
