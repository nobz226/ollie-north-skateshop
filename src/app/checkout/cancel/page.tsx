"use client";

import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";

export default function CheckoutCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="max-w-md w-full bg-vault rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-10 h-10 text-yellow-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Checkout Cancelled</h1>
        <p className="text-gray-400 mb-6">
          Your payment was cancelled. No charges have been made to your account.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => router.push("/cart")}
            className="w-full px-6 py-3 bg-fen-300 text-bone rounded-lg hover:bg-fen-200 transition-colors font-bold"
          >
            Return to Cart
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full px-6 py-3 border-2 border-gray-700 text-gray-300 rounded-lg hover:bg-gray-950 transition-colors font-bold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
