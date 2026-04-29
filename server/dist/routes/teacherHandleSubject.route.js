"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teacherHandleSubject_controller_1 = require("../controller/teacherHandleSubject.controller");
const validateToken_1 = __importDefault(require("../middleware/validateToken"));
const allowedRole_1 = __importDefault(require("../middleware/allowedRole"));
const userRole_1 = require("../constant/userRole");
const route = (0, express_1.Router)();
route.get("/teacher-subjects", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN, userRole_1.ROLES.TEACHER]), teacherHandleSubject_controller_1.getAllTeacherHandleSubjects);
route.get("/teacher-subjects/:id", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN, userRole_1.ROLES.TEACHER]), teacherHandleSubject_controller_1.getTeacherHandleSubjectById);
route.get("/teacher-subjects/teacher/:teacherId", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN, userRole_1.ROLES.TEACHER]), teacherHandleSubject_controller_1.getSubjectsByTeacher);
route.post("/teacher-subjects", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), teacherHandleSubject_controller_1.createTeacherHandleSubject);
route.delete("/teacher-subjects/:id", validateToken_1.default, (0, allowedRole_1.default)([userRole_1.ROLES.ADMIN, userRole_1.ROLES.SUPER_ADMIN]), teacherHandleSubject_controller_1.deleteTeacherHandleSubject);
exports.default = route;
//# sourceMappingURL=teacherHandleSubject.route.js.map