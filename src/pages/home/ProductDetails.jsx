import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../../hooks/useProducts';
import { ArrowLeft, Loader2 } from 'lucide-react';
import ProductImageGallery from '../../components/product/ProductImageGallery';
import ProductInfo from '../../components/product/ProductInfo';
import ProductTabs from '../../components/product/ProductTabs';
import RelatedProducts from '../../components/product/RelatedProducts';
import ProductSkeleton from '../../components/product/ProductSkeleton';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useProduct(id);

  const product = data?.data;

  if (isLoading) {
    return <ProductSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-amber-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-6xl">😞</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error.message}</p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-gradient-to-r from-rose-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-xl transition-all"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-amber-50">
      
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back</span>
        </button>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          
          {/* Image Gallery */}
          <ProductImageGallery images={product.images} productName={product.name} />

          {/* Product Info */}
          <ProductInfo product={product} />
        </div>

        {/* Product Tabs (Description, Reviews, etc.) */}
        <ProductTabs product={product} />

        {/* Related Products */}
        <RelatedProducts categoryId={product.category._id} currentProductId={product._id} />
      </div>
    </div>
  );
}