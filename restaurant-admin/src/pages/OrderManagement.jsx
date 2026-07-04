import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useToast } from '../context/AdminToastContext';
import { orderService } from '../services/orderService';
import { ShoppingBag, ClipboardList, RefreshCw, Clock, CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const OrderManagement = () => {
  const { token } = useAdminAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterStatus, setSelectedFilterStatus] = useState('');

  // Update status modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const loadOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await orderService.getOrders(token);
      setOrders(data);
    } catch (err) {
      showToast('Failed to load orders list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadOrders();
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

  const handleOpenUpdate = (order) => {
    setSelectedOrder(order);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      await orderService.updateOrderStatus(selectedOrder.id, newStatus, token);
      showToast(`Order status updated to "${newStatus}"`, 'success');
      setIsUpdateModalOpen(false);
      loadOrders(true); // reload silently
    } catch (err) {
      showToast('Failed to update status.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  // Search and Filter Logic
  const filteredOrders = orders.filter((o) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (o.id && o.id.toLowerCase().includes(query)) ||
      (o.customerName && o.customerName.toLowerCase().includes(query)) ||
      (o.contact && o.contact.toLowerCase().includes(query));
      
    const matchesStatus = selectedFilterStatus === '' || o.status === selectedFilterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: 'Order ID',
      key: 'id',
      render: (item) => <span className="font-bold text-slate-350">{item.id}</span>,
    },
    {
      header: 'Customer',
      key: 'customerName',
      render: (item) => <span className="font-bold text-slate-200">{item.customerName || 'Anonymous'}</span>,
    },
    {
      header: 'Contact Info',
      render: (item) => (
        <div>
          <p className="font-semibold text-slate-300">{item.contact}</p>
          <p className="text-[10px] text-slate-500 truncate max-w-[160px]" title={item.address}>
            {item.address}
          </p>
        </div>
      ),
    },
    {
      header: 'Order Items',
      render: (item) => (
        <div className="max-w-[220px] text-xs">
          <div className="truncate text-slate-400" title={item.items?.map((it) => `${it.quantity}x ${it.name}`).join(', ')}>
            {item.items?.map((it) => `${it.quantity}x ${it.name}`).join(', ')}
          </div>
        </div>
      ),
    },
    {
      header: 'Total Paid',
      render: (item) => (
        <span className="font-bold text-slate-200">
          ${parseFloat(item.total || 0).toFixed(2)}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (item) => (
        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md uppercase tracking-wider ${getStatusColor(item.status)}`}>
          {item.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      cellClassName: 'text-right',
      className: 'text-right w-32',
      render: (item) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleOpenUpdate(item)}
          className="py-1 px-3 text-[10px] uppercase font-bold"
        >
          Update
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-850 p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 tracking-tight">
            Order Management
          </h1>
          <p className="text-slate-550 text-xs mt-0.5">
            Monitor and change status of customer meal delivery coordinates
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={RefreshCw}
          className="border-slate-800 hover:text-indigo-400 hover:border-indigo-500/30 text-slate-350"
          onClick={() => loadOrders(false)}
        >
          Refresh Orders
        </Button>
      </section>

      {/* Filter Options */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by ID, customer name or contact..."
          />
          <select
            value={selectedFilterStatus}
            onChange={(e) => setSelectedFilterStatus(e.target.value)}
            className="bg-slate-900 border border-slate-850 text-slate-300 text-xs rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 transition-all cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Preparing">Preparing</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
        <div className="text-xs text-slate-500 font-bold uppercase select-none">
          {filteredOrders.length} Orders
        </div>
      </section>

      {/* Orders Table */}
      <section>
        <DataTable
          columns={columns}
          data={filteredOrders}
          loading={loading}
          emptyMessage="No Orders Logged"
          emptySubMessage="Customer purchases and checkout pipelines will be recorded here."
        />
      </section>

      {/* Update Order Status Modal */}
      {selectedOrder && (
        <Modal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          title={`Update Order Status: ${selectedOrder.id}`}
        >
          <div className="space-y-4">
            <p className="text-slate-450 text-xs">
              Select the new status for <strong>{selectedOrder.customerName || 'Anonymous'}</strong>'s order.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {['Pending', 'Preparing', 'Out for Delivery', 'Delivered'].map((status) => (
                <button
                  key={status}
                  disabled={updating}
                  onClick={() => handleUpdateStatus(status)}
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

export default OrderManagement;
