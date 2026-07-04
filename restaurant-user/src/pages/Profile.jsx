import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { profileService } from '../services/profileService';
import { User, Mail, Shield, Save, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';

const Profile = () => {
  const { user, token, updateUser } = useAuth();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Full Name is required');
      return;
    }
    if (fullName.trim().length < 3) {
      setError('Name must be at least 3 characters');
      return;
    }

    setSaving(true);
    setError('');

    try {
      // Invoke profile service to patch user info on Firestore REST endpoint
      const updatedProfile = await profileService.updateProfileName(
        user.uid,
        fullName.trim(),
        user.email,
        user.role || 'user',
        token
      );

      // Update AuthContext user state locally so navbar changes name instantly
      updateUser({ fullName: fullName.trim() });
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      console.error('Profile update failed:', err);
      showToast(err.message || 'Failed to update profile name. Ensure connection.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-950 py-12 px-6">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Back Link */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-500 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>

        {/* Profile Card */}
        <div className="bg-slate-900 border border-slate-850 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Heading */}
          <div className="flex items-center gap-3 border-b border-slate-850 pb-6 mb-6">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center">
              <User size={24} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-100 tracking-tight">Account Profile</h1>
              <p className="text-xs text-slate-500 mt-0.5">Manage your personal delivery preferences</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Name field */}
            <Input
              name="fullName"
              label="Full Name"
              placeholder="e.g. John Doe"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (error) setError('');
              }}
              error={error}
            />

            {/* Email field (Read Only) */}
            <div className="space-y-1.5 opacity-70">
              <label className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Mail size={14} />
                </div>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full bg-slate-950 border border-slate-850 text-slate-400 text-xs rounded-xl pl-10 pr-4 py-3 cursor-not-allowed outline-none"
                />
              </div>
              <p className="text-[10px] text-slate-500 font-semibold italic">Email is fixed to your authentication provider account.</p>
            </div>

            {/* Role indicator */}
            <div className="flex items-center gap-2.5 bg-slate-950/60 border border-slate-850 p-4.5 rounded-2xl">
              <Shield size={16} className="text-amber-500/70" />
              <div>
                <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Account Role</span>
                <span className="block text-xs font-bold text-slate-300 uppercase mt-0.5">{user?.role || 'User'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-850 flex justify-end gap-3">
              <Link to="/">
                <Button variant="outline" type="button" className="border-slate-800" disabled={saving}>
                  Cancel
                </Button>
              </Link>
              <Button
                variant="primary"
                type="submit"
                disabled={saving}
                icon={saving ? undefined : Save}
                className="px-6"
              >
                {saving ? (
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase">
                    <Loader2 size={14} className="animate-spin" /> Saving Changes
                  </span>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
