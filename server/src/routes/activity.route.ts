import { Router } from "express";
import validateToken from "../middleware/validateToken";
import allowedRole from "../middleware/allowedRole";
import { ROLES } from "../constant/userRole";
import { getActivityLogs } from "../controller/activity.controller";

const route = Router();

route.get(
  "/super-admin/activity-logs",
  validateToken,
  allowedRole([ROLES.SUPER_ADMIN]),
  getActivityLogs
);

export default route;
