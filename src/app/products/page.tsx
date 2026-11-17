import { Suspense } from "react";
import ProductsPageContent from "./ProductsPageContent";

export const dynamic = "force-dynamic";

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-gray-950">
          <div className="h-20 bg-vault border-b border-gray-800"></div>
          <main className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fen-300 mx-auto mb-4"></div>
              <div className="text-xl font-bold text-gray-400">Loading products...</div>
            </div>
          </main>
          <div className="h-20 bg-black"></div>
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}
