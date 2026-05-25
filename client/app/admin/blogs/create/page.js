'use client';

import { useState, useEffect, Suspense } from 'react';
import { PenSquare, Save, Plus, Loader, Check } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { clientApi } from '../../../utils/clientApi';
import toast from 'react-hot-toast';

function BlogFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [blogForm, setBlogForm] = useState({ title: '', excerpt: '', category: 'Design', author: 'Admin', content: '', image_url: '' });
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('pb_admin_token');
    if (savedToken) {
      setToken(savedToken);
      if (editId) {
        loadBlogDetail(editId);
      } else {
        setLoading(false);
      }
    }
  }, [editId]);

  const loadBlogDetail = async (id) => {
    try {
      const blogsList = await clientApi.fetchBlogs();
      const match = blogsList.find(b => String(b.id) === String(id));
      if (match) {
        setBlogForm({
          title: match.title || '',
          excerpt: match.excerpt || '',
          category: match.category || 'Design',
          author: match.author || 'Admin',
          content: match.content || '',
          image_url: match.image_url || ''
        });
      } else {
        toast.error('Article not found in database');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load article detail');
    } finally {
      setLoading(false);
    }
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.content || !blogForm.excerpt) {
      return toast.error('Please fill in title, summary, and article content');
    }
    try {
      if (editId) {
        await clientApi.adminUpdateBlog(token, editId, blogForm);
        toast.success('Blog article updated!');
      } else {
        await clientApi.adminCreateBlog(token, blogForm);
        toast.success('Article published successfully!');
      }
      router.push('/admin/blogs');
    } catch (err) {
      toast.error(err.message || 'Action failed');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return toast.error('Only image files are allowed');
    }

    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
    try {
      const res = await clientApi.adminUploadBlogImage(token, formData);
      setBlogForm((prev) => ({
        ...prev,
        image_url: res.url
      }));
      toast.success('Cover image uploaded successfully!');
    } catch (err) {
      toast.error(err.message || 'Image upload failed');
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-slate-500 text-xs font-mono">Synchronizing editor specifications...</p>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-6">
        <h3 className="admin-card-title flex items-center gap-2">
          <PenSquare size={16} className="text-amber-500" />
          {editId ? `Editing Article: ${blogForm.title}` : 'Compose New Blog Post'}
        </h3>
        <button
          onClick={() => router.push('/admin/blogs')}
          className="admin-btn-secondary py-1.5"
        >
          Cancel & Back
        </button>
      </div>

      <form onSubmit={handleBlogSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-1">
            <label className="admin-label">Article Title</label>
            <input
              type="text"
              value={blogForm.title}
              onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
              placeholder="Mastering advanced LLM prompting patterns..."
              className="admin-input"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="admin-label">Category</label>
            <input
              type="text"
              value={blogForm.category}
              onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
              placeholder="Engineering / Design / Marketing"
              className="admin-input"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="admin-label">Author Name</label>
            <input
              type="text"
              value={blogForm.author}
              onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
              placeholder="Admin / Tech Writer"
              className="admin-input"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="admin-label">Short Excerpt Summary</label>
            <input
              type="text"
              value={blogForm.excerpt}
              onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
              placeholder="A quick summary description of the article..."
              className="admin-input"
              required
            />
          </div>
        </div>

        {/* Image cover uploading flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 rounded-xl bg-slate-50 border border-slate-200/60 shadow-sm animate-fade-in">
          <div className="md:col-span-2 space-y-1">
            <label className="admin-label">Article Cover Image</label>
            <div className="flex gap-3 items-center mt-1.5">
              <input
                type="file"
                accept="image/*"
                id="blog-image-upload"
                className="hidden"
                onChange={handleImageUpload}
              />
              <label
                htmlFor="blog-image-upload"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-slate-900 text-xs font-semibold cursor-pointer transition-all active:scale-[0.98] shadow-sm select-none"
              >
                {uploadingImage ? (
                  <>
                    <Loader size={14} className="animate-spin text-amber-500" />
                    Uploading Image...
                  </>
                ) : (
                  <>
                    <Plus size={14} className="text-amber-500" />
                    Choose Image Cover
                  </>
                )}
              </label>

              {blogForm.image_url ? (
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-1.5">
                  <Check size={12} className="text-green-600" />
                  <span className="text-[10px] text-green-600 font-mono truncate max-w-[140px]">
                    {blogForm.image_url}
                  </span>
                  <button
                    type="button"
                    onClick={() => setBlogForm({ ...blogForm, image_url: '' })}
                    className="text-red-500 hover:text-red-700 text-[10px] ml-2 font-bold cursor-pointer bg-transparent border-none outline-none"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <span className="text-[10px] text-slate-400">No custom cover uploaded. Default placeholder will show.</span>
              )}
            </div>
          </div>

          {blogForm.image_url && (
            <div className="h-16 w-full rounded-xl border border-slate-200 overflow-hidden relative shadow-inner">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${blogForm.image_url}`}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="space-y-1">
          <label className="admin-label">Full Article Content (Markdown format via newlines)</label>
          <textarea
            value={blogForm.content}
            onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
            rows={10}
            placeholder="Write the full post markdown content here..."
            className="admin-textarea font-mono text-xs leading-relaxed"
            required
          />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => router.push('/admin/blogs')}
            className="admin-btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="admin-btn-primary"
          >
            <Save size={13} /> {editId ? 'Update Article' : 'Publish Article'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AdminBlogCreatePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-slate-500 text-xs font-mono">Preparing editor layout...</p>
      </div>
    }>
      <BlogFormInner />
    </Suspense>
  );
}
