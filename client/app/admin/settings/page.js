'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, Globe, Image, ShieldCheck, Loader, Check } from 'lucide-react';
import { clientApi } from '../../utils/clientApi';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Settings State Form
  const [settings, setSettings] = useState({
    site_logo_text: '',
    site_logo_image: '',
    footer_description: '',
    footer_copyright: '',
    default_theme_mode: 'dark',
    
    // SEO
    seo_home_title: '',
    seo_home_description: '',
    seo_home_keywords: '',
    
    seo_generator_title: '',
    seo_generator_description: '',
    seo_generator_keywords: '',
    
    seo_collections_title: '',
    seo_collections_description: '',
    seo_collections_keywords: '',
    
    seo_blog_title: '',
    seo_blog_description: '',
    seo_blog_keywords: '',
    
    seo_about_title: '',
    seo_about_description: '',
    seo_about_keywords: ''
  });

  useEffect(() => {
    const savedToken = localStorage.getItem('pb_admin_token');
    if (savedToken) {
      setToken(savedToken);
      loadSettings();
    }
  }, []);

  const loadSettings = async () => {
    try {
      const data = await clientApi.fetchSettings();
      setSettings(prev => ({
        ...prev,
        ...data
      }));
    } catch (err) {
      console.error(err);
      toast.error('Failed to load site settings from database');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      await clientApi.adminUpdateSettings(token, settings);
      toast.success('Site settings and SEO tags saved successfully!');
      loadSettings();
    } catch (err) {
      toast.error('Failed to update settings parameters');
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return toast.error('Only image logo files are permitted');
    }

    const formData = new FormData();
    formData.append('image', file);

    setUploadingLogo(true);
    try {
      const res = await clientApi.adminUploadBlogImage(token, formData);
      setSettings(prev => ({
        ...prev,
        site_logo_image: res.url
      }));
      toast.success('Logo image uploaded successfully!');
    } catch (err) {
      toast.error(err.message || 'Logo upload failed');
      console.error(err);
    } finally {
      setUploadingLogo(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-slate-500 text-xs font-mono">Synchronizing site configurations...</p>
      </div>
    );
  }

  const apiHost = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  return (
    <div className="space-y-8">
      <form onSubmit={handleSettingsSubmit} className="space-y-8">
        
        {/* SECTION 1: GENERAL BRANDING & APPEARANCE */}
        <div className="admin-card space-y-6">
          <h3 className="admin-card-title flex items-center gap-2 pb-3 border-b border-slate-100">
            <Settings size={16} className="text-amber-500" /> Branding & General Appearance
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Text Config */}
            <div className="space-y-1">
              <label className="admin-label">Logo Branding Text</label>
              <input
                type="text"
                value={settings.site_logo_text}
                onChange={(e) => setSettings({ ...settings, site_logo_text: e.target.value })}
                placeholder="REVOXERA"
                className="admin-input"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Brand name shown next to logo icon in menus.</span>
            </div>

            {/* Default Theme mode */}
            <div className="space-y-1">
              <label className="admin-label">Default Theme Mode</label>
              <select
                value={settings.default_theme_mode}
                onChange={(e) => setSettings({ ...settings, default_theme_mode: e.target.value })}
                className="admin-select"
              >
                <option value="dark">Dark Theme (Default)</option>
                <option value="light">Light Theme</option>
                <option value="system">System Preference Default</option>
              </select>
              <span className="text-[10px] text-slate-400 mt-1 block">Theme assigned to first-time landing visitors.</span>
            </div>
          </div>

          {/* Logo File Upload Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="md:col-span-2 space-y-1">
              <label className="admin-label">Custom Logo Image</label>
              <div className="flex gap-3 items-center mt-1.5">
                <input
                  type="file"
                  accept="image/*"
                  id="logo-image-upload"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
                <label
                  htmlFor="logo-image-upload"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-slate-900 text-xs font-semibold cursor-pointer shadow-sm hover:shadow active:scale-95 transition-all select-none"
                >
                  {uploadingLogo ? (
                    <>
                      <Loader size={14} className="animate-spin text-amber-500" />
                      Uploading Logo...
                    </>
                  ) : (
                    <>
                      <Image size={14} className="text-amber-500" />
                      Upload Logo Image
                    </>
                  )}
                </label>

                {settings.site_logo_image ? (
                  <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-1.5">
                    <Check size={12} className="text-green-600" />
                    <span className="text-[10px] text-green-655 font-mono truncate max-w-[150px]">
                      {settings.site_logo_image}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, site_logo_image: '' })}
                      className="text-red-500 hover:text-red-700 text-[10px] ml-2 font-bold cursor-pointer bg-transparent border-none outline-none"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-400">No logo uploaded. Standard placeholder will show.</span>
                )}
              </div>
            </div>

            {settings.site_logo_image && (
              <div className="h-14 w-14 rounded-xl border border-slate-200 bg-slate-950 overflow-hidden flex items-center justify-center p-2 self-center ml-auto">
                <img
                  src={`${apiHost}${settings.site_logo_image}`}
                  alt="Logo Preview"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Footer Desc */}
            <div className="space-y-1">
              <label className="admin-label">Footer Section Description</label>
              <textarea
                value={settings.footer_description}
                onChange={(e) => setSettings({ ...settings, footer_description: e.target.value })}
                rows={3}
                placeholder="Developer tools designed to streamline daily programming..."
                className="admin-textarea text-xs"
              />
            </div>

            {/* Footer Copyright */}
            <div className="space-y-1">
              <label className="admin-label">Footer Copyright Notice</label>
              <input
                type="text"
                value={settings.footer_copyright}
                onChange={(e) => setSettings({ ...settings, footer_copyright: e.target.value })}
                placeholder="© 2026 Revoxera. All rights reserved."
                className="admin-input"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: SEARCH ENGINE OPTIMIZATION (SEO) */}
        <div className="admin-card space-y-6">
          <h3 className="admin-card-title flex items-center gap-2 pb-3 border-b border-slate-100">
            <Globe size={16} className="text-amber-500" /> Search Engine Optimization (SEO) Metadata
          </h3>

          <p className="text-[11px] text-slate-500 leading-relaxed bg-amber-500/5 border border-amber-500/10 p-3.5 rounded-xl">
            Configure dynamic title tags, meta descriptions, and query index keywords for all individual website pages.
          </p>

          <div className="space-y-8 divide-y divide-slate-100">
            {/* 1. Homepage SEO */}
            <div className="pt-6 first:pt-0 space-y-4">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Homepage SEO
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="admin-label">Title Tag</label>
                  <input
                    type="text"
                    value={settings.seo_home_title}
                    onChange={(e) => setSettings({ ...settings, seo_home_title: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="space-y-1">
                  <label className="admin-label">Meta Description</label>
                  <input
                    type="text"
                    value={settings.seo_home_description}
                    onChange={(e) => setSettings({ ...settings, seo_home_description: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="space-y-1">
                  <label className="admin-label">Keywords</label>
                  <input
                    type="text"
                    value={settings.seo_home_keywords}
                    onChange={(e) => setSettings({ ...settings, seo_home_keywords: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>
            </div>

            {/* 2. Generator SEO */}
            <div className="pt-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> AI Generator Page SEO
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="admin-label">Title Tag</label>
                  <input
                    type="text"
                    value={settings.seo_generator_title}
                    onChange={(e) => setSettings({ ...settings, seo_generator_title: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="space-y-1">
                  <label className="admin-label">Meta Description</label>
                  <input
                    type="text"
                    value={settings.seo_generator_description}
                    onChange={(e) => setSettings({ ...settings, seo_generator_description: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="space-y-1">
                  <label className="admin-label">Keywords</label>
                  <input
                    type="text"
                    value={settings.seo_generator_keywords}
                    onChange={(e) => setSettings({ ...settings, seo_generator_keywords: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>
            </div>

            {/* 3. Collections SEO */}
            <div className="pt-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Prompt Collections Page SEO
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="admin-label">Title Tag</label>
                  <input
                    type="text"
                    value={settings.seo_collections_title}
                    onChange={(e) => setSettings({ ...settings, seo_collections_title: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="space-y-1">
                  <label className="admin-label">Meta Description</label>
                  <input
                    type="text"
                    value={settings.seo_collections_description}
                    onChange={(e) => setSettings({ ...settings, seo_collections_description: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="space-y-1">
                  <label className="admin-label">Keywords</label>
                  <input
                    type="text"
                    value={settings.seo_collections_keywords}
                    onChange={(e) => setSettings({ ...settings, seo_collections_keywords: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>
            </div>

            {/* 4. Blog SEO */}
            <div className="pt-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Blog Articles Page SEO
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="admin-label">Title Tag</label>
                  <input
                    type="text"
                    value={settings.seo_blog_title}
                    onChange={(e) => setSettings({ ...settings, seo_blog_title: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="space-y-1">
                  <label className="admin-label">Meta Description</label>
                  <input
                    type="text"
                    value={settings.seo_blog_description}
                    onChange={(e) => setSettings({ ...settings, seo_blog_description: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="space-y-1">
                  <label className="admin-label">Keywords</label>
                  <input
                    type="text"
                    value={settings.seo_blog_keywords}
                    onChange={(e) => setSettings({ ...settings, seo_blog_keywords: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>
            </div>

            {/* 5. About Us SEO */}
            <div className="pt-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500" /> About Us Page SEO
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="admin-label">Title Tag</label>
                  <input
                    type="text"
                    value={settings.seo_about_title}
                    onChange={(e) => setSettings({ ...settings, seo_about_title: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="space-y-1">
                  <label className="admin-label">Meta Description</label>
                  <input
                    type="text"
                    value={settings.seo_about_description}
                    onChange={(e) => setSettings({ ...settings, seo_about_description: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="space-y-1">
                  <label className="admin-label">Keywords</label>
                  <input
                    type="text"
                    value={settings.seo_about_keywords}
                    onChange={(e) => setSettings({ ...settings, seo_about_keywords: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SUBMIT ACTIONS */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="submit"
            className="admin-btn-primary px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 text-xs"
          >
            <Save size={14} /> Save Site Configurations
          </button>
        </div>

      </form>
    </div>
  );
}
