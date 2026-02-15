import React from "react";

const CategoryCardSkeleton = () => {
  return (
    <div className="w-80 h-96 rounded-2xl overflow-hidden shadow-lg bg-slate-800 animate-pulse">
      {/* Image placeholder */}
      <div className="w-full h-full bg-slate-700 relative">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex flex-col justify-end p-6">
          {/* Title */}
          <div className="h-6 w-3/4 bg-slate-600 rounded mb-3"></div>
          {/* Description lines */}
          <div className="h-3 w-full bg-slate-600 rounded mb-2"></div>
          <div className="h-3 w-5/6 bg-slate-600 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCardSkeleton;
