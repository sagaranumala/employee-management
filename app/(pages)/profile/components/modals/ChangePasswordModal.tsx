'use client';

import { api } from '@/src/lib/api';
import { motion } from 'framer-motion';
import { X, Loader2, Key } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface Props {
  open: boolean;
  token: string;
  onClose: () => void;
  onLogout: () => void;
}

export default function ChangePasswordModal({
  open,
  token,
  onClose,
  onLogout,
}: Props) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword) {
      toast.error('All fields are required');
      return;
    }

    setLoading(true);
    try {
      const res = await api('auth/updatePassword', {
        method: 'POST',
        body: { currentPassword, newPassword },
        authToken: token,
      });

      if (!res.success) {
        toast.error(res.message || 'Password update failed');
        return;
      }

      toast.success('Password updated successfully. Please login again.');
      onClose();
      onLogout();
    } catch (err: any) {
      toast.error(err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 w-96 shadow-xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Key className="h-5 w-5" /> Change Password
          </h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 flex justify-center items-center gap-2 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Update Password
          </button>
        </div>
      </motion.div>
    </div>
  );
}
