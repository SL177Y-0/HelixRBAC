import prismaClient from "@/lib/prisma";
import { AuthUser } from "@/commons/types/auth";

export async function handleUserSetup(email: string): Promise<AuthUser> {
  const user = await prismaClient.user.findUnique({
    where: {
      email
    }
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}