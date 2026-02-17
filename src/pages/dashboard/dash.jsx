import React from 'react';
import { motion } from 'framer-motion';
import { useOrders } from '../../hooks/useOrders';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import {
  ShoppingBag, Package, Grid3x3, TrendingUp,
  Clock, CheckCircle, XCircle, Truck
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, gradient, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <p className="text-3xl font-bold text-gray-900 mb-1">{value ?? '—'}</p>
    <p className="text-sm text-gray-500">{title}</p>
  </motion.div>
);

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  accepted: { label: 'Accepted', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
  delivered: { label: 'Delivered', icon: Truck, color: 'text-green-600', bg: 'bg-green-50' },
  canceled: { label: 'Canceled', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
};

export default function Dash() {
  const { data: ordersData } = useOrders({ limit: 5, sort: '-createdAt' });
  const { data: productsData } = useProducts({ limit: 1 });
  const { data: categoriesData } = useCategories();

  const recentOrders = ordersData?.data || [];
  const totalOrders = ordersData?.pagination?.totalItems || 0;
  const totalProducts = productsData?.pagination?.totalItems || 0;
  const totalCategories = categoriesData?.data?.length || 0;

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, Admin 👋</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Orders" value={totalOrders} icon={ShoppingBag} gradient="from-purple-500 to-pink-500" delay={0} />
        <StatCard title="Total Products" value={totalProducts} icon={Package} gradient="from-blue-500 to-cyan-500" delay={0.1} />
        <StatCard title="Categories" value={totalCategories} icon={Grid3x3} gradient="from-amber-500 to-orange-500" delay={0.2} />
        <StatCard title="Total Revenue" value="—" icon={TrendingUp} gradient="from-green-500 to-emerald-500" delay={0.3} />
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
          <a href="/admin/orders" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
            View all →
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {['Tracking Code', 'Customer', 'Phone', 'Total', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">No orders yet</td>
                </tr>
              ) : (
                recentOrders.map((order) => {
                  const cfg = statusConfig[order.orderStatus] || statusConfig.pending;
                  const Icon = cfg.icon;
                  return (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-bold text-purple-600">{order.trackingCode}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order.userName}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{order.userPhone}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">${order.totalPrice?.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}