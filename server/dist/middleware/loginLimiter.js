"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLoginRateLimitKey = getLoginRateLimitKey;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
function getLoginRateLimitKey(req) {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    return `${req.ip}:${email || "unknown"}`;
}
const loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    keyGenerator: (req) => getLoginRateLimitKey(req),
    handler: (_req, res) => {
        return res.status(429).json({
            msg: "Too many failed login attempts. Please try again in 15 minutes.",
        });
    },
});
exports.default = loginLimiter;
//# sourceMappingURL=loginLimiter.js.map