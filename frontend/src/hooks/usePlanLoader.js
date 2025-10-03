// src/hooks/usePlanLoader.js
import { useEffect, useMemo, useState, useRef } from "react";
import { getHotelImage } from "@/services/GlobalApi";

import normalizePlan from "@/utils/normalizePlan";
import { imageLoads, sleep } from "@/utils/imageLoads";
import { getPlanFromSession, persistPlanToSession, safeStringify } from "@/utils/sessionStorageSafe";
import applyBatchResults from "@/utils/applyBatchResults";

/**
 *  Custom React Hook: usePlanLoader
 * 
 * Purpose: 
 * -----------
 * - Load a travel "plan" ( with hotels, itineraries, etc ) from session storage
 * - Normalize the plan to a consistent format
 * - Fetch and verify hotel images ( with retries and fallback)
 * - Replace or persist those images back into session storage
 * - Return the plan along with a normalized version for rendering
 * 
 * Options:
 * -----------
 *  - BATCH_SIZE : number of hotels processed in one batch ( to avoid overwhelming the API )
 *  - RETRIES: number of times to retry fertching each image
 *  - RETRY_DELAY_MS: base delay (ms) before retrying , grows exponentially 
 *  - FALLBACK_IMAGE: default placeholder if image fetch fails 
 *  - forceReplaceUnverified: if true, re-fetch even already verified images
 */

export default function usePlanLoader(options = {}) {
  const {
    BATCH_SIZE = 6, // default: fetch 6 hotels in parralel per batch
    RETRIES = 1, // default : 1 retry after intial attempt
    RETRY_DELAY_MS = 600, // default : 600 ms delay, doubled after each retry
    FALLBACK_IMAGE = "https://via.placeholder.com/800x450?text=No+Image",
    forceReplaceUnverified = false, // skip re-fetch if image was already verified
  } = options;

  // state to hold the current plan
  const [plan, setPlan] = useState(null);

  // state to indicate if images/plan are still being processed
  const [loading, setLoading] = useState(true);

  // ref to track cancellation ( avoids state update after unmount )
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false; // reset cancel flag on effect run

    /**
     * 
     * MAIN ASYNC LOADER FUNCTION
     * -----------------------------
     * 1. Loads stored plan from session
     * 2. Normalized the plan
     * 3. Iterates the hotels in Batches
     * 4. Fetches/verifies hotel images
     * 5. Applies results, persists back to session, update React state
     */

    const loadAndReplaceImages = async () => {
      setLoading(true);
      try {
        // ---- Step 1: Load stoed plan from session storage
        const storedPlan = getPlanFromSession();
        if (!storedPlan) {
          // No Plan in session -> just clear the state 
          if (!cancelledRef.current) setPlan(null);
          return;
        }

        // ---- Step 2: Normalized Plan ----
        const originalPlan = normalizePlan(storedPlan);

        const hotels = originalPlan.hotelOptions || [];

        // If no hotels in plan, just persist and set plan
        if (hotels.length === 0) {
          persistPlanToSession(originalPlan);
          if (!cancelledRef.current) setPlan(originalPlan);
          return;
        }

        // ---- Step 3: Process hotels in batches ---- 
        for (let i = 0; i < hotels.length; i += BATCH_SIZE) {
          if (cancelledRef.current) break;

          // Current batch slice
          const batch = hotels.slice(i, i + BATCH_SIZE);

          // ---- Step 4: Process each hotel in batch ---- 
          const batchResults = await Promise.all(
            batch.map(async (hotel, idxInBatch) => {
              const idx = i + idxInBatch;  // absolute index in hotelOptions

              // skip if alredy verified , unless forceReplaceUnverified is true
              if (!forceReplaceUnverified && hotel && hotel._imageVerified) {
                return { 
                  index: idx, 
                  url: hotel.hotelImageUrl, 
                  verified: true, 
                  fallback: false 
                };
              } 

              const name = hotel?.hotelName ?? hotel?.name ?? "";
              const address = hotel?.hotelAddress ?? hotel?.address ?? "";

              let lastUrl = "";
              let verified = false;

              // Try Fetching image multiple times ( with retries )
              for (let attempt = 0; attempt <= RETRIES; attempt++) {
                if (cancelledRef.current) break;

                try {
                  // Calling the API service to get image URL
                  const candidate = await getHotelImage({ name, address });
                  lastUrl = candidate ? String(candidate) : "";
                } catch (err) {
                  console.warn(`[usePlanLoader] getHotelImage error for hotel idx ${idx} attempt ${attempt}:`, err);
                  lastUrl = "";
                }

                if (lastUrl) {
                  // Verify if the image actually loads in <img> ( not broken URL)
                  const ok = await imageLoads(lastUrl, 8000);
                  if (ok) {
                    verified = true;
                    break; // Stop Retrying , we got success
                  } else {
                    verified = false;
                  }
                }

                // Exponential backoff delay before retry 
                const delay = RETRY_DELAY_MS * Math.pow(2, attempt);
                await sleep(delay);
              } // end of retry looop

              // If all attemps failed -> use fallback placeholder
              if (!verified) {
                lastUrl = FALLBACK_IMAGE;
              }

              return { index: idx, url: lastUrl, verified: !!verified, fallback: !verified };
            })
          );

          // apply batch results (mutates originalPlan)
          applyBatchResults(originalPlan, batchResults);

          // persist updated plan back to session storage
          try {
            persistPlanToSession(originalPlan);
          } catch (err) {
            console.warn("[usePlanLoader] failed to persist after batch:", err);
          }

          // trigger re-render with a shallow copy
          if (!cancelledRef.current) setPlan({ ...originalPlan });
        } // end batches

        // final persist & final set
        persistPlanToSession(originalPlan);
        if (!cancelledRef.current) setPlan(originalPlan);
      } catch (err) {
        console.error("[usePlanLoader] unexpected error:", err);
        if (!cancelledRef.current) setPlan(null);
      } finally {
        if (!cancelledRef.current) setLoading(false);
      }
    };

    loadAndReplaceImages();

    return () => {
      cancelledRef.current = true;
    };
  }, [BATCH_SIZE, RETRIES, RETRY_DELAY_MS, FALLBACK_IMAGE, forceReplaceUnverified]);

  const normalizedPlan = useMemo(() => (plan ? normalizePlan(plan) : null), [plan]);

  return { plan, normalizedPlan, loading, setPlan };
}