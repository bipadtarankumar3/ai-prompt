'use client';

import { useEffect } from 'react';
import { clientApi } from '../utils/clientApi';

// Fallback SEO metadata for static pages not in DB config
const STATIC_SEO_FALLBACKS = {
  pricing: {
    title: 'Premium Pricing Plans — Revoxera AI',
    description: 'Choose the perfect plan to generate, optimize, and manage your AI prompt engineering workflow. Cancel anytime.',
    keywords: 'pricing, buy prompts, subscription, ai tokens',
  },
  contact: {
    title: 'Contact Support & Sales — Revoxera AI',
    description: 'Get in touch with the Revoxera AI team. We are here to answer your questions, support your workflows, and build tailored enterprise solutions.',
    keywords: 'contact us, email support, sales, prompt builder help',
  },
  privacy: {
    title: 'Privacy Policy — Revoxera AI',
    description: 'Learn how we collect, process, and secure your prompt configurations, personal data, and browser storage.',
    keywords: 'privacy policy, security, cookies, data protection',
  },
  terms: {
    title: 'Terms & Conditions — Revoxera AI',
    description: 'Read our terms of service, acceptable use policies, ownership of generated prompts, and liability terms.',
    keywords: 'terms of service, terms of use, legal agreement',
  },
  'cookie-policy': {
    title: 'Cookie Policy — Revoxera AI',
    description: 'Read our cookie policy explaining how we use cookies, session states, and browser local storage to improve your experience.',
    keywords: 'cookies, tracking, browser storage, user preference',
  },
  'refund-policy': {
    title: 'Refund Policy — Revoxera AI',
    description: 'Learn about our transaction policies, trial terms, and refund conditions for digital items and AI credits.',
    keywords: 'refunds, payments, digital purchases, terms of sale',
  },
  docs: {
    title: 'Documentation Guides & Tutorials — Revoxera AI',
    description: 'Learn prompt engineering principles, parameters weight tuning, model constraints, and platform integration guides.',
    keywords: 'documentation, guides, tutorials, how to prompt',
  },
  changelog: {
    title: 'Changelog & Updates — Revoxera AI',
    description: 'Stay up-to-date with new prompt categories, Hugging Face models, features additions, and site performance optimizations.',
    keywords: 'changelog, system updates, new features',
  },
  careers: {
    title: 'Careers & Opportunities — Revoxera AI',
    description: 'Join our team to build the interface layer that simplifies prompt engineering and model integrations.',
    keywords: 'careers, jobs, software engineer hiring',
  },
  press: {
    title: 'Press Kit & Media Resources — Revoxera AI',
    description: 'Get official logos, guidelines, contact emails, and statistics regarding Revoxera AI prompt engineering tools.',
    keywords: 'press kit, media, statistics, brand assets',
  },
  community: {
    title: 'Developer Community Hub — Revoxera AI',
    description: 'Join the Revoxera AI developer community. Share your customized prompt layouts, get help, and discuss prompting frameworks.',
    keywords: 'community, discord, forum, sharing prompts',
  },
  'api-reference': {
    title: 'API Reference Developer Documentation — Revoxera AI',
    description: 'Learn how to connect to our high-performance prompt optimization endpoints programmatically using curl or javascript.',
    keywords: 'api reference, REST API, developers, python scripts',
  },
  templates: {
    title: 'Free Prompt Templates Directory — Revoxera AI',
    description: 'Explore our directory of ready-to-run prompt templates for ChatGPT, Midjourney, coding, writing, and design.',
    keywords: 'templates list, free prompts, copy paste templates',
  }
};

export default function SeoHeader({ pageKey, data }) {
  useEffect(() => {
    async function updateSeo() {
      try {
        let title = '';
        let description = '';
        let keywords = '';
        let imageUrl = '/logo.png';
        let pageType = 'website';

        // 1. Check if pageKey is a dynamic routing page
        if (pageKey === 'blog_detail' && data) {
          title = `${data.title} — Revoxera AI Blog`;
          description = data.excerpt || data.title;
          keywords = `blog, post, prompt engineering, ${data.category || ''}`;
          if (data.image_url) {
            const apiHost = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            imageUrl = data.image_url.startsWith('/') ? `${apiHost}${data.image_url}` : data.image_url;
          }
          pageType = 'article';
        } else if (pageKey === 'category' && data) {
          title = `Best ${data.categoryName} Prompts & Templates Library — Revoxera AI`;
          description = `Discover premium, battle-tested ${data.categoryName} prompts. Copy or run them directly in the generator to maximize your generative AI outputs.`;
          keywords = `${data.categoryName} prompts, ChatGPT prompts, Midjourney prompts, prompt collections, ${data.categoryName.toLowerCase()}`;
        } else if (pageKey === 'prompt_detail' && data) {
          const titleText = data.promptItem?.title || data.promptItem?.pc_title || '';
          title = `${titleText} — Premium ${data.categoryName} Prompt — Revoxera AI`;
          description = `Optimize your AI workflows with our "${titleText}" prompt under ${data.categoryName}. Free to copy or run dynamically inside Revoxera AI.`;
          keywords = `${titleText}, ${data.categoryName} prompts, prompt template, prompt database`;
        } else {
          // 2. Load from dynamic database configuration (for home, generator, collections, blog, about)
          const settings = await clientApi.fetchSettings();
          const titleKey = `seo_${pageKey}_title`;
          const descKey = `seo_${pageKey}_description`;
          const keywordsKey = `seo_${pageKey}_keywords`;

          title = settings[titleKey];
          description = settings[descKey];
          keywords = settings[keywordsKey];

          // 3. If still empty, use local static fallbacks
          if (!title && STATIC_SEO_FALLBACKS[pageKey]) {
            title = STATIC_SEO_FALLBACKS[pageKey].title;
            description = STATIC_SEO_FALLBACKS[pageKey].description;
            keywords = STATIC_SEO_FALLBACKS[pageKey].keywords;
          }
        }

        // Apply metadata elements
        if (title) {
          document.title = title;
          setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
          setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
        }

        if (description) {
          setMetaTag('meta[name="description"]', 'name', 'description', description);
          setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
          setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
        }

        if (keywords) {
          setMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords);
        }

        // OpenGraph URL and type
        const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://aiprompt.revoxera.com';
        setMetaTag('meta[property="og:url"]', 'property', 'og:url', currentUrl);
        setMetaTag('meta[property="og:type"]', 'property', 'og:type', pageType);

        // OpenGraph / Twitter Image
        let finalImageUrl = imageUrl;
        if (typeof window !== 'undefined' && imageUrl.startsWith('/')) {
          finalImageUrl = `${window.location.origin}${imageUrl}`;
        }
        setMetaTag('meta[property="og:image"]', 'property', 'og:image', finalImageUrl);
        setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', finalImageUrl);

        // Twitter card type
        setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');

        // Canonical link
        const canonicalUrl = 'https://aiprompt.revoxera.com' + (typeof window !== 'undefined' ? window.location.pathname : '');
        setLinkTag('link[rel="canonical"]', 'rel', 'canonical', canonicalUrl);

      } catch (err) {
        console.error(`Failed to load SEO metadata for page key: ${pageKey}`, err);
      }
    }

    updateSeo();
  }, [pageKey, data]);

  return null;
}

const setMetaTag = (selector, attributeName, attributeValue, contentValue) => {
  if (typeof document === 'undefined') return;
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', contentValue);
};

const setLinkTag = (selector, attributeName, attributeValue, hrefValue) => {
  if (typeof document === 'undefined') return;
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('href', hrefValue);
};
