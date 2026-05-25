'use client';

import { useState, useEffect } from 'react';
import { Cpu, Sparkles, Bot, Save, Edit2, Trash2, Loader } from 'lucide-react';
import { clientApi } from '../../utils/clientApi';
import toast from 'react-hot-toast';

export default function AdminModelsPage() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState([]);
  const [modelForm, setModelForm] = useState({ name: '', provider: 'gemini', api_model_code: '', is_active: true });
  const [editingModelId, setEditingModelId] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('pb_admin_token');
    if (savedToken) {
      setToken(savedToken);
      loadModels(savedToken);
    }
  }, []);

  const loadModels = async (authToken) => {
    try {
      const data = await clientApi.adminGetModels(authToken);
      setModels(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load models list');
    } finally {
      setLoading(false);
    }
  };

  const handleModelSubmit = async (e) => {
    e.preventDefault();
    if (!modelForm.name || !modelForm.api_model_code) {
      return toast.error('All model fields are required');
    }
    try {
      if (editingModelId) {
        await clientApi.adminUpdateModel(token, editingModelId, modelForm);
        toast.success('Model configurations updated!');
      } else {
        await clientApi.adminCreateModel(token, modelForm);
        toast.success('New AI Model added successfully!');
      }
      setModelForm({ name: '', provider: 'gemini', api_model_code: '', is_active: true });
      setEditingModelId(null);
      loadModels(token);
    } catch (err) {
      toast.error(err.message || 'Action failed');
    }
  };

  const startEditModel = (model) => {
    setEditingModelId(model.id);
    setModelForm({
      name: model.name,
      provider: model.provider,
      api_model_code: model.api_model_code,
      is_active: model.is_active
    });
  };

  const toggleModelActive = async (model) => {
    try {
      await clientApi.adminUpdateModel(token, model.id, {
        ...model,
        is_active: !model.is_active
      });
      loadModels(token);
      toast.success(`${model.name} active status updated`);
    } catch (err) {
      toast.error('Failed to toggle model status');
    }
  };

  const handleDeleteModel = async (id) => {
    if (!confirm('Are you sure you want to delete this AI Model?')) return;
    try {
      await clientApi.adminDeleteModel(token, id);
      toast.success('AI Model removed');
      loadModels(token);
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-slate-500 text-xs font-mono">Loading model configurations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Model Create Form */}
      <div className="admin-card">
        <h3 className="admin-card-title flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
          <Cpu size={16} className="text-amber-500" /> 
          {editingModelId ? 'Update Model Parameters' : 'Register New AI Model'}
        </h3>
        
        <form onSubmit={handleModelSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div className="space-y-1">
            <label className="admin-label">Display Name</label>
            <input
              type="text"
              value={modelForm.name}
              onChange={(e) => setModelForm({ ...modelForm, name: e.target.value })}
              placeholder="GPT-4o Mini"
              className="admin-input"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="admin-label">Provider</label>
            <select
              value={modelForm.provider}
              onChange={(e) => setModelForm({ ...modelForm, provider: e.target.value })}
              className="admin-select"
            >
              <option value="openai">OpenAI</option>
              <option value="gemini">Gemini</option>
              <option value="huggingface">HuggingFace</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="admin-label">API Identifier Code</label>
            <input
              type="text"
              value={modelForm.api_model_code}
              onChange={(e) => setModelForm({ ...modelForm, api_model_code: e.target.value })}
              placeholder="gpt-4o-mini"
              className="admin-input"
              required
            />
          </div>

          <div className="sm:col-span-3 flex items-center justify-between gap-4 pt-4 border-t border-slate-100 mt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 font-semibold">
              <input
                type="checkbox"
                checked={modelForm.is_active}
                onChange={(e) => setModelForm({ ...modelForm, is_active: e.target.checked })}
                className="w-3.5 h-3.5 rounded accent-amber-500"
              />
              Activate model in client list select dropdown
            </label>

            <div className="flex gap-2">
              {editingModelId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingModelId(null);
                    setModelForm({ name: '', provider: 'gemini', api_model_code: '', is_active: true });
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
                <Save size={13} /> {editingModelId ? 'Save Configurations' : 'Register Model'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Registered Models List */}
      <div className="admin-card">
        <h3 className="admin-card-title flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">Configured API Models</h3>
        
        <div className="space-y-2">
          {models.map(m => {
            const Icon = m.provider === 'openai' ? Cpu : (m.provider === 'gemini' ? Sparkles : Bot);
            return (
              <div key={m.id} className="admin-list-row">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-amber-500">
                    <Icon size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                      {m.name}
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-500 font-mono">
                        {m.api_model_code}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 uppercase font-mono">Provider: {m.provider}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleModelActive(m)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border cursor-pointer select-none transition-all active:scale-95 ${
                      m.is_active
                        ? 'bg-green-500/10 text-green-600 border-green-500/20'
                        : 'bg-red-500/10 text-red-600 border-red-500/20'
                    }`}
                  >
                    {m.is_active ? 'Active' : 'Inactive'}
                  </button>

                  <button
                    onClick={() => startEditModel(m)}
                    className="admin-btn-edit-icon"
                  >
                    <Edit2 size={12} />
                  </button>

                  <button
                    onClick={() => handleDeleteModel(m.id)}
                    className="admin-btn-danger-icon"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
