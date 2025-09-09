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

  const raw = await generateContent({ contents, config: opts.config ?? {} });

  // parse & validate
  const parsed = parseJSON(raw);

  // optional: run light validation (throws on failure)
  validateTopLevel(parsed);

  return parsed;
};
