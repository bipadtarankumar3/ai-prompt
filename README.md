# 🦁 Prompt Beast — World-Class AI Prompt Generator

> Generate, improve, and rewrite AI prompts instantly powered by GPT-4o and Hugging Face.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwind-css)](https://tailwindcss.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-10a37f?logo=openai)](https://openai.com)
[![Hugging Face](https://img.shields.io/badge/Hugging%20Face-Inference-ff9d00?logo=huggingface)](https://huggingface.co)

---

## ✨ Features

| Feature | Description |
|---|---|
| **Generate** | Create optimized AI prompts from rough ideas |
| **Improve** | Enhance existing prompts with AI assistance |
| **Rewrite** | Get fresh variations of any prompt |
| **8 Categories** | ChatGPT, Midjourney, Coding, Marketing, SEO, YouTube, Blogging, Business |
| **5 Tones** | Professional, Creative, Funny, Expert, Minimal |
| **Multiple AI Providers** | OpenAI GPT-4o + Hugging Face (Qwen, Mistral, DeepSeek, Phi, Zephyr) |
| **Prompt History** | Auto-saved to localStorage (last 50 prompts) |
| **Favorites** | Save your best prompts for quick access |
| **Copy / Download** | One-click copy or download as .txt |
| **Share** | Generate shareable links |
| **Dark Mode** | Beautiful dark/light theme toggle |
| **8 Templates** | Ready-to-use expert prompt templates |
| **Rate Limiting** | 20 requests/minute per IP (configurable) |
| **SEO Optimized** | Full metadata, OpenGraph, robots.txt, sitemap |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key (optional, for GPT-4o)
- Hugging Face token (optional, for open-source models)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/prompt-beast.git
cd prompt-beast

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

Create a `.env.local` file in the root directory:

```bash
# OpenAI (for GPT-4o Mini)
OPENAI_API_KEY=sk-your-openai-api-key

# Hugging Face (for open-source models)
HF_TOKEN=hf_your-huggingface-token

# App URL (for share links)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Getting API Keys:**
- **OpenAI**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **Hugging Face**: [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

> ⚠️ API keys are server-side only and never exposed to the browser.

---

## 📁 Project Structure

```
app/
├── api/
│   └── generate/
│       └── route.js          # AI API route
├── components/
│   ├── Navbar.js              # Sticky glassmorphism navbar
│   ├── Hero.js                # Animated hero section
│   ├── PromptBox.js           # Main input form
│   ├── ProviderSelect.js      # AI provider selector
│   ├── OutputBox.js           # Results display
│   ├── PromptHistory.js       # History slide panel
│   ├── TemplateCard.js        # Templates section
│   ├── FeatureGrid.js         # Features showcase
│   ├── HowItWorks.js          # 3-step process
│   ├── Testimonials.js        # Social proof
│   ├── FAQ.js                 # Accordion FAQ
│   ├── PricingCard.js         # Pricing tiers
│   └── Footer.js              # Full footer
├── utils/
│   └── aiProviders.js         # AI provider utilities
├── globals.css                # Design tokens + animations
├── layout.js                  # Root layout + SEO
└── page.js                    # Homepage

public/
├── robots.txt
└── sitemap.xml
```

---

## 🤖 Supported AI Models

### OpenAI
| Model | Use Case |
|---|---|
| `gpt-4o-mini` | Default — fast, accurate, cost-effective |

### Hugging Face (Free)
| Model | Label |
|---|---|
| `Qwen/Qwen2.5-7B-Instruct` | Qwen 2.5 7B |
| `mistralai/Mistral-7B-Instruct-v0.3` | Mistral 7B |
| `deepseek-ai/DeepSeek-R1-Distill-Qwen-7B` | DeepSeek R1 |
| `microsoft/Phi-3.5-mini-instruct` | Phi 3.5 Mini |
| `HuggingFaceH4/zephyr-7b-beta` | Zephyr 7B |

---

## 🌐 Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Then add environment variables in Vercel dashboard:**
1. Go to Project Settings → Environment Variables
2. Add `OPENAI_API_KEY` and `HF_TOKEN`
3. Redeploy

---

## 🛡️ Security

- API keys stored in environment variables only
- All AI calls server-side (Next.js API routes)
- Input validation and sanitization
- Rate limiting: 20 requests/min per IP
- Security headers on API routes

---

## 📊 API Reference

### `POST /api/generate`

**Request body:**
```json
{
  "userInput": "Write a blog post about AI",
  "category": "Blogging",
  "tone": "Professional",
  "mode": "generate",
  "provider": "openai",
  "hfModel": "Qwen/Qwen2.5-7B-Instruct"
}
```

**Response:**
```json
{
  "success": true,
  "result": "You are an expert content strategist...",
  "tokensUsed": 387,
  "provider": "openai",
  "model": "gpt-4o-mini"
}
```

**Modes:** `generate` | `improve` | `rewrite`
**Providers:** `openai` | `huggingface`

---

## 🎨 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: JavaScript (ES2024)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Toast**: React Hot Toast
- **Theme**: next-themes
- **AI**: OpenAI SDK + Hugging Face Inference API

---

## 🚦 Rate Limits

| Plan | Limit |
|---|---|
| Free | 50 generations/day |
| Pro | Unlimited |
| Self-hosted | 20 req/min (configurable) |

---

## 📝 License

MIT License — feel free to use and modify for commercial projects.

---

## 🙏 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

Made with ❤️ by the **Prompt Beast** team | [promptbeast.ai](https://promptbeast.ai)
