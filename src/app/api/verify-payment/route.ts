import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json() as { sessionId: string };

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      // Get cart items from metadata
      const cartItems = session.metadata?.cartItems
        ? JSON.parse(session.metadata.cartItems)
        : [];

      return NextResponse.json({
        success: true,
        items: cartItems,
        amount: session.amount_total || 0,
        userId: session.metadata?.userId,
        userEmail: session.customer_email,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Payment not completed",
      });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
