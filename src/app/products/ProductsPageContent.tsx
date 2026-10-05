"use client";

import { useMemo, useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import ProductCard from "@/components/ProductCard";
import Header from "../Header";
import Footer from "../Footer";
import { useSearchParams, useRouter } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Reveal, SplitReveal } from "@/components/motion";
import { latinFor } from "@/lib/catalog";

export default function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Category and Subcategory are LOCKED from URL - these determine what products to show
  const lockedCategory = searchParams.get("category") || "";
  const lockedSubcategory = searchParams.get("subcategory") || "";

  // These are the user-controlled filters
  const urlProductType = searchParams.get("productType") || "";
  const urlSize = searchParams.get("size") || "";

  const products = useQuery(api.products.list);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductType, setSelectedProductType] = useState(urlProductType);
  const [selectedSize, setSelectedSize] = useState(urlSize);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // DEBUG: Log URL parameters and product data
  useEffect(() => {
    console.log('=== DEBUG INFO ===');
    console.log('URL - lockedCategory:', lockedCategory);
    console.log('URL - lockedSubcategory:', lockedSubcategory);
    console.log('Total products loaded:', products?.length);

    if (products && products.length > 0) {
      // Show unique categories and subcategories in database
      const uniqueCategories = [...new Set(products.map(p => p.category))];
      const uniqueSubcategories = [...new Set(products.map(p => p.subcategory))];
      console.log('Available categories in DB:', uniqueCategories);
      console.log('Available subcategories in DB:', uniqueSubcategories);
    }
  }, [lockedCategory, lockedSubcategory, products]);

  // Use useEffect instead of useMemo for side effects (per copilot-instructions.md)
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, lockedCategory, lockedSubcategory, selectedProductType, selectedSize, priceRange]);

  // Build dynamic breadcrumbs based on current filters
  const breadcrumbItems = useMemo(() => {
    const items = [{ label: "Products", href: "/products" }];

    if (lockedCategory) {
      items.push({
        label: lockedCategory,
        href: `/products?category=${lockedCategory}`,
      });
    }

    if (lockedSubcategory) {
      items.push({
        label: lockedSubcategory.charAt(0).toUpperCase() + lockedSubcategory.slice(1),
        href: `/products?subcategory=${lockedSubcategory}`,
      });
    }

    return items;
  }, [lockedCategory, lockedSubcategory]);

  // Sync URL params to state when they change
  useEffect(() => {
    setSelectedProductType(urlProductType);
    setSelectedSize(urlSize);
  }, [urlProductType, urlSize]);

  // Update URL when filters change (always preserve locked category/subcategory)
  useEffect(() => {
    const params = new URLSearchParams();
    if (lockedCategory) params.set("category", lockedCategory);
    if (lockedSubcategory) params.set("subcategory", lockedSubcategory);
    if (selectedProductType) params.set("productType", selectedProductType);
    if (selectedSize) params.set("size", selectedSize);

    const newUrl = params.toString() ? `/products?${params.toString()}` : "/products";
    router.replace(newUrl, { scroll: false });
  }, [lockedCategory, lockedSubcategory, selectedProductType, selectedSize, router]);

  // Get available filters based on locked category/subcategory
  const { productTypes, sizes } = useMemo(() => {
    if (!products) return { productTypes: [], sizes: [] };

    let filteredProducts = products;

    // ALWAYS filter by locked category if it exists (case-insensitive)
    if (lockedCategory) {
      filteredProducts = filteredProducts.filter((p) =>
        p.category.toLowerCase() === lockedCategory.toLowerCase()
      );
    }

    // ALWAYS filter by locked subcategory if it exists (case-insensitive)
    if (lockedSubcategory) {
      filteredProducts = filteredProducts.filter((p) =>
        p.subcategory.toLowerCase() === lockedSubcategory.toLowerCase()
      );
    }

    console.log('Filtered products after category/subcategory:', filteredProducts.length);

    // Get available product types for this category/subcategory
    const availableProductTypes = Array.from(
      new Set(filteredProducts.map((p) => p.productType))
    ).sort();

    console.log('Available product types:', availableProductTypes);

    // Filter further by selected product type to get sizes
    if (selectedProductType) {
      filteredProducts = filteredProducts.filter((p) => p.productType === selectedProductType);
    }

    const availableSizes = Array.from(
      new Set(filteredProducts.map((p) => p.size).filter((s): s is string => !!s))
    ).sort((a, b) => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    });

    return {
      productTypes: availableProductTypes,
      sizes: availableSizes,
    };
  }, [products, lockedCategory, lockedSubcategory, selectedProductType]);

  // Reset dependent filters when they become invalid
  useEffect(() => {
    if (selectedProductType && !productTypes.includes(selectedProductType)) {
      setSelectedProductType("");
    }
  }, [productTypes, selectedProductType]);

  useEffect(() => {
    if (selectedSize && !sizes.includes(selectedSize)) {
      setSelectedSize("");
    }
  }, [sizes, selectedSize]);

  // Filter products - ALWAYS respect locked category/subcategory (case-insensitive)
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      // LOCKED filters - these ALWAYS apply when present in URL (case-insensitive)
      const matchesCategory =
        lockedCategory === "" || product.category.toLowerCase() === lockedCategory.toLowerCase();

      const matchesSubcategory =
        lockedSubcategory === "" || product.subcategory.toLowerCase() === lockedSubcategory.toLowerCase();

      // User-controlled filters
      const matchesProductType =
        selectedProductType === "" || product.productType === selectedProductType;

      const matchesSize =
        selectedSize === "" || product.size === selectedSize;

      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubcategory &&
        matchesProductType &&
        matchesSize &&
        matchesPrice
      );
    });
  }, [products, searchQuery, lockedCategory, lockedSubcategory, selectedProductType, selectedSize, priceRange]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedProductType("");
    setSelectedSize("");
    setPriceRange([0, 20000]);
    setCurrentPage(1);
    // DO NOT reset locked category/subcategory - they come from URL
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedProductType !== "" ||
    selectedSize !== "" ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 20000;

  // Dynamic page title shows most specific level
  const pageTitle = selectedProductType || lockedSubcategory || lockedCategory || "ALL PRODUCTS";

  // Determine if we're on a filtered page (category or subcategory locked)
  const isFilteredPage = Boolean(lockedCategory || lockedSubcategory);

  if (!products) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="latin text-3xl text-ink/60 animate-pulse">Gathering specimens…</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Page Header */}
        <section className="container mx-auto px-4 pt-10 pb-4">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="mt-8 flex flex-col gap-4 border-b border-ink/15 pb-10 md:flex-row md:items-end md:justify-between">
            <SplitReveal
              key={pageTitle}
              as="h1"
              inView={false}
              text={latinFor(pageTitle) ? `*${latinFor(pageTitle)}*` : pageTitle === "ALL PRODUCTS" ? "The whole *bog*" : pageTitle}
              className="text-6xl md:text-8xl leading-[0.95] text-ink capitalize"
            />
            <p className="label text-ink/50 md:text-right">
              {latinFor(pageTitle) ? `${pageTitle} · ` : ""}
              {filteredProducts.length} specimens available
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-32 rounded-3xl border border-ink/10 bg-white/60 p-6 backdrop-blur">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl">Refine</h2>
                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="label text-trap-500 hover:text-trap-600 transition-colors"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className="label block mb-2 text-ink/60">SEARCH</label>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2.5 border border-ink/15 rounded-full bg-parchment/60 focus:outline-none focus:ring-2 focus:ring-moss-600 focus:border-transparent transition-all"
                  />
                </div>

                {/* Product Type Filter - Show when on filtered page */}
                {isFilteredPage && (
                  <div className="mb-6">
                    <label className="label block mb-2 text-ink/60">PRODUCT TYPE</label>
                    <select
                      value={selectedProductType}
                      onChange={(e) => setSelectedProductType(e.target.value)}
                      className="w-full px-4 py-2.5 border border-ink/15 rounded-full bg-parchment/60 focus:outline-none focus:ring-2 focus:ring-moss-600 focus:border-transparent transition-all bg-white"
                    >
                      <option value="">All Types</option>
                      {productTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Size Filter - Show when product type is selected */}
                {isFilteredPage && selectedProductType !== "" && (
                  <div className="mb-6">
                    <label className="label block mb-2 text-ink/60">SIZE</label>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full px-4 py-2.5 border border-ink/15 rounded-full bg-parchment/60 focus:outline-none focus:ring-2 focus:ring-moss-600 focus:border-transparent transition-all bg-white"
                    >
                      <option value="">All Sizes</option>
                      {sizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Price Range - Always show */}
                <div className="mb-6">
                  <label className="label block mb-2 text-ink/60">PRICE RANGE: ${(priceRange[0] / 100).toFixed(0)} - ${(priceRange[1] / 100).toFixed(0)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20000"
                    step="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-trap-500"
                  />
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-grow">
              {/* Results Info */}
              <div className="flex items-center justify-between mb-6">
                <p className="label text-ink/50">
                  Showing {filteredProducts.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, filteredProducts.length)} of{" "}
                  {filteredProducts.length} products
                </p>
              </div>

              {/* Products */}
              {currentProducts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-xl text-gray-500 mb-4">No products found</p>
                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="text-moss-700 hover:text-moss-800 font-bold transition-colors"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-10 sm:gap-x-8 sm:gap-y-14 mb-16">
                    {currentProducts.map((product, i) => (
                      <Reveal key={product._id} delay={(i % 3) * 0.08} className="h-full">
                        <ProductCard product={product} />
                      </Reveal>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="label px-6 py-3 border border-ink/15 rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:bg-ink hover:text-parchment transition-all"
                      >
                        PREVIOUS
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`h-11 w-11 border rounded-full font-mono text-sm transition-all ${
                            currentPage === page
                              ? "bg-ink text-parchment border-ink"
                              : "border-ink/15 hover:border-ink"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="label px-6 py-3 border border-ink/15 rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:bg-ink hover:text-parchment transition-all"
                      >
                        NEXT
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
