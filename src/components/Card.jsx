import { motion } from 'framer-motion';

export default function Card({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      className={`card-surface rounded-2xl p-5 ${className}`}
    >
      {children}
    </motion.div>
  );
}
