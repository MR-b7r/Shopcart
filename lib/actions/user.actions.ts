"use server";
import { UserFormSchema } from "../types";
import { parseStringify } from "../utils";
import { shouldBeAdmin } from "./payment.actions";
import { clerkClient } from "@clerk/nextjs/server";

export const getAllUsers = async () => {
  await shouldBeAdmin();

  const client = await clerkClient();
  const { data, totalCount } = await client.users.getUserList();
  return parseStringify({ data, totalCount });
};
export const getUserById = async (userId: string) => {
  await shouldBeAdmin();

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return parseStringify(user);
};

export const createUser = async (userData: any) => {
  try {
    await shouldBeAdmin();

    const client = await clerkClient();
    const user = await client.users.createUser(userData);
    return parseStringify(user);
  } catch (error: any) {
    console.log(JSON.stringify(error.errors, null, 2));
    throw error;
  }
};
export const deleteUser = async (userId: string) => {
  try {
    await shouldBeAdmin();
    const client = await clerkClient();
    await client.users.deleteUser(userId);
  } catch (error: any) {
    throw error;
  }
};
