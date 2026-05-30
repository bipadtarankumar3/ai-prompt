'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { clientApi } from '../../utils/clientApi';
import toast from 'react-hot-toast';

export default function AdminBlogsListPage() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const savedToken = localStorage.getItem('pb_auth_token');
    if (savedToken) {
      setToken(savedToken);
      loadBlogs();
    }
  }, []);

  const loadBlogs = async () => {
    try {
      const blogsData = await clientApi.fetchBlogs();
      setBlogs(blogsData);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load blog posts list');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!confirm('Permanently delete this blog article?')) return;
    try {
      await clientApi.adminDeleteBlog(token, id);
      toast.success('Article deleted from DB');
      loadBlogs();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-slate-500 text-xs font-mono">Loading published blogs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Blog listing header area */}
      <div className="flex justify-between items-center bg-white border border-slate-250 p-4 rounded-2xl shadow-sm">
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Blogs Database</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">{blogs.length} articles published dynamically</p>
        </div>
        <button
          onClick={() => router.push('/admin/blogs/create')}
          className="admin-btn-primary"
        >
          <Plus size={14} /> Write Article
        </button>
      </div>

      {/* Published articles List */}
      <div className="admin-card">
        <div className="space-y-2">
          {blogs.map(b => (
            <div key={b.id} className="admin-list-row">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-12 h-12 rounded-lg border border-slate-200 overflow-hidden flex-shrink-0 bg-slate-55 flex items-center justify-center">
                  {b.image_url ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${b.image_url}`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen size={16} className="text-slate-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-800 truncate">{b.title}</h4>
                  <div className="flex items-center gap-2 mt-1 text-[9px] text-slate-500">
                    <span className="text-amber-600 font-semibold uppercase">{b.category}</span>
                    <span>·</span>
                    <span>By {b.author}</span>
                    <span>·</span>
                    <span>{b.read_time}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => router.push(`/admin/blogs/create?edit=${b.id}`)}
                  className="admin-btn-edit-icon"
                  title="Edit Article"
                >
                  <Edit2 size={12} />
                </button>
                <button
                  onClick={() => handleDeleteBlog(b.id)}
                  className="admin-btn-danger-icon"
                  title="Delete Article"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
