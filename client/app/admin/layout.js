'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Sliders, Cpu, LayoutGrid, BookOpen, PenSquare, Info, 
  UserCheck, LogOut, ChevronRight, Database, Activity, Loader, Sparkles, Settings, ExternalLink
} from 'lucide-react';
import { clientApi } from '../utils/clientApi';
import toast from 'react-hot-toast';
import './admin.css'; // Dedicated admin portal styles

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState({ name: 'Admin', email: 'admin@example.com' });

  // Check auth session
  useEffect(() => {
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    const savedToken = localStorage.getItem('pb_admin_token');
    if (savedToken) {
      setToken(savedToken);
      verifySession(savedToken);
    } else {
      router.push('/admin/login');
    }
  }, [pathname]);

  const verifySession = async (authToken) => {
    try {
      const res = await clientApi.adminVerify(authToken);
      if (res && res.user) {
        setAdminUser({
          name: res.user.name || 'Admin',
          email: res.user.email || 'admin@example.com'
        });
      }
    } catch (err) {
      console.error('Session expired:', err);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('pb_admin_token');
    setToken(null);
    toast.success('Logged out successfully');
    router.push('/admin/login');
  };

  // Determine active tab/menu key based on current pathname
  const getActiveTab = () => {
    if (pathname === '/admin') return 'overview';
    if (pathname.includes('/admin/models')) return 'models';
    if (pathname.includes('/admin/presets')) return 'collections';
    if (pathname.includes('/admin/settings')) return 'settings';
    if (pathname.includes('/admin/blogs/create')) return 'create-blog';
    if (pathname.includes('/admin/blogs')) return 'blog';
    if (pathname.includes('/admin/about')) return 'about';
    return '';
  };

  const getTabLabel = () => {
    const tab = getActiveTab();
    switch (tab) {
      case 'overview': return 'Overview & Statistics';
      case 'models': return 'LLM Providers Models';
      case 'collections': return 'Prompt Preset Collections';
      case 'settings': return 'Site Branding & SEO Configuration';
      case 'blog': return 'Manage Blog Articles';
      case 'create-blog': return pathname.includes('edit') || pathname.includes('?edit') ? 'Edit Blog Article' : 'Write New Article';
      case 'about': return 'About Us Page Content';
      default: return 'Management Console';
    }
  };

  // If loading or login page, adjust accordingly
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex flex-col items-center justify-center gap-4">
        <Loader className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-slate-500 text-xs font-mono">Verifying authorization parameters...</p>
      </div>
    );
  }

  const activeTab = getActiveTab();

  return (
    <div className="admin-layout-wrapper">
      
      {/* ── SIDEBAR COMPONENT ── */}
      <aside className="admin-sidebar">
        <div>
          {/* Logo Brand Header */}
          <div className="admin-sidebar-header">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-950/40">
              <Sparkles size={18} className="text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white font-mono">REVOXERA</h1>
              <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Admin Console</span>
            </div>
          </div>

          {/* Visit Main Site Shortcut */}
          <div className="px-4 pt-4">
            <button
              onClick={() => window.open('/', '_blank')}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-slate-350 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all cursor-pointer active:scale-95"
            >
              <ExternalLink size={12} className="text-amber-500" /> Visit Main Site
            </button>
          </div>

          {/* Navigation Menus */}
          <div className="admin-sidebar-menu space-y-6">
            <div>
              <span className="admin-sidebar-label">
                Core Control
              </span>
              <nav className="space-y-1">
                <button
                  onClick={() => router.push('/admin')}
                  className={`admin-menu-item ${activeTab === 'overview' ? 'active' : ''}`}
                >
                  <Sliders size={14} /> System Overview
                </button>

                <button
                  onClick={() => router.push('/admin/models')}
                  className={`admin-menu-item ${activeTab === 'models' ? 'active' : ''}`}
                >
                  <Cpu size={14} /> LLM Models
                </button>

                <button
                  onClick={() => router.push('/admin/presets')}
                  className={`admin-menu-item ${activeTab === 'collections' ? 'active' : ''}`}
                >
                  <LayoutGrid size={14} /> Prompt Presets
                </button>

                <button
                  onClick={() => router.push('/admin/settings')}
                  className={`admin-menu-item ${activeTab === 'settings' ? 'active' : ''}`}
                >
                  <Settings size={14} /> Site Settings
                </button>
              </nav>
            </div>

            <div>
              <span className="admin-sidebar-label">
                Content Management
              </span>
              <nav className="space-y-1">
                <button
                  onClick={() => router.push('/admin/blogs')}
                  className={`admin-menu-item ${activeTab === 'blog' ? 'active' : ''}`}
                >
                  <BookOpen size={14} /> Manage Blogs
                </button>

                <button
                  onClick={() => router.push('/admin/blogs/create')}
                  className={`admin-menu-item ${activeTab === 'create-blog' ? 'active' : ''}`}
                >
                  <PenSquare size={14} /> Write New Article
                </button>

                <button
                  onClick={() => router.push('/admin/about')}
                  className={`admin-menu-item ${activeTab === 'about' ? 'active' : ''}`}
                >
                  <Info size={14} /> About Page Settings
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Sidebar Footer - Account Panel */}
        <div className="admin-sidebar-footer">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <UserCheck size={14} className="text-amber-400" />
            </div>
            <div className="min-w-0 flex-1 text-slate-300">
              <div className="text-xs font-bold truncate">{adminUser.name}</div>
              <div className="text-[9px] opacity-60 truncate">{adminUser.email}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-550/15 rounded-xl transition-all cursor-pointer active:scale-95"
          >
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── WORKSPACE AREA ── */}
      <main className="admin-workspace">
        
        {/* ── HEADER COMPONENT ── */}
        <header className="admin-header">
          <div>
            <div className="admin-header-subtitle">
              <span>Admin Console</span>
              <ChevronRight size={10} />
              <span className="text-slate-400">{activeTab}</span>
            </div>
            <h2 className="admin-header-title">{getTabLabel()}</h2>
          </div>

          {/* System Health Indicators */}
          <div className="flex items-center gap-4">
            <div className="admin-header-badge">
              <Database size={12} className="text-green-500 animate-pulse" />
              <span>DB Connected</span>
            </div>
            
            <div className="admin-header-badge">
              <Activity size={12} className="text-blue-500" />
              <span>Server: Live</span>
            </div>
          </div>
        </header>

        {/* ── MAIN CONTENT CONTAINER ── */}
        <section className="admin-content-container">
          {children}
        </section>

        {/* ── ADMIN FOOTER COMPONENT ── */}
        <footer className="admin-footer">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Revoxera AI Management Console • Version 1.2.0</span>
            <span>Secured Session • Dynamic Database Integration</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
