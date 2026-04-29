"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateToken_1 = __importDefault(require("../middleware/validateToken"));
const allowedRole_1 = __importDefault(require("../middleware/allowedRole"));
const userRole_1 = require("../constant/userRole");
const activity_controller_1 = require("../controller/activity.controller");
const route = (0, express_1.Router)();
route.get("/super-admin/activity-logs", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.SUPER_ADMIN]), activity_controller_1.getActivityLogs);
exports.default = route;
//# sourceMappingURL=activity.route.js.map