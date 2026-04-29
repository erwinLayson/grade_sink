import { Request } from "express";
import ActivityService from "../service/activity.service";
import ActivityModel from "../model/activity.model";
import { pool } from "../config/dbConnection.config";

const activityService = new ActivityService(new ActivityModel(pool));

export function resolveClientIp(req: Request) {
  const forwardedFor = req.headers["x-forwarded-for"];
  const realIp = req.headers["x-real-ip"];
  const cfConnectingIp = req.headers["cf-connecting-ip"];

  const firstForwardedIp = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : typeof forwardedFor === "string"
      ? forwardedFor.split(",")[0].trim()
      : undefined;

  const candidate =
    (typeof cfConnectingIp === "string" && cfConnectingIp) ||
    (typeof realIp === "string" && realIp) ||
    firstForwardedIp ||
    req.ip ||
    req.socket?.remoteAddress ||
    req.connection?.remoteAddress;

  return typeof candidate === "string" ? candidate : undefined;
}

export async function logActivity(req: Request, action: string, resource: string, details?: any) {
  try {
    const user = (req as any).user;
    if (!user) return;

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
  } catch (e) {
    console.error("Failed to log activity", e);
  }
}
