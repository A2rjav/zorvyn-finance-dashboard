import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, Target, Zap, PiggyBank } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import useStore from '../store/useStore';
import { getMonthlyData, getCategoryData, COLORS } from '../data/mockData';
import Card from '../components/Card';
import InsightRecommendations from '../components/InsightRecommendations';
import { formatCurrencyINR } from '../utils/currency';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-xl p-3 shadow-lg text-sm">
      <p className="font-semibold text-text-primary mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }} className="text-xs">
          {entry.name}: {formatCurrencyINR(entry.value)}
        </p>
      ))}
    </div>
  );
};

export default function Insights() {
  const transactions = useStore((s) => s.transactions);
  const monthlyData = getMonthlyData(transactions);
  const categoryData = getCategoryData(transactions);
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setChartReady(true), 350);
    return () => clearTimeout(timeout);
  }, []);

  // Compute insights
  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  const highestCategory = categoryData[0] || { name: 'N/A', value: 0 };
  const lowestCategory = categoryData[categoryData.length - 1] || { name: 'N/A', value: 0 };

  const avgMonthlyExpense = monthlyData.length > 0
    ? monthlyData.reduce((s, m) => s + m.expenses, 0) / monthlyData.length
    : 0;
  const avgMonthlyIncome = monthlyData.length > 0
    ? monthlyData.reduce((s, m) => s + m.income, 0) / monthlyData.length
    : 0;

  // Month over month
  const currentMonth = monthlyData[monthlyData.length - 1];
  const prevMonth = monthlyData[monthlyData.length - 2];
  const expenseChange = currentMonth && prevMonth && prevMonth.expenses > 0
    ? ((currentMonth.expenses - prevMonth.expenses) / prevMonth.expenses) * 100
    : 0;
  const incomeChange = currentMonth && prevMonth && prevMonth.income > 0
    ? ((currentMonth.income - prevMonth.income) / prevMonth.income) * 100
    : 0;

  const insightCards = [
    {
      icon: Target,
      title: 'Highest Spending',
      value: highestCategory.name,
      detail: formatCurrencyINR(highestCategory.value),
      color: 'text-rose-500',
      bg: 'bg-rose-50 dark:bg-rose-500/10',
    },
    {
      icon: PiggyBank,
      title: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      detail: savingsRate > 20 ? 'Healthy savings' : 'Consider saving more',
      color: savingsRate > 20 ? 'text-emerald-500' : 'text-amber-500',
      bg: savingsRate > 20 ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-amber-50 dark:bg-amber-500/10',
    },
    {
      icon: Zap,
      title: 'Avg Monthly Expense',
      value: formatCurrencyINR(avgMonthlyExpense),
      detail: `Across ${monthlyData.length} months`,
      color: 'text-primary-500',
      bg: 'bg-primary-50 dark:bg-primary-500/10',
    },
    {
      icon: TrendingDown,
      title: 'Lowest Spending',
      value: lowestCategory.name,
      detail: formatCurrencyINR(lowestCategory.value),
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Insight Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {insightCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="bg-surface rounded-2xl border border-border p-5"
          >
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className="text-xs text-text-muted font-medium">{card.title}</p>
            <p className="text-xl font-bold text-text-primary mt-1">{card.value}</p>
            <p className="text-xs text-text-muted mt-0.5">{card.detail}</p>
          </motion.div>
        ))}
      </div>

      {/* MoM Changes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card delay={0.1}>
          <h3 className="text-base font-semibold text-text-primary mb-1">Month-over-Month</h3>
          <p className="text-xs text-text-muted mb-4">Comparing latest two months</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-secondary">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">Income Change</p>
                  <p className="text-xs text-text-muted">{prevMonth?.name || 'N/A'} → {currentMonth?.name || 'N/A'}</p>
                </div>
              </div>
              <span className={`text-sm font-bold ${incomeChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {incomeChange >= 0 ? '+' : ''}{incomeChange.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-secondary">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-rose-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">Expense Change</p>
                  <p className="text-xs text-text-muted">{prevMonth?.name || 'N/A'} → {currentMonth?.name || 'N/A'}</p>
                </div>
              </div>
              <span className={`text-sm font-bold ${expenseChange <= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {expenseChange >= 0 ? '+' : ''}{expenseChange.toFixed(1)}%
              </span>
            </div>
          </div>
        </Card>

        <Card delay={0.15}>
          <h3 className="text-base font-semibold text-text-primary mb-1">Spending by Category</h3>
          <p className="text-xs text-text-muted mb-4">Top expense categories</p>
          <div className="space-y-3">
            {categoryData.slice(0, 5).map((cat, i) => {
              const maxVal = categoryData[0]?.value || 1;
              const pct = (cat.value / maxVal) * 100;
              return (
                <div key={cat.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-secondary font-medium">{cat.name}</span>
                    <span className="text-text-muted">{formatCurrencyINR(cat.value)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-tertiary overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ background: COLORS[i % COLORS.length] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Monthly Comparison Bar Chart */}
      <Card delay={0.2}>
        <h3 className="text-base font-semibold text-text-primary mb-1">Monthly Comparison</h3>
        <p className="text-xs text-text-muted mb-4">Income vs Expenses by month</p>
        <div className="h-72 min-w-0">
          {chartReady ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
              <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
                <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full rounded-xl bg-surface-secondary animate-pulse" />
          )}
        </div>
      </Card>

      {/* Quick Observations */}
      <Card delay={0.25}>
        <h3 className="text-base font-semibold text-text-primary mb-3">Key Observations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              icon: AlertCircle,
              text: `Your highest spending category is ${highestCategory.name} at ${formatCurrencyINR(highestCategory.value)}`,
              accent: 'text-amber-500',
              bg: 'bg-amber-50 dark:bg-amber-500/10',
            },
            {
              icon: PiggyBank,
              text: `Your savings rate is ${savingsRate.toFixed(1)}% — ${savingsRate > 20 ? 'above the recommended 20%' : 'below the recommended 20%'}`,
              accent: savingsRate > 20 ? 'text-emerald-500' : 'text-rose-500',
              bg: savingsRate > 20 ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-rose-50 dark:bg-rose-500/10',
            },
            {
              icon: TrendingUp,
              text: `Average monthly income is ${formatCurrencyINR(avgMonthlyIncome)} across ${monthlyData.length} months`,
              accent: 'text-primary-500',
              bg: 'bg-primary-50 dark:bg-primary-500/10',
            },
            {
              icon: Zap,
              text: `You have ${transactions.length} transactions totaling ${formatCurrencyINR(totalExpenses)} in expenses`,
              accent: 'text-primary-500',
              bg: 'bg-primary-50 dark:bg-primary-500/10',
            },
          ].map((obs, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-surface-secondary">
              <div className={`w-8 h-8 rounded-lg ${obs.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                <obs.icon className={`w-4 h-4 ${obs.accent}`} />
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{obs.text}</p>
            </div>
          ))}
        </div>
      </Card>

      <InsightRecommendations />
    </div>
  );
}
