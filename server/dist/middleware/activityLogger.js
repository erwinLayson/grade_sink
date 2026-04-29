"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveClientIp = resolveClientIp;
exports.logActivity = logActivity;
const activity_service_1 = __importDefault(require("../service/activity.service"));
const activity_model_1 = __importDefault(require("../model/activity.model"));
const dbConnection_config_1 = require("../config/dbConnection.config");
const activityService = new activity_service_1.default(new activity_model_1.default(dbConnection_config_1.pool));
function resolveClientIp(req) {
    const forwardedFor = req.headers["x-forwarded-for"];
    const realIp = req.headers["x-real-ip"];
    const cfConnectingIp = req.headers["cf-connecting-ip"];
    const firstForwardedIp = Array.isArray(forwardedFor)
        ? forwardedFor[0]
        : typeof forwardedFor === "string" && forwardedFor.length > 0
            ? forwardedFor.split(",")[0]?.trim()
            : undefined;
    const candidate = (typeof cfConnectingIp === "string" && cfConnectingIp) ||
        (typeof realIp === "string" && realIp) ||
        firstForwardedIp ||
        req.ip ||
        req.socket?.remoteAddress ||
        req.connection?.remoteAddress;
    return typeof candidate === "string" ? candidate : undefined;
}
async function logActivity(req, action, resource, details) {
    try {
        const user = req.user;
        if (!user)
            return;
        const ip = resolveClientIp(req);
        const userAgent = req.get("user-agent") || "";
        await activityService.recordActivity({
            user_id: user.id,
            role: user.role,
            action,
            resource,
            details: details ? JSON.stringify(details) : undefined,
            ip,
            user_agent: userAgent,
        });
    }
    catch (e) {
        console.error("Failed to log activity", e);
    }
}
//# sourceMappingURL=activityLogger.js.map