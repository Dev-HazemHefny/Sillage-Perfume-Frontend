import React from 'react';

export default function ProductCardSkeleton() {
  return (
    <div className="w-full max-w-sm mx-auto animate-pulse">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Image Skeleton */}
        <div className="aspect-square bg-gray-200" />
        
        {/* Content Skeleton */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-20" />
            <div className="h-6 bg-gray-200 rounded-full w-16" />
          </div>
          
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 rounded w-16" />
            <div className="h-6 bg-gray-200 rounded w-16" />
          </div>
          
          <div className="flex gap-2">
            <div className="h-10 bg-gray-200 rounded-lg flex-1" />
            <div className="h-10 bg-gray-200 rounded-lg flex-1" />
            <div className="h-10 bg-gray-200 rounded-lg flex-1" />
          </div>
          
          <div className="flex justify-between items-center pt-4">
            <div className="h-10 bg-gray-200 rounded w-24" />
            <div className="h-12 w-12 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}