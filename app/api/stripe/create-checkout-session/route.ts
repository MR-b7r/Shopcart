import { createCheckoutSession } from "@/lib/actions/payment.actions";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { cart } = await req.json();
    const { userId } = await auth();
    const session = await createCheckoutSession({ cart, userId });
    return NextResponse.json(session, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
