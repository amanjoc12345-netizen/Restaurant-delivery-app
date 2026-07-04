import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import Modal from '../components/Modal';

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const validateForm = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    setError('');
    return true;
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError('');
    try {
      await forgotPassword(email);
      setIsSuccessModalOpen(true);
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

      {/* Card Container */}
      <div className="relative w-full max-w-md bg-slate-900/60 border border-slate-800 backdrop-blur-md rounded-2xl p-8 shadow-2xl animate-fade-in z-10">
        <Link to="/login" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors uppercase tracking-wider mb-6">
          <ArrowLeft size={14} />
          <span>Back to Login</span>
        </Link>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-100 mb-1.5 tracking-tight">
            Reset Password
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Enter your email address and we'll send you a link to reset your account password.
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
            value={email}
            onChange={handleChange}
            error={error}
          />

          <Button
            type="submit"
            className="w-full mt-2"
            loading={loading}
          >
            Send Reset Link
          </Button>
        </form>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Check Your Email"
        showClose={true}
      >
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
            <CheckCircle2 size={24} />
          </div>
          <h4 className="font-semibold text-slate-200 text-base mb-1.5">
            Reset Link Sent Successfully
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-6 max-w-sm">
            We have sent password reset instructions to <strong>{email}</strong>. Please check your inbox (and spam folder) to reset your account.
          </p>
          <Link to="/login" className="w-full">
            <Button className="w-full" size="md">
              Okay, Go to Login
            </Button>
          </Link>
        </div>
      </Modal>
    </div>
  );
};

export default ForgotPassword;
