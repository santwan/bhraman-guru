// src/integrations/gemini/parser.js
/**
 * Simplified, robust JSON parsing for Gemini API responses.
 * Even in JSON mode, the model can sometimes wrap the output in markdown.
 * This parser handles that gracefully while remaining simple.
 */
import { ApiError } from "../../utils/ApiError.js";

/**
 * Extracts a JSON string from the model's raw output.
 * It specifically handles the case where the JSON is wrapped in a ```json markdown block.
 * @param {string} rawText - The raw text from the AI model.
 * @returns {string} The cleaned JSON string.
 */
export const extractJsonString = (rawText) => {
  if (!rawText || typeof rawText !== "string") {
    throw new ApiError(502, "Model returned an empty or invalid response.");
  }

  const trimmed = rawText.trim();

  // Even in JSON mode, the model can sometimes wrap output in a fenced block.
  // This regex strips the fence, leaving the clean JSON string.
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch) {
    return fencedMatch[1].trim();
  }

  // If no fence is found, assume the response is the clean JSON string itself.
  return trimmed;
};

/**
 * Parses JSON from raw model text using the simplified extractor.
 * Throws ApiError(422) if JSON.parse fails.
 */
export const parseJSON = (rawText) => {
  const jsonStr = extractJsonString(rawText);
  try {
    return JSON.parse(jsonStr);
  } catch (error) {
    throw new ApiError(422, "Failed to parse JSON from model output.", [
      { reason: "json_parse_error", message: error.message },
      { reason: "snippet", snippet: jsonStr.slice(0, 500) },
    ]);
  }
};

/**
 * Validates the top-level schema of the parsed JSON object.
 * Throws ApiError(422) for missing or invalid keys.
 */
export const validateTopLevel = (obj) => {
  if (!obj || typeof obj !== "object") {
    throw new ApiError(422, "Parsed response is not an object.");
  }

  const requiredKeys = ["tripDetails", "hotelOptions", "dailyItinerary"];
  for (const key of requiredKeys) {
    if (!(key in obj)) {
      throw new ApiError(422, `Missing required top-level key: '${key}'.`);
    }
  }

  if (!Array.isArray(obj.hotelOptions) || obj.hotelOptions.length < 1) {
    throw new ApiError(422, "'hotelOptions' must be a non-empty array.");
  }

  return true;
};
