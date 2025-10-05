// parser.js
/**
 * Robust JSON extraction and parse for one-shot output.
 * Handles fenced code blocks and stray text around JSON.
 */

export const extractJsonString = (rawText) => {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Empty response from model");
  }

  // Remove leading/trailing whitespace
  const trimmed = rawText.trim();

  // Strip triple-fence code blocks if present
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch) return fencedMatch[1].trim();

  // Attempt to find first top-level JSON object (from first { to matching last })
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  // Fallback: attempt special case for arrays
  const firstBracket = trimmed.indexOf("[");
  const lastBracket = trimmed.lastIndexOf("]");
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    return trimmed.slice(firstBracket, lastBracket + 1);
  }

  // Otherwise, return full string (will likely fail JSON.parse downstream)
  return trimmed;
};

export const parseJSON = (rawText) => {
  const jsonStr = extractJsonString(rawText);
  try {
    return JSON.parse(jsonStr);
  } catch (err) {
    const snippet = jsonStr.length > 500 ? jsonStr.slice(0, 500) + "..." : jsonStr;
    const message = `Failed to parse JSON from model output. Error: ${err.message}. Snippet: ${snippet}`;
    const e = new Error(message);
    e.original = err;
    e.snippet = snippet;
    throw e;
  }
};

export const validateTopLevel = (obj) => {
  if (!obj || typeof obj !== "object") throw new Error("Parsed response is not an object.");
  if (!("tripDetails" in obj)) throw new Error("Missing 'tripDetails' key.");
  if (!("hotelOptions" in obj)) throw new Error("Missing 'hotelOptions' key.");
  if (!Array.isArray(obj.hotelOptions) || obj.hotelOptions.length < 1) {
    throw new Error("'hotelOptions' must be a non-empty array.");
  }
  if (!("dailyItinerary" in obj)) throw new Error("Missing 'dailyItinerary' key.");
  return true;
};