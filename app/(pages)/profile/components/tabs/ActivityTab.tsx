import { motion } from 'framer-motion';

export default function ActivityTab({ logs }: { logs: any[] }) {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">Recent Activity</h3>

      <div className="space-y-4">
        {logs.map((log, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 bg-gray-50 rounded-xl"
          >
            <p className="font-medium">{log.action}</p>
            <p className="text-sm text-gray-500">{log.time}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
