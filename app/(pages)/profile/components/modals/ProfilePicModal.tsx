import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

export default function ProfilePicModal({ open, onClose }: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 rounded-2xl w-80"
      >
        <h3 className="text-lg font-semibold mb-4 text-center">
          Update Profile Picture
        </h3>

        <input type="file" className="mb-4" />

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-gray-200 rounded-lg py-2">
            <X className="inline h-4 w-4" /> Cancel
          </button>
          <button className="flex-1 bg-blue-500 text-white rounded-lg py-2">
            <Check className="inline h-4 w-4" /> Save
          </button>
        </div>
      </motion.div>
    </div>
  );
}
