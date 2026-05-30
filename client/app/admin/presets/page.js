'use client';

import { useState, useEffect } from 'react';
import { LayoutGrid, Save, Edit2, Trash2, Loader } from 'lucide-react';
import { clientApi } from '../../utils/clientApi';
import toast from 'react-hot-toast';

export default function AdminPresetsPage() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);
  const [collectionForm, setCollectionForm] = useState({ title: '', prompt_text: '', category: 'Coding' });
  const [editingCollectionId, setEditingCollectionId] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('pb_auth_token');
    if (savedToken) {
      setToken(savedToken);
      loadCollections();
    }
  }, []);

  const loadCollections = async () => {
    try {
      const collectionsData = await clientApi.fetchCollections();
      setCollections(collectionsData);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load collections gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleCollectionSubmit = async (e) => {
    e.preventDefault();
    if (!collectionForm.title || !collectionForm.prompt_text) {
      return toast.error('Please enter both title and prompt template');
    }
    try {
      if (editingCollectionId) {
        await clientApi.adminUpdateCollection(token, editingCollectionId, collectionForm);
        toast.success('Prompt template modified!');
      } else {
        await clientApi.adminCreateCollection(token, collectionForm);
        toast.success('Added preset to collections gallery!');
      }
      setCollectionForm({ title: '', prompt_text: '', category: 'Coding' });
      setEditingCollectionId(null);
      loadCollections();
    } catch (err) {
      toast.error(err.message || 'Action failed');
    }
  };

  const startEditCollection = (coll) => {
    setEditingCollectionId(coll.id);
    setCollectionForm({
      title: coll.title,
      prompt_text: coll.prompt_text,
      category: coll.category
    });
  };

  const handleDeleteCollection = async (id) => {
    if (!confirm('Remove this template from prompt collections?')) return;
    try {
      await clientApi.adminDeleteCollection(token, id);
      toast.success('Collection preset deleted');
      loadCollections();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-slate-500 text-xs font-mono">Loading preset gallery...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Preset Creation Form */}
      <div className="admin-card">
        <h3 className="admin-card-title flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
          <LayoutGrid size={16} className="text-amber-500" />
          {editingCollectionId ? 'Update Preset Instruction' : 'Add New Instruction Preset'}
        </h3>

        <form onSubmit={handleCollectionSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="admin-label">Title / Focus Area</label>
              <input
                type="text"
                value={collectionForm.title}
                onChange={(e) => setCollectionForm({ ...collectionForm, title: e.target.value })}
                placeholder="SEO Outline Generator..."
                className="admin-input"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="admin-label">Category Tag</label>
              <select
                value={collectionForm.category}
                onChange={(e) => setCollectionForm({ ...collectionForm, category: e.target.value })}
                className="admin-select"
              >
                <option value="Coding">Coding</option>
                <option value="Marketing">Marketing</option>
                <option value="SEO">SEO</option>
                <option value="Design">Design</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="admin-label">Prompt Template Instructions</label>
            <textarea
              value={collectionForm.prompt_text}
              onChange={(e) => setCollectionForm({ ...collectionForm, prompt_text: e.target.value })}
              rows={5}
              placeholder="You are an expert engineer... Refactor following snippet:"
              className="admin-textarea font-mono text-xs leading-relaxed"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            {editingCollectionId && (
              <button
                type="button"
                onClick={() => {
                  setEditingCollectionId(null);
                  setCollectionForm({ title: '', prompt_text: '', category: 'Coding' });
                }}
                className="admin-btn-secondary"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="admin-btn-primary"
            >
              <Save size={13} /> {editingCollectionId ? 'Update Preset' : 'Publish Preset'}
            </button>
          </div>
        </form>
      </div>

      {/* Registered Collections presets list */}
      <div className="admin-card">
        <h3 className="admin-card-title flex items-center gap-2 pb-3 border-b border-slate-100 mb-4 font-bold">Presets Gallery</h3>
        <div className="space-y-2">
          {collections.map(c => (
            <div key={c.id} className="admin-list-row items-start">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-amber-550/10 border border-amber-500/20 text-amber-600 uppercase font-mono tracking-wider">
                    {c.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 truncate">{c.title}</h4>
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-2 font-mono whitespace-pre-wrap">{c.prompt_text}</p>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => startEditCollection(c)}
                  className="admin-btn-edit-icon"
                >
                  <Edit2 size={11} />
                </button>
                <button
                  onClick={() => handleDeleteCollection(c.id)}
                  className="admin-btn-danger-icon"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
