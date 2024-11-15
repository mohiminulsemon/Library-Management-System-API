import express from "express";
import { BookController } from "./book.controller";

const router = express.Router();

router.post("/", BookController.createBook);
router.get("/", BookController.getAllBooksFromDB);
router.get("/:bookId", BookController.getBookByIdFromDB);
router.put("/:bookId", BookController.updateBookIntoDB);
router.delete("/:bookId", BookController.deleteBookFromDB);

export const BookRoutes = router;