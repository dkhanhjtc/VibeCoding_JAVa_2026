/**
 * API ANALYZE ENDPOINT - HOSTWISE AI (TV2 Serverless Endpoint)
 * Tích hợp Gemini API hoặc fallback nội bộ
 */

import { buildRecommendationPrompt } from './_lib/prompt.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const formData = req.body || {};
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    // Trả về tín hiệu để frontend fallback êm ái
    return res.status(200).json({
      fallback: true,
      message: 'No GEMINI_API_KEY configured. Fallback engine activated on client.'
    });
  }

  try {
    const prompt = buildRecommendationPrompt(formData);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const result = await response.json();
    const textOutput = result.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsedData = JSON.parse(textOutput);

    return res.status(200).json({
      ...parsedData,
      isFallback: false,
      provider: 'AI Gemini 1.5 Flash'
    });
  } catch (error) {
    console.error('Error calling Gemini in api/analyze:', error);
    return res.status(500).json({
      fallback: true,
      error: error.message
    });
  }
}

