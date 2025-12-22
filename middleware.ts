import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { JwtSessionClaims } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/orders(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims, userId, getToken } = await auth();
  const token = await getToken();
  console.log("token", token);
  const claims = sessionClaims as JwtSessionClaims & CustomJwtSessionClaims;
  const role = claims?.metadata?.role;

  // if (!userId) {
  //   return NextResponse.json(
  //     { message: "You are not logged in!" },
  //     { status: 401 }
  //   );
  // }

  if (isAdminRoute(req)) {
    if (role !== "admin") {
      return NextResponse.json(
        { message: "You do not have permission to access this route!" },
        { status: 403 }
      );
    }
  }

  // Restrict Organization routes to signed in users
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
