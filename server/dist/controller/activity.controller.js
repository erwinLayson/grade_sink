"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivityLogs = getActivityLogs;
const activity_service_1 = __importDefault(require("../service/activity.service"));
const activity_model_1 = __importDefault(require("../model/activity.model"));
const dbConnection_config_1 = require("../config/dbConnection.config");
async function getActivityLogs(req, res) {
    try {
        const { role, user_id, action, resource, start, end, page, limit } = req.query;
        const offset = ((Number(page) || 1) - 1) * (Number(limit) || 50);
        const currentUser = req.user;
        const filters = {
            role: role,
            user_id: user_id ? Number(user_id) : undefined,
            action: action,
            resource: resource,
            start: start,
            end: end,
            offset,
            limit: Number(limit) || 50,
        };
        // Exclude the currently logged-in super admin by default
        if (currentUser && currentUser.role === "super_admin") {
            filters.exclude_user_id = currentUser.id;
        }
        const svc = new activity_service_1.default(new activity_model_1.default(dbConnection_config_1.pool));
        const result = await svc.listActivities(filters);
        return res.status(200).json({ success: true, data: result.rows, total: result.total });
    }
    catch (e) {
        return res.status(500).json({ success: false, msg: `Error fetching logs: ${e}` });
    }
}
//# sourceMappingURL=activity.controller.js.map