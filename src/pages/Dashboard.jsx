import { Inbox } from 'lucide-react';
import useStore from '../store/useStore';
import SummaryCards from '../components/SummaryCards';
import BalanceChart from '../components/BalanceChart';
import SpendingChart from '../components/SpendingChart';
import RecentTransactions from '../components/RecentTransactions';
import FinancialHealthCard from '../components/FinancialHealthCard';

export default function Dashboard() {
  const transactions = useStore((s) => s.transactions);

  if (transactions.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-surface rounded-2xl border border-border p-10 md:p-14 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8 text-primary-500" />
          </div>
          <h2 className="text-xl font-semibold text-text-primary">No finance data yet</h2>
          <p className="text-sm text-text-secondary mt-2 max-w-md">
            Add your first transaction to unlock dashboard insights, trend charts, and spending analysis.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SummaryCards />
      <FinancialHealthCard />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <BalanceChart />
        <SpendingChart />
      </div>
      <RecentTransactions />
    </div>
  );
}
