import React, { useState } from 'react';
import { ShoppingCart, Sparkles, Check, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useNotification } from '../../context/NotificationContext';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { success: successNotif, error: errorNotif } = useNotification();
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null);
  const [isHovered, setIsHovered] = useState(false);

  if (!product) return null;

  const { name, brand, images, sizes, gender, season, featured } = product;
  const mainImage = images?.[0]?.url || 'https://via.placeholder.com/400';
  const inCart = selectedSize ? isInCart(product._id, selectedSize._id) : false;
  const inWishlist = isInWishlist(product._id);

  const handleCardClick = () => {
    navigate(`/products/${product._id}`);
  };

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    action();
  };

  const handleAddToCart = () => {
    if (selectedSize) {
      const result = addToCart(product, selectedSize, 1);
      if (result.success) {
        successNotif(result.message);
      } else {
        errorNotif(result.message);
      }
    }
  };

  const handleToggleWishlist = () => {
    const result = toggleWishlist(product);
    if (result.success) {
      successNotif(result.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      className="group relative w-full max-w-sm mx-auto cursor-pointer"
    >
      <div className="relative bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
        
        {/* Badges */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {featured && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full text-xs font-bold shadow-lg"
            >
              <Sparkles className="w-3 h-3" />
              <span>Featured</span>
            </motion.div>
          )}
        </div>

        {/* Action Buttons - Show on Hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-4 right-4 z-20 flex gap-2"
            >
              {/* Wishlist Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => handleActionClick(e, handleToggleWishlist)}
                className={`p-3 rounded-full shadow-2xl transition-all ${
                  inWishlist
                    ? 'bg-rose-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-rose-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </motion.button>

              {/* Add to Cart Button */}
              {selectedSize && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handleActionClick(e, handleAddToCart)}
                  disabled={!selectedSize.isAvailable || inCart}
                  className={`p-3 rounded-full shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    inCart
                      ? 'bg-green-500 text-white'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  }`}
                >
                  {inCart ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <ShoppingCart className="w-5 h-5" />
                  )}
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image Section */}
        <div className="relative aspect-square bg-gradient-to-br from-slate-50 to-gray-100 overflow-hidden">
          <motion.img
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            src={mainImage}
            alt={name}
            className="w-full h-full object-cover"
          />
          
          <div className={`absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          
          {/* Brand & Gender */}
          <div className="flex items-center justify-between">
            {brand && (
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                {brand}
              </span>
            )}
            {gender && (
              <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs font-bold rounded-full">
                {gender}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 leading-tight">
            {name}
          </h3>

          {/* Season Tags */}
          {season && season.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {season.slice(0, 2).map((s, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg font-medium"
                >
                  {s}
                </span>
              ))}
              {season.length > 2 && (
                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg font-medium">
                  +{season.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Size Selection */}
          {sizes && sizes.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Select Size</p>
              <div className="flex flex-wrap gap-2">
                {sizes.slice(0, 4).map((size) => (
                  <button
                    key={size._id}
                    onClick={(e) => handleActionClick(e, () => setSelectedSize(size))}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                      selectedSize?._id === size._id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105'
                    }`}
                  >
                    {size.size}{size.unit}
                  </button>
                ))}
                {sizes.length > 4 && (
                  <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                    +{sizes.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Price Section */}
          {selectedSize && (
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ${selectedSize.price.toFixed(2)}
                </span>
              </div>
              
              {/* Stock Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${selectedSize.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className={`text-xs font-medium ${selectedSize.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedSize.isAvailable ? `${selectedSize.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {inCart && (
                    <span className="flex items-center gap-1 text-xs font-bold text-green-600">
                      <Check className="w-3 h-3" />
                      In Cart
                    </span>
                  )}
                  {inWishlist && (
                    <Heart className="w-4 h-4 text-rose-500 fill-current" />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}