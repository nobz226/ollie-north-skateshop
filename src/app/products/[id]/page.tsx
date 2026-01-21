"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel";
import { useConvexUser } from "@/hooks/useConvexUser";
import { useGuestCart } from "@/hooks/useGuestCart";
import { useState, useMemo } from "react";
import Image from "next/image";
import Header from "../../Header";
import Footer from "../../Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as Id<"products">;
  const product = useQuery(api.products.getById, { id: productId });
  const { convexUser, isLoading: userLoading } = useConvexUser();
  const { addToCart: addToGuestCart } = useGuestCart();
  const addToCart = useMutation(api.cart.addToCart);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);

    try {
      if (convexUser) {
        // Authenticated user - use Convex
        await addToCart({
          userId: convexUser._id,
          productId: product._id,
        });
      } else {
        // Guest user - use localStorage
        addToGuestCart(product._id, 1);
      }

      // Show success feedback
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Build breadcrumbs based on product
  const breadcrumbItems = useMemo(() => {
    if (!product) return [{ label: "Products", href: "/products" }];
    
    return [
      { label: "Products", href: "/products" },
      { label: product.category, href: `/products?category=${product.category}` },
      { label: product.subcategory, href: `/products?subcategory=${product.subcategory}` },
      { label: product.name, href: `/products/${product._id}` },
    ];
  }, [product]);

  if (product === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (product === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h2>
          <button
            onClick={() => router.push("/products")}
            className="text-cyan-500 hover:text-cyan-600 font-bold transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <Breadcrumbs items={breadcrumbItems} />
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mb-6 text-cyan-500 hover:text-cyan-600 flex items-center gap-2 font-bold transition-colors"
          >
            ← BACK
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="relative h-96 md:h-[600px] bg-gray-50 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-white font-bold text-2xl tracking-wide">
                    OUT OF STOCK
                  </span>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <div className="mb-6">
                <p className="text-sm text-cyan-600 mb-2 uppercase font-bold tracking-wide">
                  {product.category} / {product.subcategory}
                </p>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  {product.name}
                </h1>
                {product.size && (
                  <p className="text-lg text-gray-600">Size: {product.size}</p>
                )}
              </div>

              <div className="mb-8">
                <p className="text-5xl font-bold text-gray-900">
                  ${(product.price / 100).toFixed(2)}
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  Description
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

              <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Product Details
                </h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <span className="font-bold w-32">Type:</span>
                    <span>{product.productType}</span>
                  </li>
                  {product.size && (
                    <li className="flex items-center">
                      <span className="font-bold w-32">Size:</span>
                      <span>{product.size}</span>
                    </li>
                  )}
                  <li className="flex items-center">
                    <span className="font-bold w-32">Availability:</span>
                    <span
                      className={
                        product.inStock ? "text-green-600 font-bold" : "text-red-600 font-bold"
                      }
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || isAddingToCart || userLoading}
                className={`w-full py-5 px-6 rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 ${
                  showSuccess
                    ? "bg-green-500 text-white"
                    : product.inStock
                    ? "bg-cyan-500 text-white hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {showSuccess
                  ? "ADDED TO CART"
                  : isAddingToCart
                  ? "ADDING TO CART..."
                  : product.inStock
                  ? "ADD TO CART"
                  : "OUT OF STOCK"}
              </button>

              {!convexUser && !userLoading && (
                <p className="mt-4 text-sm text-gray-600 text-center">
                  Please{" "}
                  <button
                    onClick={() => router.push("/sign-in")}
                    className="text-cyan-500 hover:text-cyan-600 font-bold transition-colors"
                  >
                    sign in
                  </button>{" "}
                  to add items to your cart
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}