"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

interface ProductFormProps {
  productId?: Id<"products">;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProductForm({ productId, onClose, onSuccess }: ProductFormProps) {
  const existingProduct = useQuery(
    api.products.getById,
    productId ? { id: productId } : "skip"
  );
  const categories = useQuery(api.adminProducts.getCategories);
  const updateProduct = useMutation(api.adminProducts.updateProduct);
  const createProduct = useMutation(api.adminProducts.createProduct);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
    subcategory: "",
    productType: "",
    size: "",
    inStock: true,
    featured: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Populate form when editing existing product
  useEffect(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name,
        description: existingProduct.description,
        price: (existingProduct.price / 100).toFixed(2), // Convert cents to dollars
        imageUrl: existingProduct.imageUrl,
        category: existingProduct.category,
        subcategory: existingProduct.subcategory,
        productType: existingProduct.productType,
        size: existingProduct.size || "",
        inStock: existingProduct.inStock,
        featured: existingProduct.featured || false,
      });
    }
  }, [existingProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.price || !formData.category) {
        throw new Error("Please fill in all required fields");
      }

      // Convert price to cents
      const priceInCents = Math.round(parseFloat(formData.price) * 100);

      if (productId) {
        // Update existing product
        await updateProduct({
          productId,
          name: formData.name,
          description: formData.description,
          price: priceInCents,
          imageUrl: formData.imageUrl,
          category: formData.category,
          subcategory: formData.subcategory,
          productType: formData.productType,
          size: formData.size || undefined,
          inStock: formData.inStock,
          featured: formData.featured,
        });
      } else {
        // Create new product
        await createProduct({
          name: formData.name,
          description: formData.description,
          price: priceInCents,
          imageUrl: formData.imageUrl,
          category: formData.category,
          subcategory: formData.subcategory,
          productType: formData.productType,
          size: formData.size || undefined,
          inStock: formData.inStock,
          featured: formData.featured,
        });
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 my-8">
        <h3 className="text-lg font-medium mb-4">
          {productId ? "Edit Product" : "Create New Product"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Price and Image URL */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price (USD) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Size (optional)
              </label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                placeholder="e.g., 8.0, M, L"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Category Dropdowns */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select...</option>
                {categories?.categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="__new__">+ Add New</option>
              </select>
              {formData.category === "__new__" && (
                <input
                  type="text"
                  placeholder="New category name"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subcategory *
              </label>
              <select
                required
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select...</option>
                {categories?.subcategories.map((subcat) => (
                  <option key={subcat} value={subcat}>
                    {subcat}
                  </option>
                ))}
                <option value="__new__">+ Add New</option>
              </select>
              {formData.subcategory === "__new__" && (
                <input
                  type="text"
                  placeholder="New subcategory name"
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Type *
              </label>
              <select
                required
                value={formData.productType}
                onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select...</option>
                {categories?.productTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
                <option value="__new__">+ Add New</option>
              </select>
              {formData.productType === "__new__" && (
                <input
                  type="text"
                  placeholder="New product type"
                  onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                  className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              )}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex gap-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">In Stock</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Featured on Homepage</span>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : productId ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}