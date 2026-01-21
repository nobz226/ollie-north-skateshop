"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useConvexUser } from "@/hooks/useConvexUser";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Check } from "lucide-react";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { convexUser } = useConvexUser();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState("");

  const createOrder = useMutation(api.orders.createOrder);
  const clearCart = useMutation(api.cart.clearCart);

  useEffect(() => {
    if (!sessionId || !convexUser) return;

    const processOrder = async () => {
      try {
        // Verify payment with Stripe
        const response = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (data.success) {
          // Create order in Convex
          await createOrder({
            userId: convexUser._id,
            items: data.items,
            total: data.amount,
          });

          // Clear cart
          await clearCart({ userId: convexUser._id });

          setIsProcessing(false);
        } else {
          setError("Payment verification failed");
          setIsProcessing(false);
        }
      } catch (err) {
        console.error("Order processing error:", err);
        setError("Failed to process order");
        setIsProcessing(false);
      }
    };

    processOrder();
  }, [sessionId, convexUser, createOrder, clearCart]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Processing your order...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-3xl">✕</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/cart")}
            className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Return to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been successfully processed.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => router.push("/")}
            className="w-full px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-bold"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => router.push("/profile")}
            className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-bold"
          >
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
}
