"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useConvexUser } from "@/hooks/useConvexUser";
import { useGuestCart } from "@/hooks/useGuestCart";
import { useState } from "react";
import { Heart, Plus, Check } from "lucide-react";
import { latinFor, specimenNumber } from "@/lib/catalog";

interface Product {
  _id: Id<"products">;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  subcategory: string;
  productType: string;
  size?: string;
  inStock: boolean;
  stockQuantity?: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { convexUser, isLoading: userLoading } = useConvexUser();
  const addToCartMutation = useMutation(api.cart.addToCart);
  const addToWishlist = useMutation(api.wishlist.addToWishlist);
  const removeFromWishlist = useMutation(api.wishlist.removeFromWishlistByProduct);
  const { addToCart: addToGuestCart } = useGuestCart();
  
  const isInWishlist = useQuery(
    api.wishlist.isInWishlist,
    convexUser ? { userId: convexUser._id, productId: product._id } : "skip"
  );
  
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation

    setIsAddingToCart(true);

    try {
      if (convexUser) {
        // Authenticated user - add to Convex cart
        await addToCartMutation({
          userId: convexUser._id,
          productId: product._id,
        });
      } else {
        // Guest user - add to localStorage cart
        addToGuestCart(product._id);
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

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!convexUser || userLoading) {
      router.push("/sign-in?redirectUrl=" + encodeURIComponent(window.location.pathname));
      return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlist({
          userId: convexUser._id,
          productId: product._id,
        });
      } else {
        await addToWishlist({
          userId: convexUser._id,
          productId: product._id,
        });
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  const latin = latinFor(product.subcategory);
  const lowStock =
    product.inStock && product.stockQuantity !== undefined && product.stockQuantity > 0 && product.stockQuantity <= 5;

  return (
    <Link href={`/products/${product._id}`} className="group block h-full">
      <article className="h-full flex flex-col">
        {/* Arched specimen photo */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-t-[12rem] rounded-b-3xl bg-moss-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
            className={`object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110 ${
              product.inStock ? "" : "grayscale-[60%]"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Hanging specimen tag */}
          <div className="absolute left-1/2 top-5 -translate-x-1/2">
            <div className="origin-top transition-transform group-hover:animate-sway">
              <div className="mx-auto h-3 w-px bg-ink/40" />
              <span className="label block rounded-sm bg-parchment/95 px-2.5 py-1 text-[0.65rem] text-ink shadow-sm">
                No. {specimenNumber(product._id)}
              </span>
            </div>
          </div>

          {!product.inStock && (
            <span className="label absolute right-4 bottom-20 rotate-[-8deg] rounded-sm border-2 border-trap-500 bg-parchment/90 px-3 py-1.5 text-trap-600">
              Sold out · back soon
            </span>
          )}

          {/* Wishlist Button - Only show for logged-in users */}
          {convexUser && (
            <button
              onClick={handleToggleWishlist}
              aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              className="absolute bottom-4 right-4 z-10 rounded-full bg-parchment/90 p-2.5 backdrop-blur-sm transition-all hover:scale-110"
            >
              <Heart className={`h-4 w-4 ${isInWishlist ? "fill-trap-500 text-trap-500" : "text-ink"}`} />
            </button>
          )}

          {/* Quick add, slides up on hover */}
          {product.inStock && (
            <button
              onClick={handleAddToCart}
              disabled={Boolean(isAddingToCart || userLoading)}
              className={`absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-full px-3 py-2 text-xs sm:px-4 sm:py-2.5 sm:text-sm font-medium shadow-lg transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] md:translate-y-[150%] md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 ${
                showSuccess ? "bg-moss-600 text-white" : "bg-ink text-parchment hover:bg-trap-500"
              } ${convexUser ? "right-16" : "right-4"} justify-center disabled:opacity-60`}
            >
              {showSuccess ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showSuccess ? "Added to bag" : isAddingToCart ? "Adding…" : "Add to bag"}
            </button>
          )}
        </div>

        {/* Label */}
        <div className="flex flex-grow flex-col pt-5 px-1">
          <p className="label mb-2 text-moss-600 truncate">
            {latin ? <span className="latin normal-case tracking-normal text-[0.85rem]">{latin}</span> : product.subcategory}
            {product.size && <span className="text-ink/40"> &nbsp;/&nbsp; {product.size}</span>}
          </p>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <h3 className="text-lg sm:text-[1.4rem] leading-tight text-ink transition-colors duration-300 group-hover:text-moss-700">
              {product.name}
            </h3>
            <span className="font-display text-lg sm:text-[1.4rem] leading-tight text-ink">
              ${(product.price / 100).toFixed(2)}
            </span>
          </div>
          {lowStock && (
            <p className="label mt-3 flex items-center gap-2 text-trap-600">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-trap-500" />
              Only {product.stockQuantity} left
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
