import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Settings, 
  LayoutTemplate, 
  BookOpen, 
  HelpCircle, 
  BarChart3, 
  Award, 
  FileText, 
  QrCode, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X,
  Database,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout, isMockAuth } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Madrasa Settings', path: '/admin/settings', icon: Settings },
    { name: 'Homepage Sections', path: '/admin/homepage', icon: LayoutTemplate },
    { name: 'Educational Programs', path: '/admin/programs', icon: BookOpen },
    { name: 'Current Needs', path: '/admin/problems', icon: HelpCircle },
    { name: 'Student Statistics', path: '/admin/statistics', icon: BarChart3 },
    { name: 'Student Activities', path: '/admin/activities', icon: Award },
    { name: 'Legal Documents', path: '/admin/documents', icon: FileText },
    { name: 'Donation & QR Settings', path: '/admin/donation', icon: QrCode },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Top Warning Banner if in Mock/Offline mode */}
      {isMockAuth && (
        <div className="bg-amber-500 text-stone-950 px-4 py-2 text-xs font-semibold flex items-center justify-between border-b border-amber-600">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <AlertTriangle className="w-4 h-4 shrink-0 text-stone-950" />
            <span>
              <strong>Local Preview Mode:</strong> Supabase credentials are not detected in <code className="bg-amber-600/30 px-1.5 py-0.5 rounded text-[11px]">.env</code>. All edits are saved reactively to local storage for testing. To connect to live PostgreSQL, configure <code className="bg-amber-600/30 px-1.5 py-0.5 rounded text-[11px]">VITE_SUPABASE_URL</code> and <code className="bg-amber-600/30 px-1.5 py-0.5 rounded text-[11px]">VITE_SUPABASE_ANON_KEY</code>.
            </span>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-64 bg-stone-900 text-stone-200 border-r border-stone-800">
          {/* Brand header */}
          <div className="p-6 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center text-amber-400 font-bold text-lg shadow-sm">
                م
              </div>
              <div>
                <span className="font-extrabold text-sm text-white block">Madrasa Portal</span>
                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Admin Suite
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-emerald-800 text-white shadow-xs font-bold'
                        : 'text-stone-400 hover:text-white hover:bg-stone-800'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Bottom user card */}
          <div className="p-4 border-t border-stone-800 space-y-3">
            <div className="px-2">
              <span className="text-[11px] text-stone-400 block truncate">
                {user?.email || 'admin@madrasa.org'}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                {isMockAuth ? 'Mock Administrator' : 'Verified Supabase Admin'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/"
                target="_blank"
                className="flex-1 py-2 px-3 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Live Site</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-stone-800 hover:bg-red-900/60 text-stone-400 hover:text-red-200 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Header and Drawer */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-50 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div 
              className="w-64 h-full bg-stone-900 text-stone-200 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-stone-800 flex items-center justify-between">
                <span className="font-bold text-white text-sm">Madrasa Admin</span>
                <button onClick={() => setSidebarOpen(false)} className="text-stone-400">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.exact}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                          isActive ? 'bg-emerald-800 text-white' : 'text-stone-400 hover:bg-stone-800'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-stone-800">
                <button
                  onClick={handleLogout}
                  className="w-full py-2 bg-red-900/60 hover:bg-red-900 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Admin Header */}
          <header className="bg-white border-b border-stone-200 px-3.5 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2 text-xs font-medium text-stone-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="truncate">Institutional Management System</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/"
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition-colors"
              >
                <span>View Public Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </header>

          {/* Page Outlet */}
          <main className="p-3.5 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
