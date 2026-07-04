import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertTriangle } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
  const { login } = useAuth();
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
    <div className="flex-1 flex items-center justify-center py-12 px-6 relative overflow-hidden">
      {/* Decorative Blur Background Circles */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

      {/* Login Card */}
      <div className="relative w-full max-w-md bg-slate-900/60 border border-slate-800 backdrop-blur-md rounded-2xl p-8 shadow-2xl animate-fade-in z-10">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-100 mb-1.5 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-500">
            Log in to order your favorite meals
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
            label="Email Address"
            placeholder="john@example.com"
            icon={Mail}
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-amber-500 hover:text-amber-400 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <Input
              name="password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            loading={loading}
          >
            Log In
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-amber-500 hover:text-amber-400 transition-colors">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
