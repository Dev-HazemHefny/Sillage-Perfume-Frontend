import React from 'react';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../common/ProductCard';
import ProductCardSkeleton from '../common/ProductCardSkeleton';
import { Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FeaturedProducts() {
  const { data, isLoading, error } = useProducts({ featured: true, limit: 8 });

  // 🔍 Debug
  console.log('📊 Featured Products Response:', data);
  
  // ✅ الصح - data.data مباشرة
  const products = data?.data || [];
  
  console.log('✅ Products to render:', products);
  console.log('📏 Products length:', products.length);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-rose-50 to-amber-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-rose-100">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span className="text-sm font-medium bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
              Bestsellers
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Featured <span className="bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">Fragrances</span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {products.length > 0 
              ? `Discover our ${products.length} most loved perfumes`
              : 'Discover our most loved perfumes'}
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="max-w-md mx-auto mb-8 bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <h3 className="text-red-900 font-bold text-lg">Failed to load products</h3>
            </div>
            <p className="text-red-700 text-sm">
              {error.message || 'Something went wrong'}
            </p>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            // Loading Skeletons
            Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={`skeleton-${index}`} />
            ))
          ) : products.length > 0 ? (
            // Product Cards
            products.map((product) => {
              console.log('🎴 Rendering product:', product);
              return (
                <ProductCard key={product._id} product={product} />
              );
            })
          ) : (
            // Empty State
            !error && (
              <div className="col-span-full text-center py-20">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-16 h-16 text-purple-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No featured products yet</h3>
                <p className="text-gray-500">
                  Featured products will appear here once they are created
                </p>
              </div>
            )
          )}
        </div>

        {/* View All Button */}
        {products.length > 0 && (
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-600 to-purple-600 text-white rounded-full font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              View All Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}