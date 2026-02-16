import React, { useState } from 'react';
import { Heart, ShoppingCart, Share2, Star, Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNotification } from '../../context/NotificationContext';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';


export default function ProductInfo({ product }) {
  const navigate = useNavigate();
  const { addToCart, isInCart, getCartItem } = useCart();
  const { success: successNotif, error: errorNotif } = useNotification();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);
  const [quantity, setQuantity] = useState(1);

  const { toggleWishlist, isInWishlist } = useWishlist();
  const isLiked = isInWishlist(product._id);

  const cartItem = selectedSize ? getCartItem(product._id, selectedSize._id) : null;
  const inCart = selectedSize ? isInCart(product._id, selectedSize._id) : false;


  const handleToggleLike = () => {
    const result = toggleWishlist(product);
    if (result.success) {
      successNotif(result.message);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      errorNotif('Please select a size');
      return;
    }
    if (!selectedSize.isAvailable) {
      errorNotif('This size is out of stock');
      return;
    }

    const result = addToCart(product, selectedSize, quantity);
    if (result.success) {
      successNotif(result.message);
      setQuantity(1);
    } else {
      errorNotif(result.message);
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      errorNotif('Please select a size');
      return;
    }
    if (!selectedSize.isAvailable) {
      errorNotif('This size is out of stock');
      return;
    }

    const result = addToCart(product, selectedSize, quantity);
    if (result.success) {
      navigate('/cart');
    } else {
      errorNotif(result.message);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      successNotif('Link copied to clipboard!');
    }
  };


  return (
    <div className="space-y-6">

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {product.featured && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full text-xs font-bold">
            <Sparkles className="w-3 h-3" />
            Featured
          </span>
        )}
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold uppercase">
          {product.gender}
        </span>
        {product.category && (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
            {product.category.name}
          </span>
        )}
      </div>

      {/* Product Name */}
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
          {product.name}
        </h1>
        {product.brand && (
          <p className="text-lg text-gray-600">by {product.brand}</p>
        )}
      </div>

      {/* Price */}
      {selectedSize && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ${selectedSize.price.toFixed(2)}
            </span>
          </div>
          <p className="text-gray-600 text-sm mt-2">
            Size: {selectedSize.size}{selectedSize.unit}
          </p>
          <div className="mt-3 flex items-center gap-2">
            {selectedSize.isAvailable ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">
                  {selectedSize.stock} in stock
                </span>
              </>
            ) : (
              <span className="text-sm text-red-600 font-medium">Out of stock</span>
            )}
          </div>
        </div>
      )}

      {/* Size Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-900">Select Size</label>
        <div className="grid grid-cols-3 gap-3">
          {product.sizes?.map((size) => (
            <button
              key={size._id}
              onClick={() => {
                setSelectedSize(size);
                setQuantity(1); // Reset quantity when changing size
              }}
              disabled={!size.isAvailable}
              className={`relative p-4 rounded-xl border-2 transition-all ${selectedSize?._id === size._id
                ? 'border-purple-500 bg-purple-50'
                : size.isAvailable
                  ? 'border-gray-200 hover:border-purple-300'
                  : 'border-gray-200 opacity-50 cursor-not-allowed'
                }`}
            >
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">
                  {size.size}{size.unit}
                </p>
                <p className="text-sm text-purple-600 font-bold">
                  ${size.price.toFixed(2)}
                </p>
              </div>
              {!size.isAvailable && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                  <span className="text-xs font-semibold text-red-600">Sold Out</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-900">Quantity</label>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-lg bg-white hover:bg-gray-50 transition-colors font-semibold"
            >
              −
            </button>
            <span className="w-12 text-center font-semibold">{quantity}</span>
            <button
              onClick={() =>
                setQuantity(Math.min(selectedSize?.stock || 1, quantity + 1))
              }
              className="w-10 h-10 rounded-lg bg-white hover:bg-gray-50 transition-colors font-semibold"
            >
              +
            </button>
          </div>
          {selectedSize && (
            <span className="text-sm text-gray-600">Max: {selectedSize.stock}</span>
          )}
          {inCart && cartItem && (
            <span className="text-sm text-purple-600 font-medium">
              {cartItem.quantity} already in cart
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={!selectedSize?.isAvailable}
            className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-600 to-purple-600 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {inCart ? (
              <>
                <Check className="w-5 h-5" />
                Add More
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleLike}
            className={`p-4 rounded-xl border-2 transition-all ${isLiked
                ? 'border-rose-500 bg-rose-50 text-rose-600'
                : 'border-gray-200 hover:border-rose-300 text-gray-600'
              }`}
          >
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 text-gray-600 transition-all"
          >
            <Share2 className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Buy Now Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBuyNow}
          disabled={!selectedSize?.isAvailable}
          className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Buy Now
        </motion.button>
      </div>

      {/* Season Tags */}
      {product.season?.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700">Perfect for:</p>
          <div className="flex flex-wrap gap-2">
            {product.season.map((s, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-purple-700 rounded-lg text-sm font-medium capitalize"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {product.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm capitalize"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}