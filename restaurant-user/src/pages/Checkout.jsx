import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/orderService';
import { ShoppingBag, MapPin, Phone, CreditCard, Trash2, Plus, Minus, Tag, ShieldCheck, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';

const Checkout = () => {
  const { user, token } = useAuth();
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Form states
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Error states
  const [errors, setErrors] = useState({});

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'BITE20') {
      setDiscountApplied(true);
      showToast('Coupon "BITE20" applied! 20% discount subtracted.', 'success');
      setCouponCode('');
    } else {
      showToast('Invalid promo coupon code.', 'error');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!address.trim()) {
      newErrors.address = 'Delivery address is required';
    } else if (address.trim().length < 8) {
      newErrors.address = 'Please specify a complete delivery address (min 8 chars)';
    }

    if (!contact.trim()) {
      newErrors.contact = 'Contact telephone number is required';
    } else if (!/^\+?[0-9\s-]{7,15}$/.test(contact.trim())) {
      newErrors.contact = 'Please enter a valid telephone contact number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const subtotal = getCartTotal();
  const discountRate = discountApplied ? 0.2 : 0;
  const discountAmount = subtotal * discountRate;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      showToast('Your shopping cart is empty.', 'error');
      return;
    }

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      // Structure the order data based on API expectations
      const orderPayload = {
        userId: user.uid,
        customerName: user.fullName || user.email.split('@')[0],
        address: address.trim(),
        contact: contact.trim(),
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: parseFloat(item.price),
          quantity: item.quantity,
          image: item.image,
        })),
        total: parseFloat(finalTotal.toFixed(2)),
      };

      // Place order via REST API
      await orderService.placeOrder(orderPayload, token);
      
      showToast('Order placed successfully!', 'success');
      clearCart();
      navigate('/orders');
    } catch (err) {
      console.error('Failed to submit order:', err);
      showToast('Unable to complete check out. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-6 bg-slate-950 text-center">
        <div className="bg-slate-900 border border-slate-850 p-8 rounded-3xl max-w-md shadow-2xl flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center animate-bounce">
            <ShoppingBag size={30} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-100">Your Cart is Empty</h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-xs">
              Looks like you haven't added anything to your cart yet. Explore our delicious menu category items.
            </p>
          </div>
          <Link to="/" className="w-full mt-4">
            <Button className="w-full uppercase font-bold text-xs py-3" icon={ArrowLeft}>
              Start Ordering
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-950 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight mb-8 flex items-center gap-2">
          <ShoppingBag className="text-amber-500" />
          <span>Checkout & Cart Summary</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Delivery Details Form */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-850 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
            <h2 className="text-base font-bold text-slate-200 border-b border-slate-850 pb-4 flex items-center gap-2">
              <MapPin size={18} className="text-amber-500" />
              <span>Delivery Coordinates</span>
            </h2>

            <form onSubmit={handlePlaceOrder} className="space-y-5">
              {/* Customer display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 opacity-80">
                  <label className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">Customer Name</label>
                  <input
                    type="text"
                    disabled
                    value={user?.fullName || ''}
                    className="w-full bg-slate-950 border border-slate-850 text-slate-350 text-xs rounded-xl px-4 py-3 cursor-not-allowed outline-none"
                  />
                </div>
                <div className="space-y-1.5 opacity-80">
                  <label className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">Customer Email</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full bg-slate-950 border border-slate-850 text-slate-350 text-xs rounded-xl px-4 py-3 cursor-not-allowed outline-none"
                  />
                </div>
              </div>

              {/* Contact telephone */}
              <div className="space-y-1.5">
                <label className="text-2xs font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <Phone size={12} className="text-slate-500" />
                  <span>Contact Phone Number</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="e.g. +1 555-019-2834"
                    value={contact}
                    onChange={(e) => {
                      setContact(e.target.value);
                      if (errors.contact) setErrors({ ...errors, contact: '' });
                    }}
                    className={`w-full bg-slate-950 border ${
                      errors.contact ? 'border-rose-500/50' : 'border-slate-850'
                    } text-slate-200 text-xs rounded-xl px-4 py-3 outline-none focus:border-amber-500 transition-colors`}
                  />
                </div>
                {errors.contact && (
                  <span className="text-[10px] text-rose-400 font-semibold">{errors.contact}</span>
                )}
              </div>

              {/* Delivery Address */}
              <div className="space-y-1.5">
                <label className="text-2xs font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <MapPin size={12} className="text-slate-500" />
                  <span>Delivery Address</span>
                </label>
                <textarea
                  rows="3"
                  placeholder="Enter complete house street details, zip code..."
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address) setErrors({ ...errors, address: '' });
                  }}
                  className={`w-full bg-slate-950 border ${
                    errors.address ? 'border-rose-500/50' : 'border-slate-850'
                  } text-slate-200 text-xs rounded-xl px-4 py-3 outline-none focus:border-amber-500 transition-colors resize-none`}
                />
                {errors.address && (
                  <span className="text-[10px] text-rose-400 font-semibold">{errors.address}</span>
                )}
              </div>

              {/* Payment Method Badge */}
              <div className="space-y-2">
                <label className="text-2xs font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <CreditCard size={12} className="text-slate-500" />
                  <span>Payment Strategy</span>
                </label>
                <div className="flex items-center gap-3 bg-amber-500/5 border border-amber-500/10 p-4.5 rounded-2xl">
                  <input
                    type="radio"
                    id="cod"
                    name="payment"
                    defaultChecked
                    disabled
                    className="accent-amber-500"
                  />
                  <label htmlFor="cod" className="flex-1 cursor-pointer">
                    <span className="block text-xs font-bold text-slate-200">Cash on Delivery (COD)</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">Pay standard cash when courier hands over the parcel.</span>
                  </label>
                  <span className="bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                    COD Only
                  </span>
                </div>
              </div>

              {/* Place Order CTA Button */}
              <div className="pt-4 border-t border-slate-850">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 uppercase font-bold text-xs tracking-wider"
                  icon={ShieldCheck}
                >
                  {submitting ? 'Processing Purchase...' : `Place COD Order - $${finalTotal.toFixed(2)}`}
                </Button>
              </div>
            </form>
          </div>

          {/* Right Column: Cart Item Listings & Pricing */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Cart Items List */}
            <div className="bg-slate-900 border border-slate-850 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider border-b border-slate-850 pb-3 flex justify-between items-center">
                <span>Ordered Items</span>
                <span>{cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items</span>
              </h3>

              <div className="divide-y divide-slate-850 max-h-96 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-850">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-3 flex gap-3.5 items-center first:pt-0 last:pb-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-950 flex-shrink-0 border border-slate-800">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-200 truncate">{item.name}</h4>
                      <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                        ${parseFloat(item.price).toFixed(2)} each
                      </p>
                    </div>
                    
                    {/* Inline Counter */}
                    <div className="flex items-center gap-2 bg-slate-950 border border-slate-850 px-2 py-1 rounded-lg">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="text-[11px] font-bold text-slate-300 w-3 text-center">{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        <Plus size={10} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 bg-slate-950 hover:bg-rose-500/10 rounded-lg text-slate-500 hover:text-rose-400 border border-slate-850 hover:border-rose-500/20 transition-all cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Coupon Code Block */}
            <div className="bg-slate-900 border border-slate-850 rounded-3xl p-6 shadow-xl">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Tag size={14} className="text-amber-500" />
                <span>Promo Discount Coupon</span>
              </h3>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. BITE20"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={discountApplied}
                  className="flex-1 bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-500 disabled:opacity-50 uppercase placeholder:normal-case font-bold"
                />
                <Button
                  variant="outline"
                  type="submit"
                  disabled={discountApplied || !couponCode.trim()}
                  className="border-slate-800 text-xs px-4 py-2"
                >
                  Apply
                </Button>
              </form>
              {discountApplied && (
                <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold bg-emerald-500/5 border border-emerald-500/10 p-2 rounded-xl">
                  <ShieldCheck size={12} />
                  <span>20% off Applied ("BITE20")</span>
                </div>
              )}
            </div>

            {/* Cart Summary Totals */}
            <div className="bg-slate-900 border border-slate-850 rounded-3xl p-6 shadow-xl space-y-3.5">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Basket Subtotal</span>
                <span className="font-semibold text-slate-200">${subtotal.toFixed(2)}</span>
              </div>
              {discountApplied && (
                <div className="flex justify-between items-center text-xs text-emerald-400">
                  <span>Coupon Discount (20%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Delivery Service Fee</span>
                <span className="font-semibold text-slate-200">FREE</span>
              </div>
              <div className="border-t border-slate-850 pt-3.5 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-200">Grand Total (COD)</span>
                <span className="text-lg font-black text-amber-500">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
