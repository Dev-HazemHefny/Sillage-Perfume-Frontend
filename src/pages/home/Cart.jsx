import React from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, TruckIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discount,
    subtotalAfterDiscount,
    shipping,
    total,
    totalSavings,
    discountRate,
    freeShippingThreshold,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-amber-50 flex items-center justify-center px-4">
        <div className="text-center space-y-6">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-purple-300" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Looks like you haven't added any fragrances yet. Start exploring our collection!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-600 to-purple-600 text-white rounded-full font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            Shop Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotalAfterDiscount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Shopping <span className="bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">Cart</span>
            </h1>
            <p className="text-gray-600 mt-2">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
          </div>
          
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* Free Shipping Progress */}
        {shipping > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <TruckIcon className="w-6 h-6 text-blue-600" />
              <p className="text-sm font-medium text-blue-900">
                Add <span className="font-bold">${amountToFreeShipping.toFixed(2)}</span> more to get <span className="font-bold">FREE SHIPPING!</span>
              </p>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((subtotalAfterDiscount / freeShippingThreshold) * 100, 100)}%` }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <Link to={`/products/${item.product._id}`} className="w-32 h-32 flex-shrink-0">
                      <img
                        src={item.product.images[0]?.url}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-xl hover:scale-105 transition-transform"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between">
                        <div>
                          <Link
                            to={`/products/${item.product._id}`}
                            className="text-xl font-bold text-gray-900 hover:text-purple-600 transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-gray-500">{item.product.brand}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Size: {item.size.size}{item.size.unit}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-2 h-fit"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1">
                          <button
                            onClick={() => updateQuantity(item._id, -1)}
                            className="p-2 hover:bg-white rounded-lg transition-all"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-semibold w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, 1)}
                            disabled={item.quantity >= item.size.stock}
                            className="p-2 hover:bg-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            ${(item.size.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${item.size.price} each
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-green-600 font-medium">
                              Save ${((item.size.price * item.quantity) * discountRate).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-24 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>

              <div className="space-y-4 py-6 border-y border-gray-200">
                {/* Subtotal */}
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>

                {/* Discount */}
                {discount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      <span>Discount (20%)</span>
                    </div>
                    <span className="font-semibold">-${discount.toFixed(2)}</span>
                  </div>
                )}

                {/* Subtotal After Discount */}
                {discount > 0 && (
                  <div className="flex justify-between text-gray-900 font-medium">
                    <span>Subtotal after discount</span>
                    <span>${subtotalAfterDiscount.toFixed(2)}</span>
                  </div>
                )}

                {/* Shipping */}
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
              </div>

              {/* Total Savings Badge */}
              {totalSavings > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <p className="text-sm text-green-800 font-medium text-center">
                    🎉 You're saving <span className="font-bold">${totalSavings.toFixed(2)}</span> on this order!
                  </p>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between text-2xl font-bold">
                <span>Total</span>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ${total.toFixed(2)}
                </span>
              </div>

              {/* Checkout Button */}
              <button className="w-full py-4 bg-gradient-to-r from-rose-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2">
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </button>

              <Link
                to="/products"
                className="block text-center text-gray-600 hover:text-purple-600 font-medium transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}