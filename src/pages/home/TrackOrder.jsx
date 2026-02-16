import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, Phone, MapPin, Calendar, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTrackOrder } from '../../hooks/useOrders';

export default function TrackOrder() {
  const [trackingCode, setTrackingCode] = useState('');
  const [phoneLastDigits, setPhoneLastDigits] = useState('');
  const { mutate: trackOrder, data, isPending, error, reset } = useTrackOrder();

  const order = data?.data;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!trackingCode.trim()) {
      toast.error('Please enter tracking code');
      return;
    }

    if (phoneLastDigits.length !== 4) {
      toast.error('Please enter last 4 digits of phone number');
      return;
    }

    trackOrder(
      { trackingCode: trackingCode.trim().toUpperCase(), phoneLastDigits },
      {
        onError: (err) => {
          const message = err.response?.data?.message || 'Failed to track order';
          toast.error(message);
        },
      }
    );
  };

  const handleReset = () => {
    setTrackingCode('');
    setPhoneLastDigits('');
    reset();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-6 h-6 text-amber-500" />;
      case 'accepted':
        return <CheckCircle className="w-6 h-6 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'canceled':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Package className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'canceled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending Confirmation';
      case 'accepted':
        return 'Order Accepted - In Progress';
      case 'delivered':
        return 'Delivered Successfully';
      case 'canceled':
        return 'Order Canceled';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-purple-100 mb-6">
            <Package className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Order Tracking
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Track Your <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Order</span>
          </h1>
          <p className="text-lg text-gray-600">
            Enter your tracking code to check your order status
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tracking Code
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                  placeholder="SILL-XXXXXX"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all outline-none uppercase"
                  maxLength={11}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Last 4 Digits of Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={phoneLastDigits}
                  onChange={(e) => setPhoneLastDigits(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="1234"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all outline-none"
                  maxLength={4}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Enter the last 4 digits of the phone number used for the order
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Tracking...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Track Order
                  </>
                )}
              </button>

              {(order || error) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Order Details */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Status Banner */}
            <div className={`rounded-2xl p-6 border-2 ${getStatusColor(order.orderStatus)}`}>
              <div className="flex items-center gap-4">
                {getStatusIcon(order.orderStatus)}
                <div className="flex-1">
                  <p className="text-sm font-medium opacity-80">Order Status</p>
                  <p className="text-xl font-bold capitalize">{getStatusText(order.orderStatus)}</p>
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Details</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Package className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Tracking Code</p>
                      <p className="font-semibold text-gray-900">{order.trackingCode}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="font-semibold text-gray-900">{order.userName}</p>
                      <p className="text-sm text-gray-600">{order.userPhone}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Delivery Address</p>
                      <p className="font-semibold text-gray-900">{order.shippingAddress.street}</p>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress.city}, {order.shippingAddress.governorate}
                      </p>
                      {order.shippingAddress.postalCode && (
                        <p className="text-sm text-gray-600">Postal: {order.shippingAddress.postalCode}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Order Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      {item.product?.images?.[0]?.url && (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.product?.name || 'Product'}</p>
                        <p className="text-sm text-gray-600">
                          Size: {item.size}{item.product?.sizes?.find(s => s._id === item.sizeId)?.unit || 'ml'} • Qty: {item.qty}
                        </p>
                      </div>
                      <p className="font-bold text-purple-600">${(item.price * item.qty).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Summary */}
              <div className="pt-6 border-t border-gray-200 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Items Total</span>
                  <span className="font-semibold">${order.itemPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {order.shippingPrice === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `$${order.shippingPrice.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ${order.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">Order Notes</p>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-xl">{order.notes}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}