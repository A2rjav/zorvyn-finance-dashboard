import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useEffect, useState } from 'react';
import useStore from '../store/useStore';
import { getCategoryData, COLORS } from '../data/mockData';
import Card from './Card';
import { formatCurrencyINR } from '../utils/currency';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-xl p-3 shadow-lg text-sm">
      <p className="font-semibold text-text-primary">{payload[0].name}</p>
      <p className="text-xs text-text-muted">{formatCurrencyINR(payload[0].value)}</p>
    </div>
  );
};

export default function SpendingChart() {
  const transactions = useStore((s) => s.transactions);
  const data = getCategoryData(transactions);
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setChartReady(true), 350);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Card delay={0.2}>
      <h3 className="text-base font-semibold text-text-primary mb-1">Spending Breakdown</h3>
      <p className="text-xs text-text-muted mb-4">By category</p>
      <div className="h-52 min-w-0">
        {chartReady ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={180}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full rounded-xl bg-surface-secondary animate-pulse" />
        )}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
        {data.slice(0, 6).map((item, i) => (
          <div key={item.name} className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="text-text-secondary truncate">{item.name}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
