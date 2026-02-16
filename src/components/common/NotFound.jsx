import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft, Package, Sparkles } from 'lucide-react';

export default function NotFound() {
  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-amber-50 flex items-center justify-center px-4 overflow-hidden relative">
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-20 w-[500px] h-[500px] bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Floating Shapes */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 left-10 w-16 h-16 border-2 border-rose-300 rounded-lg opacity-30"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 right-20 w-20 h-20 border-2 border-purple-300 rounded-full opacity-30"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-40 right-40 w-12 h-12 bg-gradient-to-br from-amber-400 to-rose-400 rounded-lg rotate-45 opacity-20"
      />

      {/* Main Content */}
      <div className="relative max-w-4xl w-full text-center">
        
        {/* 404 Number with Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1 }}
          className="mb-8"
        >
          <h1 className="text-[150px] md:text-[200px] font-bold leading-none">
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent drop-shadow-2xl">
              404
            </span>
          </h1>
        </motion.div>

        {/* Floating Perfume Icon */}
        <motion.div
          animate={floatingAnimation}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
              <Package className="w-16 h-16 text-white" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -top-4 -right-4"
            >
              <Sparkles className="w-12 h-12 text-amber-400 drop-shadow-lg" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full blur-xl opacity-30" />
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Oops! Page Not Found
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            The fragrance you're looking for seems to have evaporated into thin air. 
            Let's get you back on track!
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all"
            >
              <Home className="w-5 h-5" />
              Back to Home
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </motion.div>
            </motion.button>
          </Link>

          <Link to="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all border border-gray-200"
            >
              <Search className="w-5 h-5" />
              Browse Products
            </motion.button>
          </Link>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <p className="text-sm text-gray-500 mb-4">You might be looking for:</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/products"
              className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:text-purple-600 hover:shadow-md transition-all border border-gray-200"
            >
              Shop All Products
            </Link>
            <Link
              to="/categories"
              className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:text-purple-600 hover:shadow-md transition-all border border-gray-200"
            >
              Categories
            </Link>
            <Link
              to="/track-order"
              className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:text-purple-600 hover:shadow-md transition-all border border-gray-200"
            >
              Track Order
            </Link>
            <Link
              to="/cart"
              className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:text-purple-600 hover:shadow-md transition-all border border-gray-200"
            >
              View Cart
            </Link>
          </div>
        </motion.div>

        {/* Fun Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12"
        >
          <p className="text-sm text-gray-400 italic">
            "Not all who wander are lost, but this page definitely is." 🌸
          </p>
        </motion.div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}