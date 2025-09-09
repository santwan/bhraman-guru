// client.js
import { GoogleGenAI } from "@google/genai";
import { env } from "../../config/env.js";
import { MODEL, DEFAULT_TEMPERATURE, DEFAULT_RESPONSE_MIME } from "./constants.js";

let aiInstance = null;

export const getAI = () => {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  }
  return aiInstance;
};

/**
 * One-shot content generation using generateContent()
 * - contents: array of role/parts objects (same shape you used)
 * - config: optional override (temperature, thinkingConfig, etc.)
 */
export const generateContent = async ({ contents, config = {} }) => {
  const ai = getAI();
  const finalConfig = {
    responseMimeType: DEFAULT_RESPONSE_MIME,
    temperature: DEFAULT_TEMPERATURE,
    ...config,
  };

  const response = await ai.models.generateContent({
    model: MODEL,
    contents,
    config: finalConfig,
  });

  // The SDK returns the full response. Different SDK versions might place text on response.text
  // or response.output[0]?.content[0]?.text — use response.text when available.
  if (response?.text) return response.text;
  // Fallback: try to reduce the most-likely field
  if (Array.isArray(response?.candidates) && response.candidates[0]?.content?.[0]?.text) {
    return response.candidates[0].content[0].text;
  }
  // Last-resort: return JSON.stringify of entire response for debugging
  return JSON.stringify(response);
};
