const config = require('../config/env');

class AIService {
  /**
   * Main router for generating prompt using selected provider and model code.
   */
  async generate({ userInput, category, tone, mode, provider, modelCode, length, outputStyle, chatHistory = [] }) {
    // 1. Build messages
    const messages = this.buildMessages({
      userInput: userInput.trim(),
      category: category || 'General',
      tone: tone || 'Professional',
      mode: mode || 'generate',
      length,
      outputStyle,
      chatHistory,
    });

    // 2. Route to provider
    if (provider === 'openai') {
      return this.generateWithOpenAI(messages, modelCode || 'gpt-4o-mini');
    } else if (provider === 'gemini') {
      return this.generateWithGemini(messages, modelCode || 'gemini-2.5-flash');
    } else if (provider === 'huggingface') {
      return this.generateWithHuggingFace(messages, modelCode || 'Qwen/Qwen2.5-7B-Instruct');
    } else {
      throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }

  /**
   * Build system + user messages for the AI based on the generation mode.
   */
  buildMessages({ userInput, category, tone, mode, length, outputStyle, chatHistory = [] }) {
    let constraints = '';
    if (length) {
      constraints += `\n- Length Constraint: Make the output prompt itself formatted to represent a ${length} configuration (e.g. if 'Short', output a brief 1-paragraph prompt; if 'Detailed', output a comprehensive prompt with detailed role, constraints, and examples).`;
    }
    if (outputStyle) {
      constraints += `\n- Formatting Constraint: Structure the generated prompt to instruct the target AI to output in '${outputStyle}' format (e.g. markdown headers, bullet lists, JSON template, etc.).`;
    }

    const systemBase = `You are Revoxera AI, an expert AI prompt engineer. 
You craft highly optimized, detailed prompts for various AI tools and use cases.
Always return ONLY the improved/generated/refined prompt — no preamble, no explanation, no quotation marks around it.
Use clear structure, specific details, and best practices for the ${category} category.${constraints}`;

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

  /**
   * OpenAI Chat Completion
   */
  async generateWithOpenAI(messages, model) {
    const apiKey = config.openaiApiKey;
    if (!apiKey) throw new Error('OPENAI_API_KEY is not configured on the server.');

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

  /**
   * Gemini SDK Generation
   */
  async generateWithGemini(messages, model) {
    const apiKey = config.geminiApiKey;
    if (!apiKey) throw new Error('GEMINI_API_KEY is not configured on the server.');

    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);

    const systemMessage = messages.find(m => m.role === 'system')?.content || '';
    const userMessages = messages.filter(m => m.role !== 'system').map(m => m.content).join('\n\n');

    const prompt = systemMessage ? `${systemMessage}\n\n${userMessages}` : userMessages;

    const geminiModel = genAI.getGenerativeModel({ model });
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;

    const text = response.text().trim();
    const tokensUsed = response.usageMetadata?.totalTokenCount || 0;

    return { text, tokensUsed };
  }

  /**
   * Hugging Face Inference API
   */
  async generateWithHuggingFace(messages, model) {
    const token = config.hfToken;
    if (!token || token.includes('your-huggingface-token-here')) {
      throw new Error('HF_TOKEN is not configured on the server.');
    }

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
        signal: AbortSignal.timeout(45000), // 45s timeout for HF
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
}

module.exports = new AIService();
