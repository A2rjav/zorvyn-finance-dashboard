import { Moon, Sun, Shield, Eye } from 'lucide-react';
import useStore from '../store/useStore';

export default function Header() {
  const darkMode = useStore((s) => s.darkMode);
  const toggleDarkMode = useStore((s) => s.toggleDarkMode);
  const role = useStore((s) => s.role);
  const setRole = useStore((s) => s.setRole);
  const activeTab = useStore((s) => s.activeTab);
  const todayLabel = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }).format(new Date());

  return (
    <header className="h-16 border-b border-border/80 bg-surface/75 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-2 md:hidden">
        <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
          <span className="text-white text-sm font-bold">F</span>
        </div>
        <span className="font-bold text-text-primary font-display">FinanceHub</span>
      </div>

      <div className="hidden md:flex md:items-center md:gap-3">
        <div>
          <h1 className="text-lg font-semibold text-text-primary capitalize font-display leading-none">
            {activeTab}
          </h1>
          <p className="text-[11px] text-text-muted mt-1">Track. Analyze. Improve.</p>
        </div>
        <span className="text-[11px] px-2.5 py-1 rounded-full bg-surface-tertiary text-text-secondary border border-border">
          {todayLabel}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Role Toggle */}
        <div className="flex items-center bg-surface-tertiary rounded-lg p-0.5 border border-border/70">
          <button
            onClick={() => setRole('viewer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
              role === 'viewer'
                ? 'bg-surface text-primary-600 shadow-sm'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Viewer</span>
          </button>
          <button
            onClick={() => setRole('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
              role === 'admin'
                ? 'bg-surface text-primary-600 shadow-sm'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-9 h-9 rounded-lg bg-surface-tertiary flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer border border-border/70"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-semibold shadow-md shadow-primary-500/25">
          A
        </div>
      </div>
    </header>
  );
}
