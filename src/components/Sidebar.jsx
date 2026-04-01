import { LayoutDashboard, ArrowLeftRight, Lightbulb, Wallet, Eye, ShieldCheck } from 'lucide-react';
import useStore from '../store/useStore';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
];

export default function Sidebar() {
  const activeTab = useStore((s) => s.activeTab);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const role = useStore((s) => s.role);

  const roleBadge = role === 'admin'
    ? {
        label: 'Admin',
        icon: ShieldCheck,
        classes: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30',
      }
    : {
        label: 'Viewer',
        icon: Eye,
        classes: 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300 border-primary-200 dark:border-primary-500/30',
      };
  const RoleIcon = roleBadge.icon;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-surface/85 backdrop-blur-xl border-r border-border/80 shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-lg font-bold text-text-primary tracking-tight font-display">FinanceHub</p>
          <p className="text-[11px] text-text-muted">Personal Finance OS</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2">
        {navItems.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all duration-200 cursor-pointer ${
                active
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/25'
                  : 'text-text-secondary hover:bg-surface-tertiary/80 hover:text-text-primary'
              }`}
            >
              <item.icon className="w-[18px] h-[18px]" />
              {item.label}
            </button>
          );
        })}

        <div className={`mt-3 mx-1 rounded-xl border px-3 py-2.5 flex items-center gap-2.5 ${roleBadge.classes}`}>
          <RoleIcon className="w-4 h-4" />
          <div>
            <p className="text-[11px] uppercase tracking-wide opacity-80">Role</p>
            <p className="text-sm font-semibold leading-none mt-0.5">{roleBadge.label}</p>
          </div>
        </div>
      </nav>

      <div className="p-4 m-3 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <p className="text-sm font-semibold">Pro Tip</p>
        <p className="text-xs opacity-80 mt-1 leading-relaxed">
          Switch to Admin role to add and manage transactions.
        </p>
      </div>
    </aside>
  );
}
