import { RequestHandler } from "express";
import sendResponse from "../../shared/sendResponse";
import { MemberService } from "./member.service";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAysnc";

const createMember: RequestHandler = catchAsync(async (req, res) => {
    const result = await MemberService.createMember(req.body);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: "Member created successfully",
        data: result,
    });
});

const getAllMembersFromDB: RequestHandler = catchAsync(async (req, res) => {
    const result = await MemberService.getAllMembersFromDB();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Members retrieved successfully",
        data: result,
    });
});

const getMemberByIdFromDB: RequestHandler = catchAsync(async (req, res) => {
    let { memberId } = req.params;
    if (memberId.startsWith(":")) {
        memberId = memberId.substring(1);
    }
    const result = await MemberService.getMemberByIdFromDB(memberId);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Member retrieved successfully",
        data: result,
    });
});

const updateMemberIntoDB: RequestHandler = catchAsync(async (req, res) => {
    let { memberId } = req.params;
    if (memberId.startsWith(":")) {
        memberId = memberId.substring(1);
    }
    const payload = req.body;
    const result = await MemberService.updateMemberIntoDB(
        memberId,
        payload
    );
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Member updated successfully",
        data: result,
    });
});

const deleteMemberFromDB: RequestHandler = catchAsync(async (req, res) => {
    let { memberId } = req.params;
    if (memberId.startsWith(":")) {
        memberId = memberId.substring(1);
    }
    await MemberService.deleteMemberFromDB(memberId);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Member successfully deleted",
    });
});

export const MemberController = {
    createMember,
    getAllMembersFromDB,
    getMemberByIdFromDB,
    updateMemberIntoDB,
    deleteMemberFromDB
};