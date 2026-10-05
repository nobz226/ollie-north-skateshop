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
import { ArrowLeft, Check, Plus, Sun, Droplets, Snowflake, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { CARE_INFO, latinFor, specimenNumber } from "@/lib/catalog";

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
        <div className="latin text-3xl text-ink/60 animate-pulse">Fetching specimen…</div>
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
            className="text-moss-700 hover:text-moss-800 font-bold transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const care = CARE_INFO[product.subcategory];
  const latin = latinFor(product.subcategory);
  const lowStock =
    product.inStock && product.stockQuantity !== undefined && product.stockQuantity > 0 && product.stockQuantity <= 5;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-10">
          <div className="flex items-center justify-between gap-4">
            <Breadcrumbs items={breadcrumbItems} />
            <button
              onClick={() => router.back()}
              className="label mb-6 hidden items-center gap-2 text-ink/60 hover:text-ink transition-colors md:flex"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Product Image */}
            <div className="lg:sticky lg:top-32 lg:self-start">
              <motion.div
                className="relative aspect-[4/5] overflow-hidden rounded-t-[18rem] rounded-b-[2rem] bg-moss-100"
                initial={{ clipPath: "inset(100% 0 0 0)" }}
                animate={{ clipPath: "inset(0% 0 0 0)" }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  className="absolute inset-0"
                  initial={{ scale: 1.25 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className={`object-cover ${product.inStock ? "" : "grayscale-[60%]"}`}
                    priority
                  />
                </motion.div>
                <div className="absolute left-1/2 top-8 -translate-x-1/2 animate-sway origin-top">
                  <div className="mx-auto h-4 w-px bg-ink/40" />
                  <span className="label block rounded-sm bg-parchment/95 px-3 py-1.5 text-ink shadow-sm">
                    Specimen No. {specimenNumber(product._id)}
                  </span>
                </div>
                {!product.inStock && (
                  <span className="label absolute bottom-8 right-8 rotate-[-8deg] rounded-sm border-2 border-trap-500 bg-parchment/90 px-4 py-2 text-trap-600">
                    Sold out · back soon
                  </span>
                )}
              </motion.div>
            </div>

            {/* Product Details */}
            <motion.div
              className="flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="label mb-4 text-moss-600">
                {latin ? <span className="latin normal-case tracking-normal text-base">{latin}</span> : product.category}
                <span className="text-ink/40"> &nbsp;/&nbsp; {product.subcategory}</span>
              </p>
              <h1 className="text-5xl md:text-6xl leading-[1] text-ink">{product.name}</h1>

              <div className="mt-8 flex items-end justify-between gap-4 border-y border-ink/15 py-6">
                <p className="font-display text-5xl text-ink">${(product.price / 100).toFixed(2)}</p>
                <div className="text-right">
                  {product.inStock ? (
                    <p className={`label flex items-center justify-end gap-2 ${lowStock ? "text-trap-600" : "text-moss-600"}`}>
                      <span className={`h-2 w-2 rounded-full ${lowStock ? "bg-trap-500 animate-pulse" : "bg-moss-500"}`} />
                      {lowStock ? `Only ${product.stockQuantity} left` : "In stock"}
                    </p>
                  ) : (
                    <p className="label text-trap-600">Out of stock</p>
                  )}
                </div>
              </div>

              <p className="mt-8 text-lg leading-relaxed text-ink/75">{product.description}</p>

              <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10">
                <div className="bg-parchment p-5">
                  <dt className="label text-ink/50">Form</dt>
                  <dd className="mt-1 text-lg">{product.productType}</dd>
                </div>
                <div className="bg-parchment p-5">
                  <dt className="label text-ink/50">Size</dt>
                  <dd className="mt-1 text-lg">{product.size || "One size"}</dd>
                </div>
              </dl>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={Boolean(!product || !product.inStock || isAddingToCart || userLoading)}
                className={`group mt-8 flex w-full items-center justify-center gap-3 rounded-full py-5 text-lg transition-all duration-300 active:scale-[0.98] ${
                  showSuccess
                    ? "bg-moss-600 text-white"
                    : product.inStock
                    ? "bg-ink text-parchment hover:bg-trap-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    : "bg-ink/10 text-ink/40 cursor-not-allowed"
                }`}
              >
                {showSuccess ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Plus className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
                )}
                {showSuccess
                  ? "Added to your bag"
                  : isAddingToCart
                  ? "Adding…"
                  : product.inStock
                  ? "Add to bag"
                  : "Sold out"}
              </button>
              <p className="label mt-4 flex items-center justify-center gap-2 text-ink/50">
                <Truck className="h-3.5 w-3.5" /> Ships Mon–Wed · live arrival guaranteed
              </p>

              {care && (
                <div className="relative mt-12 rounded-3xl bg-moss-900 p-8 text-parchment">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-3xl">
                      Field <em>notes</em>
                    </h2>
                    <span className="label rounded-full border border-parchment/25 px-3 py-1 text-parchment/80">
                      {care.difficulty}
                    </span>
                  </div>
                  <ul className="space-y-5">
                    {[
                      { icon: Sun, label: "Light", text: care.light },
                      { icon: Droplets, label: "Water", text: care.water },
                      { icon: Snowflake, label: "Dormancy", text: care.dormancy },
                    ].map(({ icon: Icon, label, text }) => (
                      <li key={label} className="flex gap-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-parchment/10">
                          <Icon className="h-4 w-4 text-dew-300" />
                        </span>
                        <div>
                          <p className="label text-parchment/50">{label}</p>
                          <p className="mt-0.5 text-parchment/90">{text}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
