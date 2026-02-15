import React, { useState } from 'react';
import { Package, MessageSquare, ShieldCheck } from 'lucide-react';

export default function ProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description', icon: Package },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'shipping', label: 'Shipping', icon: ShieldCheck },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-all ${
                activeTab === tab.id
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {activeTab === 'description' && (
          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">About this fragrance</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
            
            {product.brand && (
              <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Brand</h4>
                <p className="text-gray-700">{product.brand}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-600">Be the first to review this product!</p>
            <button className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all">
              Write a Review
            </button>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Free Shipping</h4>
                <p className="text-gray-600">On orders over $50</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Fast Delivery</h4>
                <p className="text-gray-600">2-3 business days</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">100% Authentic</h4>
                <p className="text-gray-600">Guaranteed original products</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}