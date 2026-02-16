import React from 'react';
import { Sparkles, Award, Truck, Star, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { motion } from 'framer-motion';

export default function PerfumeHero() {
  // Get featured product
  const { data } = useProducts({ featured: true, limit: 1, sort: '-createdAt' });
  const featuredProduct = data?.data?.[0];

  const features = [
    { icon: Award, text: "Premium Quality", description: "Finest ingredients" },
    { icon: Truck, text: "Free Delivery", description: "Orders over $100" },
    { icon: Sparkles, text: "100% Authentic", description: "Guaranteed original" }
  ];

  const stats = [
    { number: "500+", label: "Luxury Fragrances" },
    { number: "50K+", label: "Happy Customers" },
    { number: "100%", label: "Satisfaction Rate" }
  ];

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-amber-50 overflow-hidden">
      
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-20 w-[500px] h-[500px] bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Floating Shapes */}
      <div className="absolute top-20 left-10 w-20 h-20 border-2 border-rose-300 rounded-lg rotate-12 opacity-30" />
      <div className="absolute bottom-40 right-20 w-16 h-16 border-2 border-purple-300 rounded-full opacity-30" />

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        
        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-300px)]">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block text-gray-900">Discover Your</span>
                <span className="block bg-gradient-to-r from-rose-600 via-purple-600 to-amber-600 bg-clip-text text-transparent">
                  Signature Scent
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-xl leading-relaxed">
                Indulge in luxurious fragrances crafted from the finest ingredients. Each bottle tells a unique story of elegance and sophistication.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 bg-gradient-to-r from-rose-600 to-purple-600 text-white rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
                >
                  Shop Collection
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link to="/categories">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-900 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
                >
                  View Categories
                </motion.button>
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <feature.icon className="w-8 h-8 mx-auto mb-2 text-rose-600" />
                  <p className="font-semibold text-gray-900 text-sm">{feature.text}</p>
                  <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4 border-t border-gray-200">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <p className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.number}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Featured Product */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            
            {/* Bestseller Badge */}
            <div className="absolute -top-4 -left-4 z-20 bg-gradient-to-br from-amber-400 to-orange-500 text-white px-6 py-3 rounded-2xl shadow-2xl rotate-3 hover:rotate-6 transition-transform">
              <p className="text-sm font-semibold">✨ Bestseller</p>
            </div>

            {/* Product Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-400 via-purple-400 to-amber-400 rounded-3xl blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
              
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 overflow-hidden">
                
                {/* Corner Decorations */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-200 to-transparent rounded-bl-full opacity-50" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-200 to-transparent rounded-tr-full opacity-50" />
                
                {/* Product Image */}
                <div className="relative z-10">
                  <img
                    src={featuredProduct?.images?.[0]?.url || "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=800&fit=crop"}
                    alt={featuredProduct?.name || "Luxury Perfume"}
                    className="w-full h-[500px] object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Product Info */}
                {featuredProduct && (
                  <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-100 z-10">
                    <div className="flex items-center gap-2 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">(4.8 reviews)</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{featuredProduct.name}</h3>
                    <p className="text-gray-600 mb-3">
                      {featuredProduct.brand} • {featuredProduct.sizes?.[0]?.size}{featuredProduct.sizes?.[0]?.unit}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-3xl font-bold text-gray-900">
                          ${featuredProduct.sizes?.[0]?.price.toFixed(2)}
                        </span>
                      </div>
                      <Link to={`/products/${featuredProduct._id}`}>
                        <button className="px-6 py-3 bg-gradient-to-r from-rose-600 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        </div>
      </div>

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