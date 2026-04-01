import { useMemo } from 'react';
import { Gauge, ShieldCheck, TriangleAlert } from 'lucide-react';
import useStore from '../store/useStore';
import { getCategoryData, getMonthlyData } from '../data/mockData';
import Card from './Card';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function getVolatility(monthlyData) {
  if (!monthlyData.length) return 0;
  const values = monthlyData.map((m) => m.expenses);
  const avg = values.reduce((sum, n) => sum + n, 0) / values.length;
  if (avg === 0) return 0;
  const variance = values.reduce((sum, n) => sum + (n - avg) ** 2, 0) / values.length;
  const stdDev = Math.sqrt(variance);
  return stdDev / avg;
}

export default function FinancialHealthCard() {
  const transactions = useStore((s) => s.transactions);

  const health = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthly = getMonthlyData(transactions);
    const categories = getCategoryData(transactions);
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
    const topCategoryShare = expenses > 0 && categories[0] ? (categories[0].value / expenses) * 100 : 0;
    const volatility = getVolatility(monthly);

    const score = Math.round(
      clamp(
        50 + savingsRate * 0.6 - clamp(volatility * 20, 0, 20) - clamp((topCategoryShare - 35) * 0.5, 0, 25),
        0,
        100
      )
    );

    let tier = 'Stable';
    let hint = 'Good baseline. Keep spending concentration under control.';
    if (score >= 80) {
      tier = 'Excellent';
      hint = 'Strong savings behavior with healthy spending distribution.';
    } else if (score < 55) {
      tier = 'Needs Attention';
      hint = 'Reduce high-category concentration and improve monthly savings consistency.';
    }

    return {
      score,
      tier,
      hint,
      savingsRate,
      topCategoryName: categories[0]?.name || 'N/A',
      topCategoryShare,
    };
  }, [transactions]);

  const ringColor =
    health.score >= 80
      ? '#10b981'
      : health.score >= 55
        ? '#6366f1'
        : '#f43f5e';

  const TierIcon = health.score >= 55 ? ShieldCheck : TriangleAlert;

  return (
    <Card className="col-span-1 lg:col-span-3" delay={0.12}>
      <div className="flex flex-col md:flex-row md:items-center gap-5">
        <div className="flex items-center gap-4">
          <div
            className="w-24 h-24 rounded-full grid place-items-center"
            style={{
              background: `conic-gradient(${ringColor} ${health.score * 3.6}deg, var(--color-surface-tertiary) 0deg)`,
            }}
          >
            <div className="w-[72px] h-[72px] rounded-full bg-surface grid place-items-center border border-border">
              <span className="text-xl font-bold text-text-primary">{health.score}</span>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">Financial Health Score</p>
            <div className="flex items-center gap-2 mt-1">
              <TierIcon className="w-4 h-4 text-primary-500" />
              <p className="text-sm font-semibold text-text-primary">{health.tier}</p>
            </div>
            <p className="text-xs text-text-secondary mt-1 max-w-sm">{health.hint}</p>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-surface-secondary p-3">
            <p className="text-xs text-text-muted">Savings Rate</p>
            <p className="text-sm font-semibold text-text-primary mt-0.5">{health.savingsRate.toFixed(1)}%</p>
          </div>
          <div className="rounded-xl border border-border bg-surface-secondary p-3">
            <p className="text-xs text-text-muted">Top Spend Category</p>
            <p className="text-sm font-semibold text-text-primary mt-0.5">
              {health.topCategoryName} ({health.topCategoryShare.toFixed(1)}%)
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-xs text-text-muted">
        <Gauge className="w-3.5 h-3.5" />
        Composite score based on savings rate, spending concentration, and expense volatility.
      </div>
    </Card>
  );
}
