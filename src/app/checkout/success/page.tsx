import { Suspense } from "react";
import CheckoutSuccessContent from "./CheckoutSuccessContent";

export const dynamic = "force-dynamic";

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-xl text-gray-700">Processing your order...</p>
          </div>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
