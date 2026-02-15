import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';

export default function ProductCard() {
  const [isLiked, setIsLiked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = {
    name: "Premium Wireless Headphones",
    price: 299.99,
    // originalPrice: 399.99,
    rating: 4.8,
    reviews: 127,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=500&h=500&fit=crop"
    ],
    // badge: "Best Seller",
    inStock: true,
    // colors: ["#000000", "#1E40AF", "#DC2626"]
  };

//   const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
        {/* Image Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Badge */}
          {/* <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            {product.badge}
          </div> */}
          
          {/* Discount Badge */}
          {/* <div className="absolute top-4 right-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            -{discount}%
          </div> */}

          {/* Action Buttons */}
          <div className="absolute top-16 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full backdrop-blur-md bg-white/90 shadow-lg hover:scale-110 transition-transform ${
                isLiked ? 'text-red-500' : 'text-gray-700'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button className="p-2 rounded-full backdrop-blur-md bg-white/90 shadow-lg hover:scale-110 transition-transform text-gray-700">
              <Eye className="w-5 h-5" />
            </button>
          </div>

          {/* Product Image */}
          <div className="aspect-square p-8">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          {/* Image Thumbnails */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  selectedImage === index
                    ? 'bg-purple-600 w-6'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            {/* <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div> */}
            {/* <span className="text-sm text-gray-600">
              {product.rating} <span className="text-gray-400">({product.reviews})</span>
            </span> */}
          </div>

          {/* Product Name */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
            {product.name}
          </h3>

          {/* Color Options */}
          {/* <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-600">Color:</span>
            <div className="flex gap-2">
              {product.colors.map((color, index) => (
                <button
                  key={index}
                  className="w-6 h-6 rounded-full border-2 border-gray-200 hover:border-purple-600 transition-colors"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div> */}

          {/* Price Section */}
          <div className="flex items-end gap-3 mb-4">
            <span className="text-3xl font-bold text-gray-900">
              ${product.price}
            </span>
            {/* <span className="text-lg text-gray-400 line-through mb-1">
              ${product.originalPrice}
            </span> */}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Add to Cart Button */}
          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group">
            <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}