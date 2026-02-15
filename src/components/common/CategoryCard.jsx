import React from "react";
import { motion } from "framer-motion";

const CategoryCard = ({ name, description, image }) => {
  // 🔍 Debug
  console.log('🎴 CategoryCard props:', { name, description, image });

  // Fallback image if image is undefined
  const imageUrl = image?.url || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400';

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative w-full h-96 overflow-hidden rounded-2xl shadow-2xl cursor-pointer"
    >
      {/* Background Image */}
      <img
        src={imageUrl}
        alt={name || "Category image"}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        onError={(e) => {
          console.error('❌ Image failed to load:', imageUrl);
          e.target.src = 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400';
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        
        {/* Category Name */}
        <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
          {name || 'Untitled'}
        </h3>

        {/* Category Description */}
        <p className="text-gray-200 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
          {description || 'No description available'}
        </p>

        {/* Decorative Element */}
        <div className="mt-4 w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100" />
      </div>

      {/* Border Glow Effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500/50 rounded-2xl transition-colors duration-300" />
    </motion.div>
  );
};

export default CategoryCard;