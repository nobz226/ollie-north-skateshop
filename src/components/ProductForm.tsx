"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import Image from "next/image";

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
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const getStorageUrl = useMutation(api.fileStorage.getStorageUrl);

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
    stockQuantity: "0",
    featured: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

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
        stockQuantity: existingProduct.stockQuantity?.toString() || "0",
        featured: existingProduct.featured || false,
      });
      setImagePreview(existingProduct.imageUrl);
    }
  }, [existingProduct]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);
      
      // Get upload URL from Convex
      const uploadUrl = await generateUploadUrl();
      
      // Upload the file
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      
      if (!result.ok) {
        throw new Error(`Upload failed: ${result.statusText}`);
      }
      
      const { storageId } = await result.json();
      console.log("Uploaded file with storageId:", storageId);
      
      // Get the actual signed URL from Convex
      const imageUrl = await getStorageUrl({ storageId });
      console.log("Generated image URL:", imageUrl);
      
      return imageUrl || "";
      
    } catch (err) {
      console.error("Upload error:", err);
      throw new Error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.price || !formData.category) {
        throw new Error("Please fill in all required fields");
      }

      let imageUrl = formData.imageUrl;
      
      // Upload file if one was selected
      if (selectedFile) {
        imageUrl = await uploadFile(selectedFile);
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
          imageUrl,
          category: formData.category,
          subcategory: formData.subcategory,
          productType: formData.productType,
          size: formData.size || undefined,
          inStock: formData.inStock,
          stockQuantity: parseInt(formData.stockQuantity) || 0,
          featured: formData.featured,
        });
      } else {
        // Create new product
        await createProduct({
          name: formData.name,
          description: formData.description,
          price: priceInCents,
          imageUrl,
          category: formData.category,
          subcategory: formData.subcategory,
          productType: formData.productType,
          size: formData.size || undefined,
          inStock: formData.inStock,
          stockQuantity: parseInt(formData.stockQuantity) || 0,
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

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image
            </label>
            
            <div className="space-y-3">
              {/* File Upload */}
              <div>
                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-cyan-500">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {selectedFile ? selectedFile.name : "Choose Image File"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="sr-only"
                  />
                </label>
                {isUploading && (
                  <p className="text-sm text-cyan-600 mt-1">Uploading image...</p>
                )}
              </div>

              {/* OR divider */}
              <div className="flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-3 text-sm text-gray-500">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {/* URL Input */}
              <div>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, imageUrl: e.target.value });
                    setImagePreview(e.target.value);
                    setSelectedFile(null);
                  }}
                  placeholder="https://... (paste image URL)"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  <div className="relative w-40 h-40 border-2 border-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
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

          {/* Checkboxes and Stock Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stock Quantity *
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
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