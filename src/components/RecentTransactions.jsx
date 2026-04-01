import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import useStore from '../store/useStore';
import Card from './Card';
import { formatCurrencyINR } from '../utils/currency';

export default function RecentTransactions() {
  const transactions = useStore((s) => s.transactions);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const recent = transactions.slice(0, 6);

  if (recent.length === 0) {
    return (
      <Card delay={0.25}>
        <h3 className="text-base font-semibold text-text-primary mb-4">Recent Transactions</h3>
        <div className="flex flex-col items-center justify-center py-8 text-text-muted">
          <p className="text-sm">No transactions yet</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 lg:col-span-2" delay={0.25}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-text-primary">Recent Transactions</h3>
        <button
          onClick={() => setActiveTab('transactions')}
          className="text-xs text-primary-500 hover:text-primary-600 font-medium cursor-pointer"
        >
          View all
        </button>
      </div>
      <div className="space-y-2">
        {recent.map((txn) => (
          <div
            key={txn.id}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-tertiary transition-colors"
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                txn.type === 'income'
                  ? 'bg-emerald-50 dark:bg-emerald-500/10'
                  : 'bg-rose-50 dark:bg-rose-500/10'
              }`}
            >
              {txn.type === 'income' ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-rose-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{txn.description}</p>
              <p className="text-xs text-text-muted">{txn.category}</p>
            </div>
            <div className="text-right">
              <p
                className={`text-sm font-semibold ${
                  txn.type === 'income' ? 'text-emerald-500' : 'text-rose-500'
                }`}
              >
                {txn.type === 'income' ? '+' : '-'}{formatCurrencyINR(txn.amount)}
              </p>
              <p className="text-xs text-text-muted">{txn.date}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
