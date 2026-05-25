'use client';

import { useEffect } from 'react';
import { clientApi } from '../utils/clientApi';

export default function SeoHeader({ pageKey }) {
  useEffect(() => {
    async function updateSeo() {
      try {
        const settings = await clientApi.fetchSettings();
        
        const titleKey = `seo_${pageKey}_title`;
        const descKey = `seo_${pageKey}_description`;
        const keywordsKey = `seo_${pageKey}_keywords`;

        const title = settings[titleKey];
        const description = settings[descKey];
        const keywords = settings[keywordsKey];

        if (title) {
          document.title = title;
        }

        if (description) {
          let metaDesc = document.querySelector('meta[name="description"]');
          if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
          }
          metaDesc.setAttribute('content', description);

          // Update OpenGraph/Twitter description if present
          document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
          document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description);
        }

        if (keywords) {
          let metaKeywords = document.querySelector('meta[name="keywords"]');
          if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.setAttribute('name', 'keywords');
            document.head.appendChild(metaKeywords);
          }
          metaKeywords.setAttribute('content', keywords);
        }

        // Also update OpenGraph/Twitter title if present
        if (title) {
          document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
          document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
        }

      } catch (err) {
        console.error(`Failed to load SEO metadata for page key: ${pageKey}`, err);
      }
    }
    
    updateSeo();
  }, [pageKey]);

  return null;
}
