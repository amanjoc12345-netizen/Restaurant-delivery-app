import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, AlertTriangle } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear validation error on change
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
      await signup(formData.email, formData.password, formData.fullName);
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

      {/* Signup Card */}
      <div className="relative w-full max-w-md bg-slate-900/60 border border-slate-800 backdrop-blur-md rounded-2xl p-8 shadow-2xl animate-fade-in z-10">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-100 mb-1.5 tracking-tight">
            Create an Account
          </h2>
          <p className="text-sm text-slate-500">
            Sign up to get fresh meals delivered to your doorstep
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
            name="fullName"
            label="Full Name"
            placeholder="John Doe"
            icon={User}
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
          />

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

          <Input
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            icon={Lock}
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          <Input
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="••••••••"
            icon={Lock}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />

          <Button
            type="submit"
            className="w-full mt-2"
            loading={loading}
          >
            Create Account
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-amber-500 hover:text-amber-400 transition-colors">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
