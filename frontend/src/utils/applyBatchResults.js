
/**
 * batchResults: array of { index, url, verified, fallback }
 * originalPlan: mutated in place (keeps your previous design choice)
 */
export default function applyBatchResults(originalPlan, batchResults) {
  if (!originalPlan || !Array.isArray(originalPlan.hotelOptions)) return;

  for (const r of batchResults) {
    if (!r) continue;
    const idx = r.index;
    if (typeof idx !== "number") continue;
    if (idx < 0 || idx >= originalPlan.hotelOptions.length) continue;

    const hotel = originalPlan.hotelOptions[idx] || {};
    hotel.hotelImageUrl = r.url ?? "";
    // Keep semantics: mark verified true even if fallback (you may change)
    hotel._imageVerified = !!r.verified;
    // If you want to also persist fallback flag:
    hotel._imageFallback = !!r.fallback;
    originalPlan.hotelOptions[idx] = hotel;
  }
}
