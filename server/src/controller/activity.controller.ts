import { Request, Response } from "express";
import ActivityService from "../service/activity.service";
import ActivityModel from "../model/activity.model";
import { pool } from "../config/dbConnection.config";

export async function getActivityLogs(req: Request, res: Response) {
  try {
    const { role, user_id, action, resource, start, end, page, limit } = req.query;
    const offset = ((Number(page) || 1) - 1) * (Number(limit) || 50);

    const currentUser = (req as any).user;

    const filters: any = {
      role: role as string | undefined,
      user_id: user_id ? Number(user_id) : undefined,
      action: action as string | undefined,
      resource: resource as string | undefined,
      start: start as string | undefined,
      end: end as string | undefined,
      offset,
      limit: Number(limit) || 50,
    };

    // Exclude the currently logged-in super admin by default
    if (currentUser && currentUser.role === "super_admin") {
      filters.exclude_user_id = currentUser.id;
    }

    const svc = new ActivityService(new ActivityModel(pool));
    const result = await svc.listActivities(filters);

    return res.status(200).json({ success: true, data: result.rows, total: result.total });
  } catch (e) {
    return res.status(500).json({ success: false, msg: `Error fetching logs: ${e}` });
  }
}
