import React from 'react';

export default function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-amber-50 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Back Button Skeleton */}
        <div className="h-10 w-24 bg-gray-200 rounded-lg mb-8" />

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          
          {/* Image Gallery Skeleton */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-3xl" />
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-2xl" />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-gray-200 rounded-full" />
              <div className="h-6 w-16 bg-gray-200 rounded-full" />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <div className="h-12 bg-gray-200 rounded-lg w-3/4" />
              <div className="h-6 bg-gray-200 rounded-lg w-1/2" />
            </div>

            {/* Rating */}
            <div className="h-6 bg-gray-200 rounded-lg w-40" />

            {/* Price Box */}
            <div className="h-32 bg-gray-200 rounded-2xl" />

            {/* Sizes */}
            <div className="space-y-3">
              <div className="h-5 bg-gray-200 rounded w-24" />
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded-xl" />
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <div className="flex-1 h-14 bg-gray-200 rounded-xl" />
              <div className="h-14 w-14 bg-gray-200 rounded-xl" />
              <div className="h-14 w-14 bg-gray-200 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="bg-gray-200 rounded-3xl h-96" />
      </div>
    </div>
  );
}