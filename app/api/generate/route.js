/**
 * API Route: /api/generate
 * Handles AI prompt generation with provider selection, validation, and rate limiting.
 */

import { NextResponse } from 'next/server';
import {
  generateWithOpenAI,
  generateWithHuggingFace,
  generateWithGemini,
  buildMessages,
} from '@/app/utils/aiProviders';

// ─── Simple In-Memory Rate Limiter ───────────────────────────────────────────
const rateLimitMap = new Map();
const RATE_LIMIT = 20;       // max requests
const RATE_WINDOW = 60000;   // per 60 seconds

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, start: now };

  if (now - record.start > RATE_WINDOW) {
    // Reset window
    rateLimitMap.set(ip, { count: 1, start: now });
    return true;
  }

  if (record.count >= RATE_LIMIT) return false;

  record.count += 1;
  rateLimitMap.set(ip, record);
  return true;
}

// ─── POST Handler ─────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    // Rate limiting by IP
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a minute before trying again.' },
        { status: 429 }
      );
    }

    // Parse body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const { userInput, category, tone, mode, provider, hfModel, chatHistory } = body;

    // ── Input validation ──
    if (chatHistory && !Array.isArray(chatHistory)) {
      return NextResponse.json({ error: 'Invalid chat history format.' }, { status: 400 });
    }

    if (!userInput || typeof userInput !== 'string' || userInput.trim().length < 3) {
      return NextResponse.json(
        { error: 'Please provide a valid prompt idea (at least 3 characters).' },
        { status: 400 }
      );
    }

    if (userInput.trim().length > 2000) {
      return NextResponse.json(
        { error: 'Input is too long. Please keep it under 2000 characters.' },
        { status: 400 }
      );
    }

    const validProviders = ['openai', 'huggingface', 'gemini'];
    if (!validProviders.includes(provider)) {
      return NextResponse.json({ error: 'Invalid provider selected.' }, { status: 400 });
    }

    const validModes = ['generate', 'improve', 'rewrite'];
    if (mode && !validModes.includes(mode)) {
      return NextResponse.json({ error: 'Invalid mode selected.' }, { status: 400 });
    }

    // Read history limit from env (default to 5 turns = 10 messages)
    const historyLimit = parseInt(process.env.MAX_CHAT_HISTORY_LIMIT || '5', 10);
    const maxHistoryMessages = historyLimit * 2;
    const slicedHistory = (chatHistory || []).slice(-maxHistoryMessages);

    // ── Build messages ──
    const messages = buildMessages({
      userInput: userInput.trim(),
      category: category || 'General',
      tone: tone || 'Professional',
      mode: mode || 'generate',
      chatHistory: slicedHistory,
    });

    // ── Call AI provider ──
    let result;

    if (provider === 'openai') {
      result = await generateWithOpenAI(messages);
    } else if (provider === 'gemini') {
      result = await generateWithGemini(messages);
    } else {
      result = await generateWithHuggingFace(
        messages,
        hfModel || 'Qwen/Qwen2.5-7B-Instruct'
      );
    }

    return NextResponse.json({
      success: true,
      result: result.text,
      tokensUsed: result.tokensUsed,
      provider,
      model: provider === 'openai' ? (process.env.OPENAI_MODEL || 'gpt-4o-mini') : (provider === 'gemini' ? (process.env.GEMINI_MODEL || 'gemini-2.5-flash') : (hfModel || 'Qwen/Qwen2.5-7B-Instruct')),
    });
  } catch (error) {
    console.error('[/api/generate] Error:', error);

    // Friendly error messages
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'API key not configured. Please check your .env.local file.' },
        { status: 500 }
      );
    }

    if (error.name === 'AbortError' || error.message?.includes('timeout')) {
      return NextResponse.json(
        { error: 'Request timed out. The AI model took too long to respond. Please try again.' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// Block non-POST methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 });
}
