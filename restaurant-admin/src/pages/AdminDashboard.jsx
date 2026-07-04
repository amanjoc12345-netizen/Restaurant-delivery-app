import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useToast } from '../context/AdminToastContext';
import { categoryService } from '../services/categoryService';
import { recipeService } from '../services/recipeService';
import { orderService } from '../services/orderService';
import {
  TrendingUp,
  ShoppingBag,
  Layers,
  Utensils,
  RefreshCw,
  Clock,
  CheckCircle,
  ShieldCheck,
  ChevronRight,
  ClipboardList,
} from 'lucide-react';
import Button from '../components/Button';
import Modal from '../components/Modal';
import LoadingSkeleton from '../components/LoadingSkeleton';

const AdminDashboard = () => {
  const { token, admin } = useAdminAuth();
  const { showToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const loadDashboardData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [cats, recs, ords] = await Promise.all([
        categoryService.getCategories(),
        recipeService.getRecipes(),
        orderService.getOrders(token),
      ]);
      setCategories(cats);
      setRecipes(recs);
      setOrders(ords);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      showToast('Failed to retrieve real-time dashboard data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadDashboardData();
    }
  }, [token]);

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

  const updateOrderStatus = async (newStatus) => {
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      await orderService.updateOrderStatus(selectedOrder.id, newStatus, token);
      showToast(`Order status updated to "${newStatus}"`, 'success');
      
      // Update local state silenty
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? { ...o, status: newStatus } : o))
      );
      setIsUpdateModalOpen(false);
    } catch (err) {
      showToast('Failed to update order status. Please try again.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  // Calculations
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;
  const deliveredOrdersCount = orders.filter((o) => o.status === 'Delivered').length;
  const activeOrdersQueue = orders.filter((o) => o.status !== 'Delivered').slice(0, 5);

  const metrics = [
    { label: 'Total Categories', value: categories.length, icon: Layers, color: 'text-indigo-400' },
    { label: 'Total Recipes', value: recipes.length, icon: Utensils, color: 'text-rose-400' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-emerald-400' },
    { label: 'Pending Orders', value: pendingOrdersCount, icon: Clock, color: 'text-amber-400' },
    { label: 'Delivered Orders', value: deliveredOrdersCount, icon: CheckCircle, color: 'text-teal-400' },
  ];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-20 bg-slate-900 border border-slate-850 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-28 bg-slate-900 border border-slate-850 rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-slate-900 border border-slate-850 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-850 p-6 rounded-2xl relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-radial-at-t from-indigo-500/5 via-transparent to-transparent opacity-60 pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck size={12} />
            <span>Operational Hub</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-100 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Logged in as <strong className="text-slate-350">{admin?.email}</strong>
          </p>
        </div>
        <div className="relative z-10 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            className="border-slate-800 hover:text-indigo-400 hover:border-indigo-500/30 text-slate-300"
            onClick={() => loadDashboardData(false)}
          >
            Sync Data
          </Button>
        </div>
      </section>

      {/* Metrics Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-850 rounded-2xl p-5 hover:border-slate-800 transition-all hover:scale-[1.02] shadow-lg flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {m.label}
                </span>
                <div className="p-2 bg-slate-950 border border-slate-850 rounded-xl">
                  <Icon size={16} className={m.color} />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-200 tracking-tight">
                  {m.value}
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Active Orders Queue */}
      <section className="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-850 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200">
              Live Delivery Pipeline
            </h3>
            <p className="text-[10px] text-slate-550 mt-0.5">Showing active, uncompleted orders in real-time</p>
          </div>
          <span className="text-[10px] font-bold bg-indigo-500/15 text-indigo-400 px-2.5 py-1 rounded-full uppercase tracking-wider">
            {orders.filter(o => o.status !== 'Delivered').length} Remaining Active
          </span>
        </div>

        {activeOrdersQueue.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            <ClipboardList className="mx-auto mb-2.5 text-slate-600" size={30} />
            <p className="font-semibold text-slate-400">All orders processed!</p>
            <p className="text-[10px] text-slate-600 mt-0.5">There are no active orders waiting in the pipeline.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-850 bg-slate-950/40 text-[9px] uppercase font-bold text-slate-550 tracking-wider">
                  <th className="py-3.5 px-6">Order ID</th>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Contact / Address</th>
                  <th className="py-3.5 px-6">Details</th>
                  <th className="py-3.5 px-6">Total</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-xs text-slate-450">
                {activeOrdersQueue.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-950/20 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-350">{o.id}</td>
                    <td className="py-4 px-6 font-semibold text-slate-200">{o.customerName || 'Anonymous'}</td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-slate-300">{o.contact}</p>
                      <p className="text-[10px] text-slate-500 truncate max-w-[150px]" title={o.address}>{o.address}</p>
                    </td>
                    <td className="py-4 px-6 text-xs max-w-[200px]">
                      <div className="truncate text-slate-400" title={o.items?.map(it => `${it.quantity}x ${it.name}`).join(', ')}>
                        {o.items?.map(it => `${it.quantity}x ${it.name}`).join(', ')}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-200">${parseFloat(o.total || 0).toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md uppercase tracking-wider ${getStatusColor(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openUpdateModal(o)}
                        className="py-1 px-3 text-[10px] uppercase font-bold"
                      >
                        Update
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Update Order Status Modal */}
      {selectedOrder && (
        <Modal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          title={`Update Order Status: ${selectedOrder.id}`}
        >
          <div className="space-y-4">
            <p className="text-slate-400 text-xs">
              Select the new status for <strong>{selectedOrder.customerName || 'Anonymous'}</strong>'s order.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {['Pending', 'Preparing', 'Out for Delivery', 'Delivered'].map((status) => (
                <button
                  key={status}
                  disabled={updating}
                  onClick={() => updateOrderStatus(status)}
                  className={`py-3 px-4 border rounded-xl font-semibold text-xs text-left cursor-pointer transition-all duration-200 ${
                    selectedOrder.status === status
                      ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400'
                      : 'bg-slate-950 border-slate-850 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
                  } disabled:opacity-50`}
                >
                  {status}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsUpdateModalOpen(false)}
                disabled={updating}
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
