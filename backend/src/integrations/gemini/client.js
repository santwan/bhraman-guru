import { GoogleGenAI, Models } from "@google/genai";
import { env } from "../../config/env.js";
import { MODEL, DEFAULT_RESPONSE_MIME, DEFAULT_TEMPERATURE } from "./constants.js";

// Initialize the AI client once with the API key and reuse it.
const ai = new GoogleGenAI({apiKey: env.GEMINI_API_KEY});



/**
 * Generates content using the Gemini API with a one-shot, non-streaming request.
 * This is the correct pattern for the `@google/genai` SDK for this use case.
 *
 * @param {object} params - The parameters for the content generation.
 * @param {Array} params.contents - The conversation history/prompt for the model.
 * @param {object} params.config - Optional configuration overrides (e.g., temperature).
 * @returns {Promise<string>} The text response from the AI model.
 */

export const generateContent = async ({ contents, config = {} }) => {
  try {
    // Prepare the generation configuration, applying defaults and allowing overrides.
    const generationConfig = {
      responseMimeType: config.responseMimeType || DEFAULT_RESPONSE_MIME,
      temperature: config.temperature || DEFAULT_TEMPERATURE,
      ...config,
    };

    // Call the `generateContent` method with the prompt contents and config.
    const result = await ai.models.generateContent({
        model: MODEL,
      contents: contents,
      generationConfig: generationConfig,
    });



    if (!result) {
      throw new Error("AI returned an empty response.");
    }

    return result;

  } catch (error) {
    // Provide detailed error logging for the backend and a generic error for the caller.
    console.error("Error in generateContent from Gemini client:", error);
    throw new Error("The AI model failed to generate a response.");
  }
};
