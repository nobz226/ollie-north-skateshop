import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(request: NextRequest) {
  try {
    const { items, userId, userEmail } = await request.json();

    // Calculate order total and prepare line items with metadata
    const lineItems = items.map((item: any, index: number) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
          description: item.product.description,
          images: [item.product.imageUrl],
          metadata: {
            productId: item.product._id,
          },
        },
        unit_amount: item.product.price, // Already in cents
      },
      quantity: item.quantity,
    }));

    // Store cart items in metadata for retrieval after payment
    const metadata: any = {
      cartItems: JSON.stringify(items.map((item: any) => ({
        productId: item.product._id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      }))),
    };

    if (userId) {
      metadata.userId = userId;
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/checkout/cancel`,
      customer_email: userEmail,
      metadata,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
