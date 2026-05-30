const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Helper for standardized requests
async function request(path, options = {}) {
  const url = `${API_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    throw new Error(`Invalid response format from server: ${text.slice(0, 100)}`);
  }

  if (!response.ok) {
    throw new Error(data.message || data.error || `HTTP error! Status: ${response.status}`);
  }

  // standard JSON wrapping on server uses `{ success: true, data: ... }`
  // but public routes/generate may use standard response structures
  return data.data !== undefined ? data.data : data;
}

export const clientApi = {
  // Public APIs
  fetchActiveModels: () => request('/api/models'),
  fetchSettings: () => request('/api/settings'),
  generatePrompt: (payload) => request('/api/generate', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  fetchCollections: () => request('/api/prompt-collections'),
  fetchPromptBySlug: (slug) => request(`/api/prompt-collections/slug/${slug}`),
  incrementPromptCopy: (id) => request(`/api/prompt-collections/${id}/copy`, { method: 'POST' }),
  incrementPromptView: (id) => request(`/api/prompt-collections/${id}/view`, { method: 'POST' }),
  fetchTrendingPrompts: () => request('/api/prompt-collections/trending'),
  fetchRelatedPrompts: (id, category, limit = 3) => request(`/api/prompt-collections/related/${id}?category=${encodeURIComponent(category)}&limit=${limit}`),
  
  // Analytics
  trackAnalyticsEvent: (eventType, targetId = null, metadata = {}) => request('/api/analytics/event', {
    method: 'POST',
    body: JSON.stringify({ eventType, targetId, metadata }),
  }),

  // Accounts & Monetization (requires User Token)
  fetchSavedPrompts: (token) => request('/api/monetization/saved', {
    headers: { Authorization: `Bearer ${token}` }
  }),
  toggleSavePrompt: (token, promptId) => request('/api/monetization/saved/toggle', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ promptId })
  }),
  fetchUserLimits: (token) => request('/api/monetization/limits', {
    headers: { Authorization: `Bearer ${token}` }
  }),
  fetchApiKeys: (token) => request('/api/monetization/keys', {
    headers: { Authorization: `Bearer ${token}` }
  }),
  generateApiKey: (token) => request('/api/monetization/keys/generate', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  }),

  fetchBlogs: () => request('/api/blog-posts'),
  fetchBlogBySlug: (slug) => request(`/api/blog-posts/slug/${slug}`),

  // Admin Authentication / User Session Actions
  adminLogin: (username, password) => request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  }),
  userRegister: (name, email, password) => request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  }),
  adminVerify: (token) => request('/api/auth/status', {
    headers: { Authorization: `Bearer ${token}` },
  }),

  // Admin Models Management
  adminGetModels: (token) => request('/api/models/admin', {
    headers: { Authorization: `Bearer ${token}` },
  }),
  adminCreateModel: (token, model) => request('/api/models/admin', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(model),
  }),
  adminUpdateModel: (token, id, model) => request(`/api/models/admin/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(model),
  }),
  adminDeleteModel: (token, id) => request(`/api/models/admin/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  }),

  // Admin Settings Management
  adminUpdateSettings: (token, settingsObj) => request('/api/settings/admin', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(settingsObj),
  }),

  // Admin Prompt Collections Management
  adminCreateCollection: (token, coll) => request('/api/prompt-collections/admin', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(coll),
  }),
  adminUpdateCollection: (token, id, coll) => request(`/api/prompt-collections/admin/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(coll),
  }),
  adminDeleteCollection: (token, id) => request(`/api/prompt-collections/admin/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  }),

  // Admin Blog Posts Management
  adminCreateBlog: (token, blog) => request('/api/blog-posts/admin', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(blog),
  }),
  adminUpdateBlog: (token, id, blog) => request(`/api/blog-posts/admin/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(blog),
  }),
  adminDeleteBlog: (token, id) => request(`/api/blog-posts/admin/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  }),

  // Admin Blog Image Upload
  adminUploadBlogImage: (token, formData) => fetch(`${API_URL}/api/blog-posts/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Image upload failed');
    return data;
  }),
};
