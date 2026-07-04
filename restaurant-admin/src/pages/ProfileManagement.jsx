import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useToast } from '../context/AdminToastContext';
import { authServices } from '../api/firebaseApi';
import { User, Lock, Mail, ShieldAlert, KeyRound } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';

const ProfileManagement = () => {
  const { admin, token } = useAdminAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.password) {
      newErrors.password = 'New password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await authServices.changePassword(token, formData.password);
      showToast('Password updated successfully!', 'success');
      setFormData({ password: '', confirmPassword: '' });
    } catch (err) {
      console.error('Password change error:', err);
      const msg = err.response?.data?.error?.message || err.message || 'Failed to update password';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <section className="bg-slate-900 border border-slate-850 p-6 rounded-2xl shadow-xl">
        <h1 className="text-xl font-extrabold text-slate-100 tracking-tight">
          Admin Profile Settings
        </h1>
        <p className="text-slate-550 text-xs mt-0.5">
          View account credentials and configure secure control center access
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <section className="bg-slate-900 border border-slate-850 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-between text-center relative overflow-hidden h-fit">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-4">
            <User size={30} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-200 text-base tracking-tight">
              BiteDash Administrator
            </h3>
            <span className="inline-block mt-1 bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Control Panel Owner
            </span>
          </div>

          <div className="w-full border-t border-slate-850 my-6 pt-5 text-left space-y-4">
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-slate-550 flex-shrink-0" />
              <div className="min-w-0">
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</span>
                <span className="block text-xs font-semibold text-slate-300 truncate">{admin?.email}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <KeyRound size={16} className="text-slate-550 flex-shrink-0" />
              <div className="min-w-0">
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Security Identifier</span>
                <span className="block text-[10px] font-mono text-slate-400 truncate select-all">{admin?.uid}</span>
              </div>
            </div>
          </div>

          <div className="w-full px-3 py-2 bg-slate-950/60 border border-slate-850 rounded-xl flex items-start gap-2.5 text-left">
            <ShieldAlert size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-slate-500 leading-relaxed">
              These credentials grant full read and write authorizations directly to Firestore database documents. Keep details confidential.
            </p>
          </div>
        </section>

        {/* Change Password Form */}
        <section className="lg:col-span-2 bg-slate-900 border border-slate-850 p-6 rounded-2xl shadow-xl">
          <h2 className="text-sm font-bold text-slate-200 mb-1 tracking-tight">
            Modify Security Password
          </h2>
          <p className="text-xs text-slate-550 mb-6">
            Ensure your control panel remains secure by keeping passwords rotated
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <Input
              name="password"
              type="password"
              label="New Security Password"
              placeholder="••••••••"
              icon={Lock}
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
            />

            <Input
              name="confirmPassword"
              type="password"
              label="Confirm New Password"
              placeholder="••••••••"
              icon={Lock}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={errors.confirmPassword}
            />

            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={loading}
              className="mt-2"
            >
              Update Password
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default ProfileManagement;
