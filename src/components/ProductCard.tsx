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
import { latinFor, specimenNumber, toRoman } from "@/lib/catalog";

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
      <article className="frame flex h-full flex-col bg-vault/40 p-3 transition-colors duration-500 group-hover:border-blood-500/50">
        {/* Specimen plate */}
        <div className="relative aspect-[4/5] overflow-hidden bg-vault">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
            className={`specimen-img object-cover group-hover:scale-105 ${product.inStock ? "" : "!grayscale"}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-crypt/80 via-transparent to-crypt/30" />

          {/* Specimen number, in Roman numerals */}
          <span className="label absolute left-3 top-3 text-[0.62rem] text-bone/75">
            No. {toRoman(Number(specimenNumber(product._id)))}
          </span>

          {!product.inStock && (
            <span className="label absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 whitespace-nowrap border-2 border-blood-500 bg-crypt/80 px-3 py-1.5 text-blood-400">
              Sold out · back soon
            </span>
          )}

          {/* Wishlist Button - Only show for logged-in users */}
          {convexUser && (
            <button
              onClick={handleToggleWishlist}
              aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              className="absolute right-3 top-3 z-10 text-bone/80 transition-transform hover:scale-110"
            >
              <Heart className={`h-5 w-5 ${isInWishlist ? "fill-blood-500 text-blood-500" : ""}`} strokeWidth={1.25} />
            </button>
          )}

          {/* Quick add, rises on hover (always visible on touch screens) */}
          {product.inStock && (
            <button
              onClick={handleAddToCart}
              disabled={Boolean(isAddingToCart || userLoading)}
              className={`btn absolute inset-x-3 bottom-3 z-10 !px-3 !py-3 text-[0.68rem] transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] md:translate-y-[130%] md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 disabled:opacity-60 ${
                showSuccess ? "bg-fen-600 text-bone" : "btn-blood"
              }`}
            >
              {showSuccess ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              {showSuccess ? "In your bag" : isAddingToCart ? "Adding…" : "Add to bag"}
            </button>
          )}
        </div>

        {/* Label */}
        <div className="flex flex-grow flex-col px-1 pb-1 pt-4 text-center">
          <p className="truncate text-sm text-blood-300/90">
            {latin ? <span className="latin text-base">{latin}</span> : <span className="label">{product.subcategory}</span>}
            {product.size && <span className="text-bone/40"> &nbsp;·&nbsp; {product.size}</span>}
          </p>
          <h3 className="mt-1 text-xl leading-tight text-bone sm:text-2xl">{product.name}</h3>
          <span className="mx-auto my-3 h-px w-8 bg-bone/20 transition-all duration-500 group-hover:w-16 group-hover:bg-blood-500" />
          <span className="font-display text-xl text-bone/90">${(product.price / 100).toFixed(2)}</span>
          {lowStock && (
            <p className="label mt-2 text-[0.62rem] text-blood-400">
              Only {product.stockQuantity} remain
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
