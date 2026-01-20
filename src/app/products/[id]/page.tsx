"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel";
import { useConvexUser } from "@/hooks/useConvexUser";
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
  const addToCart = useMutation(api.cart.addToCart);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = async () => {
    if (!convexUser || userLoading) {
      // Redirect to sign-in with return URL
      router.push("/sign-in?redirectUrl=" + encodeURIComponent(window.location.pathname));
      return;
    }

    setIsAddingToCart(true);

    try {
      await addToCart({
        userId: convexUser._id,
        productId: product!._id,
      });

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
            className="text-indigo-600 hover:text-indigo-800"
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
            className="mb-6 text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
          >
            ← Back
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative h-96 md:h-[600px] bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  {product.category} / {product.subcategory}
                </p>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                {product.size && (
                  <p className="text-lg text-gray-600">Size: {product.size}</p>
                )}
              </div>

              <div className="mb-6">
                <p className="text-4xl font-bold text-gray-900">
                  ${(product.price / 100).toFixed(2)}
                </p>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Product Details
                </h2>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <span className="font-medium">Type:</span> {product.productType}
                  </li>
                  {product.size && (
                    <li>
                      <span className="font-medium">Size:</span> {product.size}
                    </li>
                  )}
                  <li>
                    <span className="font-medium">Availability:</span>{" "}
                    <span
                      className={
                        product.inStock ? "text-green-600" : "text-red-600"
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
                className={`w-full py-4 px-6 rounded-lg text-lg font-semibold transition-colors ${
                  showSuccess
                    ? "bg-green-600 text-white"
                    : product.inStock
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {showSuccess
                  ? "Added to Cart ✓"
                  : isAddingToCart
                  ? "Adding to Cart..."
                  : product.inStock
                  ? "Add to Cart"
                  : "Out of Stock"}
              </button>

              {!convexUser && !userLoading && (
                <p className="mt-4 text-sm text-gray-600 text-center">
                  Please{" "}
                  <button
                    onClick={() => router.push("/sign-in")}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
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