import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, User, Phone, MapPin, FileText, Calendar, Loader2 } from 'lucide-react';
import { useCreateOrder } from '../../hooks/useOrders';
import toast from 'react-hot-toast';

export default function CheckoutModal({ isOpen, onClose, cartItems, total }) {
  const { mutate: createOrder, isPending } = useCreateOrder();
  
  const [formData, setFormData] = useState({
    userName: '',
    userPhone: '',
    street: '',
    city: '',
    governorate: '',
    postalCode: '',
    notes: '',
    delivery_at: '',
  });

  const [errors, setErrors] = useState({});
  const [trackingCode, setTrackingCode] = useState(null);

  const egyptianGovernorates = [
    'Cairo', 'Giza', 'Alexandria', 'Aswan', 'Asyut', 'Beheira', 'Beni Suef',
    'Dakahlia', 'Damietta', 'Faiyum', 'Gharbia', 'Ismailia', 'Kafr El Sheikh',
    'Luxor', 'Matruh', 'Minya', 'Monufia', 'New Valley', 'North Sinai',
    'Port Said', 'Qalyubia', 'Qena', 'Red Sea', 'Sharqia', 'Sohag',
    'South Sinai', 'Suez'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userName.trim()) {
      newErrors.userName = 'Name is required';
    }

    const phoneRegex = /^01[0125][0-9]{8}$/;
    if (!phoneRegex.test(formData.userPhone)) {
      newErrors.userPhone = 'Invalid Egyptian phone number (e.g., 01012345678)';
    }

    if (!formData.street.trim()) {
      newErrors.street = 'Street address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.governorate) {
      newErrors.governorate = 'Governorate is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    // Prepare order data
    const orderData = {
      userName: formData.userName.trim(),
      userPhone: formData.userPhone.trim(),
      shippingAddress: {
        street: formData.street.trim(),
        city: formData.city.trim(),
        governorate: formData.governorate,
        postalCode: formData.postalCode.trim() || undefined,
      },
      items: cartItems.map((item) => ({
        product: item.product._id,
        sizeId: item.size._id,
        qty: item.quantity,
      })),
      notes: formData.notes.trim() || undefined,
      delivery_at: formData.delivery_at || undefined,
    };

    createOrder(orderData, {
      onSuccess: (response) => {
        const code = response.tracking?.trackingCode || response.data?.trackingCode;
        setTrackingCode(code);
        toast.success('Order placed successfully! 🎉');
      },
    });
  };

  const handleCopyTrackingCode = () => {
    navigator.clipboard.writeText(trackingCode);
    toast.success('Tracking code copied to clipboard!');
  };

  const handleClose = () => {
    setFormData({
      userName: '',
      userPhone: '',
      street: '',
      city: '',
      governorate: '',
      postalCode: '',
      notes: '',
      delivery_at: '',
    });
    setErrors({});
    setTrackingCode(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Tracking Code Success */}
            {trackingCode ? (
              <div className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Order Placed Successfully! 🎉
                </h2>

                <p className="text-gray-600 mb-6">
                  Your order has been received and is being processed.
                </p>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6">
                  <p className="text-sm text-gray-600 mb-2">Your Tracking Code</p>
                  <div className="flex items-center justify-center gap-3">
                    <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {trackingCode}
                    </p>
                    <button
                      onClick={handleCopyTrackingCode}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Save this code to track your order
                  </p>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Complete your order details
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <User className="w-5 h-5 text-purple-600" />
                      Personal Information
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.userName ? 'border-red-500' : 'border-gray-200'
                        } focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all outline-none`}
                        placeholder="Enter your full name"
                      />
                      {errors.userName && (
                        <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="userPhone"
                          value={formData.userPhone}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                            errors.userPhone ? 'border-red-500' : 'border-gray-200'
                          } focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all outline-none`}
                          placeholder="01012345678"
                        />
                      </div>
                      {errors.userPhone && (
                        <p className="text-red-500 text-sm mt-1">{errors.userPhone}</p>
                      )}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-purple-600" />
                      Shipping Address
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.street ? 'border-red-500' : 'border-gray-200'
                        } focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all outline-none`}
                        placeholder="Street address, building number"
                      />
                      {errors.street && (
                        <p className="text-red-500 text-sm mt-1">{errors.street}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            errors.city ? 'border-red-500' : 'border-gray-200'
                          } focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all outline-none`}
                          placeholder="City name"
                        />
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Governorate <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="governorate"
                          value={formData.governorate}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            errors.governorate ? 'border-red-500' : 'border-gray-200'
                          } focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all outline-none`}
                        >
                          <option value="">Select governorate</option>
                          {egyptianGovernorates.map((gov) => (
                            <option key={gov} value={gov}>
                              {gov}
                            </option>
                          ))}
                        </select>
                        {errors.governorate && (
                          <p className="text-red-500 text-sm mt-1">{errors.governorate}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code (Optional)
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all outline-none"
                        placeholder="Postal code"
                      />
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-600" />
                      Additional Information
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order Notes (Optional)
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all outline-none resize-none"
                        placeholder="Any special requests or delivery instructions..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Preferred Delivery Date (Optional)
                      </label>
                      <input
                        type="datetime-local"
                        name="delivery_at"
                        value={formData.delivery_at}
                        onChange={handleChange}
                        min={new Date().toISOString().slice(0, 16)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                    <h4 className="font-semibold text-gray-900 mb-4">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Items ({cartItems.length})</span>
                        <span className="font-medium">${total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-purple-600 pt-2 border-t border-purple-200">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        Place Order
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}