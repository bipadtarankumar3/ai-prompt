import { clientApi } from './clientApi';

// Helper to track session state and returning users
export const initAnalytics = () => {
  if (typeof window === 'undefined') return;

  const startTime = Date.now();
  let isReturning = false;

  try {
    const visited = localStorage.getItem('pb_user_visited');
    if (visited) {
      isReturning = true;
    } else {
      localStorage.setItem('pb_user_visited', 'true');
    }
  } catch (err) {
    console.error('Storage tracking disabled:', err);
  }

  // Dispatch session start event
  clientApi.trackAnalyticsEvent('session_start', null, {
    isReturning,
    userAgent: navigator.userAgent,
    screenSize: `${window.innerWidth}x${window.innerHeight}`
  }).catch(console.error);

  // Dispatch Clarity metrics helper tag
  if (window.clarity) {
    window.clarity("set", "user_type", isReturning ? "returning" : "new");
  }

  // Setup unloading trigger to capture session duration
  window.addEventListener('beforeunload', () => {
    const sessionDurationSeconds = Math.round((Date.now() - startTime) / 1000);
    
    // Use keepalive: true to ensure the fetch completes during page close
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${API_URL}/api/analytics/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'session_end',
        targetId: null,
        metadata: { durationSeconds: sessionDurationSeconds }
      }),
      keepalive: true
    }).catch(() => {});
  });
};

// Expose individual event trackers
export const trackCopy = (promptSlug, promptId) => {
  clientApi.trackAnalyticsEvent('copy', promptSlug, { promptId }).catch(console.error);
  if (window.clarity) window.clarity("event", "prompt_copied");
};

export const trackSearch = (query, categoryName) => {
  clientApi.trackAnalyticsEvent('search', query, { category: categoryName }).catch(console.error);
};

export const trackGeneration = (provider, model, category, tone) => {
  clientApi.trackAnalyticsEvent('generate', model, { provider, category, tone }).catch(console.error);
  if (window.clarity) window.clarity("event", "prompt_generated");
};

export const trackCategoryClick = (categoryName, slug) => {
  clientApi.trackAnalyticsEvent('category_click', slug, { categoryName }).catch(console.error);
};
