import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { ClipboardList, RefreshCw, Clock, MapPin, Phone, ShieldAlert, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const Orders = () => {
  const { user, token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const loadOrders = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      setError('');
      const data = await orderService.getCustomerOrders(user.uid, token);
      setOrders(data);
    } catch (err) {
      console.error('Failed to load user orders:', err);
      setError('Unable to fetch your orders list at this time.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.uid && token) {
      loadOrders();
    }
  }, [user, token]);

  const toggleExpandOrder = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

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
      case 'Failed':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      default:
        return 'bg-slate-800 text-slate-400 border border-slate-700';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-20 bg-slate-950 text-slate-400">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">Loading Order Records...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-950 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header section */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-850 p-6 rounded-2xl shadow-xl">
          <div>
            <h1 className="text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
              <ClipboardList className="text-amber-500" />
              <span>My Orders</span>
            </h1>
            <p className="text-slate-500 text-xs mt-0.5">
              Monitor active deliveries and look through past recipe purchases
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={refreshing}
            icon={RefreshCw}
            className={`border-slate-800 hover:text-amber-400 text-slate-350 ${refreshing ? 'animate-spin' : ''}`}
            onClick={() => loadOrders(true)}
          >
            {refreshing ? 'Refreshing...' : 'Refresh Status'}
          </Button>
        </section>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl flex items-center gap-3">
            <ShieldAlert size={20} />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {/* Orders Listing */}
        <section className="space-y-4">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-900/40 border border-slate-850 rounded-3xl p-8">
              <ClipboardList size={36} className="text-slate-650 mb-3" />
              <h4 className="font-semibold text-slate-350 text-base mb-1">
                No Orders Placed Yet
              </h4>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                You haven't ordered anything yet. Browse our selection and place your first meal order!
              </p>
              <Link to="/" className="mt-6">
                <Button size="sm" className="uppercase font-bold text-xs">
                  Browse Delicious Plates
                </Button>
              </Link>
            </div>
          ) : (
            orders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const formattedDate = order.createdAt
                ? new Date(order.createdAt).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })
                : 'N/A';

              return (
                <div
                  key={order.id}
                  className="bg-slate-900 border border-slate-850 hover:border-slate-800 rounded-2xl shadow-lg transition-all overflow-hidden"
                >
                  {/* Order Main Row Header */}
                  <div
                    onClick={() => toggleExpandOrder(order.id)}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 bg-slate-950 border border-slate-850 rounded-xl flex items-center justify-center text-slate-400">
                        <ShoppingBag size={18} />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-slate-200">Order #{order.id.slice(-6).toUpperCase()}</span>
                          <span className={`px-2 py-0.5 text-[9px] font-black rounded-md uppercase tracking-wider ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <span className="block text-[10px] text-slate-500 mt-1 font-medium">{formattedDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-0 border-slate-850 pt-3 sm:pt-0">
                      <div className="text-right">
                        <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Total Paid</span>
                        <span className="block text-sm font-black text-amber-500 mt-0.5">${parseFloat(order.total).toFixed(2)}</span>
                      </div>
                      <div className="text-slate-400">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  {isExpanded && (
                    <div className="border-t border-slate-850 bg-slate-950/40 p-5 space-y-6">
                      
                      {/* Delivery Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-950 border border-slate-900 p-4 rounded-xl space-y-2">
                          <span className="text-2xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                            <MapPin size={12} className="text-amber-500" />
                            <span>Destination Address</span>
                          </span>
                          <p className="text-xs text-slate-350 leading-relaxed font-semibold">{order.address}</p>
                        </div>
                        
                        <div className="bg-slate-950 border border-slate-900 p-4 rounded-xl space-y-2">
                          <span className="text-2xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                            <Phone size={12} className="text-amber-500" />
                            <span>Contact coordinates</span>
                          </span>
                          <p className="text-xs text-slate-350 leading-relaxed font-semibold">{order.contact}</p>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="space-y-2.5">
                        <span className="text-2xs font-bold text-slate-500 uppercase tracking-wider block">Receipt Items</span>
                        <div className="border border-slate-850 rounded-xl divide-y divide-slate-850 overflow-hidden bg-slate-900/50">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="p-3.5 flex items-center justify-between text-xs text-slate-350">
                              <div className="flex items-center gap-3">
                                {item.image && (
                                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-950 flex-shrink-0 border border-slate-850">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                  </div>
                                )}
                                <div>
                                  <span className="font-bold text-slate-200">{item.name}</span>
                                  <span className="text-[10px] text-slate-500 ml-1.5 font-bold uppercase">x {item.quantity}</span>
                                </div>
                              </div>
                              <span className="font-bold text-slate-200">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Detailed Pricing Summary */}
                      <div className="flex justify-between items-center bg-slate-900 border border-slate-850 px-4 py-3 rounded-xl">
                        <div className="text-2xs text-slate-500 uppercase tracking-wider font-bold">Billing Strategy</div>
                        <div className="text-right">
                          <span className="text-xs text-slate-400 font-medium">Cash on Delivery - </span>
                          <span className="text-xs font-extrabold text-amber-500">${parseFloat(order.total).toFixed(2)}</span>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })
          )}
        </section>
      </div>
    </div>
  );
};

export default Orders;
