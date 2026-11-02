/**
 * API ANALYZE ENDPOINT - HOSTWISE AI (TV2 Serverless Endpoint)
 * Tích hợp Gemini API, trả tín hiệu fallback để frontend dùng thuật toán nội bộ khi AI lỗi
 */

import { buildRecommendationPrompt, RECOMMENDATION_SCHEMA } from './_lib/prompt.js';
import { validateNeedsForm } from '../src/shared/validation.js';
import { validateAIResponse } from '../src/shared/aiValidator.js';

const DEFAULT_MODEL = 'gemini-3.5-flash-lite';
const AI_TIMEOUT_MS = 12000;

const readText = (value) => (typeof value === 'string' ? value.trim() : '');

const readSurvey = (body) => ({
  shopName: readText(body?.shopName),
  websiteType: readText(body?.websiteType),
  traffic: readText(body?.traffic),
  budget: Number(body?.budget),
  needsDomain: body?.needsDomain === true,
  domainIdea: readText(body?.domainIdea)
});

const callGemini = async (prompt, apiKey, model) => {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: RECOMMENDATION_SCHEMA
      }
    }),
    signal: AbortSignal.timeout(AI_TIMEOUT_MS)
  });

  if (!response.ok) {
    throw new Error(`Gemini API returned status ${response.status}`);
  }

  const result = await response.json();
  return JSON.parse(result.candidates?.[0]?.content?.parts?.[0]?.text);
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const survey = readSurvey(req.body);
  const validation = validateNeedsForm(survey);
  if (!validation.isValid) {
    return res.status(400).json({ error: 'Invalid survey data', fields: validation.errors });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    // Trả về tín hiệu để frontend fallback êm ái
    return res.status(200).json({ fallback: true, reason: 'GEMINI_API_KEY is not configured' });
  }

  try {
    const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
    const aiResult = await callGemini(buildRecommendationPrompt(survey), geminiApiKey, model);

    const checked = validateAIResponse(aiResult, survey);
    if (!checked.isValid) {
      console.warn('Rejected Gemini response:', checked.error);
      return res.status(200).json({ fallback: true, reason: 'AI response rejected' });
    }

    return res.status(200).json({ ...aiResult, provider: `AI ${model}` });
  } catch (error) {
    console.error('Error calling Gemini in api/analyze:', error.message);
    return res.status(200).json({ fallback: true, reason: 'AI service unavailable' });
  }
}
