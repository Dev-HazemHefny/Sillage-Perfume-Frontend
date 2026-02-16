import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CategoryCard = ({ category, name, description, image }) => {
  const navigate = useNavigate();
  
  const imageUrl = image?.url || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400';

  const handleClick = () => {
    navigate(`/categories/${category._id}`, { 
      state: { categoryName: name } 
    });
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
      className="group relative w-full h-96 overflow-hidden rounded-3xl shadow-xl cursor-pointer"
    >
      {/* Background Image */}
      <img
        src={imageUrl}
        alt={name || "Category image"}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        onError={(e) => {
          console.error('❌ Image failed to load:', imageUrl);
          e.target.src = 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400';
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        
        {/* Category Name */}
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white mb-3 drop-shadow-2xl"
        >
          {name || 'Untitled'}
        </motion.h3>

        {/* Category Description */}
        <p className="text-gray-200 text-base leading-relaxed mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
          {description || 'Discover amazing fragrances in this collection'}
        </p>

        {/* Explore Button */}
        <div className="flex items-center gap-2 text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
          <span>Explore Collection</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </div>

        {/* Decorative Element */}
        <div className="mt-4 w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150" />
      </div>

      {/* Border Glow Effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500/50 rounded-3xl transition-colors duration-300" />

      {/* Shine Effect on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
      </div>
    </motion.div>
  );
};

export default CategoryCard;