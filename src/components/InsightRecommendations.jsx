import { useMemo } from 'react';
import { Sparkles, TrendingDown, TrendingUp, TriangleAlert, Target } from 'lucide-react';
import useStore from '../store/useStore';
import { getCategoryData, getMonthlyData } from '../data/mockData';
import Card from './Card';
import { formatCurrencyINR } from '../utils/currency';

export default function InsightRecommendations() {
  const transactions = useStore((s) => s.transactions);

  const recommendations = useMemo(() => {
    const monthly = getMonthlyData(transactions);
    const categories = getCategoryData(transactions);

    const totalIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    const current = monthly[monthly.length - 1];
    const previous = monthly[monthly.length - 2];

    const expenseDelta =
      current && previous && previous.expenses > 0
        ? ((current.expenses - previous.expenses) / previous.expenses) * 100
        : 0;

    const topCategory = categories[0];
    const topShare = totalExpenses > 0 && topCategory ? (topCategory.value / totalExpenses) * 100 : 0;

    const list = [];

    if (savingsRate < 20) {
      list.push({
        icon: TriangleAlert,
        title: 'Raise Savings Buffer',
        detail: `Savings rate is ${savingsRate.toFixed(1)}%. Target 20%+ by capping discretionary categories first.`,
        tone: 'warn',
      });
    } else {
      list.push({
        icon: TrendingUp,
        title: 'Savings Momentum Is Healthy',
        detail: `Current savings rate is ${savingsRate.toFixed(1)}%. Consider automating investments from monthly surplus.`,
        tone: 'good',
      });
    }

    if (expenseDelta > 10) {
      list.push({
        icon: TrendingDown,
        title: 'Monthly Expense Spike Detected',
        detail: `Expenses are up ${expenseDelta.toFixed(1)}% vs last month. Set a short-term cap for this cycle.`,
        tone: 'warn',
      });
    }

    if (topCategory && topShare > 35) {
      list.push({
        icon: Target,
        title: 'Category Concentration Risk',
        detail: `${topCategory.name} contributes ${topShare.toFixed(1)}% of total expenses (${formatCurrencyINR(topCategory.value)}).`,
        tone: 'neutral',
      });
    }

    if (list.length < 3) {
      list.push({
        icon: Sparkles,
        title: 'Next Optimization Step',
        detail: 'Tag recurring transactions and review them weekly to improve predictability and decision speed.',
        tone: 'neutral',
      });
    }

    return list.slice(0, 3);
  }, [transactions]);

  return (
    <Card delay={0.18}>
      <h3 className="text-base font-semibold text-text-primary mb-1">Actionable Recommendations</h3>
      <p className="text-xs text-text-muted mb-4">Priority actions generated from your latest finance patterns</p>

      <div className="space-y-2.5">
        {recommendations.map((item) => (
          <div key={item.title} className="rounded-xl border border-border bg-surface-secondary p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <item.icon
                className={`w-4 h-4 ${
                  item.tone === 'good'
                    ? 'text-emerald-500'
                    : item.tone === 'warn'
                      ? 'text-rose-500'
                      : 'text-primary-500'
                }`}
              />
              <p className="text-sm font-semibold text-text-primary">{item.title}</p>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">{item.detail}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
