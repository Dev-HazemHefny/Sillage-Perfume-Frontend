import React from "react";

const CategoryCard = ({ name, description, image }) => {
  return (
    <div className="w-80 h-96 relative overflow-hidden rounded-2xl shadow-lg cursor-pointer group">
      {/* Background Image */}
      <img
        src={image.url}
        alt={name || "category image"}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Overlay with gradient that appears on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Content container */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
          {/* Category Name */}
          <h3 className="text-white text-3xl font-bold mb-2">{name}</h3>

          {/* Category Description */}
          <p className="text-gray-200 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
