"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const class_controller_1 = require("../controller/class.controller");
const validateToken_1 = __importDefault(require("../middleware/validateToken"));
const allowedRole_1 = __importDefault(require("../middleware/allowedRole"));
const userRole_1 = require("../constant/userRole");
const route = (0, express_1.Router)();
route.get("/classes", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), class_controller_1.getAllClasses);
route.get("/classes/:id", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), class_controller_1.getClassById);
route.post("/classes", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), class_controller_1.createClass);
route.put("/classes/:id", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), class_controller_1.updateClass);
route.delete("/classes/:id", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), class_controller_1.deleteClass);
exports.default = route;
//# sourceMappingURL=class.route.js.map