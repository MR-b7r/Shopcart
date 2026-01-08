import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET(
  req: Request,
  { params }: { params: { session_id: string } }
) {
  try {
    const { session_id } = params;
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items"],
    });
    return NextResponse.json(
      { status: session.status, paymentStatus: session.payment_status },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
