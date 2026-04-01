import { Wallet, TrendingUp, TrendingDown, ArrowLeftRight } from 'lucide-react';
import { motion } from 'framer-motion';
import useStore, { getSummary } from '../store/useStore';
import { useMemo } from 'react';
import { formatCurrencyINR } from '../utils/currency';

const cards = [
  {
    label: 'Total Balance',
    key: 'totalBalance',
    icon: Wallet,
    color: 'primary',
    bg: 'bg-primary-50 dark:bg-primary-900/30',
    iconColor: 'text-primary-500',
    glow: 'bg-primary-500/15',
  },
  {
    label: 'Total Income',
    key: 'totalIncome',
    icon: TrendingUp,
    color: 'emerald',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    iconColor: 'text-emerald-500',
    glow: 'bg-emerald-500/15',
  },
  {
    label: 'Total Expenses',
    key: 'totalExpenses',
    icon: TrendingDown,
    color: 'rose',
    bg: 'bg-rose-50 dark:bg-rose-500/10',
    iconColor: 'text-rose-500',
    glow: 'bg-rose-500/15',
  },
  {
    label: 'Transactions',
    key: 'transactionCount',
    icon: ArrowLeftRight,
    color: 'amber',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    iconColor: 'text-amber-500',
    glow: 'bg-amber-500/15',
  },
];

export default function SummaryCards() {
  const transactions = useStore((s) => s.transactions);
  const summary = useMemo(() => getSummary(transactions), [transactions]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className="card-surface rounded-2xl p-5 hover:-translate-y-0.5 transition-transform duration-300"
        >
          <div className={`pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full blur-2xl ${card.glow}`} />
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-muted font-medium">{card.label}</span>
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
              <card.icon className={`w-5 h-5 ${card.iconColor}`} />
            </div>
          </div>
          <p className="text-2xl font-bold text-text-primary">
            {card.key === 'transactionCount' ? summary[card.key] : formatCurrencyINR(summary[card.key])}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
