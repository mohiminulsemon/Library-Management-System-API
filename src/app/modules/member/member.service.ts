import prisma from "../../shared/prisma";
import { validate as isUUID } from 'uuid';
import { BadRequestError, ConflictError, NotFoundError } from "../../utils/error";

// Helper function to check if memberId is valid and if member exists
const getMemberById = async (memberId: string) => {
    if (!isUUID(memberId)) {
        throw new BadRequestError(`Invalid member ID format. Please provide a valid UUID.`);
    }

    const member = await prisma.member.findUnique({
        where: { memberId },
    });

    if (!member) {
        throw new NotFoundError(`Sorry, the member with ID ${memberId} could not be found. Please check the ID and try again.`);
    }

    return member;
};


const createMember = async (payload: any) => {
    const existingMember = await prisma.member.findUnique({
        where: {
            email: payload.email,
        },
    });

    if (existingMember) {
        throw new ConflictError(`A member with the email ${payload.email} already exists.`);
    }

    const createdMember = await prisma.member.create({
        data: {
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            membershipDate: payload.membershipDate,
        },
    });
    return createdMember;
};

const getAllMembersFromDB = async () => {
    const members = await prisma.member.findMany();

    if (members.length === 0) {
        throw new NotFoundError("No members found in the database.");
    }
    
    return members;
};

const getMemberByIdFromDB = async (memberId: string) => {
    // const member = await prisma.member.findUnique({
    //     where: { memberId },
    // });
    // return member;
    return await getMemberById(memberId);

};

const updateMemberIntoDB = async (memberId: string, payload: any) => {
    await getMemberById(memberId);
    const updatedMember = await prisma.member.update({
        where: { memberId },
        data: {
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
        },
    });

    return updatedMember;
};

const deleteMemberFromDB = async (memberId: string) => {
    await getMemberById(memberId);
    const deletedMember = await prisma.member.delete({
        where: { memberId },
    });
    return deletedMember;
};

export const MemberService = {
    createMember,
    getAllMembersFromDB,
    getMemberByIdFromDB,
    updateMemberIntoDB,
    deleteMemberFromDB
};