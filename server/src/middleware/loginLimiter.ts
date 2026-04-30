import rateLimit from "express-rate-limit";
import { Request, Response } from "express";

export function getLoginRateLimitKey(req: Request) {
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  return `${req.ip}:${email || "unknown"}`;
}

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => getLoginRateLimitKey(req),
  handler: (_req: Request, res: Response) => {
    return res.status(429).json({
      msg: "Too many failed login attempts. Please try again in 15 minutes.",
    });
  },
});

export default loginLimiter;