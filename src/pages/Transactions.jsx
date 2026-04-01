import { useState, useMemo } from 'react';
import {
  Search, Filter, Plus, ArrowUpRight, ArrowDownRight,
  ChevronDown, Trash2, Pencil, Download, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore, { getFilteredTransactions } from '../store/useStore';
import AddTransactionModal from '../components/AddTransactionModal';
import Card from '../components/Card';
import { formatCurrencyINR } from '../utils/currency';

const categories = ['all', 'Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Healthcare', 'Utilities', 'Education', 'Salary', 'Freelance', 'Investment'];

export default function Transactions() {
  const role = useStore((s) => s.role);
  const filters = useStore((s) => s.filters);
  const setFilter = useStore((s) => s.setFilter);
  const resetFilters = useStore((s) => s.resetFilters);
  const allTransactions = useStore((s) => s.transactions);
  const deleteTransaction = useStore((s) => s.deleteTransaction);
  const transactions = useMemo(() => getFilteredTransactions(allTransactions, filters), [allTransactions, filters]);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 15;
  const totalPages = Math.ceil(transactions.length / perPage);
  const paged = transactions.slice((page - 1) * perPage, page * perPage);
  const animationKey = `${filters.search}|${filters.category}|${filters.type}|${filters.dateRange}|${filters.sortBy}|${filters.sortOrder}|${page}`;

  const hasActiveFilters = filters.search || filters.category !== 'all' || filters.type !== 'all' || filters.dateRange !== 'all';

  const exportCSV = () => {
    const header = 'Date,Description,Category,Type,Amount\n';
    const rows = transactions.map((t) => `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Toolbar */}
      <Card delay={0}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => { setFilter('search', e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-surface-secondary text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={filters.category}
              onChange={(e) => { setFilter('category', e.target.value); setPage(1); }}
              className="px-3 py-2.5 rounded-xl border border-border bg-surface-secondary text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>
              ))}
            </select>
            <select
              value={filters.type}
              onChange={(e) => { setFilter('type', e.target.value); setPage(1); }}
              className="px-3 py-2.5 rounded-xl border border-border bg-surface-secondary text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select
              value={filters.dateRange}
              onChange={(e) => { setFilter('dateRange', e.target.value); setPage(1); }}
              className="px-3 py-2.5 rounded-xl border border-border bg-surface-secondary text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              <option value="all">All Time</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="180d">Last 6 months</option>
            </select>
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                setFilter('sortBy', sortBy);
                setFilter('sortOrder', sortOrder);
              }}
              className="px-3 py-2.5 rounded-xl border border-border bg-surface-secondary text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              <option value="date-desc">Newest first</option>
              <option value="date-asc">Oldest first</option>
              <option value="amount-desc">Highest amount</option>
              <option value="amount-asc">Lowest amount</option>
            </select>
            {hasActiveFilters && (
              <button
                onClick={() => { resetFilters(); setPage(1); }}
                className="px-3 py-2.5 rounded-xl border border-rose-200 dark:border-rose-500/30 text-rose-500 text-sm hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-muted">
          {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
        </p>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-text-secondary text-sm hover:bg-surface-tertiary transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export
          </button>
          {role === 'admin' && (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <Card delay={0.05}>
        {paged.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-text-muted">
            <Filter className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm font-medium">No transactions found</p>
            <p className="text-xs mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-text-muted py-3 px-3">Date</th>
                    <th className="text-left text-xs font-medium text-text-muted py-3 px-3">Description</th>
                    <th className="text-left text-xs font-medium text-text-muted py-3 px-3">Category</th>
                    <th className="text-left text-xs font-medium text-text-muted py-3 px-3">Type</th>
                    <th className="text-right text-xs font-medium text-text-muted py-3 px-3">Amount</th>
                    {role === 'admin' && <th className="text-right text-xs font-medium text-text-muted py-3 px-3">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {paged.map((txn, i) => (
                    <motion.tr
                      key={`${txn.id}-${animationKey}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.24, delay: i * 0.02 }}
                      className="border-b border-border/50 last:border-0 hover:bg-surface-tertiary/50 transition-colors"
                    >
                      <td className="py-3 px-3 text-sm text-text-secondary">{txn.date}</td>
                      <td className="py-3 px-3">
                        <p className="text-sm font-medium text-text-primary">{txn.description}</p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-surface-tertiary text-text-secondary font-medium">
                          {txn.category}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                          txn.type === 'income' ? 'text-emerald-500' : 'text-rose-500'
                        }`}>
                          {txn.type === 'income' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {txn.type}
                        </span>
                      </td>
                      <td className={`py-3 px-3 text-right text-sm font-semibold ${
                        txn.type === 'income' ? 'text-emerald-500' : 'text-rose-500'
                      }`}>
                        {txn.type === 'income' ? '+' : '-'}{formatCurrencyINR(txn.amount)}
                      </td>
                      {role === 'admin' && (
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => deleteTransaction(txn.id)}
                            className="p-1.5 rounded-lg text-text-muted hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-2">
              {paged.map((txn, i) => (
                <motion.div
                  key={`${txn.id}-mobile-${animationKey}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.24, delay: i * 0.02 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-surface-secondary"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    txn.type === 'income' ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-rose-50 dark:bg-rose-500/10'
                  }`}>
                    {txn.type === 'income'
                      ? <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                      : <ArrowDownRight className="w-4 h-4 text-rose-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{txn.description}</p>
                    <p className="text-xs text-text-muted">{txn.date} · {txn.category}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${txn.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {txn.type === 'income' ? '+' : '-'}{formatCurrencyINR(txn.amount)}
                    </p>
                  </div>
                  {role === 'admin' && (
                    <button
                      onClick={() => deleteTransaction(txn.id)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-rose-500 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-border">
                <p className="text-xs text-text-muted">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        page === p
                          ? 'bg-primary-500 text-white'
                          : 'text-text-secondary hover:bg-surface-tertiary'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      <AddTransactionModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
