'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Key, Bookmark, ShieldAlert, ArrowRight, User,
  Trash2, LogOut, Check, Copy, KeyRound, UserCheck, Lock,
  Activity, ArrowLeft, RefreshCw, Terminal, Eye, EyeOff, Loader, ChevronRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SeoHeader from '../components/SeoHeader';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { clientApi } from '../utils/clientApi';

export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);

  // Form Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  // Dashboard Data State
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [limits, setLimits] = useState({ limit_count: 20, used_count: 0, reset_at: null });
  const [apiKeys, setApiKeys] = useState([]);
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState('');

  // UI state
  const [activeTab, setActiveTab] = useState('saved'); // 'saved', 'limits', 'keys'
  const [copiedPromptId, setCopiedPromptId] = useState(null);
  const [copiedKeyId, setCopiedKeyId] = useState(null);
  const [showKeyText, setShowKeyText] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('pb_auth_token');
      if (storedToken) {
        setToken(storedToken);
        verifyAndLoadData(storedToken);
      } else {
        setLoading(false);
      }
    }
  }, []);

  const verifyAndLoadData = async (authToken) => {
    try {
      const verifyRes = await clientApi.adminVerify(authToken);
      setUser(verifyRes.user);

      // Redirect directly to admin management portal if role matches
      if (verifyRes.user && verifyRes.user.role === 'admin') {
        toast.success('Admin authenticated. Redirecting to admin console...');
        router.push('/admin');
        return;
      }

      // Load dashboard information
      const [saved, userLimits, keys] = await Promise.all([
        clientApi.fetchSavedPrompts(authToken),
        clientApi.fetchUserLimits(authToken),
        clientApi.fetchApiKeys(authToken)
      ]);

      setSavedPrompts(saved);
      setLimits(userLimits);
      setApiKeys(keys);
    } catch (err) {
      console.error('Session verification failed, logging out:', err);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password || loggingIn) return;

    setLoggingIn(true);
    try {
      const res = await clientApi.adminLogin(email, password);
      localStorage.setItem('pb_auth_token', res.token);
      setToken(res.token);
      toast.success('Successfully logged in! Welcome back.');
      await verifyAndLoadData(res.token);
    } catch (err) {
      toast.error(err.message || 'Login failed. Check your email and password.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      return toast.error('All fields are required.');
    }
    if (loggingIn) return;

    setLoggingIn(true);
    try {
      const res = await clientApi.userRegister(name, email, password);
      localStorage.setItem('pb_auth_token', res.token);
      setToken(res.token);
      toast.success('Successfully registered! Welcome to your developer console.');
      await verifyAndLoadData(res.token);
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('pb_auth_token');
    setToken(null);
    setUser(null);
    setSavedPrompts([]);
    setApiKeys([]);
    setNewlyGeneratedKey('');
    toast.success('Session closed successfully.');
  };

  const handleGenerateKey = async () => {
    if (!token) return;
    try {
      const res = await clientApi.generateApiKey(token);
      setNewlyGeneratedKey(res.key);
      setShowKeyText(true);
      // Reload keys
      const keys = await clientApi.fetchApiKeys(token);
      setApiKeys(keys);
      toast.success('New API developer key generated!');
    } catch (err) {
      toast.error('Failed to generate key.');
    }
  };

  const handleUnsave = async (promptId) => {
    if (!token) return;
    try {
      await clientApi.toggleSavePrompt(token, promptId);
      setSavedPrompts(prev => prev.filter(p => p.id !== promptId));
      toast.success('Prompt unsaved.');
    } catch (err) {
      toast.error('Failed to unsave prompt.');
    }
  };

  const copyPromptText = async (text, id) => {
    await navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    toast.success('Prompt copied!');
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const copyKeyText = async (text, id) => {
    await navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    toast.success('API Key copied!');
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  return (
    <main className="min-h-screen hero-bg">
      <SeoHeader pageKey="pricing" /> {/* Uses pricing meta as fallback */}
      <Navbar />

      <section className="mt-16 md:mt-20 py-24 px-4 container relative">
        <div className="absolute top-20 right-1/4 w-[450px] h-[350px] rounded-full bg-amber-600/5 blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 select-none">
              <Loader className="w-8 h-8 text-amber-500 animate-spin" />
              <p className="text-sm text-white/50">Decrypting account data...</p>
            </div>
          ) : !token ? (
            /* ── LOGIN/REGISTER FORM CARD ── */
            <div className="max-w-md mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-600/5 to-purple-600/5 rounded-3xl blur-2xl -z-10" />

              <div className="glass-card p-8 space-y-6">
                <div className="text-center select-none">
                  <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Lock className="text-amber-500" size={20} />
                  </div>
                  <h1 className="text-xl font-bold text-white mb-2">
                    {authMode === 'login' ? 'Access Developer Console' : 'Create Developer Account'}
                  </h1>
                  <p className="text-xs text-white/50 leading-relaxed">
                    {authMode === 'login'
                      ? 'Log in to test saved prompts, view programmatic API keys, and track limits.'
                      : 'Sign up to start saving prompt presets, tracking API metrics, and generating keys.'}
                  </p>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10 select-none">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${authMode === 'login'
                        ? 'border-amber-500 text-white'
                        : 'border-transparent text-white/40 hover:text-white/60'
                      }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${authMode === 'register'
                        ? 'border-amber-500 text-white'
                        : 'border-transparent text-white/40 hover:text-white/60'
                      }`}
                  >
                    Register
                  </button>
                </div>

                <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-4">
                  {authMode === 'register' && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Full Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 hover:border-white/15 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-650 outline-none transition-all"
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Email Address</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 hover:border-white/15 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-650 outline-none transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 hover:border-white/15 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-650 outline-none transition-all"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loggingIn}
                    className="w-full flex items-center justify-center gap-2 btn-primary rounded-xl py-3 text-xs font-bold transition-all disabled:opacity-50 select-none cursor-pointer active:scale-98"
                  >
                    {loggingIn ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" /> {authMode === 'login' ? 'Verifying...' : 'Creating Account...'}
                      </>
                    ) : (
                      <>
                        {authMode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </form>

                {/* {authMode === 'login' && (
                  <div className="border-t border-white/5 pt-4 text-center select-none">
                    <span className="text-[10px] text-white/35 font-bold uppercase tracking-wider block mb-1">Pre-seeded Credentials</span>
                    <code className="text-[10px] text-amber-400 bg-amber-500/10 px-2.5 py-1.5 rounded-lg border border-amber-500/20 block select-all font-mono">
                      admin@example.com / admin123
                    </code>
                  </div>
                )} */}
              </div>
            </div>
          ) : (
            /* ── DASHBOARD PLATFORM PANEL ── */
            <div className="space-y-8">
              {/* Header profile row */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 border border-white/5 p-6 rounded-2xl select-none">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <User className="text-amber-500" size={18} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {user?.name || 'Developer'}
                      {user?.role === 'admin' ? (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono font-medium">Administrator</span>
                      ) : (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-medium">Verified Account</span>
                      )}
                    </h2>
                    <p className="text-[11px] text-white/40">{user?.email || 'admin@example.com'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-1.5 text-xs text-amber-450 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-4 py-2.5 rounded-xl border border-amber-500/20 transition-all font-bold cursor-pointer"
                    >
                      <Sparkles size={13} fill="currentColor" className="text-amber-400" /> Admin Portal
                    </Link>
                  )}

                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/5 transition-all cursor-pointer"
                  >
                    <LogOut size={13} /> Sign Out
                  </button>
                </div>
              </div>

              {/* Administrator Quick Portal Banner */}
              {user?.role === 'admin' && (
                <div className="bg-gradient-to-r from-amber-500/10 via-purple-600/10 to-transparent border border-amber-500/20 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 select-none">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                      <ShieldAlert size={14} /> System Administrator Portal
                    </h3>
                    <p className="text-xs text-white/60 leading-relaxed font-sans">
                      You are logged in with system administrator privileges. Access the site management dashboard to customize settings, configure AI providers and models, draft blogs, or modify collection presets.
                    </p>
                  </div>
                  <Link
                    href="/admin"
                    className="flex-shrink-0 flex items-center gap-1.5 btn-primary px-5 py-3 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/10 active:scale-98 transition-all"
                  >
                    Manage Platform <ArrowRight size={13} />
                  </Link>
                </div>
              )}

              {/* Grid: Nav tabs on left, stats overview on right */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">

                {/* Navigation Menu */}
                <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 select-none">
                  <button
                    onClick={() => setActiveTab('saved')}
                    className={`flex-1 md:flex-initial flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${activeTab === 'saved'
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'
                      }`}
                  >
                    <Bookmark size={13} /> Saved Prompts ({savedPrompts.length})
                  </button>

                  <button
                    onClick={() => setActiveTab('limits')}
                    className={`flex-1 md:flex-initial flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${activeTab === 'limits'
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'
                      }`}
                  >
                    <Activity size={13} /> Usage Limits
                  </button>

                  <button
                    onClick={() => setActiveTab('keys')}
                    className={`flex-1 md:flex-initial flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${activeTab === 'keys'
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'
                      }`}
                  >
                    <Key size={13} /> API Key Access
                  </button>
                </div>

                {/* Main Tab Content Panel */}
                <div className="md:col-span-3">

                  {/* TAB 1: SAVED PROMPTS */}
                  {activeTab === 'saved' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between select-none">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Saved Prompts Library</h3>
                        <Link href="/prompt-collections" className="text-xs text-amber-400 hover:underline flex items-center gap-1">Browse Prompts <ChevronRight size={12} /></Link>
                      </div>

                      {savedPrompts.length === 0 ? (
                        <div className="glass-card p-12 text-center select-none space-y-4">
                          <Bookmark size={32} className="text-white/20 mx-auto" />
                          <p className="text-xs text-white/50">You do not have any saved prompts yet.</p>
                          <Link href="/prompt-collections" className="inline-block bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold text-white hover:bg-white/10">Browse Prompts</Link>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {savedPrompts.map(p => (
                            <div key={p.id} className="glass-card p-5 border border-white/5 flex flex-col justify-between hover:border-amber-500/20 transition-all duration-300">
                              <div>
                                <div className="flex items-center justify-between mb-3 select-none">
                                  <span className="text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider text-amber-400 bg-amber-500/10 border-amber-500/20">
                                    {p.category}
                                  </span>
                                  <button
                                    onClick={() => handleUnsave(p.id)}
                                    className="p-1 rounded bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/25 transition-all cursor-pointer"
                                    title="Unsave prompt"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                                <h4 className="text-xs font-bold text-white mb-2 leading-snug">{p.title}</h4>
                                <p className="text-[11px] text-white/50 leading-relaxed mb-4">{p.description}</p>
                              </div>

                              <div className="flex items-center justify-between pt-3.5 border-t border-white/5 mt-auto">
                                <button
                                  onClick={() => copyPromptText(p.prompt_text, p.id)}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold text-white border border-white/5 cursor-pointer"
                                >
                                  {copiedPromptId === p.id ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
                                  <span>Copy</span>
                                </button>

                                <Link
                                  href={`/generator?prompt=${encodeURIComponent(p.prompt_text)}`}
                                  className="flex items-center gap-1 text-[10px] font-bold text-amber-400 hover:underline"
                                >
                                  Run in Optimizer <Sparkles size={10} fill="currentColor" />
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: USAGE LIMITS */}
                  {activeTab === 'limits' && (
                    <div className="glass-card p-6 md:p-8 space-y-6">
                      <div className="select-none">
                        <h3 className="text-sm font-bold text-white mb-1">Daily Usage API Credits</h3>
                        <p className="text-xs text-white/50 leading-relaxed">
                          Your profile is allocated a complimentary daily threshold of prompt optimizations. Limits refresh every 24 hours.
                        </p>
                      </div>

                      {/* visual limit bar */}
                      <div className="space-y-2 select-none">
                        <div className="flex items-center justify-between text-xs font-mono font-semibold">
                          <span className="text-white/60">Optimizations Used</span>
                          <span className="text-white">{limits.used_count} / {limits.limit_count}</span>
                        </div>

                        <div className="w-full h-3 bg-white/5 border border-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                            style={{ width: `${Math.min((limits.used_count / limits.limit_count) * 100, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-4 flex flex-wrap items-center justify-between gap-4 text-xs select-none">
                        <span className="text-white/40 font-medium">Automatic reset at:</span>
                        <span className="font-mono font-bold text-white/80">
                          {limits.reset_at ? new Date(limits.reset_at).toLocaleString() : 'Loading reset timeframe...'}
                        </span>
                      </div>

                      <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 flex items-start gap-3">
                        <ShieldAlert size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                        <p className="text-[10px] text-white/50 leading-relaxed">
                          Need unlimited requests or concurrent API threads? Programmatic API integration plans are coming soon. Generate custom developer keys in the API Key tab to begin testing endpoints locally.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: API KEYS */}
                  {activeTab === 'keys' && (
                    <div className="space-y-6">
                      <div className="glass-card p-6 border border-white/5 space-y-6">
                        <div className="select-none">
                          <h3 className="text-sm font-bold text-white mb-1">Developer API Integrations</h3>
                          <p className="text-xs text-white/50 leading-relaxed">
                            Generate unique authorization tokens to request optimized prompts programmatically using Python scripts, node wrappers, or curl triggers.
                          </p>
                        </div>

                        <div className="flex justify-end select-none">
                          <button
                            onClick={handleGenerateKey}
                            className="flex items-center gap-2 btn-primary rounded-xl px-5 py-3 text-xs font-bold cursor-pointer active:scale-95"
                          >
                            <KeyRound size={13} /> Generate New Key
                          </button>
                        </div>

                        {newlyGeneratedKey && (
                          <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-5 space-y-3">
                            <div className="flex items-center justify-between text-[10px] font-bold text-amber-400 uppercase tracking-wider select-none">
                              <span>Newly Created API Authorization Key</span>
                              <span className="text-red-400 lowercase">! Will only show once</span>
                            </div>

                            <div className="flex items-center gap-3">
                              <code className="flex-1 font-mono text-[11px] bg-black/40 border border-white/5 px-3 py-2 rounded-lg text-white select-all overflow-x-auto whitespace-nowrap">
                                {showKeyText ? newlyGeneratedKey : '••••••••••••••••••••••••••••••••••••••••••••'}
                              </code>
                              <button
                                onClick={() => setShowKeyText(!showKeyText)}
                                className="p-2 bg-white/5 border border-white/5 text-white/50 hover:text-white rounded-lg cursor-pointer"
                              >
                                {showKeyText ? <EyeOff size={13} /> : <Eye size={13} />}
                              </button>
                              <button
                                onClick={() => copyKeyText(newlyGeneratedKey, 'new')}
                                className="p-2 bg-white/5 border border-white/5 text-white/50 hover:text-white rounded-lg cursor-pointer"
                              >
                                <Copy size={13} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Key List table */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 select-none">Active Keys List</h4>

                        {apiKeys.length === 0 ? (
                          <div className="glass-card p-6 text-center select-none text-xs text-white/40 italic">
                            No developer keys generated yet. Click key generator button to initialize one.
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-white/70 border-collapse">
                              <thead>
                                <tr className="border-b border-white/5 text-[10px] text-white/45 font-bold uppercase tracking-wider">
                                  <th className="py-3 px-4">Secret Masked Key</th>
                                  <th className="py-3 px-4">Status</th>
                                  <th className="py-3 px-4">Created Date</th>
                                  <th className="py-3 px-4 text-right">Copy</th>
                                </tr>
                              </thead>
                              <tbody>
                                {apiKeys.map(k => (
                                  <tr key={k.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                                    <td className="py-3 px-4 font-mono">{k.key}</td>
                                    <td className="py-3 px-4">
                                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${k.is_active
                                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                                          : 'bg-red-500/10 border border-red-500/20 text-red-400'
                                        }`}>
                                        {k.is_active ? 'Active' : 'Revoked'}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 text-white/40">
                                      {new Date(k.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                      <button
                                        onClick={() => copyKeyText(k.key, k.id)}
                                        className="p-1.5 bg-white/5 border border-white/5 text-white/40 hover:text-white rounded hover:bg-white/10 cursor-pointer"
                                      >
                                        {copiedKeyId === k.id ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />

      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-[#0d0d15] border border-white/10 p-6 rounded-2xl max-w-sm w-full text-center space-y-4 shadow-2xl select-none"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-500">
                <LogOut size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white font-mono">Confirm Sign Out</h3>
                <p className="text-xs text-white/50 leading-relaxed font-sans">
                  Are you sure you want to end your developer console session? You will need to log back in to access saved presets.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white border border-white/5 cursor-pointer active:scale-98 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    handleLogout();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-red-650 hover:bg-red-600 text-xs font-bold text-white border border-red-550/20 cursor-pointer active:scale-98 transition-all bg-red-600"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
