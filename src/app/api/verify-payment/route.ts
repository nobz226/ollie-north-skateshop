import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

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
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
