import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Mail, Lock, AlertTriangle, ShieldCheck } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

const AdminLogin = () => {
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError('');
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-6 relative overflow-hidden bg-slate-950">
      {/* Decorative Indigo Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[140px] pointer-events-none" />

      {/* Login Card */}
      <div className="relative w-full max-w-md bg-slate-900/60 border border-slate-850 backdrop-blur-md rounded-2xl p-8 shadow-2xl animate-scale-in z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 mb-3.5">
            <ShieldCheck size={26} />
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-1 tracking-tight">
            Admin Control Panel
          </h2>
          <p className="text-xs text-slate-500">
            Authorized personnel only. Please sign in to manage operations.
          </p>
        </div>

        {apiError && (
          <div className="mb-6 px-4 py-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2.5 animate-shake">
            <AlertTriangle className="flex-shrink-0" size={16} />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            name="email"
            type="email"
            label="Security Email"
            placeholder="admin@bitedash.com"
            icon={Mail}
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          <Input
            name="password"
            type="password"
            label="Secure Password"
            placeholder="••••••••"
            icon={Lock}
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          <Button
            type="submit"
            className="w-full mt-2"
            variant="primary"
            loading={loading}
          >
            Log In to Control Panel
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
