// lib/auth/requireAdmin.ts
import { auth } from "@clerk/nextjs/server";
import type { JwtSessionClaims } from "@clerk/nextjs/server";

export interface CustomJwtSessionClaims {
  metadata?: {
    role?: "user" | "admin";
  };
}

export async function shouldBeAdmin() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const claims = sessionClaims as JwtSessionClaims & {
    metadata?: { role?: "admin" | "user" };
  };

  if (claims.metadata?.role !== "admin") {
    throw new Error("Forbidden");
  }

  return userId;
}
