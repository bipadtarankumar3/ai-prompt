'use client';

import { useState, useEffect } from 'react';
import { Sliders, Loader } from 'lucide-react';
import { clientApi } from '../utils/clientApi';
import toast from 'react-hot-toast';

export default function AdminOverview() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [globalAIActive, setGlobalAIActive] = useState(true);
  const [counts, setCounts] = useState({ models: 0, activeModels: 0, collections: 0, blogs: 0 });

  useEffect(() => {
    const savedToken = localStorage.getItem('pb_auth_token');
    if (savedToken) {
      setToken(savedToken);
      loadOverviewData(savedToken);
    }
  }, []);

  const loadOverviewData = async (authToken) => {
    try {
      // Fetch settings
      const settings = await clientApi.fetchSettings();
      setGlobalAIActive(settings.global_ai_active === 'true');

      // Fetch counts from endpoints
      const modelsData = await clientApi.adminGetModels(authToken);
      const collectionsData = await clientApi.fetchCollections();
      const blogsData = await clientApi.fetchBlogs();

      setCounts({
        models: modelsData.length,
        activeModels: modelsData.filter(m => m.is_active).length,
        collections: collectionsData.length,
        blogs: blogsData.length
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to load system metrics');
    } finally {
      setLoading(false);
    }
  };

  const toggleGlobalAI = async () => {
    const nextVal = !globalAIActive;
    try {
      await clientApi.adminUpdateSettings(token, { global_ai_active: String(nextVal) });
      setGlobalAIActive(nextVal);
      toast.success(`Global AI generation is now ${nextVal ? 'ENABLED' : 'DISABLED'}`);
    } catch (err) {
      toast.error('Failed to update toggle setting');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-slate-500 text-xs font-mono">Synchronizing overview details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Master Switch Panel */}
      <div className="admin-card space-y-6">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
          <Sliders size={16} className="text-amber-500" /> System Control Switches
        </h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div>
            <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
              {globalAIActive ? (
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              ) : (
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              )}
              Global AI Prompt Generation Gateway
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              When switched OFF, all frontend user prompt generators are disabled and request API proxying is blocked.
            </p>
          </div>
          
          <button
            onClick={toggleGlobalAI}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer select-none transition-all active:scale-95 border ${
              globalAIActive 
                ? 'bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20' 
                : 'bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20'
            }`}
          >
            {globalAIActive ? 'System Gateway: OPEN' : 'System Gateway: BLOCKED'}
          </button>
        </div>
      </div>

      {/* Summary Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="admin-card hover:border-amber-500/20 transition-all">
          <div className="text-slate-550 text-[10px] font-bold uppercase tracking-wider">Configured Models</div>
          <div className="text-3xl font-extrabold text-slate-800 mt-2 font-mono">{counts.models}</div>
          <p className="text-[10px] text-slate-500 mt-1">{counts.activeModels} active models in generator</p>
        </div>
        <div className="admin-card hover:border-amber-500/20 transition-all">
          <div className="text-slate-555 text-[10px] font-bold uppercase tracking-wider">Presets Gallery</div>
          <div className="text-3xl font-extrabold text-slate-800 mt-2 font-mono">{counts.collections}</div>
          <p className="text-[10px] text-slate-500 mt-1">Prompt layout templates sorted dynamically</p>
        </div>
        <div className="admin-card hover:border-amber-500/20 transition-all">
          <div className="text-slate-555 text-[10px] font-bold uppercase tracking-wider">Published Articles</div>
          <div className="text-3xl font-extrabold text-slate-800 mt-2 font-mono">{counts.blogs}</div>
          <p className="text-[10px] text-slate-500 mt-1">Live blog posts with image uploads</p>
        </div>
      </div>
    </div>
  );
}
