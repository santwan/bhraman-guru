// index.js
import { buildSystemPrompt } from "./prompt.js";
import { generateContent } from "./client.js";
import { parseJSON, validateTopLevel } from "./parser.js";

/**
 * generateTripPlanJSON(payload, opts)
 * - payload: { location, noOfDays, traveler, budget }
 * - opts: optional config to pass to SDK (temperature, thinkingConfig, etc.)
 */
export const generateTripPlanJSON = async (payload, opts = {}) => {
  if (!payload || !payload.location) {
    throw new Error("Payload must include location.");
  }

  const system = buildSystemPrompt(payload);
  const user = `Plan my trip to ${payload.location}. Respond in JSON only.`;

  const contents = [
    { role: "user", parts: [{ text: system }] },
    { role: "user", parts: [{ text: user }] },
  ];

  // As you discovered, this returns the full GenerateContentResponse object.
  const response = await generateContent({ contents, config: opts.config ?? {} });

  // For debugging, let's log the raw response object.
  console.log("Raw model output:", response);

  // Extract the text content from the response object before parsing.
  const rawText = response.text();

  // Parse & validate the extracted text.
  const parsed = parseJSON(rawText);

  // Optional: run light validation (throws on failure).
  validateTopLevel(parsed);

  return parsed;
};
