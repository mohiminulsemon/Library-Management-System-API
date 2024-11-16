import express from "express";
import { BorrowedBookController } from "./borrowRecord.controller";

const router = express.Router();

router.post("/borrow", BorrowedBookController.borrowBookFromDB);
router.post("/return", BorrowedBookController.returnBookFromDB);
router.get("/borrow/overdue", BorrowedBookController.overDueBooks);

export const BorrowedBookRoutes = router;