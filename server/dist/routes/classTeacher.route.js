"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const classTeacher_controller_1 = require("../controller/classTeacher.controller");
const validateToken_1 = __importDefault(require("../middleware/validateToken"));
const allowedRole_1 = __importDefault(require("../middleware/allowedRole"));
const userRole_1 = require("../constant/userRole");
const route = (0, express_1.Router)();
route.get("/class-teachers", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN, userRole_1.ROLES.TEACHER]), classTeacher_controller_1.getAllClassTeachers);
route.get("/class-teachers/teacher/:teacherId", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN, userRole_1.ROLES.TEACHER]), classTeacher_controller_1.getClassesByTeacher);
route.get("/class-teachers/class/:classId", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN, userRole_1.ROLES.TEACHER]), classTeacher_controller_1.getTeachersByClass);
route.get("/class-teachers/:id", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN, userRole_1.ROLES.TEACHER]), classTeacher_controller_1.getClassTeacherById);
route.post("/class-teachers", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), classTeacher_controller_1.createClassTeacher);
route.delete("/class-teachers/:id", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), classTeacher_controller_1.deleteClassTeacher);
exports.default = route;
//# sourceMappingURL=classTeacher.route.js.map