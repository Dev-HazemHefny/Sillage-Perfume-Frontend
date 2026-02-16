import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useProducts, useFilters } from '../../hooks/useProducts';
import { useCategory } from '../../hooks/useCategories';
import ProductCard from '../../components/common/ProductCard';
import ProductCardSkeleton from '../../components/common/ProductCardSkeleton';
import { ArrowLeft, SlidersHorizontal, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CategoryProducts() {
  const { categoryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const categoryName = location.state?.categoryName;

  // Get category details
  const { data: categoryData } = useCategory(categoryId);
  const category = categoryData?.data;

  const [filters, setFilters] = useState({
    category: categoryId,
    gender: '',
    season: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    sort: '-createdAt',
    page: 1,
    limit: 12,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const { data: productsData, isLoading: productsLoading } = useProducts(filters);
  const { data: filtersData } = useFilters();

  const products = productsData?.data || [];
  const pagination = productsData?.pagination || {};
  const availableFilters = filtersData?.data || {};

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    handleFilterChange('search', searchInput);
  };

  const clearFilters = () => {
    setFilters({
      category: categoryId,
      gender: '',
      season: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      sort: '-createdAt',
      page: 1,
      limit: 12,
    });
    setSearchInput('');
  };

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v && v !== categoryId && v !== '-createdAt' && v !== 1 && v !== 12
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/categories')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Categories</span>
        </button>

        {/* Header */}
        <div className="mb-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                {categoryName || category?.name || 'Category'} <span className="bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">Perfumes</span>
              </h1>
              <p className="text-gray-600 mt-2">
                {pagination.totalItems || 0} fragrances in this category
              </p>
              {category?.description && (
                <p className="text-gray-500 mt-1 text-sm max-w-2xl">
                  {category.description}
                </p>
              )}
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-all"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="font-medium">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 bg-rose-500 text-white text-xs rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search in this category..."
              className="w-full px-6 py-4 pl-12 pr-32 rounded-2xl border border-gray-200 shadow-lg focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-rose-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
            >
              Search
            </button>
          </form>
        </div>

        <div className="flex gap-8">
          
          {/* Filters Sidebar */}
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 1024) && (
              <motion.aside
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                className="lg:sticky lg:top-24 h-fit w-full lg:w-80 bg-white rounded-2xl shadow-xl p-6 space-y-6"
              >
                {/* Filter Header */}
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-purple-600" />
                    <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                  </div>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      Clear
                    </button>
                  )}
                </div>

                {/* Sort */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Sort By
                  </label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all"
                  >
                    <option value="-createdAt">Newest First</option>
                    <option value="createdAt">Oldest First</option>
                    <option value="price">Price: Low to High</option>
                    <option value="-price">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                    <option value="-name">Name: Z to A</option>
                  </select>
                </div>

                {/* Gender Filter */}
                {availableFilters.genders?.length > 0 && (
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Gender
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {availableFilters.genders.map((gender) => (
                        <button
                          key={gender}
                          onClick={() =>
                            handleFilterChange('gender', filters.gender === gender ? '' : gender)
                          }
                          className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                            filters.gender === gender
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {gender}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Season Filter */}
                {availableFilters.seasons?.length > 0 && (
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Season
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {availableFilters.seasons.map((season) => (
                        <button
                          key={season}
                          onClick={() =>
                            handleFilterChange('season', filters.season === season ? '' : season)
                          }
                          className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                            filters.season === season
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {season}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range Filter */}
                {availableFilters.priceRange && (
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Price Range
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                      />
                    </div>
                  </div>
                )}
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 9 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                  <Search className="w-16 h-16 text-purple-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-rose-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-xl transition-all"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleFilterChange('page', filters.page - 1)}
                      disabled={filters.page === 1}
                      className="px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
                    >
                      Previous
                    </button>

                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handleFilterChange('page', page)}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          filters.page === page
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            : 'border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => handleFilterChange('page', filters.page + 1)}
                      disabled={filters.page === pagination.totalPages}
                      className="px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}