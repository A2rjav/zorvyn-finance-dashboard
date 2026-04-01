import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { transactions as initialTransactions } from '../data/mockData';

const useStore = create(
  persist(
    (set) => ({
      // Theme
      darkMode: false,
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

      // Role
      role: 'admin',
      setRole: (role) => set({ role }),

      // Transactions
      transactions: initialTransactions,
      addTransaction: (txn) =>
        set((s) => ({
          transactions: [{ ...txn, id: `txn-${Date.now()}` }, ...s.transactions],
        })),
      updateTransaction: (id, updates) =>
        set((s) => ({
          transactions: s.transactions.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      deleteTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
        })),

      // Filters
      filters: {
        search: '',
        category: 'all',
        type: 'all',
        dateRange: 'all',
        sortBy: 'date',
        sortOrder: 'desc',
      },
      setFilter: (key, value) =>
        set((s) => ({ filters: { ...s.filters, [key]: value } })),
      resetFilters: () =>
        set({
          filters: {
            search: '',
            category: 'all',
            type: 'all',
            dateRange: 'all',
            sortBy: 'date',
            sortOrder: 'desc',
          },
        }),

      // Active tab
      activeTab: 'dashboard',
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: 'finance-dashboard-store',
      partialize: (state) => ({
        darkMode: state.darkMode,
        role: state.role,
        transactions: state.transactions,
      }),
    }
  )
);

export default useStore;

// Utility functions (use outside selectors with raw state values)
export function getFilteredTransactions(transactions, filters) {
  let filtered = [...transactions];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.amount.toString().includes(q)
    );
  }

  if (filters.category !== 'all') {
    filtered = filtered.filter((t) => t.category === filters.category);
  }

  if (filters.type !== 'all') {
    filtered = filtered.filter((t) => t.type === filters.type);
  }

  if (filters.dateRange !== 'all') {
    const now = new Date();
    const days = { '7d': 7, '30d': 30, '90d': 90, '180d': 180 }[filters.dateRange] || 365;
    const cutoff = new Date(now.setDate(now.getDate() - days)).toISOString().split('T')[0];
    filtered = filtered.filter((t) => t.date >= cutoff);
  }

  filtered.sort((a, b) => {
    const order = filters.sortOrder === 'asc' ? 1 : -1;
    if (filters.sortBy === 'date') return order * a.date.localeCompare(b.date);
    if (filters.sortBy === 'amount') return order * (a.amount - b.amount);
    return 0;
  });

  return filtered;
}

export function getSummary(transactions) {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);
  return {
    totalBalance: Math.round(income - expenses),
    totalIncome: Math.round(income),
    totalExpenses: Math.round(expenses),
    transactionCount: transactions.length,
  };
}
