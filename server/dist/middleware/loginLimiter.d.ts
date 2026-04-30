import { Request } from "express";
export declare function getLoginRateLimitKey(req: Request): string;
declare const loginLimiter: import("express-rate-limit").RateLimitRequestHandler;
export default loginLimiter;
//# sourceMappingURL=loginLimiter.d.ts.map