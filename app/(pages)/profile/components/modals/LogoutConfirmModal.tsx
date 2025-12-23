'use client';

import { motion } from 'framer-motion';
import { LogOut, X } from 'lucide-react';

interface Props {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function LogoutConfirmModal({
  open,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 w-80 shadow-xl text-center"
      >
        <LogOut className="h-10 w-10 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold mb-2">Confirm Logout</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to logout?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 rounded-lg py-2 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 text-white rounded-lg py-2 hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
}
