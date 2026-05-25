/**
 * aiProviders.js
 * Reusable utility functions for calling AI providers.
 * All calls are server-side only (never exposed to client).
 */

// ─── OpenAI ───────────────────────────────────────────────────────────────────

/**
 * Generate text using OpenAI's Chat Completion API.
 * @param {Array<{role: string, content: string}>} messages
 * @param {string} model - defaults to gpt-4o-mini
 * @returns {Promise<{text: string, tokensUsed: number}>}
 */
export async function generateWithOpenAI(messages, model = process.env.OPENAI_MODEL || 'gpt-4o-mini') {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set in environment variables.');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 1024,
      temperature: 0.8,
    }),
    signal: AbortSignal.timeout(30000), // 30s timeout
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg = err?.error?.message || `OpenAI API error: ${response.status}`;
    throw new Error(msg);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content?.trim() || '';
  const tokensUsed = data.usage?.total_tokens || 0;

  return { text, tokensUsed };
}

// ─── Hugging Face ─────────────────────────────────────────────────────────────

/**
 * Supported Hugging Face models for prompt generation.
 */
export const HF_MODELS = [
  { id: 'Qwen/Qwen2.5-7B-Instruct', label: 'Qwen 2.5 7B' },
  { id: 'mistralai/Mistral-7B-Instruct-v0.3', label: 'Mistral 7B' },
  { id: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B', label: 'DeepSeek R1' },
  { id: 'microsoft/Phi-3.5-mini-instruct', label: 'Phi 3.5 Mini' },
  { id: 'HuggingFaceH4/zephyr-7b-beta', label: 'Zephyr 7B' },
];

/**
 * Generate text using the Hugging Face Inference API (chat completion style).
 * @param {Array<{role: string, content: string}>} messages
 * @param {string} model - HF model ID
 * @returns {Promise<{text: string, tokensUsed: number}>}
 */
export async function generateWithHuggingFace(messages, model = 'Qwen/Qwen2.5-7B-Instruct') {
  const token = process.env.HF_TOKEN;
  if (!token) throw new Error('HF_TOKEN is not set in environment variables.');

  // Use HF's OpenAI-compatible inference endpoint
  const response = await fetch(
    `https://api-inference.huggingface.co/models/${model}/v1/chat/completions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 1024,
        temperature: 0.8,
      }),
      signal: AbortSignal.timeout(45000), // HF can be slower
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg = err?.error?.message || err?.error || `Hugging Face API error: ${response.status}`;
    throw new Error(String(msg));
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content?.trim() || '';
  const tokensUsed = data.usage?.total_tokens || 0;

  return { text, tokensUsed };
}

// ─── Prompt Builder ───────────────────────────────────────────────────────────

/**
 * Build system + user messages for the AI based on the generation mode.
 * @param {Object} params
 * @param {string} params.userInput - Raw user idea
 * @param {string} params.category - e.g. 'ChatGPT', 'Midjourney'
 * @param {string} params.tone - e.g. 'Professional', 'Creative'
 * @param {string} params.mode - 'generate' | 'improve' | 'rewrite'
 * @returns {Array<{role: string, content: string}>}
 */
export function buildMessages({ userInput, category, tone, mode, chatHistory = [] }) {
  const systemBase = `You are Revoxera AI, an expert AI prompt engineer. 
You craft highly optimized, detailed prompts for various AI tools and use cases.
Always return ONLY the improved/generated/refined prompt — no preamble, no explanation, no quotation marks around it.
Use clear structure, specific details, and best practices for the ${category} category.`;

  if (chatHistory && chatHistory.length > 0) {
    const messages = [{ role: 'system', content: systemBase }];
    messages.push(...chatHistory);
    messages.push({
      role: 'user',
      content: `Refine the previous prompt based on this request: "${userInput}". 
Category: ${category}
Tone: ${tone}

Return ONLY the new refined prompt without quotes or preamble.`
    });
    return messages;
  }

  let userMessage;

  switch (mode) {
    case 'improve':
      userMessage = `Improve this existing prompt to be more effective, detailed, and optimized for ${category}.
Tone: ${tone}
Original prompt: "${userInput}"

Return the improved prompt only.`;
      break;

    case 'rewrite':
      userMessage = `Rewrite this prompt completely in a fresh, different way while keeping the core intent.
Category: ${category}
Tone: ${tone}
Original: "${userInput}"

Return the rewritten prompt only.`;
      break;

    case 'generate':
    default:
      userMessage = `Generate a highly optimized, detailed prompt for ${category} based on this idea:
"${userInput}"
Tone: ${tone}
Make it specific, clear, and immediately usable. Return only the final prompt.`;
      break;
  }

  return [
    { role: 'system', content: systemBase },
    { role: 'user', content: userMessage },
  ];
}

// ─── Google Gemini ─────────────────────────────────────────────────────────────

/**
 * Generate text using Google Gemini API.
 * @param {Array<{role: string, content: string}>} messages
 * @param {string} model - defaults to gemini-2.5-flash
 * @returns {Promise<{text: string, tokensUsed: number}>}
 */
export async function generateWithGemini(messages, model = process.env.GEMINI_MODEL || 'gemini-2.5-flash') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set in environment variables.');

  // Import dynamically or assume it's installed
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const systemMessage = messages.find(m => m.role === 'system')?.content || '';
  const userMessages = messages.filter(m => m.role !== 'system').map(m => m.content).join('\n\n');
  
  const prompt = systemMessage ? `${systemMessage}\n\n${userMessages}` : userMessages;
  
  const geminiModel = genAI.getGenerativeModel({ model });
  const result = await geminiModel.generateContent(prompt);
  const response = await result.response;
  
  const text = response.text();
  const tokensUsed = response.usageMetadata?.totalTokenCount || 0;

  return { text, tokensUsed };
}
