'use client';

import { useState, useEffect } from 'react';
import { Info, Save, Loader } from 'lucide-react';
import { clientApi } from '../../utils/clientApi';
import toast from 'react-hot-toast';

export default function AdminAboutPage() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aboutSettings, setAboutSettings] = useState({
    about_title: '',
    about_description: '',
    about_story_title: '',
    about_story_content: ''
  });

  useEffect(() => {
    const savedToken = localStorage.getItem('pb_admin_token');
    if (savedToken) {
      setToken(savedToken);
      loadAboutSettings();
    }
  }, []);

  const loadAboutSettings = async () => {
    try {
      const settings = await clientApi.fetchSettings();
      setAboutSettings({
        about_title: settings.about_title || '',
        about_description: settings.about_description || '',
        about_story_title: settings.about_story_title || '',
        about_story_content: settings.about_story_content || ''
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to load About Us page settings');
    } finally {
      setLoading(false);
    }
  };

  const handleAboutSubmit = async (e) => {
    e.preventDefault();
    try {
      await clientApi.adminUpdateSettings(token, aboutSettings);
      toast.success('Dynamic About Us configurations saved!');
      loadAboutSettings();
    } catch (err) {
      toast.error('Failed to update About Us text');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-slate-500 text-xs font-mono">Loading About page content...</p>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <h3 className="admin-card-title flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
        <Info size={16} className="text-amber-500" /> Edit About Us Page Content
      </h3>
      
      <form onSubmit={handleAboutSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="admin-label">Hero Section Title</label>
          <input
            type="text"
            value={aboutSettings.about_title}
            onChange={(e) => setAboutSettings({ ...aboutSettings, about_title: e.target.value })}
            placeholder="About Revoxera AI..."
            className="admin-input"
          />
        </div>

        <div className="space-y-1">
          <label className="admin-label">Hero Mission Description</label>
          <textarea
            value={aboutSettings.about_description}
            onChange={(e) => setAboutSettings({ ...aboutSettings, about_description: e.target.value })}
            rows={3}
            placeholder="Describe your core mission statement here..."
            className="admin-textarea text-xs leading-relaxed"
          />
        </div>

        <div className="space-y-1">
          <label className="admin-label">Story Card Title</label>
          <input
            type="text"
            value={aboutSettings.about_story_title}
            onChange={(e) => setAboutSettings({ ...aboutSettings, about_story_title: e.target.value })}
            placeholder="The Story of Revoxera AI..."
            className="admin-input"
          />
        </div>

        <div className="space-y-1">
          <label className="admin-label">Detailed Core Story Text</label>
          <textarea
            value={aboutSettings.about_story_content}
            onChange={(e) => setAboutSettings({ ...aboutSettings, about_story_content: e.target.value })}
            rows={6}
            placeholder="Write your company core story here..."
            className="admin-textarea text-xs leading-relaxed"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="admin-btn-primary"
          >
            <Save size={14} /> Save Page Content
          </button>
        </div>
      </form>
    </div>
  );
}
