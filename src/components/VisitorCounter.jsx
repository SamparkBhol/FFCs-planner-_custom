
import React from 'react';
import { motion } from 'framer-motion';
import { useVisitorCounter } from '@/hooks/useVisitorCounter';
import { Eye } from 'lucide-react';

const VisitorCounter = () => {
  const count = useVisitorCounter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="visitor-counter"
    >
      <div className="flex items-center gap-2">
        <Eye className="w-4 h-4 text-cyan-400" />
        <span>
          Views: <span className="font-bold text-white">{count.toLocaleString()}</span>
        </span>
      </div>
    </motion.div>
  );
};

export default VisitorCounter;
