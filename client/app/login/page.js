'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, Loader, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { clientApi } from '../utils/clientApi';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);

  // Redirect if session token already exists
  useEffect(() => {
    const savedToken = localStorage.getItem('pb_auth_token');
    if (savedToken) {
      verifyAndRedirect(savedToken);
    } else {
      setVerifying(false);
    }
  }, []);

  const verifyAndRedirect = async (authToken) => {
    try {
      const res = await clientApi.adminVerify(authToken);
      if (res && res.user) {
        if (res.user.role === 'admin') {
          toast.success('Admin session active. Redirecting...');
          router.push('/admin');
        } else {
          toast.success('User session active. Redirecting...');
          router.push('/dashboard');
        }
      } else {
        throw new Error('Invalid session payload');
      }
    } catch (err) {
      localStorage.removeItem('pb_auth_token');
      setVerifying(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      return toast.error('Please enter email/username and password');
    }
    setLoginLoading(true);
    try {
      const data = await clientApi.adminLogin(username, password);
      if (!data || !data.user || data.user.role !== 'admin') {
        throw new Error('Access denied. Administrator privileges required.');
      }
      localStorage.setItem('pb_auth_token', data.token);
      toast.success('Successfully logged in!');
      router.push('/admin');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen hero-bg flex flex-col items-center justify-center gap-4">
        <Loader className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-white/50 text-xs">Checking session authorization...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen hero-bg flex flex-col justify-between">
      <Navbar />

      <section className="mt-16 md:mt-20 py-24 px-4 flex-grow container relative flex items-center justify-center">
        {/* Neon Ambient glows */}
        <div className="absolute top-20 right-1/4 w-[400px] h-[300px] rounded-full bg-violet-600/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-20 left-1/4 w-[400px] h-[300px] rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />

        <div className="max-w-md w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass-card p-8 md:p-10 text-center relative overflow-hidden glow-purple-strong"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-transparent pointer-events-none" />
            
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-6 h-6 text-amber-400" />
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
              Admin Portal Login
            </h2>
            <p className="text-xs text-white/50 mb-8">Access restricted to authorized administrators only.</p>
            
            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Email or Username</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin or admin@example.com"
                    className="w-full bg-white/5 border border-white/10 hover:border-white/15 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 hover:border-white/15 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full btn-primary py-3 rounded-xl flex items-center justify-center font-bold text-xs cursor-pointer select-none active:scale-[0.98] transition-all"
              >
                {loginLoading ? <Loader className="w-4 h-4 animate-spin" /> : 'Log In to Dashboard'}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
