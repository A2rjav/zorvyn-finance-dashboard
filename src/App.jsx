import { useEffect } from 'react';
import useStore from './store/useStore';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Insights from './pages/Insights';
import MobileNav from './components/MobileNav';

export default function App() {
  const darkMode = useStore((s) => s.darkMode);
  const activeTab = useStore((s) => s.activeTab);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const pages = {
    dashboard: <Dashboard />,
    transactions: <Transactions />,
    insights: <Insights />,
  };

  return (
    <div className="relative isolate flex h-screen bg-surface-secondary overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 -left-28 h-80 w-80 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute top-1/3 -right-36 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>
      <Sidebar />
      <div className="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          {pages[activeTab]}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
