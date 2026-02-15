import React from 'react';
import CategoryCard from './CategoryCard';
import { useCategories } from '../../hooks/useCategories';
import CategoryCardSkeleton from './CategoryCardSkeleton';
import { AlertCircle, RefreshCw } from 'lucide-react';

const CategorySection = () => {
  const { data, isLoading, error, refetch } = useCategories({ isActive: true });

  // 🔍 Debug
  console.log('📊 Full Response:', data);
  
  // ✅ الصح - data.data مباشرة
  const categories = data?.data || [];
  
  console.log('✅ Categories to render:', categories);
  console.log('📏 Categories length:', categories.length);

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Explore <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Categories</span>
          </h1>
          <p className="text-gray-400 text-lg">
            {categories.length} {categories.length === 1 ? 'category' : 'categories'} available
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="max-w-md mx-auto mb-8 bg-red-500/10 border border-red-500/50 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <h3 className="text-red-400 font-bold text-lg">Failed to load categories</h3>
            </div>
            <p className="text-red-300 text-sm mb-4">
              {error.message || 'Something went wrong'}
            </p>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}
        
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading Skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <CategoryCardSkeleton key={`skeleton-${index}`} />
            ))
          ) : categories.length > 0 ? (
            // Categories Cards
            categories.map((category) => {
              console.log('🎴 Rendering category:', category);
              return (
                <CategoryCard
                  key={category._id}
                  name={category.name}
                  description={category.description}
                  image={category.image}
                />
              );
            })
          ) : (
            // Empty State
            !error && (
              <div className="col-span-full text-center py-20">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-purple-500/20">
                  <AlertCircle className="w-16 h-16 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No categories yet</h3>
                <p className="text-gray-400">
                  Categories will appear here once they are created
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CategorySection;