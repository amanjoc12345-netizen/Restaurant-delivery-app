import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { TrendingUp, ShoppingBag, Users, Utensils, RefreshCw, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';
import Modal from '../components/Modal';

const MOCK_METRICS = [
  { label: 'Total Revenue', value: '$12,840.50', icon: TrendingUp, change: '+14%', isPositive: true },
  { label: 'Active Orders', value: '38', icon: ShoppingBag, change: '+8%', isPositive: true },
  { label: 'Total Users', value: '412', icon: Users, change: '+22%', isPositive: true },
  { label: 'Menu Items', value: '85', icon: Utensils, change: '0%', isPositive: true },
];

const INITIAL_ORDERS = [
  { id: 'BD-1092', customer: 'John Doe', restaurant: 'Pepperoni Express', items: '1x Large Pepperoni Pizza, 2x Coca Cola', total: '$24.50', status: 'Pending' },
  { id: 'BD-1091', customer: 'Sarah Connor', restaurant: 'Wasabi Palace', items: '2x Salmon Roll, 1x Miso Soup', total: '$32.00', status: 'Preparing' },
  { id: 'BD-1090', customer: 'Tony Stark', restaurant: 'Burger & Co.', items: '1x Double Cheeseburger, 1x Large Fries', total: '$18.75', status: 'Out for Delivery' },
  { id: 'BD-1089', customer: 'Bruce Wayne', restaurant: 'The Green Garden', items: '1x Caesar Salad, 1x Fresh Orange Juice', total: '$15.50', status: 'Delivered' },
];

const AdminDashboard = () => {
  const { admin } = useAdminAuth();
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'Preparing':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'Out for Delivery':
        return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
      case 'Delivered':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      default:
        return 'bg-slate-800 text-slate-400 border border-slate-700';
    }
  };

  const openUpdateModal = (order) => {
    setSelectedOrder(order);
    setIsUpdateModalOpen(true);
  };

  const updateOrderStatus = (newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === selectedOrder.id ? { ...o, status: newStatus } : o))
    );
    setIsUpdateModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 min-h-screen">
      {/* Welcome Banner */}
      <section className="bg-slate-950 py-10 border-b border-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-at-t from-indigo-500/10 via-transparent to-transparent opacity-60 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-semibold uppercase tracking-wider mb-2.5">
              <ShieldCheck size={12} />
              <span>Admin Control Center</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              Logged in as <strong className="text-slate-350">{admin?.email}</strong>
            </p>
          </div>
          <div>
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              className="border-slate-800 hover:text-indigo-400 hover:border-indigo-500/30"
              onClick={() => setOrders(INITIAL_ORDERS)}
            >
              Reset Data
            </Button>
          </div>
        </div>
      </section>

      {/* Metrics Grid */}
      <section className="max-w-7xl mx-auto w-full px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_METRICS.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-850 rounded-2xl p-5 hover:border-slate-800 transition-colors shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {m.label}
                  </span>
                  <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/10">
                    <Icon size={18} />
                  </div>
                </div>
                <div className="flex items-end gap-2.5">
                  <span className="text-2xl font-bold text-slate-200 tracking-tight">
                    {m.value}
                  </span>
                  <span className="text-2xs font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded mb-1">
                    {m.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Active Orders Queue */}
      <section className="max-w-7xl mx-auto w-full px-6 pb-16 flex-1">
        <div className="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden shadow-xl">
          {/* Header */}
          <div className="p-6 border-b border-slate-850 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-200">
              Live Delivery Pipeline
            </h3>
            <span className="text-2xs font-bold bg-indigo-500/15 text-indigo-400 px-2.5 py-1 rounded-full uppercase tracking-wider">
              {orders.length} Active Orders
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-850 bg-slate-950/40 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Restaurant</th>
                  <th className="py-4 px-6">Details</th>
                  <th className="py-4 px-6">Total</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-sm">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-950/20 transition-colors text-slate-300">
                    <td className="py-4.5 px-6 font-semibold text-slate-400">{o.id}</td>
                    <td className="py-4.5 px-6 font-medium text-slate-200">{o.customer}</td>
                    <td className="py-4.5 px-6">{o.restaurant}</td>
                    <td className="py-4.5 px-6 text-xs text-slate-450 truncate max-w-[200px]" title={o.items}>
                      {o.items}
                    </td>
                    <td className="py-4.5 px-6 font-semibold text-slate-200">{o.total}</td>
                    <td className="py-4.5 px-6">
                      <span className={`px-2 py-0.5 text-2xs font-semibold rounded-md ${getStatusColor(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-4.5 px-6 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openUpdateModal(o)}
                        className="py-1 px-3 text-xs"
                      >
                        Update
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Update Order Status Modal */}
      {selectedOrder && (
        <Modal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          title={`Update Order Status: ${selectedOrder.id}`}
        >
          <div className="py-2">
            <p className="text-slate-400 text-xs mb-4">
              Select the new status for <strong>{selectedOrder.customer}</strong>'s order from <strong>{selectedOrder.restaurant}</strong>.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {['Pending', 'Preparing', 'Out for Delivery', 'Delivered'].map((status) => (
                <button
                  key={status}
                  onClick={() => updateOrderStatus(status)}
                  className={`py-3 px-4 border rounded-xl font-medium text-xs text-left cursor-pointer transition-all duration-200 ${
                    selectedOrder.status === status
                      ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsUpdateModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;
