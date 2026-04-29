"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teacher_controller_1 = require("../controller/teacher.controller");
const validateToken_1 = __importDefault(require("../middleware/validateToken"));
const allowedRole_1 = __importDefault(require("../middleware/allowedRole"));
const userRole_1 = require("../constant/userRole");
const route = (0, express_1.Router)();
route.get("/teachers", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), teacher_controller_1.getAllTeachers);
route.get("/teachers/:id", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), teacher_controller_1.getTeacherById);
route.get("/teachers/email/:email", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN, userRole_1.ROLES.TEACHER]), teacher_controller_1.getTeacherByEmail);
route.get("/teachers/me/profile", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.TEACHER]), teacher_controller_1.getMyTeacherProfile);
route.put("/teachers/me/profile", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.TEACHER]), teacher_controller_1.updateMyTeacherProfile);
route.post("/teachers", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), teacher_controller_1.createTeacher);
route.put("/teachers/:id", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), teacher_controller_1.updateTeacher);
route.delete("/teachers/:id", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), teacher_controller_1.deleteTeacher);
exports.default = route;
//# sourceMappingURL=teacher.route.js.map