import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

interface CartItem {
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
  };
  quantity: number;
}

export async function POST(request: NextRequest) {
  try {
    const { items, userId, userEmail } = await request.json() as {
      items: CartItem[];
      userId?: string;
      userEmail: string;
    };

    // Initialize Stripe inside handler to avoid build-time issues
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-12-15.clover",
    });

    // Calculate order total and prepare line items with metadata
    const lineItems = items.map((item: CartItem) => ({
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
    const metadata: Record<string, string> = {
      cartItems: JSON.stringify(items.map((item: CartItem) => ({
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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}