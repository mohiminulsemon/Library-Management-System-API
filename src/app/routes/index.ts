import express from "express";
import { BookRoutes } from "../modules/book/book.route";
import { MemberRoutes } from "../modules/member/member.route";
import path from "path";
import { BorrowedBookRoutes } from "../modules/borrowRecord/borrowRecord.route";
const router = express.Router();

const moduleRoutes = [
    {
        path: "/books",
        route: BookRoutes,
    },
    {
        path: "/members",
        route: MemberRoutes
    },
    {
        path: "/",
        route: BorrowedBookRoutes
    }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;