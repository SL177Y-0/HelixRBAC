import { User } from "@prisma/client";

export async function createTeam(user: User) {
  console.warn("createTeam called but Teams are not implemented");
  return null;
}

export async function addUserToTeam(userId: string, teamId: number, roleId: number) {
  console.warn("addUserToTeam called but Teams are not implemented");
  return null;
}