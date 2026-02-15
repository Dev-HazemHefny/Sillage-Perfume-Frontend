import React from 'react';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../common/ProductCard';
import ProductCardSkeleton from '../common/ProductCardSkeleton';
import { Sparkles } from 'lucide-react';

export default function RelatedProducts({ categoryId, currentProductId }) {
  const { data, isLoading } = useProducts({ 
    category: categoryId, 
    limit: 4 
  });

  const products = (data?.data || []).filter(
    (product) => product._id !== currentProductId
  );

  if (isLoading) {
    return (
      <section className="mt-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-purple-600" />
          You May Also Like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mt-20">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
        <Sparkles className="w-8 h-8 text-purple-600" />
        You May Also Like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}