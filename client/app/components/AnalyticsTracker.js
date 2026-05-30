'use client';

import { useEffect } from 'react';
import { initAnalytics } from '../utils/analytics';

export default function AnalyticsTracker() {
  useEffect(() => {
    initAnalytics();
  }, []);

  return null;
}
