import React from 'react';
import { Heart, ShoppingCart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';

export default function Wishlist() {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { success: successNotif } = useNotification();

  const handleRemoveItem = (productId) => {
    const result = removeFromWishlist(productId);
    if (result.success) {
      successNotif(result.message);
    }
  };

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      const result = clearWishlist();
      if (result.success) {
        successNotif(result.message);
      }
    }
  };

  const handleAddToCart = (product) => {
    const firstAvailableSize = product.sizes?.find((size) => size.isAvailable);
    
    if (!firstAvailableSize) {
      successNotif('This product is out of stock');
      return;
    }

    const result = addToCart(product, firstAvailableSize, 1);
    if (result.success) {
      successNotif(result.message);
    }
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-amber-50 flex items-center justify-center px-4">
        <div className="text-center space-y-6">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center">
            <Heart className="w-16 h-16 text-rose-300" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Your wishlist is empty</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Start adding your favorite fragrances to your wishlist!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-600 to-purple-600 text-white rounded-full font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            Explore Products
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              My <span className="bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">Wishlist</span>
            </h1>
            <p className="text-gray-600 mt-2">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          
          {wishlistItems.length > 0 && (
            <button
              onClick={handleClearWishlist}
              className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Clear Wishlist
            </button>
          )}
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {wishlistItems.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, x: -100 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group"
              >
                {/* Image */}
                <div className="relative aspect-square bg-gradient-to-br from-slate-50 to-gray-100 overflow-hidden">
                  <Link to={`/products/${product._id}`}>
                    <img
                      src={product.images?.[0]?.url || 'https://via.placeholder.com/400'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  
                  {/* Remove Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemoveItem(product._id)}
                    className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-50 transition-colors group/btn"
                  >
                    <Heart className="w-5 h-5 text-rose-500 fill-current" />
                  </motion.button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <Link to={`/products/${product._id}`}>
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-2 hover:text-purple-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  
                  {product.brand && (
                    <p className="text-sm text-gray-500 uppercase tracking-wide">
                      {product.brand}
                    </p>
                  )}

                  {/* Price Range */}
                  {product.priceRange && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        ${product.priceRange.min}
                      </span>
                      {product.priceRange.min !== product.priceRange.max && (
                        <span className="text-sm text-gray-500">
                          - ${product.priceRange.max}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all text-sm"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </motion.button>
                    
                    <Link to={`/products/${product._id}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                      >
                        <ArrowRight className="w-5 h-5 text-gray-700" />
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}