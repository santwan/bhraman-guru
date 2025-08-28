// middlewares/errorMiddleware.js
import { ApiError } from "../utils/ApiError.js";

export const errorMiddleware = (err, req, res, next) => {
  const status = err instanceof ApiError ? err.status : 500;
  const message = err.message || "Internal server error";
  const details = err.details ?? [];

  if (process.env.NODE_ENV !== "production") {
    console.error("❌ Error caught by middleware:", err);
  }

  res.status(status).json({
    success: false,
    status,
    message,
    details,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
  });
};
