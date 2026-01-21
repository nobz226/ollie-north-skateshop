"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConvexUser } from "@/hooks/useConvexUser";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, ShoppingCart } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Header from "../Header";
import Footer from "../Footer";

export default function WishlistPage() {
  const { convexUser, isLoading: userLoading } = useConvexUser();
  const router = useRouter();

  const wishlist = useQuery(
    api.wishlist.getUserWishlist,
    convexUser ? { userId: convexUser._id } : "skip"
  );

  const removeFromWishlist = useMutation(api.wishlist.removeFromWishlist);
  const addToCart = useMutation(api.cart.addToCart);

  // Show sign-in prompt if not authenticated
  if (!userLoading && !convexUser) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <Breadcrumbs items={[{ label: "Wishlist", href: "/wishlist" }]} />
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
              <div className="text-center max-w-md">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign In Required</h1>
                <p className="text-gray-600 mb-8">
                  Please sign in to view your wishlist.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link
                    href="/sign-in?redirectUrl=/wishlist"
                    className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Sign In
                  </Link>
                  <button
                    onClick={() => router.back()}
                    className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (userLoading || wishlist === undefined) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-lg">Loading wishlist...</div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleRemove = async (wishlistItemId: string) => {
    try {
      await removeFromWishlist({ wishlistItemId: wishlistItemId as any });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const handleAddToCart = async (productId: string) => {
    if (!convexUser) return;

    try {
      await addToCart({
        userId: convexUser._id,
        productId: productId as any,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <Breadcrumbs items={[{ label: "Wishlist", href: "/wishlist" }]} />
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h1>
              <p className="text-gray-600 mb-8">Save items you love for later!</p>
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Breadcrumbs items={[{ label: "Wishlist", href: "/wishlist" }]} />
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => {
              if (!item.product) return null;

              return (
                <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Product Image */}
                  <Link href={`/products/${item.product._id}`} className="block relative h-48 bg-gray-200">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemove(item._id);
                      }}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                    >
                      <X className="h-4 w-4 text-gray-600" />
                    </button>
                  </Link>

                  {/* Product Info */}
                  <div className="p-4">
                    <Link href={`/products/${item.product._id}`}>
                      <h3 className="font-semibold text-gray-900 mb-1 hover:text-indigo-600">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 mb-2">{item.product.subcategory}</p>
                    <p className="text-lg font-bold text-gray-900 mb-3">
                      ${(item.product.price / 100).toFixed(2)}
                    </p>

                    <button
                      onClick={() => handleAddToCart(item.product!._id)}
                      disabled={!item.product.inStock}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        item.product.inStock
                          ? "bg-cyan-500 text-white hover:bg-cyan-600"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {item.product.inStock ? "" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
