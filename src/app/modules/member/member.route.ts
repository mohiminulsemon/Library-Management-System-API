import express from "express";
import { MemberController } from "./member.controller";

const router = express.Router();

router.post("/", MemberController.createMember);

router.get("/", MemberController.getAllMembersFromDB);

router.get("/:memberId", MemberController.getMemberByIdFromDB);

router.put("/:memberId", MemberController.updateMemberIntoDB);

router.delete("/:memberId", MemberController.deleteMemberFromDB);

export const MemberRoutes = router;