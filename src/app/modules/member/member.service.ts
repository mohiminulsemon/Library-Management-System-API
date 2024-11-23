import prisma from "../../shared/prisma";
import { ConflictError, NotFoundError } from "../../errors/error";

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
  return members;
};

const getMemberByIdFromDB = async (memberId: string) => {
  const member = await prisma.member.findUnique({
    where: { memberId },
  });

  if (!member) {
    throw new NotFoundError(`No member found with the ID ${memberId}.`);
  }

  return member;
};

const updateMemberIntoDB = async (memberId: string, payload: any) => {
  const updatedMember = await prisma.member.update({
    where: { memberId },
    data: payload,
  });

  return updatedMember;
};

const deleteMemberFromDB = async (memberId: string) => {
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
  deleteMemberFromDB,
};
