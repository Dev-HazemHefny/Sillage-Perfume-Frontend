import React from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Cart() {
  // This will be replaced with actual cart state management (Context/Redux/Zustand)
  const [cartItems, setCartItems] = React.useState([
    {
      _id: '1',
      product: {
        _id: 'p1',
        name: 'Dior Sauvage',
        brand: 'Dior',
        images: [{ url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300' }],
      },
      size: { size: 100, unit: 'ml', price: 129 },
      quantity: 2,
    },
    {
      _id: '2',
      product: {
        _id: 'p2',
        name: 'Chanel No. 5',
        brand: 'Chanel',
        images: [{ url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=300' }],
      },
      size: { size: 50, unit: 'ml', price: 159 },
      quantity: 1,
    },
  ]);

  const updateQuantity = (id, delta) => {
    setCartItems((items) =>
      items.map((item) =>
        item._id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item._id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.size.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + shipping;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Shopping <span className="bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">Cart</span>
          </h1>
          <p className="text-gray-600 mt-2">{cartItems.length} items in your cart</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
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
                  <div className="w-32 h-32 flex-shrink-0">
                    <img
                      src={item.product.images[0]?.url}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>

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
                        onClick={() => removeItem(item._id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2"
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
                          className="p-2 hover:bg-white rounded-lg transition-all"
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
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-24 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>

              <div className="space-y-4 py-6 border-y border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
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
                {shipping > 0 && (
                  <p className="text-xs text-gray-500">
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}
              </div>

              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ${total.toFixed(2)}
                </span>
              </div>

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