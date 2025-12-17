import { auth, currentUser } from "@clerk/nextjs/server";
import React from "react";

const page = async () => {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) {
    return <div>Sign in to view this page</div>;
  }

  // Get the Backend User object when you need access to the user's information
  const user = await currentUser();
  console.log(user);
  return <div>page</div>;
};

export default page;
