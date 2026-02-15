import React, { useState } from 'react';
import { Heart, ShoppingCart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null);

  if (!product) return null;

  const { name, brand, images, sizes, gender, season, featured, priceRange } = product;
  const mainImage = images?.[0]?.url || 'https://via.placeholder.com/400';

  // Handle card click
  const handleCardClick = () => {
    navigate(`/products/${product._id}`);
  };

  // Prevent navigation when clicking action buttons
  const handleActionClick = (e, action) => {
    e.stopPropagation();
    action();
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={handleCardClick}
      className="group relative w-full max-w-sm mx-auto cursor-pointer"
    >
      <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden backdrop-blur-sm border border-gray-100 hover:shadow-2xl transition-shadow">
        
        {/* Badges */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {featured && (
            <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full text-xs font-bold shadow-lg">
              <Sparkles className="w-3 h-3" />
              Featured
            </div>
          )}
          {priceRange && (
            <div className="px-3 py-1.5 bg-rose-500 text-white rounded-full text-xs font-bold shadow-lg">
              From ${priceRange.min}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => handleActionClick(e, () => setIsLiked(!isLiked))}
            className={`p-2.5 rounded-full backdrop-blur-md bg-white/90 shadow-lg transition-colors ${
              isLiked ? 'text-rose-500' : 'text-gray-700 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </motion.button>
        </div>

        {/* Image Section */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
            src={mainImage}
            alt={name}
            className="w-full h-full object-cover p-8"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          
          {/* Brand & Gender */}
          <div className="flex items-center justify-between">
            {brand && (
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                {brand}
              </span>
            )}
            {gender && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                {gender}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 hover:text-purple-600 transition-colors">
            {name}
          </h3>

          {/* Season Tags */}
          {season && season.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {season.slice(0, 2).map((s, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg"
                >
                  {s}
                </span>
              ))}
              {season.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                  +{season.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Sizes Preview */}
          {sizes && sizes.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Available Sizes:</p>
              <div className="flex flex-wrap gap-2">
                {sizes.slice(0, 3).map((size) => (
                  <button
                    key={size._id}
                    onClick={(e) => handleActionClick(e, () => setSelectedSize(size))}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedSize?._id === size._id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {size.size}{size.unit}
                  </button>
                ))}
                {sizes.length > 3 && (
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                    +{sizes.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Price & Stock */}
          {selectedSize && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="space-y-1">
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ${selectedSize.price}
                </p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${selectedSize.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className={`text-xs font-medium ${selectedSize.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedSize.isAvailable ? `${selectedSize.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleActionClick(e, () => {
                  // Add to cart logic here
                  console.log('Add to cart:', product._id, selectedSize);
                })}
                disabled={!selectedSize.isAvailable}
                className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}