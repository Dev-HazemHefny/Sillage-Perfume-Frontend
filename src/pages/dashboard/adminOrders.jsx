import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, Loader2, ShoppingBag, ChevronLeft, ChevronRight,
  Clock, CheckCircle, XCircle, Truck, Eye, MapPin, Phone, User, Package
} from 'lucide-react';
import { useOrders, useUpdateOrderStatus, useDeleteOrder } from '../../hooks/useOrders';
import { useNotification } from '../../context/NotificationContext';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   icon: Clock,         color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200' },
  accepted:  { label: 'Accepted',  icon: CheckCircle,   color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200'  },
  delivered: { label: 'Delivered', icon: Truck,         color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200' },
  canceled:  { label: 'Canceled',  icon: XCircle,       color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200'   },
};

const STATUS_TRANSITIONS = {
  pending:   ['accepted', 'canceled'],
  accepted:  ['delivered', 'canceled'],
  delivered: [],
  canceled:  [],
};

// ─── Order Details Modal ──────────────────────────────────────────────
function OrderDetailsModal({ isOpen, onClose, order }) {
  if (!order) return null;
  const cfg = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                <p className="text-sm text-purple-600 font-mono font-bold mt-0.5">{order.trackingCode}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Status Badge */}
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                <Icon className="w-4 h-4" />
                {cfg.label}
              </span>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Customer</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <User className="w-4 h-4 text-gray-400" />
                    {order.userName}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {order.userPhone}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Shipping Address</h3>
                  <div className="flex items-start gap-2 text-sm text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p>{order.shippingAddress?.street}</p>
                      <p>{order.shippingAddress?.city}, {order.shippingAddress?.governorate}</p>
                      {order.shippingAddress?.postalCode && <p className="text-gray-500">Postal: {order.shippingAddress.postalCode}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4 text-purple-600" />
                  Order Items
                </h3>
                <div className="space-y-3">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      {item.product?.images?.[0]?.url && (
                        <img src={item.product.images[0].url} alt={item.product.name}
                          className="w-14 h-14 object-cover rounded-xl" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">{item.product?.name || 'Product'}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Size: {item.size}ml • Qty: {item.qty}</p>
                      </div>
                      <p className="font-bold text-purple-600">${(item.price * item.qty).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 space-y-2 border border-purple-100">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Items Total</span>
                  <span className="font-medium">${order.itemPrice?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {order.shippingPrice === 0
                      ? <span className="text-green-600">FREE</span>
                      : `$${order.shippingPrice?.toFixed(2)}`
                    }
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-purple-200">
                  <span>Total</span>
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ${order.totalPrice?.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Order Notes</h3>
                  <p className="text-sm text-gray-600 bg-amber-50 border border-amber-200 rounded-xl p-4">{order.notes}</p>
                </div>
              )}

              {/* Date */}
              <p className="text-xs text-gray-400 text-right">
                Ordered: {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Status Update Modal ──────────────────────────────────────────────
function StatusModal({ isOpen, onClose, order, onUpdate, isPending }) {
  const [newStatus, setNewStatus] = useState('');
  if (!order) return null;
  const available = STATUS_TRANSITIONS[order.orderStatus] || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">Update Order Status</h3>
            <p className="text-sm text-gray-500 mb-6 font-mono">{order.trackingCode}</p>

            {available.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500">This order cannot be updated further.</p>
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                {available.map(status => {
                  const cfg = STATUS_CONFIG[status];
                  const Icon = cfg.icon;
                  return (
                    <label key={status}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        newStatus === status ? `${cfg.border} ${cfg.bg}` : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input type="radio" name="status" value={status}
                        checked={newStatus === status}
                        onChange={() => setNewStatus(status)}
                        className="sr-only" />
                      <div className={`p-2 rounded-xl ${cfg.bg}`}>
                        <Icon className={`w-5 h-5 ${cfg.color}`} />
                      </div>
                      <span className={`font-semibold ${newStatus === status ? cfg.color : 'text-gray-700'}`}>
                        {cfg.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                Cancel
              </button>
              {available.length > 0 && (
                <button
                  onClick={() => { if (newStatus) onUpdate(order._id, newStatus); }}
                  disabled={!newStatus || isPending}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : 'Update Status'}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────
export default function AdminOrders() {
  const [filters, setFilters] = useState({ page: 1, limit: 10, status: '', search: '', sort: '-createdAt' });
  const [searchInput, setSearchInput] = useState('');
  const [detailsModal, setDetailsModal] = useState(null);
  const [statusModal, setStatusModal] = useState(null);

  const { data, isLoading } = useOrders(filters);
  const { mutate: updateStatus, isPending: updating } = useUpdateOrderStatus();
  const { success: successNotif } = useNotification();

  const orders = data?.data || [];
  const pagination = data?.pagination || {};

  const handleFilterChange = (key, val) => setFilters(p => ({ ...p, [key]: val, page: 1 }));

  const handleSearch = (e) => {
    e.preventDefault();
    handleFilterChange('search', searchInput);
  };

  const handleStatusUpdate = (id, status) => {
    updateStatus({ id, status }, {
      onSuccess: () => {
        successNotif('Order status updated!');
        setStatusModal(null);
      },
    });
  };

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.orderStatus] = (acc[o.orderStatus] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">{pagination.totalItems || 0} orders total</p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[{ value: '', label: 'All Orders' }, ...Object.entries(STATUS_CONFIG).map(([k, v]) => ({ value: k, label: v.label }))].map(tab => (
          <button
            key={tab.value}
            onClick={() => handleFilterChange('status', tab.value)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              filters.status === tab.value
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Sort */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-wrap gap-4">
        <form onSubmit={handleSearch} className="flex-1 min-w-48 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search by tracking code or customer..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-200 text-sm"
          />
        </form>

        <select
          value={filters.sort}
          onChange={e => handleFilterChange('sort', e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-200 text-sm"
        >
          <option value="-createdAt">Newest First</option>
          <option value="createdAt">Oldest First</option>
          <option value="-totalPrice">Highest Amount</option>
          <option value="totalPrice">Lowest Amount</option>
        </select>

        {(filters.search || filters.status) && (
          <button
            onClick={() => { setFilters(p => ({ ...p, search: '', status: '', page: 1 })); setSearchInput(''); }}
            className="flex items-center gap-1.5 px-4 py-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all text-sm"
          >
            <X className="w-4 h-4" /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Tracking Code', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto" />
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">No orders found</p>
                  </td>
                </tr>
              ) : orders.map(order => {
                const cfg = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.pending;
                const Icon = cfg.icon;
                const canUpdate = STATUS_TRANSITIONS[order.orderStatus]?.length > 0;

                return (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-bold text-purple-600">{order.trackingCode}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">{order.userName}</p>
                      <p className="text-xs text-gray-500">{order.userPhone}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">${order.totalPrice?.toFixed(2)}</p>
                      {order.shippingPrice === 0 && (
                        <p className="text-xs text-green-600 font-medium">Free shipping</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setDetailsModal(order)}
                          className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {canUpdate && (
                          <button
                            onClick={() => setStatusModal(order)}
                            className="px-3 py-1.5 text-xs font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all"
                          >
                            Update
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {((filters.page - 1) * filters.limit) + 1}–{Math.min(filters.page * filters.limit, pagination.totalItems)} of {pagination.totalItems}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))}
                disabled={filters.page === 1}
                className="p-2 rounded-xl border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setFilters(prev => ({ ...prev, page: p }))}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                    filters.page === p
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                      : 'border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))}
                disabled={filters.page === pagination.totalPages}
                className="p-2 rounded-xl border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <OrderDetailsModal isOpen={!!detailsModal} onClose={() => setDetailsModal(null)} order={detailsModal} />
      <StatusModal
        isOpen={!!statusModal}
        onClose={() => setStatusModal(null)}
        order={statusModal}
        onUpdate={handleStatusUpdate}
        isPending={updating}
      />
    </div>
  );
}