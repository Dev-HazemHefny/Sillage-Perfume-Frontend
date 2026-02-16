import React from 'react';
import { useCategories } from '../../hooks/useCategories';
import CategoryCard from '../../components/common/CategoryCard';
import CategoryCardSkeleton from '../../components/common/CategoryCardSkeleton';
import { AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Categories() {
  const { data, isLoading, error, refetch } = useCategories({ isActive: true });

  const categories = data?.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-purple-100 mb-6">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Explore Collections
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Perfume <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Categories</span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {categories.length > 0 
              ? `Discover ${categories.length} unique fragrance ${categories.length === 1 ? 'category' : 'categories'}`
              : 'Discover our unique fragrance categories'
            }
          </p>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto mb-8 bg-red-50 border border-red-200 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <h3 className="text-red-900 font-bold text-lg">Failed to load categories</h3>
            </div>
            <p className="text-red-700 text-sm mb-4">
              {error.message || 'Something went wrong'}
            </p>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </motion.div>
        )}
        
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading Skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <CategoryCardSkeleton key={`skeleton-${index}`} />
            ))
          ) : categories.length > 0 ? (
            // Category Cards
            categories.map((category, index) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CategoryCard
                  category={category}
                  name={category.name}
                  description={category.description}
                  image={category.image}
                />
              </motion.div>
            ))
          ) : (
            // Empty State
            !error && (
              <div className="col-span-full text-center py-20">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-16 h-16 text-purple-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No categories yet</h3>
                <p className="text-gray-600">
                  Categories will appear here once they are created
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}